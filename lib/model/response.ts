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

import { Request } from './request';
import { AdditionalData } from './additional-data';

/**
 * Response to a generic {@link Request} that contains the outcome and bespoke response data for that request type.
 */
@JsonObject
export class Response extends Jsonable {

    @JsonProperty("originatingRequest", Request, true)
    originatingRequest: Request = undefined;

    @JsonProperty("success")
    success: boolean = false;

    @JsonProperty("outcomeMessage")
    outcomeMessage: string = undefined;

    @JsonProperty("responseData", AdditionalData)
    responseData: AdditionalData = new AdditionalData;

    @JsonProperty("flowServiceId", String, true)
    flowServiceId: string = undefined;

    @JsonProperty("processedInBackground")
    processedInBackground: boolean = false;

    constructor() {
        super();
    }

    /**
     * Convert a JSON string into a {@link Response} object if possible
     * 
     * @param json The JSON to convert
     */
    public static fromJson(json: string): Response {
        return this.baseFromJson(json, Response);
    }
}