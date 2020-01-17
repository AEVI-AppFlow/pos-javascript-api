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
import { PreConditions } from '../util/pre-conditions';

/**
 * A {@link BasketItemModifier} can be used to associate additional cost/amounts with a basket item, such as tax, discounts or add-ons.
 *
 * Either an absolute amount or a percentage must be set.
 */
@JsonObject
export class BasketItemModifier {    

    @JsonProperty("id", String, true)
    id: string = undefined;

    @JsonProperty("name")
    name: string = undefined;

    @JsonProperty("type")
    type: string = undefined;

    @JsonProperty("amount", Number, true)
    amount: number = undefined;

    @JsonProperty("percentage", Number, true)
    percentage: number = undefined;

    constructor() {
    }

    /**
     * Create an instance of a modifier.
     *
     * Either an absolute amount or a percentage must be set.
     *
     * @param id         The id, if one exists. May be null
     * @param name       The name of the modifier.
     * @param type       The type of the modifier.
     * @param amount     The absolute amount of the modifier.
     * @param percentage The percentage applied to the item amounts.
     * 
     * @returns The new BaskeTItemModifier instance
     */
    public static from(name: string, type: string, amount?: number, percentage?: number, id?: string): BasketItemModifier {
        PreConditions.checkArgument(amount != null || percentage != null, "Either amount or percentage must be set");
        var bim = new BasketItemModifier();
        bim.name = name;
        bim.type = type;
        bim.amount = amount;
        bim.percentage = percentage;
        bim.id = id;        
        return bim;
    }
}
