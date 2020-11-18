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
import { Basket, RoundingStrategy } from './basket';
import { BasketItem } from './basket-item';
import { BasketItemBuilder } from './basket-item-builder';
import { BasketItemModifierBuilder } from './basket-item-modifier-builder';

import { basketData } from './test-data/response';

describe('Basket', () => {
  let sourceBasket: Basket;
  let defaultItemOne: BasketItem;
  let defaultItemTwo: BasketItem;

  beforeEach(() => {
    sourceBasket = Basket.fromItems('test');
    defaultItemOne = BasketItem.from('123', 'LabelOne', 'cat', 1000, 1000, 2);
    defaultItemTwo = BasketItem.from('456', 'LabelTwo', 'cat', 400, 400, 1);
  });

  it('should create an instance', () => {
    expect(new Basket()).toBeTruthy();
  });

  it('can add items', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    expect(sourceBasket.getNumberOfUniqueItems()).toBe(2);
    expect(sourceBasket.hasItemWithId(defaultItemOne.id)).toBeTruthy();
    expect(sourceBasket.hasItemWithId(defaultItemTwo.id)).toBeTruthy();
  });

  it('can merge items with the same id', () => {
    const singleItemQuantity = defaultItemOne.quantity;
    sourceBasket.addItems(defaultItemOne);

    expect(sourceBasket.getItemById(defaultItemOne.id)).toBeTruthy();
    expect(sourceBasket.getItemById(defaultItemOne.id)).toStrictEqual(expect.objectContaining({ quantity: singleItemQuantity }));

    sourceBasket.addItems(defaultItemOne);

    expect(sourceBasket.getItemById(defaultItemOne.id)).toBeTruthy();
    expect(sourceBasket.getItemById(defaultItemOne.id)).toStrictEqual(expect.objectContaining({ quantity: singleItemQuantity * 2 }));
  });

  it('returns list in recent order first', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    expect(sourceBasket.displayItems).toStrictEqual([defaultItemTwo, defaultItemOne]);
  });

  it('list order is retained after updating quantity', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    sourceBasket.incrementItemQuantity(defaultItemOne.id, 1);
    sourceBasket.decrementItemQuantity(defaultItemOne.id, 1);

    expect(sourceBasket.displayItems).toStrictEqual([defaultItemTwo, defaultItemOne]);
  });

  it('can have multiple items with the same label', () => {
    sourceBasket.addItems(defaultItemOne);
    const anotherItem = BasketItem.from('876', defaultItemOne.label, 'cat', 500, 500, 1);
    sourceBasket.addItems(anotherItem);

    expect(sourceBasket.getNumberOfUniqueItems()).toBe(2);
    expect(sourceBasket.getItemById(defaultItemOne.id)).toStrictEqual(expect.objectContaining({ label: defaultItemOne.label }));
  });

  it('can serialise and deserialise', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);
    sourceBasket.addAdditionalData('Bloop', 'blarp');

    const serialised = sourceBasket.toJson();
    const endBasket: Basket = Basket.fromJson(serialised);
    expect(endBasket).toStrictEqual(sourceBasket);

    const json2 = endBasket.toJson();
    expect(json2).toBe(serialised);
  });

  it('can specify min quantity for has item with id', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    expect(sourceBasket.hasItemWithId(defaultItemOne.id)).toBeTruthy();
    expect(sourceBasket.hasItemWithId(defaultItemTwo.id)).toBeTruthy();
    expect(sourceBasket.hasItemWithId(defaultItemOne.id, defaultItemOne.quantity)).toBeTruthy();
    expect(sourceBasket.hasItemWithId(defaultItemOne.id, defaultItemOne.quantity + 1)).toBeFalsy();
  });

  it('can find basket item by id', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    const item = sourceBasket.getItemById(defaultItemOne.id);
    expect(item).toStrictEqual(defaultItemOne);
  });

  it('can find basket item by label', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    const item = sourceBasket.getItemByLabel(defaultItemOne.label);
    expect(item).toStrictEqual(defaultItemOne);
  });

  it('can increment basket item quantity', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    const beforeQuantity = defaultItemOne.quantity;
    sourceBasket.incrementItemQuantity(defaultItemOne.id, 1);

    expect(sourceBasket.getItemById(defaultItemOne.id).quantity).toBe(beforeQuantity + 1);
  });

  it('can decrement basket item quantity', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    const beforeQuantity = defaultItemOne.quantity;
    sourceBasket.decrementItemQuantity(defaultItemOne.id, 1);

    expect(sourceBasket.getItemById(defaultItemOne.id).quantity).toBe(beforeQuantity - 1);
  });

  it('cannot decrement past zero and item retained as zero quantity', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    sourceBasket.decrementItemQuantity(defaultItemTwo.id, 1, true);

    expect(sourceBasket.getItemById(defaultItemTwo.id).quantity).toBe(0);
  });

  it('item is removed after decrementing to zero if retain not set', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    sourceBasket.decrementItemQuantity(defaultItemTwo.id, 1);

    expect(sourceBasket.hasItemWithId(defaultItemTwo.id)).toBeFalsy();
  });

  it('can set basket item quantity', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    sourceBasket.setItemQuantity(defaultItemOne.id, 10);

    expect(sourceBasket.getItemById(defaultItemOne.id).quantity).toBe(10);
  });

  it('can get total number of items', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    expect(sourceBasket.getTotalNumberOfItems()).toBe(defaultItemOne.quantity + defaultItemTwo.quantity);
  });

  it('can get number of unique items', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    expect(sourceBasket.getNumberOfUniqueItems()).toBe(2);
  });

  it('can clear items', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    sourceBasket.clearItems();

    expect(sourceBasket.getTotalNumberOfItems()).toBe(0);
  });

  it('can remove item', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    sourceBasket.removeItem(defaultItemOne.id);

    expect(sourceBasket.getTotalNumberOfItems()).toBe(1);
    expect(sourceBasket.hasItemWithId(defaultItemOne.id)).toBeFalsy();
  });

  it('can get total basket value', () => {
    sourceBasket.addItems(defaultItemOne, defaultItemTwo);

    expect(sourceBasket.getTotalBasketValue()).toBe(defaultItemOne.getTotalAmount() + defaultItemTwo.getTotalAmount());
  });

  it('can get items by category', () => {
    sourceBasket.addItems(BasketItem.from('123', 'Coke', 'Drinks', 1000, 1000, 1),
      BasketItem.from('456', 'Fanta', 'Drinks', 1000, 1000, 1),
      BasketItem.from('789', 'Pork', 'Meat', 1000, 1000, 1));

    const drinks = sourceBasket.getBasketItemsByCategory('Drinks');
    expect(drinks).toHaveLength(2);
    expect(drinks).toEqual(expect.arrayContaining([sourceBasket.getItemById('123'), sourceBasket.getItemById('456')]));
  });

  it('total value handles negative correctly', () => {
    sourceBasket.addItems(BasketItem.from('123', 'Coke', 'Drinks', 1000, 1000, 1),
      BasketItem.from('456', 'Fanta', 'Drinks', -500, -500, 1));

    const total = sourceBasket.getTotalBasketValue();
    expect(total).toBe(500);
  });

  it('total value handles negative only values correctly', () => {
    sourceBasket.addItems(BasketItem.from('456', 'Fanta', 'Drinks', -500, -500, 1));

    const total = sourceBasket.getTotalBasketValue();
    expect(total).toBe(-500);
  });

  it('total should calculate from amount field if no modifiers', () => {
    sourceBasket.addItems(BasketItem.from('123', 'Coke', 'Drinks', 1000, 0, 1),
      BasketItem.from('456', 'Fanta', 'Drinks', 500, 0, 1));

    expect(sourceBasket.getTotalBasketValue()).toBe(1500);
  });

  it('total should caluclate from base and modifiers and round correctly', () => {
    const basketItem1 = new BasketItemBuilder()
      .withLabel('vanilla')
      .withQuantity(2)
      .withBaseAmountAndModifiers(500, new BasketItemModifierBuilder('tax1', 'tax').withAmount(202.05).build(),
        new BasketItemModifierBuilder('tax2', 'tax').withPercentage(24.56).build())
      .build();

    const basketItem2 = new BasketItemBuilder()
      .withLabel('ice')
      .withQuantity(1)
      .withBaseAmountAndModifiers(150, new BasketItemModifierBuilder('tax4', 'tax').withAmount(-5.5).build(),
        new BasketItemModifierBuilder('tax5', 'tax').withPercentage(-25.003).build())
      .build();

    sourceBasket.addItems(basketItem1, basketItem2);

    sourceBasket.roundingStrategy = RoundingStrategy.NEAREST;
    expect(sourceBasket.getTotalBasketValue()).toBe(1757);

    sourceBasket.roundingStrategy = RoundingStrategy.DOWN;
    expect(sourceBasket.getTotalBasketValue()).toBe(1756);

    sourceBasket.roundingStrategy = RoundingStrategy.UP;
    expect(sourceBasket.getTotalBasketValue()).toBe(1757);
  });

  it('should read basket data from json', () => {
    const basket = Basket.fromJson(basketData);

    expect(basket).toBeTruthy();
    expect(basket.basketName).toBe('sampleBasket');
    expect(basket.displayItems).toHaveLength(4);
    expect(basket.displayItems[0].amount).toBe(300);
    expect(basket.displayItems[1].amount).toBe(150);
    expect(basket.displayItems[2].amount).toBe(250);
    expect(basket.displayItems[3].amount).toBe(458);
    expect(basket.displayItems[3].getTotalAmount()).toBe(458);
    expect(basket.displayItems[3].hasModifiers()).toBeFalsy();
    expect(basket.displayItems[3].measurement.value).toBe(1.5);
  });
});
