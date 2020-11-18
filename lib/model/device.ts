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
import { JsonObject, JsonProperty } from 'json2typescript';

import { AdditionalData } from './additional-data';
import { Jsonable } from './jsonable';

export enum DeviceDataKeys {
  MANUFACTURER = 'maufacturer',
  MODEL = 'model',
  SERIAL = 'serial',
}

/**
 * Represents a device.
 */
@JsonObject
export class Device extends Jsonable {
  @JsonProperty('referenceId')
  referenceId: string = undefined;

  @JsonProperty('serialNumber')
  serialNumber: string = undefined;

  @JsonProperty('model')
  model: string = undefined;

  @JsonProperty('name', String, true)
  name: string = undefined;

  @JsonProperty('location', String, true)
  location: string = undefined;

  @JsonProperty('details', AdditionalData, true)
  details: AdditionalData = new AdditionalData();

  /**
     * Creates and returns a new Device object based on the details given
     *
     * @param referenceId The unique Id of the device
     * @param name The friendly name of the device
     * @param details Any other details to be associated with this device e,g, make and model etc see {@link DeviceDataKeys}
     *
     * @returns The new Customer object
     */
  public static from(referenceId: string, name: string, details?: AdditionalData): Device {
    const device = new Device();
    device.referenceId = referenceId;
    device.name = name;
    if (details) {
      device.details = details;
    }
    return device;
  }

  /**
     * Convert a JSON string into an {@link Device} object if possible
     *
     * @param json The JSON to convert
     */
  public static fromJson(json: string): Device {
    return Jsonable.baseFromJson(json, Device);
  }
}
