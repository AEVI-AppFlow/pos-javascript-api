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
import { Amounts } from './amounts';
import { Amount } from './amount';
import { InvalidArgumentError } from '../util/pre-conditions';

describe('Amounts', () => {
  it('should create an instance', () => {
    expect(new Amounts()).toBeTruthy();
  });

  it('should return the correct total', () => {
    var amounts = Amounts.from(1000, "GBP");
    amounts.addAdditionalAmount("one", 1500);
    amounts.addAdditionalAmount("two", 2000);

    expect(amounts.baseAmount).toBe(1000);
    expect(amounts.getBaseAmount()).toStrictEqual(Amount.from(1000, "GBP"));
    expect(amounts.getTotalAmountValue()).toBe(4500);
    expect(amounts.getTotalAmount()).toStrictEqual(Amount.from(4500, "GBP"));
  });

  it('should return correct currency', () => {
    var amounts = Amounts.from(3000, "GBP");

    expect(amounts.currency).toBe("GBP");
  });

  it('should add amounts correctly', () => {
    var amounts1 = Amounts.from(1000, "GBP");
    amounts1.addAdditionalAmount("jo", 150);
    amounts1.addAdditionalAmount("boris", 300);
    var amounts2 = Amounts.from(350, "GBP");
    amounts2.addAdditionalAmount("jo", 250);
    amounts2.addAdditionalAmount("sian", 120);

    var result = Amounts.addAmounts(amounts1, amounts2);

    expect(result.currency).toBe("GBP");
    expect(result.baseAmount).toBe(1350);
    expect(result.getTotalAmountValue()).toBe(2170);
    expect(result.getAdditionalAmountValue("jo")).toBe(400);
    expect(result.getAdditionalAmountValue("boris")).toBe(300);
    expect(result.getAdditionalAmountValue("sian")).toBe(120);
  });

  it('cant add amounts in different currencies', () => {
    expect(() => { Amounts.addAmounts(Amounts.from(10, "GBP"), Amounts.from(10, "USD")) }).toThrowError(InvalidArgumentError);
  });

  it('should be able to add a percentage amount', () => {
    var amounts = Amounts.from(1000, "GBP");

    amounts.addAdditionalAmountAsBaseFraction("charity", 0.5);

    expect(amounts.getAdditionalAmountValue("charity")).toBe(500);
    expect(amounts.getTotalAmountValue()).toBe(1500);
  });

  it('cant use negative percentage', () => {
    var amounts = Amounts.from(1000, "GBP");

    expect(() => { amounts.addAdditionalAmountAsBaseFraction("charity", -0.5) }).toThrowError(InvalidArgumentError);
  });

  it('cant add more than 100 percent', () => {
    var amounts = Amounts.from(1000, "GBP");

    expect(() => { amounts.addAdditionalAmountAsBaseFraction("charity", 1.5) }).toThrowError(InvalidArgumentError);
  });

  it('should subtract amounts correctly', () => {
    var amount1 = Amounts.from(1000, "GBP");
    amount1.addAdditionalAmount("bob", 450);
    amount1.addAdditionalAmount("susan", 300);
    var amount2 = Amounts.from(350, "GBP");
    amount2.addAdditionalAmount("bob", 250);
    amount2.addAdditionalAmount("harry", 120);

    var result = Amounts.subtractAmounts(amount1, amount2);

    expect(result.currency).toBe("GBP");
    expect(result.baseAmount).toBe(650);
    expect(result.getTotalAmountValue()).toBe(1150);
    expect(Object.keys(result.getAdditionalAmounts())).toEqual(expect.arrayContaining(['bob', 'susan']));
    expect(result.getAdditionalAmountValue("bob")).toBe(200);
    expect(result.getAdditionalAmountValue("susan")).toBe(300);
    expect(result.getAdditionalAmountValue("harry")).toBe(0);
  });

  it('should remove any zero based additional amounts when requested in subtract', () => {
    var amount1 = Amounts.from(1000, "GBP");
    amount1.addAdditionalAmount("bob", 450);
    var amount2 = Amounts.from(500, "GBP");
    amount2.addAdditionalAmount("bob", 450);
    amount2.addAdditionalAmount("harry", 120);

    var result = Amounts.subtractAmounts(amount1, amount2, false);

    expect(result.currency).toBe("GBP");
    expect(result.baseAmount).toBe(500);
    expect(Object.keys(result.getAdditionalAmounts())).not.toEqual(expect.arrayContaining(['bob', 'susan']));
  });

  it('cant subtract amounts in different currencies', () => {
    expect(() => { Amounts.subtractAmounts(Amounts.from(10, "GBP"), Amounts.from(10, "USD")) }).toThrowError(InvalidArgumentError);
  });

  it('can get total excluding aome amounts', () => {
    var  amounts = Amounts.from(1000, "GBP");
    amounts.addAdditionalAmount("one", 1500);
    amounts.addAdditionalAmount("two", 2000);
    amounts.addAdditionalAmount("three", 3000);

    expect(amounts.baseAmount).toBe(1000);
    expect(amounts.getTotalAmountValue()).toBe(7500);
    expect(amounts.getTotalExcludingAmounts("one", "two")).toBe(4000);
  });

  it('can serialise and deserialise amounts correctly', () => {
    var  amounts = Amounts.from(1000, "GBP");
    amounts.addAdditionalAmount("one", 1500);
    amounts.addAdditionalAmount("two", 2000);
    amounts.addAdditionalAmount("three", 3000);

    var json = amounts.toJson();
    var amountsResult = Amounts.fromJson(json);

    expect(amountsResult).toStrictEqual(amounts);
  });

});
