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
import { Observable } from 'rxjs';

import { PaymentClient } from './payment-client';

export interface PaymentApi {

    /**
     * Get the API version.
     *
     * The API versioning follows semver rules with major.minor.patch versions.
     *
     * @return The API version
     */
    getApiVersion(): Observable<string>;

    /**
     * Returns true if the processing service that handles API requests is installed.
     *
     * If not installed, none of the API calls will function.
     *
     * @return True if API processing service is installed, false otherwise
     */
    isProcessingServiceInstalled(): Observable<boolean>;

    /**
     * Get the processing service version installed on this device.
     *
     * @return The processing service version (semver format)
     */
    getProcessingServiceVersion(): Observable<string>;

    /**
     * Get a new instance of a {@link PaymentClient} to initiate payments.
     *
     * @return An instance of {@link PaymentClient}
     */
    getPaymentClient(): PaymentClient;

}