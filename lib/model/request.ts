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

import { v4 as uuid } from 'uuid';
import { Jsonable } from './jsonable';
import { AdditionalData } from './additional-data';

/**
 * Generic request that at minimum contains a request type and optionally flow name and bespoke request data.
 *
 * If a flow name is set, the flow with that name will be explicitly used. If not set, the request type will be used to look up eligible flows
 * and one will be selected either automatically or via user interaction.
 *
 * @tsoaModel
 */
@JsonObject('Request')
export class Request extends Jsonable {
  @JsonProperty('id')
  id: string = undefined;

  @JsonProperty('requestType')
  requestType: string = undefined;

  @JsonProperty('requestData', AdditionalData)
  requestData: AdditionalData = new AdditionalData();

  @JsonProperty('flowName', String, true)
  flowName: string = undefined;

  @JsonProperty('deviceId', String, true)
  deviceId: string = undefined;

  @JsonProperty('source', String, true)
  source: string = undefined;

  @JsonProperty('targetAppId', String, true)
  targetAppId: string = undefined;

  @JsonProperty('processInBackground')
  processInBackground: boolean = false;

  constructor() {
    super();
    this.id = uuid();
  }

  /**
     * Initialise a request with a request type and data.
     *
     * The request type will be used to assign the correct flow for this request.
     *
     * Please use [[flowName]] to explicitly specify what flow to use.
     *
     * See reference values in the documentation for possible values.
     *
     * @param requestType The request type
     * @param requestData The data for the request
     *
     * @returns The initialised request
     */
  public static from(requestType: string, requestData: AdditionalData = new AdditionalData()): Request {
    const request = new Request();
    request.requestType = requestType;
    request.requestData = requestData;
    return request;
  }

  /**
     * Convert a JSON string into a {@link Request} object if possible
     *
     * @param json The JSON to convert
     *
     * @returns A Request object
     */
  public static fromJson(json: string): Request {
    return this.baseFromJson(json, Request);
  }
}
