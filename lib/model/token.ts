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
 * Token that can be used to identify an entity, typically a customer or a merchant.
 *
 * How the value is generated is bespoke to the application that fulfilled the request.
 */
@JsonObject
export class Token extends Jsonable {
  @JsonProperty('value', String)
  value: string = undefined;

  @JsonProperty('source', String)
  source: string = undefined;

  @JsonProperty('algorithm', String, true)
  algorithm: string = undefined;

  @JsonProperty('sourceAppId', String, true)
  sourceAppId: string = undefined;

  public static from(value: string, source: string, algorithm?: string, sourceAppId?: string): Token {
    const t = new Token();
    t.value = value;
    t.source = source;
    t.algorithm = algorithm;
    t.sourceAppId = sourceAppId;
    return t;
  }
}
