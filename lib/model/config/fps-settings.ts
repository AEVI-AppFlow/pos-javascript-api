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

@JsonObject('FpsSettings')
export class FpsSettings {
  @JsonProperty('isMultiDevice')
  isMultiDevice: boolean = false;

  @JsonProperty('isCurrencyChangeAllowed')
  isCurrencyChangeAllowed: boolean = false;

  @JsonProperty('splitResponseTimeoutSeconds')
  splitResponseTimeoutSeconds: number = 120;

  @JsonProperty('flowResponseTimeoutSeconds')
  flowResponseTimeoutSeconds: number = 120;

  @JsonProperty('paymentResponseTimeoutSeconds')
  paymentResponseTimeoutSeconds: number = 120;

  @JsonProperty('statusUpdateTimeoutSeconds')
  statusUpdateTimeoutSeconds: number = 120;

  @JsonProperty('appOrDeviceSelectionTimeoutSeconds')
  appOrDeviceSelectionTimeoutSeconds: number = 120;

  @JsonProperty('shouldAbortOnFlowAppError')
  shouldAbortOnFlowAppError: boolean = false;

  @JsonProperty('shouldAbortOnPaymentError')
  shouldAbortOnPaymentError: boolean = false;

  @JsonProperty('allowAccessViaStatusBar')
  allowAccessViaStatusBar: boolean = false;

  @JsonProperty('alwaysAllowDynamicSelect')
  alwaysAllowDynamicSelect: boolean = false;

  @JsonProperty('filterServicesByFlowType')
  filterServicesByFlowType: boolean = true;

  @JsonProperty('legacyPaymentAppsEnabled')
  legacyPaymentAppsEnabled: boolean = false;

  @JsonProperty('alwaysCallPreFlow')
  alwaysCallPreFlow: boolean = false;

  @JsonProperty('databaseRowLimit')
  databaseRowLimit: number = 100;
}
