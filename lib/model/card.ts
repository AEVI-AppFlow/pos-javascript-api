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

import { AdditionalData } from "./additional-data";
import { Token } from "./token";
import { InvalidArgumentError } from '../util/pre-conditions';

import * as moment from 'moment';

@JsonObject("Card")
export class Card {

    private static MAX_PAN_DIGITS_ALLOWED = 10;

    @JsonProperty("maskedPan")
    maskedPan: string;

    @JsonProperty("cardholderName")
    cardholderName: string;

    @JsonProperty("expiryDate")
    expiryDate: string;

    @JsonProperty("cardToken", Token, true)
    cardToken: Token = undefined;
    
    @JsonProperty("additionalData", AdditionalData)
    additionalData: AdditionalData = new AdditionalData();

    constructor() {

    }

    /**
     * Check whether this object contains any card data.
     *
     * @return True if empty, false if contains data
     */
    public isEmpty(): boolean {
        return !this.maskedPan && !this.cardholderName && !this.cardToken && !this.expiryDate && this.additionalData.isEmpty();
    }

    public static from(maskedPan: string, cardholderName: string, expiryDate: string, token: Token, additionalData?: AdditionalData): Card {
        var card = new Card();
        if (!maskedPan || maskedPan.replace(/[ X]/g,'').length > Card.MAX_PAN_DIGITS_ALLOWED) {
            throw new InvalidArgumentError("Masked PAN must not contain more than " + Card.MAX_PAN_DIGITS_ALLOWED + " non-masked digits");
        }
        card.maskedPan = maskedPan;
        card.cardholderName = cardholderName;
        card.expiryDate = expiryDate;
        card.cardToken = token;
        if(additionalData) {
            card.additionalData = additionalData;
        }
        return card;
    }

    /**
     * Get the expiry date formatted as per the provided pattern.
     *
     * See Java SimpleDateFormat for pattern documentation.
     *
     * @param pattern The moment.js pattern to format the expiry date as
     * @return The formatted expiry date, or null if expiry date not set or pattern is invalid
     */
    public getFormattedExpiryDate(pattern: string): string {
        if (this.expiryDate == null || pattern == null) {
            return null;
        }
        return moment(this.expiryDate, "YYMM").format(pattern);
    }
}