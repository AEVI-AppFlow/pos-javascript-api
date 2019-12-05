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
import { Token } from './token';
import { Jsonable } from "./jsonable";
import { JsonOption } from "../util/json-option";

import { v4 as uuid } from 'uuid';

export enum CustomerDataKeys {
    FIRST_NAME = "firstName",
    SURNAME = "surname",
    MIDDLE_NAMES = "middleNames",
    PHONE = "phone",
    EMAIL = "email",
    ADDRESS = "address",
    POSTCODE = "postcode",
    CITY = "city",
    STATE = "state",
    COUNTRY = "country"
}

@JsonObject("Customer")
export class Customer extends Jsonable {

    @JsonProperty("id")
    id: string = undefined;

    @JsonProperty("fullName")
    fullName: string = undefined;

    @JsonProperty("customerDetails", AdditionalData)
    customerDetails: AdditionalData = new AdditionalData();

    @JsonProperty("tokens", [Token])
    tokens: Array<Token> = [];

    constructor() {
        super();
        this.id = uuid();
    }

    public static from(id: string, fullName: string, customerDetails?: AdditionalData, tokens?: Array<Token>): Customer {
        var c = new Customer();
        c.id = id;
        c.fullName = fullName;
        if(customerDetails) {
            c.customerDetails = customerDetails;
        }
        if(tokens) {
            c.tokens = tokens;
        }
        return c;
    }

    public static fromJson(json: string): Customer {
        return Jsonable.baseFromJson(json, Customer);
    }

    /**
     * Convenience wrapper for adding additional customer data.
     *
     * This can be used to set arbitrary data to be passed on in the request to down-stream flow apps and/or payment apps.
     *
     * See {@link AdditionalData#addData(String, Object[])} for more info.
     *
     * @param key    The key to use for this data
     * @param values An array of values for this data
     */
    public addCustomerDetails(key: string , ...values: any | JsonOption) {
        this.customerDetails.addData(key, values);
    }
}
