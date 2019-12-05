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
import { PreConditions } from '../util/pre-conditions';
import { BasketItemModifier } from './basket-item-modifier';

export class BasketItemModifierBuilder {
    private id: string;
    private amount: number;
    private percentage: number;

    /**
     * Create an instance of this builder
     *
     * @param name The name of the modifier you are building
     * @param type The type of modifier you are building
     */
    constructor(public readonly name: string, public readonly type: string) {

    }

    /**
     * Set the id for this item modifier (optional).
     *
     * @param id The id
     * @return This builder
     */
    public withId(id: string): BasketItemModifierBuilder {
        this.id = id;
        return this;
    }

    /**
     * Set the absolute amount of this modifier in subunit form (e.g pence / cents). This amount may be fractional i.e. fractions of one cent/penny.
     * A fractional value may used in cases such as representing a tax amount that needs to be correct to several decimal places of accuracy when
     * these item modifiers are added together as a part of a whole transaction. If a fractional value is not required then use
     * {@link BasketItemModifierBuilder#withAmount(long)} instead.
     *
     * This value can be negative to indicate a reduction/discount to the item amount.
     *
     * @param amount The amount
     * @return This builder
     */
    public withAmount(amount: number): BasketItemModifierBuilder {
        this.amount = amount;
        return this;
    }

    /**
     * Set the percentage rate for this modifier.
     *
     * The percentage is represented as a float value, such as 25.75 for 25.75%.
     *
     * This value can be negative to indicate a reduction/discount to the item amount.
     *
     * @param percentage The percentage
     * @return This builder
     */
    public withPercentage(percentage: number): BasketItemModifierBuilder {
        this.percentage = percentage;
        return this;
    }

    /**
     * Build the modifier instance.
     *
     * As well as name and type either an absolute amount or a percentage must also be set otherwise this method will throw an {@link IllegalArgumentException}.
     *
     * @return A {@link BasketItemModifier} instance
     */
    public build(): BasketItemModifier {
        PreConditions.checkArgument(this.amount != null || this.percentage != null, "Either amount or percentage must be set");

        return BasketItemModifier.from(this.name, this.type, this.amount, this.percentage, this.id);
    }

}