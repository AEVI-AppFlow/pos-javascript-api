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

import { Jsonable } from "./jsonable";
import { AdditionalData } from './additional-data';

import { v4 as uuid } from 'uuid';

@JsonObject
export class Request extends Jsonable {
    @JsonProperty("id")
    id: string = undefined;

    @JsonProperty("requestType")
    requestType: string = undefined;

    @JsonProperty("requestData", AdditionalData)
    requestData: AdditionalData = new AdditionalData();

    @JsonProperty("flowName", String, true)
    flowName: string = undefined;

    @JsonProperty("deviceId", String, true)
    deviceId: string = undefined;

    @JsonProperty("targetAppId", String, true)
    targetAppId: string = undefined;

    @JsonProperty("processInBackground")
    processInBackground: boolean = false;

    constructor() {
        super();
        this.id = uuid();
    }

    public static from(requestType: string, requestData?: AdditionalData): Request {
        var request = new Request();
        request.requestType = requestType;
        request.requestData = requestData;
        return request;
    }

    public static fromJson(json: string): Request {
        return this.baseFromJson(json, Request);
    }
}