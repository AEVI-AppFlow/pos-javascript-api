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
import { Request } from './request';
import { Amount } from './amount';
import { AdditionalData } from './additional-data';

describe('Request', () => {
  it('should create an instance', () => {
    expect(new Request()).toBeTruthy();
  });

  it('should serialise and deserialise correctly', () => {
    const amount = Amount.from(20, 'GBP');
    const ad = new AdditionalData();
    ad.addData('amount', amount);
    const request = Request.from('blahah', ad);
    const json = request.toJson();

    const requestResult = Request.fromJson(json);

    expect(requestResult.requestData.getValue('amount', Amount)).toStrictEqual(amount);
  });
});
