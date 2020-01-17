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
import { BasketItem } from './basket-item';
import { BasketItemModifier } from './basket-item-modifier';
import { Measurement } from './measurement';
import { AdditionalData } from './additional-data';
import { InvalidArgumentError } from '../util/pre-conditions';

import { v4 as uuid } from 'uuid';

/**
 * Builder to create {@link BasketItem} instances.
 */
export class BasketItemBuilder {

    private id: string;
    private quantity: number = 1;
    private label: string;
    private category: string;
    private baseAmount: number = 0;
    private amount: number = 0;
    private measurement?: Measurement;
    private modifiers?: Array<BasketItemModifier>;
    private itemData?: AdditionalData;

    /**
     * Initialise the builder with a default random id.
     */
    constructor() {
        this.generateRandomId();
    }

    /**
     * Initialise the builder from the provided basket item.
     *
     * @param copyFrom The item to copy from
     */
    public static from(copyFrom: BasketItem): BasketItemBuilder {
        var b = new BasketItemBuilder();
        b.id = copyFrom.id;
        b.quantity = copyFrom.quantity;
        b.label = copyFrom.label;
        b.category = copyFrom.category;
        b.amount = copyFrom.amount;
        b.baseAmount = copyFrom.baseAmount;
        b.measurement = copyFrom.measurement;

        if (copyFrom.hasItemData()) {
            b.itemData = copyFrom.itemData;
        }
        if (copyFrom.hasModifiers()) {
            b.modifiers = copyFrom.modifiers;
        }

        return b;
    }

    /**
     * Generate a new random id (UUID) for this item.
     *
     * Note that the builder is initialised with a random id, meaning this only has to be called to generate a new random id.
     *
     * @return This builder
     */
    public generateRandomId(): BasketItemBuilder {
        this.id = uuid();
        return this;
    }

    /**
     * Set the id for this item, overriding the default generated random id.
     *
     * @param id The id
     * @return This builder
     */
    public withId(id: string): BasketItemBuilder {
        this.id = id;
        return this;
    }

    /**
     * Set the quantity for this item.
     *
     * Defaults to 1 if not set.
     *
     * See {@link #withMeasurement(float, String)} and {@link #withFractionalQuantity(float, String)} for scenarios where quantities have or may have a fractional part and a unit.
     *
     * @param quantity The item quantity
     * @return This builder
     */
    public withQuantity(quantity: number): BasketItemBuilder {
        this.quantity = quantity;
        return this;
    }

    /**
     * Increment the quantity by one.
     *
     * @return This builder
     */
    public incrementQuantity(): BasketItemBuilder {
        this.quantity++;
        return this;
    }

    /**
     * Decrements the item quantity by one as long as the current quantity is greater than zero.
     *
     * If the quantity is already zero, this method has no effect.
     *
     * @return This builder
     */
    public decrementQuantity(): BasketItemBuilder {
        this.quantity--;
        return this;
    }

    /**
     * Modify the current quantity with the provided offset.
     *
     * This effectively does quantity += offset, and can be used to increase or decrease the quantity.
     *
     * @param offset The value to modify the current quantity with.
     * @return This builder
     */
    public offsetQuantityBy(offset: number): BasketItemBuilder {
        this.quantity += offset;
        return this;
    }

    /**
     * Set the measurement of this item to support items measured in fractions with a unit, such as "1.25 kilograms".
     *
     * The quantity (via {@link #withQuantity(int)} defaults to 1, but can also be set to represent multiple items, such as "2 x 1.25 kilograms".
     *
     * See {@link #withFractionalQuantity(float, String)} for a convenience function that sets quantity and measurement as per provided parameters.
     *
     * @param value The measurement value
     * @param unit  The unit (such as "kilograms" or "feet")
     * @return This builder
     */
    public withMeasurement(value: number, unit: string): BasketItemBuilder {
        this.measurement = Measurement.from(value, unit);
        return this;
    }

