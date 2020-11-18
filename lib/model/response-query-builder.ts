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

import { ResponseQuery } from './response-query';
import { InvalidArgumentError } from '../util/pre-conditions';

export class ResponseQueryBuilder {
  flowName: string;

  flowType: string;

  startDate: number;

  endDate: number;

  maxResults: number;

  requestId: string;

  /**
     * Optionally restrict this query to responses for the given flow name
     *
     * @param flowName The flow name to restrict to
     * @return this builder
     */
  public withFlowName(flowName: string): ResponseQueryBuilder {
    this.flowName = flowName;
    return this;
  }

  /**
     * Optionally restrict this query to responses for the given flow type
     *
     * @param flowType The flow type to restrict to
     * @return this builder
     */
  public withFlowType(flowType: string): ResponseQueryBuilder {
    this.flowType = flowType;
    return this;
  }

  /**
     * Optionally restrict this query to responses within a given date range
     *
     * The start date is the earliest date to search for and the end date is the latest. Both times are in milliseconds since epoch.
     *
     * Both parameters must be set and the startDate must be less than the endDate
     *
     * @param startDate The earliest date to collect responses for
     * @param endDate   The last date to collect responses for
     * @return this builder
     */
  public withDateRange(startDate: number, endDate: number): ResponseQueryBuilder {
    this.startDate = startDate;
    this.endDate = endDate;
    return this;
  }

  /**
     * Optionally restrict this query to a specific requestId
     *
     * If this is set all other parameters set in this builder will be ignored
     *
     * @param requestId The requestId restrict to
     * @return this builder
     */
  public withRequestId(requestId: string): ResponseQueryBuilder {
    this.requestId = requestId;
    return this;
  }

  /**
     * This field can be used to change the number of results returned in this query. By default it is set to a maximum of 100
     *
     * @param maxResults The maximum number of responses to return
     * @return this builder
     */
  public withMaxResults(maxResults: number): ResponseQueryBuilder {
    this.maxResults = maxResults;
    return this;
  }

  public build(): ResponseQuery {
    if (this.endDate > 0 && this.startDate <= 0) {
      throw new InvalidArgumentError('Start date must be set for date range');
    }

    if (this.startDate > 0 && this.endDate <= 0) {
      throw new InvalidArgumentError('End date must be set for date range');
    }

    if (this.endDate > 0 && this.startDate >= this.endDate) {
      throw new InvalidArgumentError('Invalid parameters, start date must be earlier (lower) than end date');
    }

    return ResponseQuery.from(this.requestId, this.flowName, this.flowType, this.startDate, this.endDate, this.maxResults);
  }
}
