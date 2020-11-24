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
import { ConfirmationOption } from './confirmation-option';
import { ConfirmationInput } from './confirmation-input';

@JsonObject('ConfirmationRequest')
export class ConfirmationRequest extends Jsonable {
  @JsonProperty('id')
  id: string = undefined;

  @JsonProperty('type')
  type: string = undefined;

  @JsonProperty('titleText', String, true)
  titleText?: string = undefined;

  @JsonProperty('description', String, true)
  description?: string = undefined;

  @JsonProperty('confirmationOptions', [ConfirmationOption], true)
  confirmationOptions?: string = undefined;

  @JsonProperty('multiSelect')
  multiSelect: boolean = false;

  @JsonProperty('confirmationInput')
  confirmationInput: ConfirmationInput = undefined;

  /**
     * Convert a JSON string into an {@link ConfirmationRequest} object if possible
     *
     * @param json The JSON to convert
     */
  public static fromJson(json: string): ConfirmationRequest {
    return Jsonable.baseFromJson(json, ConfirmationRequest);
  }
}
