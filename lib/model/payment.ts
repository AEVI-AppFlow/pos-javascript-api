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

import { Amounts } from './amounts';
import { Basket } from './basket';
import { Customer } from './customer';
import { Token } from './token';
import { AdditionalData } from './additional-data';

import { v4 as uuid } from 'uuid';
import { Jsonable } from "./jsonable";

export enum FlowTypes {
    sale = "sale",
    refund = "refund",
    motoSale = "motoSale",
    motoRefund = "motoRefund",
    preAuthorisation = "preAuthorisation",
    preAuthCompletion = "preAuthCompletion",
    deposit = "deposit",
    reversal = "reversal",
    tokenisation = "tokenisation",
    batchClosure = "batchClosure",
    receiptDelivery = "receiptDelivery"
}

@JsonObject("Payment")
export class Payment extends Jsonable {

    @JsonProperty("id")
    id: string = undefined;

    @JsonProperty("flowType")
    flowType: string = undefined;

    @JsonProperty("flowName", String, true)
    flowName: string = undefined;

    @JsonProperty("amounts", Amounts)
    amounts: Amounts = undefined;

    @JsonProperty("paymentMethod", String, true)
    paymentMethod: string = undefined;

    @JsonProperty("basket", Basket, true)
    basket: Basket = undefined;

    @JsonProperty("customer", Customer, true)
    customer: Customer = undefined;

    @JsonProperty("splitEnabled", Boolean, true)
    splitEnabled: boolean = false;

    @JsonProperty("cardToken", Token, true)
    cardToken: Token = undefined;

    @JsonProperty("additionalData", AdditionalData)
    additionalData: AdditionalData = new AdditionalData();

    @JsonProperty("isExternalId", Boolean, true)
    isExternalId: boolean = false;

    @JsonProperty("source", String, true)
    source: string = undefined;

    @JsonProperty("deviceId", String, true)
    deviceId: string = undefined;

    constructor() {
        super();
        this.id = uuid();
    }

    public static fromJson(json: string): Payment {
        return super.baseFromJson(json, Payment);
    }


}
