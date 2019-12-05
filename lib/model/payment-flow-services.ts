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
import { JsonObject, JsonProperty } from "json2typescript";

import { PaymentFlowServiceInfo } from './payment-flow-service-info';

@JsonObject
export class PaymentFlowServices {

    @JsonProperty("paymentFlowServiceInfoList", [PaymentFlowServiceInfo])
    paymentFlowServiceInfoList: Array<PaymentFlowServiceInfo> = [];

    @JsonProperty("supportedRequestTypes", [String])
    supportedRequestTypes: Array<string> = [];

    @JsonProperty("supportedCurrencies", [String])
    supportedCurrencies: Array<string> = [];

    @JsonProperty("supportedPaymentMethods", [String])
    supportedPaymentMethods: Array<string> = [];

    @JsonProperty("supportedDataKeys", [String])
    supportedDataKeys: Array<string> = [];

    constructor() {

    }

    public static from(paymentFlowServiceInfoList: Array<PaymentFlowServiceInfo>) {
        var pfs = new PaymentFlowServices();
        pfs.paymentFlowServiceInfoList = paymentFlowServiceInfoList;
        for (let paymentFlowServiceInfo of paymentFlowServiceInfoList) {
            // FIXME should be set
            pfs.supportedRequestTypes = this.union(paymentFlowServiceInfo.customRequestTypes,  pfs.supportedRequestTypes);
            pfs.supportedCurrencies = this.union(paymentFlowServiceInfo.supportedCurrencies, pfs.supportedCurrencies);
            pfs.supportedPaymentMethods = this.union(paymentFlowServiceInfo.paymentMethods, pfs.supportedPaymentMethods);
            pfs.supportedDataKeys = this.union(paymentFlowServiceInfo.supportedDataKeys, pfs.supportedDataKeys);
        }
        return pfs;
    }

    private static union(source: Array<string>, target: Array<string>): Array<string> {
        for(let src of source) {
            if(!target.find(x => x === src)) {
                target.push(src);
            }
        }
        return target;
    }

    /**
     * Get the flow service with the provided id.
     *
     * @param id The flow service id
     * @return An instance of PaymentFlowServiceInfo if a match was found, or null otherwise
     */
    public getFlowServiceFromId(id: string): PaymentFlowServiceInfo {
        for (let serviceInfo of this.paymentFlowServiceInfoList) {
            if (serviceInfo.id === id) {
                return serviceInfo;
            }
        }
        return null;
    }
}