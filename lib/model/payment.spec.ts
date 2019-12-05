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
import { Payment } from './payment';
import { PaymentBuilder } from './payment-builder';
import { Amounts } from './amounts';

describe('Payment', () => {
  it('should create an instance', () => {
    expect(new Payment()).toBeTruthy();
  });

  it('should serialise and deserialise correctly', () => {
    var amounts = Amounts.from(20, "GBP");
    var payment = new PaymentBuilder().withPaymentFlow("sale").withAmounts(amounts).build();

    var json = payment.toJson();

    var paymentResult = Payment.fromJson(json);

    expect(paymentResult.amounts).toStrictEqual(amounts);
    expect(paymentResult).toStrictEqual(payment);
  });

  it('invalid json will throw', () => {
    expect(() => {Payment.fromJson("{}ajksjkdj")}).toThrow(SyntaxError);
  });
});
