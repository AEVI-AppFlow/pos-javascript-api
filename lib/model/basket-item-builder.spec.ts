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
import { BasketItemBuilder } from './basket-item-builder';
import { BasketItemModifier } from './basket-item-modifier';
import { BasketItemModifierBuilder } from './basket-item-modifier-builder';
import { InvalidArgumentError } from '../util/pre-conditions';
import { Measurement } from './measurement';

describe('BasketItemBuilderTest', () => { 
    it('should throw for neagtive quantity', () => {
        expect(() => { new BasketItemBuilder().withLabel("bla").withQuantity(-1).build() }).toThrowError(InvalidArgumentError);
    });

    it('should throw if label is null', () => {
        expect(() => { new BasketItemBuilder().withQuantity(1).build() }).toThrowError(InvalidArgumentError);
    });

    it('should initialise with default random id', () => {
        var basketItem = new BasketItemBuilder().withLabel("banana").build();
        expect(basketItem.id).toBeDefined();
    });

    it('has methods should return false by default', () => {
        var basketItem = new BasketItemBuilder().withLabel("banana").build();
        expect(basketItem.hasMeasurement()).toBeFalsy();
        expect(basketItem.hasModifiers()).toBeFalsy();
        expect(basketItem.hasItemData()).toBeFalsy();
    });

    it('should create correct basket item', () => {
        var modifier = BasketItemModifier.from("bla", "Cheeeese!", 100, 50.0, "addon");
        var basketItem =
                new BasketItemBuilder().withId("123").withLabel("banana").withQuantity(2).withMeasurement(1.25, "kg")
                        .withCategory("fruit")
                        .withBaseAmountAndModifiers(100, modifier)
                        .withItemData("bleep", "blarp")
                        .build();

        expect(basketItem.id).toBe("123");
        expect(basketItem.label).toBe("banana");
        expect(basketItem.category).toBe("fruit");
        expect(basketItem.quantity).toBe(2);
        expect(basketItem.amount).toBe(200);
        expect(basketItem.baseAmount).toBe(100.0);
        expect(basketItem.getTotalAmount()).toBe(400);
        expect(basketItem.getTotalBaseAmount()).toBe(200);
        expect(basketItem.hasMeasurement()).toBeTruthy();
        expect(basketItem.measurement).toStrictEqual(Measurement.from(1.25, "kg"));
        expect(basketItem.hasModifiers()).toBeTruthy();
        expect(basketItem.modifiers ? basketItem.modifiers[0] : null).toStrictEqual(modifier);
        expect(basketItem.hasItemData()).toBeTruthy();
        expect(basketItem.itemData ? basketItem.itemData.getValue("bleep") : null).toBe("blarp");
    });

    it('should allow creation from existing item', () => {
        var modifier = BasketItemModifier.from("bla", "Cheeeese!", 100, 50.0, "addon");
        var basketItem =
                new BasketItemBuilder().withId("123").withLabel("banana").withQuantity(2).withMeasurement(1.25, "kg")
                        .withCategory("fruit")
                        .withBaseAmountAndModifiers(100, modifier)
                        .withItemData("bleep", "blarp")
                        .build();

        var newItem = BasketItemBuilder.from(basketItem).withQuantity(4).build();

        expect(newItem.id).toBe("123");
        expect(newItem.label).toBe("banana");
        expect(newItem.category).toBe("fruit");
        expect(newItem.quantity).toBe(4);
        expect(newItem.amount).toBe(200);
        expect(newItem.baseAmount).toBe(100.0);
        expect(newItem.getTotalAmount()).toBe(800);
        expect(newItem.getTotalBaseAmount()).toBe(400.0);
        expect(newItem.hasMeasurement()).toBeTruthy();
        expect(newItem.measurement).toStrictEqual(Measurement.from(1.25, "kg"));
        expect(newItem.hasModifiers()).toBeTruthy();
        expect(basketItem.modifiers).toBeDefined();
        expect(newItem.modifiers).toBeDefined();
        if(basketItem.modifiers && newItem.modifiers) {
            expect(basketItem.modifiers).toStrictEqual(newItem.modifiers);
        }
    });

    it('should allow increment item quantity', () => {
        var basketItem = new BasketItemBuilder().withId("123").withLabel("banana").withQuantity(2).withCategory("fruit").withAmount(200).build();
        var newItem = BasketItemBuilder.from(basketItem).incrementQuantity().build();
        expect(newItem.quantity).toBe(3);
    });

    it('should allow decrement item quantity', () => {
        var basketItem = new BasketItemBuilder().withId("123").withLabel("banana").withQuantity(2).withCategory("fruit").withAmount(200).build();
        var newItem = BasketItemBuilder.from(basketItem).decrementQuantity().build();
        expect(newItem.quantity).toBe(1);
    });

    it('should allow offset positive item quantity', () => {
        var basketItem = new BasketItemBuilder().withId("123").withLabel("banana").withQuantity(2).withCategory("fruit").withAmount(200).build();
        var newItem = BasketItemBuilder.from(basketItem).offsetQuantityBy(2).build();
        expect(newItem.quantity).toBe(4);
    });

    it('should allow offset negative item quantity', () => {
        var basketItem = new BasketItemBuilder().withId("123").withLabel("banana").withQuantity(2).withCategory("fruit").withAmount(200).build();
        var  newItem = BasketItemBuilder.from(basketItem).offsetQuantityBy(-1).build();
        expect(newItem.quantity).toBe(1);
    });

    it('with fractional quantity should use measuree if unit is set', () => {
        var basketItem = new BasketItemBuilder().withId("123").withLabel("banana").withAmount(200).withFractionalQuantity(2.0, "kg").build();
        expect(basketItem.quantity).toBe(1);
        expect(basketItem.measurement).toStrictEqual(Measurement.from(2.0, "kg"));
    });

    it('with fractional quantity should use quantity if unit is not set', () => {
        var basketItem =  new BasketItemBuilder().withId("123").withLabel("banana").withAmount(200).withFractionalQuantity(2.0).build();
        expect(basketItem.quantity).toBe(2);
        expect(basketItem.measurement).toBeUndefined();
    });

    it('with fractional quantity should throw is no unit with fraction', () => {
        expect(() => { new BasketItemBuilder().withId("123").withLabel("banana").withAmount(200).withFractionalQuantity(2.1).build() }).toThrowError(InvalidArgumentError);
    });

    it('amount should default to zero', () => {
        var basketItem = new BasketItemBuilder().withId("123").withLabel("banana").withQuantity(2).withCategory("fruit").build();
        expect(basketItem.amount).toBe(0);
        expect(basketItem.baseAmount).toBe(0);
    });

    it('base amount should default to amount', () => {
        var basketItem = new BasketItemBuilder().withId("123").withLabel("banana").withQuantity(2).withCategory("fruit").withAmount(200).build();
        expect(basketItem.baseAmount).toBe(200.0);
    });

    it('should throw if trying to set amount after setting modifiers', () => {
        expect(() => {
            new BasketItemBuilder().withId("123").withLabel("banana").withQuantity(2).withCategory("fruit")
                .withBaseAmountAndModifiers(10.0, new BasketItemModifierBuilder("1", "2").withPercentage(20).build())
                .withAmount(50)
                .build();
        }).toThrowError(InvalidArgumentError);

    });

    it('should throw if trying to set moodifiers after amount', () => {
        expect(() => {
            new BasketItemBuilder().withId("123").withLabel("banana").withQuantity(2).withCategory("fruit")
                .withAmount(50)
                .withBaseAmountAndModifiers(10.0, new BasketItemModifierBuilder("1", "2").withPercentage(20).build())
                .build();
        }).toThrowError(InvalidArgumentError);
    });

    it('should caluclate amount if modifiers are set', () => {

        var modifier1 = BasketItemModifier.from("bla", "Cheeeese!", 100, 50.0, "addon");
        var modifier2 = BasketItemModifier.from("bla2", "Cheeeese!2", undefined, -5.5, "discount");
        var basketItem =
                new BasketItemBuilder().withId("123").withLabel("banana").withQuantity(2).withMeasurement(1.25, "kg")
                        .withCategory("fruit")
                        .withBaseAmountAndModifiers(100, modifier1, modifier2)
                        .withItemData("bleep", "blarp")
                        .build();

        expect(basketItem.amount).toBe(195);

    });
});