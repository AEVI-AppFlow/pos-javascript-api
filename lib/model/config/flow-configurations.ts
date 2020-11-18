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
import { JsonObject, JsonProperty } from 'json2typescript';

import { Observable, from } from 'rxjs';

import { FlowConfig } from './flow-config';

@JsonObject
export class FlowConfigurations {
  @JsonProperty('flowConfigurations', [FlowConfig])
  flowConfigurations: Array<FlowConfig> = [];

  /**
     * Get the flow configuration with the provided name.
     *
     * @param flowName The flow name
     * @return The flow config
     */
  public getFlowConfiguration(flowName: string): FlowConfig {
    return this.fromName(flowName);
  }

  /**
     * Stream the list of flow configurations for simple filtering, conversions, etc.
     *
     * @return An Observable stream of {@link FlowConfig}
     */
  public stream(): Observable<FlowConfig> {
    return from(this.flowConfigurations);
  }

  /**
     * Get supported flow types for the given request class.
     *
     * If this should return flow types for initiating generic {@link com.aevi.sdk.flow.model.Request}, then use {@link FlowConfig#REQUEST_CLASS_GENERIC}
     *
     * If this should return flow types for initiating {@link com.aevi.sdk.pos.flow.model.Payment}, then use {@link FlowConfig#REQUEST_CLASS_PAYMENT}
     *
     * If null is passed, all types will be returned.
     *
     * @param requestClass {@link FlowConfig#REQUEST_CLASS_GENERIC}, {@link FlowConfig#REQUEST_CLASS_PAYMENT} or null for all types
     * @return A list of supported flow types
     */
  public getFlowTypes(requestClass: string): Array<string> {
    const flowTypes = new Array<string>();
    for (const flowConfig of this.flowConfigurations) {
      if (requestClass == null || flowConfig.getRequestClass() === requestClass) {
        flowTypes.push(flowConfig.type);
      }
    }
    return flowTypes;
  }

  /**
     * Check whether a flow type is supported or not.
     *
     * A flow type is defined as supported if there is at least one flow configuration defined for that type.
     *
     * @param type The flow type to check
     * @return True if there is at least one flow for this type, false otherwise
     */
  public isFlowTypeSupported(type: string): boolean {
    for (const flowConfig of this.flowConfigurations) {
      if (flowConfig.type === type) {
        return true;
      }
    }
    return false;
  }

  /**
     * Get a list of all the flow names that are associated with the provided types.
     *
     * @param typesArray The types to filter by
     * @return The list of flow names
     */
  public getFlowNamesForType(...typesArray: Array<string>): Array<string> {
    const flowNames = new Array<string>();
    for (const flowConfiguration of this.flowConfigurations) {
      if (typesArray.find((x) => x === flowConfiguration.type)) {
        flowNames.push(flowConfiguration.name);
      }
    }
    return flowNames;
  }

  /**
     * Get a list of all the flow configs that are associated with the provided types.
     *
     * @param typesArray The types to filter by
     * @return The list of flow names
     */
  public getFlowConfigsForType(...typesArray: Array<string>): Array<FlowConfig> {
    const flowConfigs = new Array<FlowConfig>();
    for (const flowConfiguration of this.flowConfigurations) {
      if (typesArray.find((x) => x === flowConfiguration.type)) {
        flowConfigs.push(flowConfiguration);
      }
    }
    return flowConfigs;
  }

  /**
     * Check whether a particular flow has the provided stage defined.
     *
     * @param stage    The flow stage
     * @param flowName The flow to check if the stage is defined for
     * @return True if the flow has the stage defined, false otherwise
     */
  public isStageDefinedForFlow(stage: string, flowName: string): boolean {
    const flowConfig = this.fromName(flowName);
    if (flowConfig != null) {
      return flowConfig.hasStage(stage);
    }
    return false;
  }

  private fromName(flowName: string): FlowConfig {
    for (const flowConfiguration of this.flowConfigurations) {
      if (flowConfiguration.name === flowName) {
        return flowConfiguration;
      }
    }
    return null;
  }
}
