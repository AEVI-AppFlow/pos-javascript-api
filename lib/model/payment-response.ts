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

import { TransactionResponse } from "./transaction-response";
import { Payment } from "./payment";
import { Amounts } from "./amounts";
import { Transaction } from "./transaction";
import { FlowAppInfo } from "./flow-app-info";
import { Card } from './card';
import { Basket } from './basket';
import { Jsonable } from "./jsonable";

// BAC > these are typescript conversions of the AppFlow payment initiation models

export enum Outcome {
    FULFILLED = "FULFILLED",
    PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED",
    FAILED = "FAILED"
}

export enum FailureReason {
    NONE = "NONE",
    CANCELLED = "CANCELLED",
    REJECTED = "REJECTED",
    DECLINED = "DECLINED",
    TIMEOUT = "TIMEOUT",
    ERROR = "ERROR"
}

@JsonObject
export class PaymentResponse extends Jsonable{

    @JsonProperty("id")
    id: string = undefined;

    @JsonProperty("originatingPayment", Payment)
    originatingPayment: Payment = undefined;

    @JsonProperty("outcome", String)
    outcome: Outcome = undefined;

    @JsonProperty("failureReason", String)
    failureReason: FailureReason = undefined;

    @JsonProperty("failureMessage", String, true)
    failureMessage: string = undefined;

    @JsonProperty("allTransactionsApproved")
    allTransactionsApproved: boolean = undefined;

    @JsonProperty("totalAmountsRequested", Amounts)
    totalAmountsRequested: Amounts = undefined;

    @JsonProperty("totalAmountsProcessed", Amounts)
    totalAmountsProcessed: Amounts = undefined;

    @JsonProperty("transactions", [Transaction])
    transactions: Array<Transaction> = undefined;

    @JsonProperty("creationDateTimeMs")
    creationDateTimeMs: number = undefined;

    @JsonProperty("executedPreFlowApp", FlowAppInfo, true)
    executedPreFlowApp: FlowAppInfo = undefined;

    @JsonProperty("executedPostFlowApp", FlowAppInfo, true)
    executedPostFlowApp: FlowAppInfo = undefined;

    static fromJson(json: string): PaymentResponse {
        return Jsonable.baseFromJson(json, PaymentResponse);
    }

    constructor() {
        super();
    }

    public getFlowType(): string {
        return this.originatingPayment.flowType;
    }

    public getDisplayDate(): string {
        var formatter = Intl.DateTimeFormat('en-GB');
        return formatter.format(this.creationDateTimeMs);
    }

    public getDisplayDateTime(): string {
        var formatter = Intl.DateTimeFormat('en-GB', { 
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric' 
        });
        return formatter.format(this.creationDateTimeMs);
    }

    public getCurrency(): string {
        return this.totalAmountsProcessed.currency
    }

    public getTransactions(): Array<Transaction> {
        return this.transactions;
    }

    public getTransactionResponses(): Array<TransactionResponse> {
        // BAC - At this time every payment service we have will only return a single transaction response
        return this.transactions[0].transactionResponses;
    }

    public getLastResponse() : TransactionResponse {
        // BAC - Assuming there is only one response FIXME
        var last = this.transactions[0].transactionResponses.length - 1;
        return this.transactions[0].transactionResponses[last];
    }

    public getRequestedBasket(): Basket {
        // BAC - This is the basket the POS app requested
        return this.originatingPayment.basket;
    }

    public getBaskets(): Array<Basket> {
        // BAC - This is the basket that was associated with the transaction. We are assuming only one Transaction and one Basket in that transaction
        return this.transactions[0].baskets;
    }
}