    /**
     * Convenience method for scenarios where the quantity is represented as float/double internally in the client application.
     *
     * If a unit is set, the provided values will be set as per {@link #withMeasurement(float, String)} and the quantity defaults to 1.
     *
     * If no unit is set (null) and the provided quantity is a whole number, the value will be set as per {@link #withQuantity(int)}.
     *
     * If no unit is set and the provided quantity has a fractional part, an exception will be thrown as unit is mandatory for measurement.
     *
     * @param quantity The floating point quantity
     * @param unit     The unit (such as "kilograms" or "feet") - may be undefined
     * @return This builder
     * @throws IllegalArgumentException When the unit is not set for a quantity with a fractional part
     */
    public withFractionalQuantity(quantity: number, unit?: string): BasketItemBuilder {
        if (unit) {
            this.withMeasurement(quantity, unit);
        } else if (!this.hasFractionalPart(quantity)) {
            this.withQuantity(quantity);
        } else {
            throw new InvalidArgumentError("Unit must be set for quantities with fractional parts");
        }
        return this;
    }

    private hasFractionalPart(value: number): boolean {
        return value % 1 != 0;
    }

    /**
     * Set the label for this item.
     *
     * @param label The label
     * @return This builder
     */
    public withLabel(label: string): BasketItemBuilder {
        this.label = label;
        return this;
    }

    /**
     * Set the category for this item (such as "drinks" or "vegetables")
     *
     * @param category The category the item belongs to
     * @return This builder
     */
    public withCategory(category: string): BasketItemBuilder {
        this.category = category;
        return this;
    }

    /**
     * Set the item amount value, inclusive of tax.
     *
     * This is to be used for cases where modifiers (see {@link #withBaseAmountAndModifiers(float, BasketItemModifier...)} are not relevant and a client
     * just wants to set the absolute amount value of this item.
     *
     * Note that the amount value can be negative to represent discounts, etc.
     *
     * See {@link #withBaseAmountAndModifiers(float, BasketItemModifier...)} to instead provide a base amount with modifiers applied.
     *
     * @param amount The item amount value, inclusive of tax.
     * @return This builder
     */
    public withAmount(amount: number): BasketItemBuilder {
        if (this.baseAmount != 0 || (this.modifiers != null && this.modifiers.length > 0)) {
            throw new InvalidArgumentError("Amount may not be set if base amount and modifiers have been set");
        }
        this.amount = amount;
        this.baseAmount = amount;
        return this;
    }

    /**
     * Set the item base amount value together with any modifiers that are to be applied to this amount.
     *
     * {@link #withAmount(long)} may NOT be called in combination with this - the amount field is in this case calculated
     * from the base amount with modifiers applied, and then rounded.
     *
     * @param baseAmount          The base amount value (exclusive of modifiers)
     * @param basketItemModifiers The var-args list of modifiers to apply to base amount
     * @return This builder
     */
    public withBaseAmountAndModifiers(baseAmount: number, ...basketItemModifiers: BasketItemModifier[]): BasketItemBuilder {
        if (this.amount != 0) {
            throw new InvalidArgumentError("Base amount and modifiers may not be set if amount has already been set");
        }
        this.baseAmount = baseAmount;
        this.modifiers = basketItemModifiers;
        this.amount = Math.round(BasketItem.calculateFinalAmount(baseAmount, this.modifiers));
        return this;
    }

    /**
     * Add additional item data entries.
     *
     * @param key    The key to use for this data
     * @param values An array of values for this data
     * @param <T>    The type of object this data is an array of
     * @return This builder
     */
    public withItemData(key: string, ...values: any): BasketItemBuilder {
        if (this.itemData == null) {
            this.itemData = new AdditionalData();
        }
        this.itemData.addData(key, values);
        return this;
    }

    /**
     * Add additional item data.
     *
     * @param additionalData The additional item data
     * @return This builder
     */
    public withAdditionalData(additionalData: AdditionalData): BasketItemBuilder {
        this.itemData = additionalData;
        return this;
    }

    /**
     * Build the instance with a default quantity of 1 (if not set).
     *
     * @return A {@link BasketItem} instance
     */
    public build(): BasketItem {
        if (this.quantity < 0) {
            throw new InvalidArgumentError("Basket item must have a quantity of zero or more");
        }
        if (this.id == null || this.id == "") {
            throw new InvalidArgumentError("A basket item must have an id");
        }
        if (this.label == null || this.label == "") {
            throw new InvalidArgumentError("A basket item must have a label");
        }

        return BasketItem.from(this.id, this.label, this.category, this.amount, this.baseAmount, this.quantity, this.measurement, this.modifiers, this.itemData);
    }
}