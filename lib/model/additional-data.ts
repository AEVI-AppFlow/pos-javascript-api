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
import { JsonObject, JsonProperty, JsonConverter, JsonCustomConvert, Any } from "json2typescript";

import { JsonOption } from '../util/json-option';
import { Jsonable } from "./jsonable";

@JsonConverter
class AdditionalDataConverter implements JsonCustomConvert<{ [name: string]: JsonOption }> {

    serialize(data: { [name: string]: JsonOption }): any {
        return data;
    }

    deserialize(dataValue: any): { [name: string]: JsonOption } {
        var data: { [name: string]: JsonOption } = {};
        for(let key of Object.keys(dataValue)) {
            data[key] = JsonOption.from(dataValue[key].value, dataValue[key].type);
        }
        return data;
    }
}

@JsonObject("AdditionalData")
export class AdditionalData extends Jsonable {

    @JsonProperty("data", AdditionalDataConverter)
    private data: { [name: string]: JsonOption } = {};

    constructor() {
        super();
    }    

    /**
     * Convert a JSON string into an {@link AdditionalData} object if possible
     * 
     * @param json The JSON to convert
     */
    public static fromJson(json: string) {
        return Jsonable.baseFromJson(json, AdditionalData);
    }

    /**
     * Check if this data collection is empty or not.
     *
     * @return True if there are no data, false otherwise.
     */
    public isEmpty(): boolean {
        return Object.keys(this.data).length == 0;
    }

    /**
     * Add any arbitrary non-primitive object as value with an associated string based key.
     *
     * This will overwrite any previous values with the same key. Clients need to call [[hasData]] to check whether a key already
     * exists to avoid potential overwriting of existing values.
     *
     * Note that JsonOption is used here to store the type of the class so that it can be deserialised in higher level languages such as Java. 
     *
     * @param key    The string key for this value
     * @param value The value to store
     */
    public addData(key: string, value: any | JsonOption) {
        if(value instanceof JsonOption) {
            this.data[key] = value;
        } else {
            if(Array.isArray(value)) {
                if(value.length == 1) {
                    this.data[key] = JsonOption.from(value[0]);
                } else {
                    this.data[key] = JsonOption.from(value, "array");
                }
            } else {
                this.data[key] = JsonOption.from(value);
            }
        }
    }

    /**
     * Copy over values from the provided AdditionalData model.
     *
     * Depending on the allowOverwrite parameter, existing values may or may not get overwritten.
     *
     * @param additionalData The data to copy from.
     * @param allowOverwrite Whether or not to allow overwriting existing values
     */
    public addAdditionalData(additionalData: AdditionalData, allowOverwrite: boolean) {
        for (let key of additionalData.getKeys()) {
            if (allowOverwrite || !this.hasData(key)) {
                var val = additionalData.getJsonOption(key);
                if(val != undefined) {
                    this.addData(key, val);
                }
            }
        }
    }

    /**
     * Remove data with associated key from the collection.
     *
     * @param key The data key
     * 
     * @returns The value of the key removed
     */
    public removeData(key: string): any {
        var retVal = this.data[key];
        delete this.data[key];
        return retVal;
    }

    /**
     * Clear all data from the collection.
     */
    public clearData() {
        this.data = {};
    }

    /**
     * Check whether there is any data with the associated key in the collection.
     *
     * @param key The data key
     * @return True if exists, false otherwise.
     */
    public hasData(key: string): boolean {
        return this.data[key] != null;
    }

    /**
     * Get a set of all the keys for this data collection.
     *
     * @return An array of data keys
     */
    public getKeys(): string[] {
        return Object.keys(this.data);
    }

    protected getJsonOption(key: string): JsonOption | undefined {
        return this.data[key];
    }

    /**
     * Retrieve the value for the provided key as an object of type T.
     *
     * @param key          The data key
     * @param defaultValue Optional var-args where a default value can be passed in which will be returned if key does not exist
     * @return The value as an Object of type T or default value if set, or undefined
     */
    public getValue<T>(key: string, classReference?: { new (): T;}, defaultValue?: T): T | undefined {
        var option = this.data[key];
        if (option) {
            if(JsonOption.isPrimative(option.type) || !classReference) {
                return option.value as T;
            } else {
                return Jsonable.baseFromJsonObject(option.value, classReference);
            }
        }
        return defaultValue;
    }
}