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

import { AdditionalData } from "../additional-data";
import { PaymentFlowServices } from "../payment-flow-services";
import { PaymentFlowServiceInfo } from "../payment-flow-service-info";
import { FlowConfigurations } from "./flow-configurations";
import { FpsSettings } from "./fps-settings";
import { AppFlowSettings } from "./app-flow-settings";
import { AppExecutionType } from './flow-stage';

import { Jsonable } from "../jsonable";

@JsonObject
export class PaymentSettings {

    @JsonProperty("flowConfigurations", FlowConfigurations)
    flowConfigurations: FlowConfigurations = undefined;

    @JsonProperty("allServices", PaymentFlowServices)
    allServices: PaymentFlowServices = undefined;

    @JsonProperty("fpsSettings", FpsSettings)
    fpsSettings: FpsSettings = undefined;

    @JsonProperty("appFlowSettings", AppFlowSettings)
    appFlowSettings: AppFlowSettings = undefined;

    @JsonProperty("additionalSettings", AdditionalData)
    additionalSettings: AdditionalData = new AdditionalData();

    constructor() {

    }

    /**
     * Get an instance of {@link PaymentFlowServices} that contains a filtered list of services based on the provided flow configuration.
     *
     * This can be used to ensure that you retrieve the correct set of supported currencies, payment methods, etc based on the flow that
     * will be processed.
     *
     * If no applications are defined in the flow config, it is assumed any is eligible and the full list of services will be returned.
     *
     * If there is no flow by the provided name, all services will be returned.
     *
     * @param flowName The name of the flow configuration to filter services by
     * @return An instance of {@link PaymentFlowServices} with filtered set of services, or null if no flow config found
     */
    public getServicesForFlow(flowName: string): PaymentFlowServices {
        var flowConfig = this.flowConfigurations.getFlowConfiguration(flowName);
        if (flowConfig == null) {
            return this.allServices;
        }

        var paymentFlowServices = new Array<PaymentFlowServiceInfo>();

        for (let flowStage of flowConfig.getStages(true)) {
            if (flowStage.appExecutionType != AppExecutionType.NONE && flowStage.flowApps.length != 0) {
                for (let flowApp of flowStage.flowApps) {
                    var flowServiceFromId = this.allServices.getFlowServiceFromId(flowApp.id);
                    if (flowServiceFromId != null) {
                        paymentFlowServices.push(flowServiceFromId);
                    }
                }
            }
        }
        if (paymentFlowServices.length > 0) {
            return PaymentFlowServices.from(paymentFlowServices);
        }

        return this.allServices;
    }

    static fromJson(json: string): PaymentSettings {
        return Jsonable.baseFromJson(json, PaymentSettings);
    }
}