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
import { Customer } from './customer';
import { AdditionalData } from './additional-data';
import { Token } from './token';

describe('Customer', () => {
  it('should create an instance', () => {
    expect(new Customer()).toBeTruthy();
  });

  it('should serialize and deserialize correctly', () => {
    var ad = new AdditionalData();
    ad.addData("cheese", "bire");
    var token = Token.from("5353535", "card");
    var tokens = new Array<Token>();
    tokens[0] = token;
    var customer = Customer.from("123", "Jonny Big Cheese", ad, tokens);

    var json = customer.toJson();
    var customerResult = Customer.fromJson(json);

    expect(customerResult).toStrictEqual(customer);
  });
});
