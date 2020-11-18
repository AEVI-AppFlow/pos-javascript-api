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

/**
 * Amount represented by a value in its subunit form (such as cents or pence) and currency (ISO 4217).
 */
@JsonObject('Amount')
export class Amount extends Jsonable {
  @JsonProperty('value')
  public value: number = 0;

  @JsonProperty('currency')
  public currency: string = 'XXX';

  /**
     * Convert a JSON string into an {@link Amount} object if possible
     *
     * @param json The JSON to convert
     */
  public fromJson(json: string): Amount {
    return Jsonable.baseFromJson(json, Amount);
  }

  /**
     * Create a new Amount instance.
     *
     * @param value    The value in subunit form (cents, pence, etc)
     * @param currency The ISO-4217 currency code
     *
     * @returns The initialised amount object
     */
  public static from(value: number, currency: string): Amount {
    const a = new Amount();
    a.value = value;
    a.currency = currency;
    return a;
  }
}
