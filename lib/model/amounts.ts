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

import { PreConditions, InvalidArgumentError } from '../util/pre-conditions';
import { Amount } from './amount';
import { Jsonable } from "./jsonable";

/**
 * Representation of all the amounts relevant for a transaction.
 *
 * See {@link Amount} for representation of a single amount value with associated currency.
 */
@JsonObject("Amounts")
export class Amounts extends Jsonable {

    @JsonProperty("baseAmount")
    baseAmount: number = 0;

    @JsonProperty("additionalAmounts")
    additionalAmounts: { [name: string]: number } = {};

    @JsonProperty("currency", String, true)
    currency: string = "XXX";

    @JsonProperty("currencyExchangeRate", Number, true)
    currencyExchangeRate: number | undefined = 0;

    @JsonProperty("originalCurrency", String, true)
    originalCurrency: string | undefined = undefined;

    constructor() {
        super();
    }

    /**
     * Convert a JSON string into an {@link Amounts} object if possible
     * 
     * @param json The JSON to convert
     */
    public static fromJson(json: string): Amounts {
        return Jsonable.baseFromJson(json, Amounts);
    }

    /**
     * Initialise with base amount (inclusive of tax), currency and optional additional amounts map.
     *
     * @param baseAmount        The base amount, inclusive of tax, in subunit form (cents, pence, etc)
     * @param currency          The ISO-4217 currency code
     * @param additionalAmounts The additional amounts
     * 
     * @returns The initialised amounts object
     */
    public static from(baseAmount = 0, currency = "XXX", additionalAmounts = {}): Amounts {
        var amounts = new Amounts();
        amounts.baseAmount = baseAmount;
        amounts.currency = currency;
        amounts.additionalAmounts = additionalAmounts;
        return amounts;
    }

    /**
     * Initialise a new Amounts object from another one.
     * 
     * The method will create a new Amounts object cloned from the original
     * 
     * @param from The Amounts object to clone
     * 
     * @returns The initialised amounts object
     */
    public static fromAmounts(from: Amounts): Amounts {
        var obj = Amounts.from(from.baseAmount, from.currency, from.additionalAmounts);
        obj.currencyExchangeRate = from.currencyExchangeRate;
        obj.originalCurrency = from.originalCurrency;
        return obj;
    }

    /**
     * Add an additional amount to complement the base amount.
     *
     * The additional amounts are represented via a string identifier and the amount value in subunit form.
     *
     * Examples of identifiers are "tip" and "cashback". Note that identifiers are case sensitive!
     *
     * @param identifier The string identifier for the amount
     * @param amount     The amount value
     */
    public addAdditionalAmount(identifier: string, amount: number) {
        PreConditions.checkArgument(identifier != null && amount >= 0, "Identifier must be set and value must be >= 0");
        this.additionalAmounts[identifier] = amount;
    }

    /**
     * Add an additional amount as a fraction of the base amount.
     *
     * This is useful for cases where a fee, charity contribution, etc is calculated as a fraction or percentage of the base amount value.
     *
     * Examples of identifiers are "tip" and "cashback". Note that identifiers are case sensitive!
     *
     * @param identifier The string identifier for the amount
     * @param fraction   The fraction of the base amount, ranging from 0.0 to 1.0f (0% to 100%)
     */
    public addAdditionalAmountAsBaseFraction(identifier: string, fraction: number) {
        if (fraction < 0.0 || fraction > 1.0) {
            throw new InvalidArgumentError("Fraction must be between 0.0 and 1.0");
        }
        this.addAdditionalAmount(identifier, this.baseAmount * fraction);
    }

    /**
     * Get an {@link Amount} representation of the base amount with associated currency.
     *
     * The base amount is inclusive of any tax.
     *
     * @return Base {@link Amount}
     */
    public getBaseAmount(): Amount {
        return Amount.from(this.baseAmount, this.currency);
    }

/**
     * Check whether there is an additional amount with the provided identifier defined.
     *
     * Note that identifiers are case sensitive.
     *
     * @param identifier The identifier
     * @return True if one is defined, false otherwise
     */
    public hasAdditionalAmount(identifier: string): boolean {
        return this.additionalAmounts[identifier] != undefined;
    }

    /**
     * Get the additional amount value for the provided identifier.
     *
     * If none is set, 0 will be returned.
     *
     * Note that identifiers are case sensitive.
     *
     * @param identifier The identifier
     * @return The amount value
     */
    public getAdditionalAmountValue(identifier: string): number {
        if (this.additionalAmounts[identifier]) {
            return this.additionalAmounts[identifier];
        }
        return 0;
    }

