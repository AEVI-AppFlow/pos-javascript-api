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
import { JsonObject, JsonProperty } from "json2typescript";

import { AdditionalData } from './additional-data';
import { Jsonable } from "./jsonable";

export enum DeviceDataKeys {
    MANUFACTURER = "maufacturer",
    MODEL = "model",
    SERIAL = "serial"
}

/**
 * Represents a device.
 */
export class Device extends Jsonable {
    
    @JsonProperty("uid")
    uid: string = undefined;

    @JsonProperty("name")
    name: string = undefined;

    @JsonProperty("details", AdditionalData)
    details: AdditionalData = new AdditionalData();

    constructor() {
        super();
    }

    /**
     * Creates and returns a new Device object based on the details given
     * 
     * @param uid The unique Id of the device
     * @param name The friendly name of the device
     * @param details Any other details to be associated with this device e,g, make and model etc see {@link DeviceDataKeys}
     * 
     * @returns The new Customer object
     */
    public static from(uid: string, name: string, details?: AdditionalData): Device {
        var device = new Device();
        device.uid = uid;
        device.name = name;
        if(details) {
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
