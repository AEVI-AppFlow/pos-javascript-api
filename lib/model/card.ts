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

import * as moment from 'moment';
import { AdditionalData } from './additional-data';
import { Token } from './token';
import { InvalidArgumentError } from '../util/pre-conditions';

/**
 * The card details representing the card presented during a transaction.
 *
 * All fields in this class are optional and the payment service used may or may not return all these values.
 */
@JsonObject('Card')
export class Card {
  private static MAX_PAN_DIGITS_ALLOWED = 10;

  @JsonProperty('maskedPan', String, true)
  maskedPan?: string = undefined;

  @JsonProperty('cardholderName', String, true)
  cardholderName?: string = undefined;

  @JsonProperty('expiryDate', String, true)
  expiryDate?: string = undefined;

  @JsonProperty('cardToken', Token, true)
  cardToken?: Token = undefined;

  @JsonProperty('additionalData', AdditionalData)
  additionalData: AdditionalData = new AdditionalData();

  /**
     * Check whether this object contains any card data.
     *
     * @return True if empty, false if contains data
     */
  public isEmpty(): boolean {
    return !this.maskedPan && !this.cardholderName && !this.cardToken && !this.expiryDate && this.additionalData.isEmpty();
  }

  /**
     * Create and returns a new Card object from the parameters given
     *
     * @param maskedPan The masked PAN of the card
     * @param cardholderName The cardholder name from the card
     * @param expiryDate The expiry date of the card in the format YYMM
     * @param token The token associated with this card
     * @param additionalData Optionally any other additional card data such as EMV data etc.
     *
     * @returns The newly created Card object
     */
  public static from(maskedPan: string, cardholderName: string, expiryDate: string, token: Token, additionalData?: AdditionalData): Card {
    const card = new Card();
    if (!maskedPan || maskedPan.replace(/[ X]/g, '').length > Card.MAX_PAN_DIGITS_ALLOWED) {
      throw new InvalidArgumentError(`Masked PAN must not contain more than ${Card.MAX_PAN_DIGITS_ALLOWED} non-masked digits`);
    }
    card.maskedPan = maskedPan;
    card.cardholderName = cardholderName;
    card.expiryDate = expiryDate;
    card.cardToken = token;
    if (additionalData) {
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
    return moment(this.expiryDate, 'YYMM').format(pattern);
  }
}
