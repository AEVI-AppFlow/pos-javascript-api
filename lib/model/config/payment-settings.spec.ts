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
import { PaymentSettings } from './payment-settings';

import { paymentSettingsData } from '../test-data/response';

describe('PaymentSettings', () => {
  it('should create an instance', () => {
    expect(new PaymentSettings()).toBeTruthy();
  });

  it('should serialise from JSON correctly', () => {
    const paymentSettings = PaymentSettings.fromJson(paymentSettingsData);

    expect(paymentSettings.additionalSettings).toBeDefined();
    expect(paymentSettings.allServices).toBeDefined();
    expect(paymentSettings.appFlowSettings).toBeDefined();
    expect(paymentSettings.flowConfigurations).toBeDefined();
    expect(paymentSettings.fpsSettings).toBeDefined();

    expect(paymentSettings.allServices.paymentFlowServiceInfoList.length).toBe(6);
    expect(paymentSettings.getServicesForFlow('sampleSale').paymentFlowServiceInfoList.length).toBe(6);

    expect(paymentSettings.allServices.supportedCurrencies).toHaveLength(3);
    expect(paymentSettings.allServices.supportedPaymentMethods).toHaveLength(5);
    expect(paymentSettings.allServices.supportedRequestTypes).toHaveLength(5);
    expect(paymentSettings.allServices.getFlowServiceFromId('com.aevi.appflow.storage').displayName).toBe('AEVI Developer Data Storage');
  });
});
