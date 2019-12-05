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
import { Payment } from './payment';
import { Amounts } from './amounts';
import { Basket } from './basket';
import { Customer } from './customer';
import { Token } from './token';
import { AdditionalData } from './additional-data';

import { InvalidArgumentError } from '../util/pre-conditions';
import { JsonOption } from '../util/json-option';

export class PaymentBuilder{

    flowType: string;
    flowName?: string; 
    amounts: Amounts;
    basket?: Basket;
    customer?: Customer;
    splitEnabled: boolean = false;
    cardToken?: Token;
    additionalData?: AdditionalData;
    source?: string;
    deviceId?: string;
    paymentMethod?: string;

    /**
     * Set what flow to use based on flow type and name.
     *
     * This ensures that the intended flow is used in the case of multiple flows for the provided type.
     *
     * The flow will determine what stages the payment goes through and what applications get called.
     *
     * See {@link PaymentSettings} for retrieving flow information.
     *
     * @param flowType The flow type
     * @param flowName The name of the flow to use
     * @return This builder
     */
    public withPaymentFlow(flowType: string, flowName?: string): PaymentBuilder {
        this.flowType = flowType;
        this.flowName = flowName;
        return this;
    }

    /**
     * Set the amounts.
     *
     * This parameter is mandatory.
     *
     * @param amounts The amounts.
     * @return This builder
     */
    public withAmounts(amounts: Amounts): PaymentBuilder {
        this.amounts = amounts;
        return this;
    }

    /**
     * Add a basket for this payment.
     *
     * Note that {@link #withAmounts(Amounts)} must be called to reflect the value of the basket. This API and the flow processing service do not
     * take the basket data into account for any processing.
     *
     * @param basket The basket
     * @return This builder
     */
    public withBasket(basket: Basket): PaymentBuilder {
        this.basket = basket;
        return this;
    }

    /**
     * Specify the payment method to use for transaction processing for this payment.
     *
     * Setting this has two effects - first it means FPS will filter payment applications based on supported methods, and secondarily it allows
     * any payment app that supports multiple methods to proceed without a user choice.
     *
     * Note that this value has no effect on flow services in general - they may still use any method of their choice to offer services such as loyalty.
     *
     * @param paymentMethod The payment method to use for this payment
     * @return This builder
     */
    public withPaymentMethod(paymentMethod: string): PaymentBuilder {
        this.paymentMethod = paymentMethod;
        return this;
    }

    /**
     * Add customer details for this payment.
     *
     * Note that this should not be set for a split payment.
     *
     * @param customer Customer details
     * @return This builder
     */
    public withCustomer(customer: Customer): PaymentBuilder {
        this.customer = customer;
        return this;
    }

    /**
     * Set split enabled for this payment which means it *may* be broken up into multiple sub-payments.
     *
     * It is up to the flow processing service configuration if split is enabled or not. Use {@link PaymentClient#getPaymentSettings()} to get
     * list of flow configurations and check for defined stages
     *
     * If this is not called, it is still possible that split will be enabled during the payment flow.
     *
     * @param enabled True to enable split, false to disable
     * @return This builder
     */
    public withSplitEnabled(enabled: boolean): PaymentBuilder {
        this.splitEnabled = enabled;
        return this;
    }

    /**
     * Set any previously generated card token to use for this transaction.
     *
     * @param cardToken The card {@link Token}
     * @return This builder
     */
    public withCardToken(cardToken: Token): PaymentBuilder {
        this.cardToken = cardToken;
        return this;
    }

    /**
     * Convenience wrapper for adding additional data.
     *
     * See {@link AdditionalData#addData(String, Object[])} for more info.
     *
     * @param key    The key to use for this data
     * @param values An array of values for this data
     * @param <T>    The type of object this data is an array of
     * @return This builder
     */
    public addAdditionalData(key: string, values: any | JsonOption): PaymentBuilder {
        this.additionalData.addData(key, values);
        return this;
    }

    /**
     * Set the additional data to pass via the payment.
     *
     * @param additionalData The additional data
     * @return This builder
     */
    public withAdditionalData(additionalData: AdditionalData): PaymentBuilder {
        this.additionalData = additionalData;
        return this;
    }

    /**
     * Get the current additional data model.
     *
     * @return The additional data
     */
    public getCurrentAdditionalData(): AdditionalData {
        return this.additionalData;
    }

    /**
     * Set the id of the device this payment should be processed on.
     *
     * @param deviceId The id of the device to process this payment on
     * @return This builder
     */
    public withDeviceId(deviceId: string): PaymentBuilder {
        this.deviceId = deviceId;
        return this;
    }

    /**
     * Build an instance of {@link Payment} using the provided parameters.
     *
     * @return An instance of {@link Payment}
     * @throws IllegalArgumentException for invalid data or combinations of data
     */
    public build(): Payment {
        var p = new Payment();
        p.flowType = this.flowType;
        p.amounts = this.amounts;

        if(this.flowName) {
            p.flowName = this.flowName;
        }

        if(this.basket) {
            p.basket = this.basket;
        }

        if(this.customer) {
            p.customer = this.customer;
        }

        p.splitEnabled = this.splitEnabled;

        if(this.cardToken) {
            p.cardToken = this.cardToken;
        }

        if(this.additionalData) {
            p.additionalData = this.additionalData;
        }

        if(this.source) {
            p.source = this.source;
        }

        if(this.deviceId) {
            p.deviceId = this.deviceId;
        }

        if(this.paymentMethod) {
            p.paymentMethod = this.paymentMethod;
        }

        if(p.cardToken && p.splitEnabled) {
            throw new InvalidArgumentError("Card token can not be set for a split payment as token relates to only one customer");
        }

        if(p.basket && p.basket.getTotalBasketValue() != p.amounts.baseAmount) {
            throw new InvalidArgumentError("The basket total value must match base amounts value");
        }

        if(p.basket) {
            p.basket.primaryBasket = true;
        }
        return p;
    }
}