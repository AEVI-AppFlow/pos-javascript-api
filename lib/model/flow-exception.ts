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
import {JsonObject, JsonProperty} from "json2typescript";
import { Jsonable } from "./jsonable";

/**
 * An exception that will be returned to a client for fatal flow errors
 *
 * This exception will contain an errorCode that can be used to handle the error or display relevant information to the user.
 *
 * The errorMessage contained in the exception is a human readable message that should be used for debugging purposes only
 */
@JsonObject
export class FlowException extends Jsonable {

    @JsonProperty("errorCode", String)
    errorCode: string = undefined;

    @JsonProperty("errorMessage", String)
    errorMessage: string = undefined;

    constructor() {
        super();
    }

    public static from(errorCode: string, errorMessage: string): FlowException {
        var fe = new FlowException();
        fe.errorCode = errorCode;
        fe.errorMessage = errorMessage;
        return fe;
    }

    public static fromJson(json: string): FlowException {
        return this.baseFromJson(json, FlowException);
    }
}