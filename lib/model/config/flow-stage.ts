/*
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { JsonObject, JsonProperty, Any } from 'json2typescript';

// eslint-disable-next-line import/no-cycle
import { FlowConfig } from './flow-config';
import { FlowApp } from './flow-app';

export enum AppExecutionType {
  SINGLE = 'SINGLE',
  SINGLE_SELECT = 'SINGLE_SELECT',
  DYNAMIC_SELECT = 'DYNAMIC_SELECT',
  MULTIPLE = 'MULTIPLE',
  NONE = 'NONE',
}

@JsonObject('FlowStage')
export class FlowStage {
  @JsonProperty('name')
  name: string = undefined;

  @JsonProperty('appExecutionType')
  appExecutionType: string = AppExecutionType.NONE;

  @JsonProperty('flowApps', [FlowApp])
  flowApps: Array<FlowApp> = [];

  // FIXME - at this time json2typescript doesn't support circular models so this has to be a default object here instead of a FlowConfig as it should be
  @JsonProperty('innerFlow', Any, true)
  innerFlow: FlowConfig = undefined;

  public static from(name: string, appExecutionType: AppExecutionType): FlowStage {
    const fs = new FlowStage();
    fs.name = name;
    fs.appExecutionType = appExecutionType;
    return fs;
  }

  /**
     * Check whether the stage has an inner flow.
     *
     * @return True if inner flow, false otherwise
     */
  public hasInnerFlow(): boolean {
    return this.innerFlow !== undefined;
  }

  /**
     * Utility method to get innerFlow as a genuine {@link FlowConfig} object
     *
     * This allows you to use methods on the {@link FlowConfig} returned as due to a json2typescript restriction
     * the object cannot be setup automatically when deserialising.
     *
     * @return The inner flow config if there is one
     */
  public getInnerFlow(): FlowConfig {
    if (this.innerFlow) {
      return FlowConfig.fromJson(JSON.stringify(this.innerFlow));
    }
    return null;
  }
}
