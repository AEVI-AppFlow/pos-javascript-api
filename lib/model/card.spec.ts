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
import { Card } from './card';
import { InvalidArgumentError } from '../util/pre-conditions';
import { AdditionalData } from './additional-data';

describe('Card', () => {
  it('should create an instance', () => {
    expect(new Card()).toBeTruthy();
  });

  it('should not allow pan with more than 10 digits', () => {
    expect(() => { Card.from('1234567890123456', 'Mr T', '0102', null, null); }).toThrowError(InvalidArgumentError);
  });

  it('should allow pan with less than 10 digits', () => {
    const card = Card.from('123456789XXXXXX', 'Mr T', '0102', null, null);
    expect(card.maskedPan).toBe('123456789XXXXXX');
  });

  it('should format expiry date correctly', () => {
    const card = Card.from('123456789XXXXXX', 'Mr T', '2210', null, null);
    expect(card.getFormattedExpiryDate('MM/YYYY')).toBe('10/2022');
  });

  it('should return empty when its empty', () => {
    const card = new Card();

    expect(card.isEmpty()).toBeTruthy();

    card.cardholderName = 'bob';
    expect(card.isEmpty()).toBeFalsy();
  });

  it('should return empty correctly when addtional data set', () => {
    const card = new Card();

    expect(card.isEmpty()).toBeTruthy();

    const ad = new AdditionalData();
    ad.addData('ghost', 'boo');
    card.additionalData = ad;

    expect(card.isEmpty()).toBeFalsy();
  });
});
