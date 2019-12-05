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
import { BasketItemBuilder } from './basket-item-builder';
import { BasketItemModifierBuilder } from './basket-item-modifier-builder';
import { Measurement } from './measurement';

describe('BasketItem', () => {

  var defaultItem = BasketItem.from("123", "Pandoras Box", "Greek Myths", 1000, 500, 2, Measurement.from(2.5, "kg"), undefined);
  var basketItem = new BasketItemBuilder()
                        .withLabel("ice")
                        .withQuantity(2)
                        .withBaseAmountAndModifiers(500,
                            new BasketItemModifierBuilder("tax1", "tax").withAmount(202.05).build(),
                            new BasketItemModifierBuilder("tax2", "tax").withPercentage(24.56).build(),
                            new BasketItemModifierBuilder("tax3", "tax").withAmount(200).build(),
                            new BasketItemModifierBuilder("tax4", "tax").withAmount(-5.5).build(),
                            new BasketItemModifierBuilder("tax5", "tax").withPercentage(-25.003).build()).build();


  it('should create an instance', () => {
    expect(defaultItem).toBeTruthy();
    expect(defaultItem.id).toBe("123");
    expect(defaultItem.label).toBe("Pandoras Box");
    expect(defaultItem.category).toBe("Greek Myths");
    expect(defaultItem.amount).toBe(1000);
    expect(defaultItem.baseAmount).toBe(500);
    expect(defaultItem.quantity).toBe(2);
    expect(defaultItem.hasMeasurement()).toBe(true);
    expect(defaultItem.measurement).toStrictEqual(Measurement.from(2.5, "kg"));
  });

  it('should get correct fractional amount', () => {
    var expected = 2 * (500 + 202.05 + (500 * 0.2456) + 200 + (-5.5) + (500 * -0.25003));
    expect(basketItem.getTotalFractionalAmount()).toBe(expected);
  });

  it('should report modifiers correctly', () => {
    expect(defaultItem.hasModifiers()).toBeFalsy();
    expect(basketItem.hasModifiers()).toBeTruthy();
  });

  it('should report measurements correctly', () => {
    expect(basketItem.hasMeasurement()).toBeFalsy();
    expect(defaultItem.hasMeasurement()).toBeTruthy();
  })
});
