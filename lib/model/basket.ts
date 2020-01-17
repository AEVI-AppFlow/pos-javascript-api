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
import {JsonObject, JsonProperty, JsonConverter, JsonCustomConvert} from "json2typescript";

import { Jsonable } from "./jsonable";
import { BasketItem } from "./basket-item";
import { AdditionalData } from "./additional-data";
import { BasketItemBuilder } from "./basket-item-builder";

/**
 * Strategies for rounding decimal numbers.
 */
export enum RoundingStrategy {
    /**
     * Always round down. Both 15.2 and 15.9 is rounded to 15.
     */
    DOWN = "DOWN",
    /**
     * Round to nearest. 15.2 is rounded to 15, and 15.9 is rounded to 16.
     */
    NEAREST =  "NEAREST",
    /**
     * Always round up. Both 15.2 and 15.9 is rounded to 16.
     */
    UP = "UP"
}

/**
 * Represents a basket consisting of one or multiple {@link BasketItem}.
 *
 * Baskets are uniquely identified via a randomly generated id, and also contains a name as a readable identifier.
 *
 * Basket items are kept in a list sorted by most recently added first.
 *
 * Basket items are uniquely identified by an id, meaning it is possible that there is more than one item with the same label.
 * It is up to the client to manage this correctly.
 *
 * Note that as basket items are immutable, any update to items (such as merging or changing quantity) leads to new instances being created. For the
 * latest up to date item, always fetch via {@link #getItemById(String)}.
 */
@JsonObject("Basket")
export class Basket extends Jsonable {
    @JsonProperty("basketName")
    basketName: string = "";

    @JsonProperty("displayItems", [BasketItem])
    displayItems: BasketItem[] = [];

    @JsonProperty("additionalBasketData", AdditionalData, true)
    additionalBasketData: AdditionalData = new AdditionalData();

    @JsonProperty("primaryBasket")
    primaryBasket: boolean = false;

    @JsonProperty("roundingStrategy", String)
    roundingStrategy: RoundingStrategy = RoundingStrategy.NEAREST;

    constructor() {
        super();
    }

    /**
     * Convert a JSON string into an {@link Basket} object if possible
     * 
     * @param json The JSON to convert
     */
    public static fromJson(json: string) {
        return super.baseFromJson(json, Basket);
    }

    /**
     * Initialise a basket from the provided var-args items, maintaining the same order as they are specified in.
     *
     * @param basketName  The name of the basket
     * @param basketItems The var-args list of basket items to initialise the basket with
     * 
     * @returns The new Basket object
     */
    public static fromItems(name: string, ...basketItems: Array<BasketItem>): Basket {
        var basket: Basket = new Basket();
        basket.basketName = name;
        basket.displayItems = basketItems;
        return basket;
    }

    /**
     * Get the total basket value, inclusive of tax.
     *
     * This value is calculated as the sum of each item base amount with modifiers applied and then rounded as per the strategy set
     * via {@link #setRoundingStrategy(RoundingStrategy)}.
     *
     * @return The total basket value
     */
    public getTotalBasketValue(): number {
        var total = 0;
        for (let displayItem of this.displayItems) {
            total += displayItem.getTotalFractionalAmount();
        }
        if (this.roundingStrategy != null) {
            switch (this.roundingStrategy) {
                case RoundingStrategy.DOWN:
                    return Math.floor(total);
                case RoundingStrategy.UP:
                    return Math.ceil(total);
                case RoundingStrategy.NEAREST:
                default:
                    return Math.round(total);
            }
        }
        return Math.round(total);
    } 

    /**
     * Add one or multiple basket items to the *front* of the basket either as a new item or via merging with an existing one with the same id.
     *
     * If there is an existing item with the same id in the basket, then the item quantity of the two items will be added together and stored.
     *
     * Note that due to how items may be merged, the instance passed into this method is not necessarily the same instance that is stored.
     *
     * @param items The item(s) to add
     */
    public addItems(...items: Array<BasketItem>) {
        for (let item of items) {
            var existingItem = this.getItemById(item.id);
            if (existingItem != null) {
                this.replaceItem(existingItem, item.quantity, true);
            } else {
                this.displayItems.splice(0, 0, item);
            }
        }
    }

