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
import { AdditionalData } from './additional-data';
import { TransactionResponse, TransactionResponseOutcome } from './transaction-response';
import { FlowAppInfo } from './flow-app-info';
import { FlowStages } from './constants';

/**
 * Represents a transaction within a flow.
 *
 * In the case of a split enabled flow, there will be an instance of this class for each "split", which usually represents each customer.
 *
 * {@link TransactionRequest} instances are created as required to call flow services within this transaction, with the remaining amounts to process.
 *
 * A transaction can contain zero to many {@link TransactionResponse} instances, as a result of calling into flow services that pay off a portion
 * or all of the requested amounts.
 *
 * Use [[requestedAmounts]] to retrieve the total amount requested for this transaction, and [[getRemainingAmounts]] to retrieve
 * the amounts remaining to pay for this transaction, if any.
 */
@JsonObject
export class Transaction {

    @JsonProperty("requestedAmounts", Amounts)
    requestedAmounts: Amounts = undefined;

    @JsonProperty("baskets", [Basket], true)
    baskets: Array<Basket> = undefined;

    @JsonProperty("customer", Customer, true)
    customer: Customer = undefined;

    @JsonProperty("additionalData", AdditionalData)
    additionalData: AdditionalData = undefined;

    @JsonProperty("transactionResponses", [TransactionResponse])
    transactionResponses: Array<TransactionResponse> = undefined;

    @JsonProperty("executedFlowApps", [FlowAppInfo])
    executedFlowApps: Array<FlowAppInfo> = undefined;

    constructor() {}

    /**
     * Get the remaining amounts required to fulfill the requested amounts for this transaction.
     *
     * This shall be used to determine how much to charge the customer at any given point.
     *
     * @return The remaining amounts.
     */
    public getRemainingAmounts(): Amounts {
        var remaining = Amounts.fromAmounts(this.requestedAmounts);
        for (let transactionResponse of this.transactionResponses) {
            if (transactionResponse.outcome == TransactionResponseOutcome.APPROVED && transactionResponse.amounts != null) {
                remaining = Amounts.subtractAmounts(remaining, transactionResponse.amounts, false);
            }
        }
        return remaining;
    }

    /**
     * Get the amounts processed at this point in time.
     *
     * Note that the processed amount may be larger than the requested amounts.
     *
     * @return The amounts processed at this point in time.
     */
    public getProcessedAmounts(): Amounts {
        var processed = Amounts.from(0, this.requestedAmounts.currency);
        for (let transactionResponse of this.transactionResponses) {
            if (transactionResponse.outcome == TransactionResponseOutcome.APPROVED && transactionResponse.amounts) {
                processed = Amounts.addAmounts(processed, transactionResponse.amounts);
            }
        }
        return processed;
    }

    /**
     * Check whether the requested amounts have been fully processed.
     *
     * @return True if the amounts have been fully processed, false otherwise.
     */
    public hasProcessedRequestedAmounts(): boolean {
        return this.getRemainingAmounts().getTotalAmountValue() == 0;
    }

    /**
     * Check whether this transaction has any responses or not yet.
     *
     * @return True if there are transaction responses, false otherwise.
     */
    public hasResponses(): boolean {
        return this.transactionResponses.length > 0;
    }

    /**
     * Check whether there were any declined responses.
     *
     * @return True if there were declined responses, false otherwise
     */
    public hasDeclinedResponses(): boolean {
        for (let transactionResponse of this.transactionResponses) {
            if (transactionResponse.outcome == TransactionResponseOutcome.DECLINED) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get the last transaction response, if any.
     *
     * @return The last transaction response, if one is available.
     */
    public getLastResponse(): TransactionResponse {
        if (this.transactionResponses.length > 0) {
            return this.transactionResponses[this.transactionResponses.length - 1];
        }
        return null;
    }

    /**
     * Get the transaction response generated by a payment application specifically, if any.
     *
     * This is a convenience method that can be used when the response details such as id is required to initiate follow-up requests against the
     * payment app, such as reversals.
     *
     * @return The transaction response generated by a payment application if set, or null
     */
    public getPaymentAppResponse(): TransactionResponse {
        for (let transactionResponse of this.transactionResponses) {
            if (transactionResponse.flowStage && (transactionResponse.flowStage == FlowStages.PAYMENT_CARD_READING ||
                    transactionResponse.flowStage == FlowStages.TRANSACTION_PROCESSING)) {
                return transactionResponse;
            }
        }
        return null;
    }
}
