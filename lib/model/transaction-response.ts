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

import { AdditionalData } from './additional-data';
import { Amounts } from './amounts';
import { Card } from './card';

export enum TransactionResponseOutcome {
    APPROVED = "APPROVED",
    DECLINED = "DECLINED"
}

/**
 * A transaction response representing the outcome of processing a {@link TransactionRequest}.
 */
@JsonObject
export class TransactionResponse {

    @JsonProperty("id")
    id: string = undefined;

    @JsonProperty("card", Card, true)
    card: Card = undefined;

    @JsonProperty("outcome", String)
    outcome: TransactionResponseOutcome = undefined;

    @JsonProperty("outcomeMessage")
    outcomeMessage: string = undefined;

    @JsonProperty("amounts", Amounts, true)
    amounts: Amounts = undefined;

    @JsonProperty("responseCode", String, true)
    responseCode: string = undefined;

    @JsonProperty("paymentMethod")
    paymentMethod: string = undefined;

    @JsonProperty("references", AdditionalData, true)
    references: AdditionalData = new AdditionalData();

    @JsonProperty("flowServiceId", String, true)    
    flowServiceId: string = undefined;

    @JsonProperty("flowStage", String, true)
    flowStage: string = undefined;
}
