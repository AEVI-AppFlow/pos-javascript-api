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
import { ProgressMessage } from './progress-message';

describe('ProgressMessage', () => {
  it('should create an instance', () => {
    expect(new ProgressMessage()).toBeTruthy();
  });

  it('should serialize and deserialize correctly', () => {
    const message = new ProgressMessage();
    message.messageText = 'bleeeeeep';

    const json = message.toJson();
    const messageResult = ProgressMessage.fromJson(json);

    expect(messageResult).toStrictEqual(message);
  });
});
