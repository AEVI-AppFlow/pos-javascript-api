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
import { PaymentResponse, Outcome } from './payment-response';

import { responseData } from './test-data/response';
import { TransactionResponseOutcome } from './transaction-response';
import { Amounts } from './amounts';

describe('PaymentResponse', () => {
  it('should create an instance', () => {
    expect(new PaymentResponse()).toBeTruthy();
  });

  it('should deserialise json response correctly', () => {
    const resp = PaymentResponse.fromJson(responseData);

    expect(resp).toBeDefined();
    expect(resp.outcome).toBe(Outcome.FULFILLED);
    expect(resp.transactions).toBeDefined();
    expect(resp.totalAmountsProcessed).toStrictEqual(Amounts.from(1000, 'EUR'));
    expect(resp.getBaskets()).toBeDefined();
    expect(resp.getLastResponse()).toBeDefined();
    expect(resp.getLastResponse().outcome).toBe(TransactionResponseOutcome.APPROVED);
    expect(resp.getLastResponse().references).toBeDefined();
    expect(resp.getLastResponse().references.getValue('merchantId')).toBe('87654321');
  });
});
