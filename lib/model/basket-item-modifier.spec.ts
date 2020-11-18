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
import { BasketItemModifier } from './basket-item-modifier';
import { InvalidArgumentError } from '../util/pre-conditions';

describe('BasketItemModifier', () => {
  it('should create an instance for an amount', () => {
    expect(BasketItemModifier.from('bob', 'thing', 1000)).toBeTruthy();
  });

  it('should create an instance for a percentage', () => {
    expect(BasketItemModifier.from('bob', 'thing', undefined, 10)).toBeTruthy();
  });

  it('should throw if no amount', () => {
    expect(() => { BasketItemModifier.from('bob', 'thing'); }).toThrowError(InvalidArgumentError);
  });

  it('should throw if no percentage', () => {
    expect(() => { BasketItemModifier.from('bob', 'thing', undefined); }).toThrowError(InvalidArgumentError);
  });

  it('should accept just amount', () => {
    expect(BasketItemModifier.from('name', 'type', 100)).toBeTruthy();
  });

  it('should accept just percentage', () => {
    expect(BasketItemModifier.from('name', 'type', undefined, 2.5)).toBeTruthy();
  });

  it('should build full instanace', () => {
    expect(BasketItemModifier.from('name', 'type', 100, 2.5, 'bla')).toBeTruthy();
  });
});
