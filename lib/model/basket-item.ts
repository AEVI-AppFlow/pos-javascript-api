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
import {JsonObject, JsonProperty} from "json2typescript";

import { Measurement } from "./measurement";
import { BasketItemModifier } from "./basket-item-modifier";
import { AdditionalData } from "./additional-data";

@JsonObject("BasketItem")
export class BasketItem {

    @JsonProperty("id") 
    public id: string = undefined;

    @JsonProperty("label") 
    public label: string = undefined;

    @JsonProperty("category", String, true) 
    public category: string = undefined;

    @JsonProperty("amount") 
    public amount: number = undefined;

    @JsonProperty("baseAmount") 
    public baseAmount: number = undefined;

    @JsonProperty("quantity") 
    public quantity: number = undefined;

    @JsonProperty("measurement", Measurement, true) 
    public measurement?: Measurement = undefined;

    @JsonProperty("modifiers", [BasketItemModifier], true) 
    public modifiers?: Array<BasketItemModifier> = undefined;

    @JsonProperty("itemData", AdditionalData, true) 
    public itemData = new AdditionalData();

    constructor() {

    }

    public static from(id: string, label: string, category: string, amount: number, baseAmount: number, quantity: number, measurement?: Measurement, modifiers?: Array<BasketItemModifier>, itemData?: AdditionalData): BasketItem {
        let basketItem = new BasketItem();
        basketItem.id = id;
        basketItem.label = label;
        basketItem.category = category;
        basketItem.amount = amount;
        basketItem.baseAmount = baseAmount;
        basketItem.quantity = quantity;
        basketItem.measurement = measurement;
        basketItem.modifiers = modifiers;
        if(itemData) {
            basketItem.itemData = itemData;
        }
        return basketItem;
    }

    /**
     * Get the total base cost (amount) for the items of this type, exclusive of any modifiers.
     *
     * Note that the amount may be negative in the case of discounts, etc.
     *
     * @return The total cost (amount) for the items of this type, excluding modifiers
     */
    public getTotalBaseAmount(): number {
        return this.baseAmount * this.quantity;
    }

    /**
     * Get the total cost (amount) for the items of this type, inclusive of modifiers.
     *
     * This value has been rounded to closest whole sub-unit if the calculated amount has decimal points.
     *
     * Note that the amount may be negative in the case of discounts, etc.
     *
     * @return The total cost (amount) for the items of this type, including modifiers
     */
    public getTotalAmount(): number {
        return this.amount * this.quantity;
    }

    /**
     * Get the total cost (amount) for the items of this type, calculated from the base amount with modifiers applied.
     *
     * This can be used when rounding does not provide enough accuracy for calculating the total basket value.
     *
     * @return The total fractional amount, calculated from base amount with modifiers applied
     */
    public getTotalFractionalAmount(): number {
        if (!this.hasModifiers()) {
            return this.getTotalAmount();
        } else {
            var amount = BasketItem.calculateFinalAmount(this.baseAmount, this.modifiers);
            return amount * this.quantity;
        }
    }

    /**
     * Check whether this item has any modifiers.
     *
     * @return True if there are modifiers, false otherwise
     */
    public hasModifiers(): boolean {
        return this.modifiers && this.modifiers.length > 0;
    }

    /**
     * Check whether this item has a measurement value
     * 
     * @return True if this item is measured
     */
    public hasMeasurement(): boolean {
        return this.measurement != null && this.measurement != undefined;
    }

    /**
     * Check whether this basket item has any associated item data.
     *
     * @return True if there is any item data, false otherwise
     */
    public hasItemData(): boolean {
        return this.itemData != null && this.itemData != undefined && !this.itemData.isEmpty();
    }

    /**
     * Calculate the final amount after applying modifiers to the base amount.
     *
     * @param baseAmount The base amount value
     * @param modifiers  The list of modifiers
     * @return The amount value calculated from base with modifiers applied
     */
    public static calculateFinalAmount(baseAmount: number, modifiers: Array<BasketItemModifier> | undefined): number {
        var amount = baseAmount;
        if(modifiers) {
            for (let modifier of modifiers) {
                if (modifier.amount != null && modifier.amount != 0.0) {
                    amount += modifier.amount;
                } else if (modifier.percentage != null) {
                    amount += baseAmount * (modifier.percentage / 100.0);
                }
            }
        }
        return amount;
    }
}