    /**
     * Get an {@link Amount} representation of the additional amount with associated currency.
     *
     * Note that identifiers are case sensitive.
     *
     * @param identifier The identifier
     * @return The additional {@link Amount}
     */
    public getAdditionalAmount(identifier: string): Amount {
        return Amount.from(this.getAdditionalAmountValue(identifier), this.currency);
    }

    /**
     * Get the map of all the additional amounts set.
     *
     * Note that amount identifiers are case sensitive.
     *
     * @return The map of identifier keys mapped to amount values
     */
    public getAdditionalAmounts(): { [name: string]: number } {
        return this.additionalAmounts;
    }

    /**
     * Get the total amount (base + additional amounts) in subunit form.
     *
     * @return The total amount
     */
    public getTotalAmountValue(): number {
        var total = this.baseAmount;
        for (let key of Object.keys(this.additionalAmounts)) {
            total += this.additionalAmounts[key];
        }
        return total;
    }

    /**
     * Get the total amount (base + additional amounts) in subunit form, excluding any additionals as defined by their provided identifiers.
     *
     * This is useful for scenarios where some additional amounts are supported natively in an environment (such as tip and cashback), but others
     * (like charity donations) are not and should be appended to the base amount for that environment.
     *
     * Note that identifiers are case sensitive.
     *
     * @param amountIdentifiers The identifiers of the amounts to exclude from the calculation
     * @return The total amount value, excluding the amounts as provider via the identifiers
     */
    public getTotalExcludingAmounts(...amountIdentifiers: Array<string>): number {
        var total = this.baseAmount;
        for (let key of Object.keys(this.additionalAmounts)) {
            if (!amountIdentifiers.includes(key)) {
                total += this.additionalAmounts[key];
            }
        }
        return total;
    }

    /**
     * Get an {@link Amount} representation of the total amount with associated currency.
     *
     * @return Total {@link Amount}
     */
    public getTotalAmount(): Amount {
        return Amount.from(this.getTotalAmountValue(), this.currency);
    }

    /**
     * Add together two amounts and get a new Amounts instance back with the result.
     *
     * @param a1 The first amount to add with
     * @param a2 The second amount to add with
     * @return The combined result
     */
    public static addAmounts(a1: Amounts, a2: Amounts): Amounts {
        if (a1 == null || a2 == null || a1.currency !== a2.currency) {
            throw new InvalidArgumentError("Invalid amounts or trying to combine different currencies");
        }
        var newBaseAmount = a1.baseAmount + a2.baseAmount;
        var newAdditionals = a1.additionalAmounts;
        var a2Additionals = a2.additionalAmounts;
        for (let a2Key of Object.keys(a2Additionals)) {
            if (newAdditionals.hasOwnProperty(a2Key)) {
                newAdditionals[a2Key] = newAdditionals[a2Key] + a2Additionals[a2Key];
            } else {
                newAdditionals[a2Key] = a2Additionals[a2Key];
            }
        }

        return Amounts.from(newBaseAmount, a1.currency, newAdditionals);
    }

    /**
     * Subtract one amounts from another.
     *
     * Note that the result Amounts will only contain additionalAmounts defined in a1, the one being subtracted from.
     * If an amount is set in a2 only, it will not be added to the resulting Amounts.
     *
     * @param a1                        The amounts to subtract a2 from
     * @param a2                        The amounts of which a1 will be reduced by
     * @param keepZeroAmountAdditionals Whether or not to keep additional amounts with a value of zero
     * @return The reduced amounts
     */
    public static subtractAmounts(a1: Amounts, a2: Amounts, keepZeroAmountAdditionals: boolean = true): Amounts {
        if (a1 == null || a2 == null || a1.currency !== a2.currency) {
            throw new InvalidArgumentError("Invalid amounts or trying to combine different currencies");
        }
        var remainingBase = Math.max(a1.baseAmount - a2.baseAmount, 0);
        var newAdditionals = a1.additionalAmounts;
        var a2Additionals = a2.additionalAmounts;
        for (let a2Key of Object.keys(a2Additionals)) {
            if (newAdditionals.hasOwnProperty(a2Key)) {
                var additionalRemainder = Math.max(newAdditionals[a2Key] - a2Additionals[a2Key], 0);
                if (additionalRemainder > 0 || keepZeroAmountAdditionals) {
                    newAdditionals[a2Key] = additionalRemainder;
                } else {
                    delete newAdditionals[a2Key];
                }
            }
        }

        return Amounts.from(remainingBase, a1.currency, newAdditionals);
    }

}
