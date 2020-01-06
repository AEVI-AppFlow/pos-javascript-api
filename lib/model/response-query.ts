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

@JsonObject
export class ResponseQuery extends Jsonable {

    @JsonProperty("requestId", String, true)
    requestId: string = undefined;

    @JsonProperty("flowName", String, true)
    flowName: string = undefined;

    @JsonProperty("flowType", String, true)
    flowType: string = undefined;

    @JsonProperty("startDate", Number, true)
    startDate: number = undefined;

    @JsonProperty("endDate", Number, true)
    endDate: number = undefined;

    @JsonProperty("maxResults", Number, true)
    maxResults: number = undefined;

    public static from(requestId: string, flowName: string, flowType: string, startDate: number, endDate: number, maxResults: number): ResponseQuery {
        var responseQuery = new ResponseQuery();
        responseQuery.requestId = requestId;
        responseQuery.flowName = flowName;
        responseQuery.flowType = flowType;
        responseQuery.startDate = startDate;
        responseQuery.endDate = endDate;
        responseQuery.maxResults = maxResults;
        return responseQuery;
    }
}