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
import { Jsonable } from '../jsonable';

@JsonObject('ConfirmationInput')
export class ConfirmationInput extends Jsonable {
  @JsonProperty('valueType')
  valueType: string = undefined;

  @JsonProperty('maxValueLength')
  maxValueLength: number = -1;

  @JsonProperty('minValueLength')
  minValueLength: number = -1;

  @JsonProperty('valueRegEx', String, true)
  valueRegEx?: string = undefined;

  /**
     * Convert a JSON string into an {@link ConfirmationInput} object if possible
     *
     * @param json The JSON to convert
     */
  public static fromJson(json: string): ConfirmationInput {
    return Jsonable.baseFromJson(json, ConfirmationInput);
  }
}
