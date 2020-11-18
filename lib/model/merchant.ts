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
import { Jsonable } from './jsonable';
import { JsonOption } from '../util/json-option';
import { AdditionalData } from './additional-data';

export enum MerchantDataKeys {
  NAME = 'name',
  PHONE = 'phone',
  EMAIL = 'email',
  ADDRESS = 'address',
  POSTCODE = 'postcode',
  CITY = 'city',
  STATE = 'state',
  COUNTRY = 'country',
}

export enum MerchantTokenKeys {
  MARKETPLACE = 'marketplace',
  AEVIPAY = 'aevipay',
  UMP = 'ump',
}

/**
 * A model to store merchant data such as address and contact details
 */
@JsonObject('Merchant')
export class Merchant extends Jsonable {
  @JsonProperty('umpId')
  umpId: string = undefined;

  @JsonProperty('name')
  name: string = undefined;

  @JsonProperty('merchantDetails', AdditionalData)
  details: AdditionalData = new AdditionalData();

  @JsonProperty('tokens', AdditionalData)
  tokens: AdditionalData = new AdditionalData();

  /**
     * Create a new merchant object using the details given
     *
     * @param umpId The unique Unified Merchant Portal (UMP) id of this merchant
     * @param name The name of the merchant
     * @param details All other details for this merchant stored as a
     * @param tokens A collection of {@link Token} objects that give this merchant access to the various external services
     */
  public static from(umpId: string, name: string, details?: AdditionalData, tokens?: AdditionalData): Merchant {
    const merch = new Merchant();
    merch.umpId = umpId;
    merch.name = name;
    if (details) {
      merch.details = details;
    }
    if (tokens) {
      merch.tokens = tokens;
    }
    return merch;
  }

  /**
     * Convert a JSON string into an {@link Merchant} object if possible
     *
     * @param json The JSON to convert
     */
  public static fromJson(json: string): Merchant {
    return Jsonable.baseFromJson(json, Merchant);
  }

  /**
     * Convenience wrapper for adding additional merchant data.
     *     *
     * See {@link AdditionalData#addData(String, Object[])} for more info.
     *
     * @param key    The key to use for this data
     * @param values An array of values for this data
     */
  public addMerchantDetails(key: string, ...values: any | JsonOption) {
    this.details.addData(key, values);
  }
}