    /**
     * Check whether the basket has an item with the provided id.
     *
     * Optionally, a min quantity parameter can be passed in to filter results against. If an item with the id is found and the min quantity is set,
     * this method will only return true if the item has at least the min quantity.
     *
     * @param id          The id to match against
     * @param minQuantity Optional param to specify a minimum quantity criteria
     * @return True if there is an item with matching id, false otherwise
     */
    public hasItemWithId(id: string, ...minQuantity: number[]): boolean {
        var minQuantityValue = minQuantity.length > 0 ? minQuantity[0] : -1;
        for (let item of this.displayItems) {
            if (item.id == id && item.quantity >= minQuantityValue) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check whether the basket has an item with the provided label.
     *
     * Note that there may be more than one item with the same label.
     *
     * @param label The label to match against
     * @return True if there is an item with matching label, false otherwise.
     */
    public hasItemWithLabel(label: string): boolean {
        for (let item of this.displayItems) {
            if (item.label == label) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get an item based on its id.
     *
     * @param id The id to match against
     * @return The item if found, or null
     */
    public getItemById(id: string): BasketItem | null {
        for (let item of this.displayItems) {
            if (item.id == id) {
                return item;
            }
        }
        return null;
    }

    /**
     * Get an item that matches the provided label.
     *
     * Note that there may be more than one item with the same label, in which case it returns the first one found.
     *
     * @param label The label to match against
     * @return The item if found, or null
     */
    public getItemByLabel(label: string): BasketItem | null {
        for (let item  of this.displayItems) {
            if (item.label == label) {
                return item;
            }
        }
        return null;
    }

    /**
     * Get all items that belongs to the provided category.
     *
     * @param category The category to filter against
     * @return A list of items belonging to the provided category. May be empty.
     */
    public getBasketItemsByCategory(category: string): Array<BasketItem>  {
        var items = new Array();
        for (let displayItem of this.displayItems) {
            var itemCategory = displayItem.category;
            if (itemCategory != null && itemCategory == category) {
                items.push(displayItem);
            }
        }
        return items;
    }

    /**
     * Increment the basket item quantity of the item with the provided id.
     *
     * Note that if no such item exists, this is a no-op.
     *
     * @param itemId    The basket item id to increment the quantity of
     * @param increment The increment value (positive)
     * @return The item with updated quantity or null if no item with id found
     */
    public incrementItemQuantity(itemId: string, increment: number): BasketItem | null {
        var item = this.getItemById(itemId);
        if (item != null) {
            return this.replaceItem(item, increment, true);
        }
        return null;
    }

    /**
     * Decrement the basket item quantity of the item with the provided id.
     *
     * The default behaviour is that items that are decremented to zero are removed from the basket. This can be overriden by the retainIfZero param.
     *
     * Note that if no such item exists, this is a no-op.
     *
     * @param itemId       The basket item id to decrement the quantity of
     * @param decrement    The decrement value (positive)
     * @param retainIfZero If set to true, the item will be kept in the basket despite the quantity being zero
     * @return The item with the updated quantity or null if no item with id found or it is removed
     */
    public decrementItemQuantity(itemId: string, decrement: number, ...retainIfZero: boolean[]): BasketItem | null {
        var item = this.getItemById(itemId);
        if (item != null) {
            var retain = retainIfZero.length > 0 && retainIfZero[0];
            return this.replaceItem(item, -decrement, retain);
        }
        return null;
    }

    /**
     * Explicitly set the quantity for a basket item.
     *
     * Note that if no such item exists, this is a no-op.
     *
     * The quantity must be zero or larger. Negative values are ignored.
     *
     * @param itemId      The item id
     * @param newQuantity The new quantity for the basket item (must be positive)
     * @return The item with the updated quantity or null if no item with id found
     */
    public setItemQuantity(itemId: string, newQuantity: number): BasketItem | null {
        if (newQuantity >= 0) {
            var item = this.getItemById(itemId);
            if (item != null) {
                return this.replaceItem(item, newQuantity - item.quantity, true);
            }
        }
        return null;
    }

    /**
     * Remove the item with the provided id.
     *
     * @param itemId The id of the item to remove
     * @return The basket item that was removed, or null
     */
    public removeItem(itemId: string): BasketItem | null {
        var item = this.getItemById(itemId);
        if (item != null) {
            this.displayItems = this.displayItems.filter(item => item.id !== itemId);
            return item;
        }
        return null;
    }

    /**
     * Clear the basket of all items.
     */
    public clearItems() {
        this.displayItems = [];
    }

    /**
     * Get the number of unique items in the basket, incl any zero-quantity items.
     *
     * See {@link #getTotalNumberOfItems()} for retrieving the total number of items.
     *
     * @return The number of unique items in the basket
     */
    public getNumberOfUniqueItems(): number {
        return this.displayItems.length;
    }

    /**
     * Get the total number of items, taking into account the quantity of each individual item. This excludes zero-quantity items.
     *
     * See {@link #getNumberOfUniqueItems()} for retrieving the number of unique items.
     *
     * @return The total number of items
     */
    public getTotalNumberOfItems(): number {
        var total = 0;
        for (let displayItem of this.displayItems) {
            total += displayItem.quantity;
        }
        return total;
    }

    /**
     * Add additional data to this basket.
     *
     * See {@link AdditionalData#addData(String, Object[])} for more info.
     *
     * @param key    The key to use for this data
     * @param values An array of values for this data
     * @param <T>    The type of object this data is an array of
     */
    public addAdditionalData<T>(key: string, ...values: T[]) {
        this.additionalBasketData.addData(key, values);
    }

    private replaceItem(existingItem: BasketItem, quantityOffset: number, retainIfZero: boolean): BasketItem {
        var newItem = BasketItemBuilder.from(existingItem).offsetQuantityBy(quantityOffset).build();
        if (newItem.quantity == 0 && !retainIfZero) {
            this.displayItems = this.displayItems.filter(item => item.id !== existingItem.id);
        } else {
            this.displayItems[this.displayItems.indexOf(existingItem)] = newItem;
        }
        return newItem;
    }
}