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
import { AdditionalData } from './additional-data';

import { Basket } from './basket';
import { BasketItem } from './basket-item';
import { Customer } from './customer';

describe('AdditionalData', () => {
  it('should create an instance', () => {
    expect(new AdditionalData()).toBeTruthy();
  });

  it('should report empty correctly', () => {
    const ad = new AdditionalData();
    expect(ad.isEmpty()).toBeTruthy();

    ad.addData('bleep', 'blarp');
    expect(ad.isEmpty()).toBeFalsy();
  });

  it('should get a boolean as a boolean', () => {
    const ad = new AdditionalData();
    ad.addData('banana', true);

    expect(ad.getValue('banana')).toBe(true);
  });

  it('should get a string back as a string', () => {
    const ad = new AdditionalData();
    ad.addData('banana', "I'm a banana");

    expect(ad.getValue('banana')).toBe("I'm a banana");
  });

  it('should get a number back as a number', () => {
    const ad = new AdditionalData();
    ad.addData('banana', 100344);

    expect(ad.getValue('banana')).toBe(100344);
  });

  it('should return has data correctly', () => {
    const ad = new AdditionalData();
    ad.addData('banana', 100344);

    expect(ad.hasData('banana')).toBe(true);
    expect(ad.hasData('apple')).toBe(false);
  });

  it('should get an object back as an object', () => {
    const ad = new AdditionalData();
    const obj = { cheese: 'bacon', onion: 'lettuce' };
    ad.addData('banana', obj);

    expect(ad.getValue('banana')).toStrictEqual(obj);
  });

  it('should get an array back as an array', () => {
    const ad = new AdditionalData();
    ad.addData('banana', ["I'm a banana", "No I'm a banana"]);

    expect(ad.getValue('banana')).toHaveLength(2);
    expect(ad.getValue('banana')).toEqual(expect.arrayContaining(["I'm a banana", "No I'm a banana"]));
  });

  it('should get a higher order object as correct type after serialization', () => {
    const ad = new AdditionalData();
    const basket = new Basket();
    const customer = new Customer();
    const obj = { stuff: 'andthat' };
    customer.fullName = 'Barry White';
    basket.addAdditionalData('bloop', 'blarp');
    basket.addAdditionalData('somestuff', obj);
    basket.addAdditionalData('customer', customer);
    ad.addData('basket', basket);

    const deserialised = AdditionalData.fromJson(ad.toJson());
    const basketResult: Basket = deserialised.getValue('basket', Basket);

    expect(basketResult.constructor.name).toBe(Basket.name);
    expect(basketResult.additionalBasketData.getValue('bloop')).toBe('blarp');
    expect(basketResult.additionalBasketData.getValue('somestuff')).toStrictEqual(obj);
    expect(basketResult.additionalBasketData.getValue('customer', Customer).constructor.name).toBe(Customer.name);
    expect(basketResult.additionalBasketData.getValue('customer', Customer).fullName).toStrictEqual(customer.fullName);
    expect(basketResult.toJson()).toBe(basket.toJson());
  });

  it('should clear all data', () => {
    const ad = new AdditionalData();
    ad.addData('banana', 1);
    ad.addData('banana1', 2);
    ad.addData('banana2', 3);
    ad.addData('banana3', 4);

    ad.clearData();

    expect(ad.getValue('banana')).toBeUndefined();
    expect(ad.hasData('banana')).toBe(false);
  });

  it('should remove a key', () => {
    const ad = new AdditionalData();
    ad.addData('banana', 1);
    ad.addData('banana1', 2);

    ad.removeData('banana');

    expect(ad.getValue('banana')).toBeUndefined();
  });

  it('should return all keys', () => {
    const ad = new AdditionalData();
    ad.addData('key1', 0);
    ad.addData('key2', 0);
    ad.addData('key3', 0);
    ad.addData('key4', 0);

    expect(ad.getKeys()).toHaveLength(4);
    expect(ad.getKeys()).toContain('key1');
    expect(ad.getKeys()).toContain('key2');
    expect(ad.getKeys()).toContain('key3');
    expect(ad.getKeys()).toContain('key4');
  });

  it('can read from JSON correctly', () => {
    const json = '{"data":{"key1":{"value":0,"type":"number"},"key2":{"value":0,"type":"number"},"key3":{"value":0,"type":"number"},"key4":{"value":0,"type":"number"}}}';
    const ad = Object.assign(new AdditionalData(), JSON.parse(json));

    expect(ad.getKeys()).toHaveLength(4);
    expect(ad.getKeys()).toContain('key1');
    expect(ad.getKeys()).toContain('key2');
    expect(ad.getKeys()).toContain('key3');
    expect(ad.getKeys()).toContain('key4');
  });

  it('can serialise and deserialise from JSON', () => {
    const ad = new AdditionalData();
    ad.addData('key1', {
      blah: 'bloop', bleep: 2, bling: true, blang: 5.63291991911,
    });
    const basketo = new Basket();
    basketo.basketName = 'Berts shopping';
    basketo.addItems(new BasketItem());
    ad.addData('key2', basketo);
    ad.addData('key3', 0);
    ad.addData('key4', 0);

    const json = ad.toJson();
    const deserialised = AdditionalData.fromJson(json);

    expect(deserialised.toJson()).toStrictEqual(ad.toJson());
  });
});
