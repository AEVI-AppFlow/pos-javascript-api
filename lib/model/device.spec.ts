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
import { Device } from './device';

describe('Device', () => {

  it('should create an instance', () => {
    expect(new Device()).toBeTruthy();
  });

  it('should create from', () => {
    var device = Device.from("1245452", "Best device eva");
    expect(device.name).toBe("Best device eva");
    expect(device.referenceId).toBe("1245452");
  });


  it('should serialise and deserialise correctly', () => {
    var device = new Device();
    device.name = "Best Device Eva";
    device.referenceId = "63773662";

    var json = device.toJson();

    var deviceResult = Device.fromJson(json);

    expect(device).toStrictEqual(deviceResult);
  });
});
