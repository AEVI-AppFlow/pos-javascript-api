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
import { PaymentBuilder }  from './payment-builder';
import { Amounts } from './amounts';
import { Token } from './token';
import { InvalidArgumentError } from '../util/pre-conditions';
import { Basket } from './basket';
import { BasketItemBuilder } from './basket-item-builder';

describe('PaymentBuilder', () => {

  it('can build a valid request', () => {
    var amounts = Amounts.from(2000, "GBP");
    var payment = new PaymentBuilder().withPaymentFlow("sale").withAmounts(amounts).build();

    expect(payment.amounts).toStrictEqual(amounts);
    expect(payment.flowType).toBe("sale");
  });

  it('should not allow card token and split together', () => {
    var amounts = Amounts.from(2000, "GBP");
    expect(() => { new PaymentBuilder().withPaymentFlow("sale").withAmounts(amounts).withSplitEnabled(true).withCardToken(Token.from("1232", "card")).build() }).toThrow(InvalidArgumentError);
  });

  it('should not allow basket and amounts total mismatch', () => {
    var amounts = Amounts.from(2000, "GBP");
    var basket = Basket.fromItems("test", new BasketItemBuilder().generateRandomId().withLabel("bla").withAmount(900).build());
    expect(() => { new PaymentBuilder().withPaymentFlow("sale").withAmounts(amounts).withBasket(basket).build() }).toThrow(InvalidArgumentError);
  });
});