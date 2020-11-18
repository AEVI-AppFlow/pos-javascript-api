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

import { AdditionalData } from './additional-data';

/**
 * Represents the capabilities of a flow service.
 */
@JsonObject
export class PaymentFlowServiceInfo {
  @JsonProperty('id')
  id: string = undefined;

  @JsonProperty('packageName')
  packageName: string = undefined;

  @JsonProperty('vendor')
  vendor: string = undefined;

  @JsonProperty('serviceVersion')
  serviceVersion: string = undefined;

  @JsonProperty('apiVersion')
  apiVersion: string = undefined;

  @JsonProperty('displayName')
  displayName: string = undefined;

  @JsonProperty('hasAccessibilityMode')
  hasAccessibilityMode: boolean = false;

  @JsonProperty('supportedFlowTypes', [String])
  supportedFlowTypes: Array<string> = [];

  @JsonProperty('customRequestTypes', [String])
  customRequestTypes: Array<string> = [];

  @JsonProperty('supportedDataKeys', [String])
  supportedDataKeys: Array<string> = [];

  @JsonProperty('additionalInfo', AdditionalData)
  additionalInfo: AdditionalData = new AdditionalData();

  @JsonProperty('stages', [String])
  stages: Array<string> = [];

  // @JsonProperty("flowAndStagesDefinitions")
  // flowAndStagesDefinitions: Map<string, string[]>;

  @JsonProperty('canAdjustAmounts')
  canAdjustAmounts: boolean = false;

  @JsonProperty('canPayAmounts')
  canPayAmounts: boolean = false;

  @JsonProperty('defaultCurrency')
  defaultCurrency: string = undefined;

  @JsonProperty('supportedCurrencies', [String])
  supportedCurrencies: Array<string> = [];

  @JsonProperty('paymentMethods', [String])
  paymentMethods: Array<string> = [];
}
