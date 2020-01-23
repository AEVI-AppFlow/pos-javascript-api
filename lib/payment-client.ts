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

import { Payment } from './model/payment';
import { PaymentResponse } from './model/payment-response';
import { Request } from './model/request';
import { Response } from './model/response';
import { ResponseQuery } from './model/response-query';
import { FlowEvent } from './model/flow-event';
import { Device } from './model/device';
import { PaymentSettings } from './model/config/payment-settings';
import { FlowException } from './model/flow-exception';

export interface PaymentClient {

    /**
     * Retrieve a snapshot of the current payment settings.
     *
     * This includes system settings, flow configurations, information about flow services, etc.
     *
     * Subscribe to system events via [[subscribeToSystemEvents]] for updates when the state changes.
     *
     * @return Observable emitting the latest known {@link PaymentSettings} instance
     */
    getPaymentSettings(): Observable<PaymentSettings>;

    /**
     * Initiate processing of the provided {@link Request}.
     *
     * Due to the nature of Android component lifecycles, AppFlow can not guarantee that your activity/service is still alive when a flow is complete,
     * meaning it may not be able to receive the response via this rx chain. To ensure that your application receives a response in a reliable way,
     * your application must instead subscribe to the {@link Response} asynchronously using [[subscribeToResponses]].
     *
     * This method returns a Promise that will resolve successfully if the request is accepted, or send an error if the request is invalid.
     *
     * If your request is rejected or an error occurs during the flow, a {@link FlowException} will be delivered to the observable that
     * can be subscribed to from [[subscribeToResponseErrors]] method. 
     * 
     * This {@link FlowException} contains an error code that can be mapped to one of the constants in {@link ErrorConstants} and an error message
     * that further describes the problem. These values are not intended to be presented directly to the merchant.
     *
     * @param request The request
     * @return Promise that represents the acceptance of the request
     */
    initiateRequest(request: Request): Promise<void>;

    /**
     * Initiate payment processing based on the provided {@link Payment}.
     *
     * Due to the nature of Android component lifecycles, AppFlow can not guarantee that your activity/service is still alive when a flow is complete,
     * meaning it may not be able to receive the response via this rx chain. To ensure that your application receives a response in a reliable way,
     * your application must instead subscribe to the {@link PaymentResponse} asynchronously using [[subscribeToPaymentResponses]].
     *
     * This method returns a Promise that will resolve successfully if the request is accepted, or send an error if the request is invalid.
     *
     * If your request is rejected or an error occurs during the flow, a {@link FlowException} will be delivered to the observable that
     * can be subscribed to from [[subscribeToPaymentResponseErrors]] method. 
     * 
     * This {@link FlowException} contains an error code that can be mapped to one of the constants in {@link ErrorConstants} and an error message
     * that further describes the problem. These values are not intended to be presented directly to the merchant.
     *
     * @param payment The payment to process
     * @return Promise that represents the acceptance of the request
     */
    initiatePayment(payment: Payment): Promise<void>;

    /**
     * Returns a stream of completed PaymentResponses for the given parameters.
     *
     * This query will <strong>only</strong> return {@link PaymentResponse} objects that were generated in response to requests by your application (package name)
     *
     * Responses will <strong>only</strong> be returned for completed flows. Responses for incomplete or in-progress flows will not be returned by this method
     *
     * @param responseQuery An object representing some parameters to limit the query by
     * @return An Observable stream of payment responses
     */
    queryPaymentResponses(responseQuery: ResponseQuery):  Observable<PaymentResponse>;

    /**
     * Returns a stream of completed Responses for the given parameters
     *
     * This query will <strong>only</strong> return {@link Response} objects that were generated in response to requests by your application (package name)
     *
     * Responses will <strong>only</strong> be returned for completed flows. Responses for incomplete or in-progress flows will not be returned by this method
     *
     * @param responseQuery An object representing some parameters to limit the query by
     * @return An Observable stream of responses
     */
    queryResponses(responseQuery: ResponseQuery): Observable<Response>;

    /**
     * Query for devices connected to the processing service, if multi-device is enabled.
     *
     * It is up to the flow processing service configuration if multi-device is enabled or not. See {@link PaymentSettings} for more details.
     *
     * Returns a single that emits a list of currently connected devices.
     *
     * This should be queried each time a selection is required to ensure an up-to-date list.
     *
     * You can subscribe to [[subscribeToSystemEvents]] for updates on changes to the available devices.
     *
     * @return Observable stream emitting a list of {@link Device} objects containing basic device info
     */
    getDevices(): Observable<Array<Device>>;

    /**
     * Subscribe to general system events.
     *
     * Examples are when there are changed to devices, applications or system settings.
     *
     * @return A stream that will emit {@link FlowEvent} items
     */
    subscribeToSystemEvents(): Observable<FlowEvent>;

    /**
     * Subscribe to payment response that are sent asynchronously to this client
     * 
     * @retun A stream of {@link PaymentResponse} that are sent for every {@link Payment} requested
     */
    subscribeToPaymentResponses(): Observable<PaymentResponse>;

    /**
     * Subscribe to ALL payment response errors sent back to this application
     *
     * See {@link ErrorConstants} for details of the error codes that can be sent.
     * The {@link FlowException} also contains a message that is intended to be used for debugging purposes only. 
     * 
     * This message is not intended for the end user (merchant). Instead the `errorCode` value should be used to lookup a suitable message for your user.
     *  
     * @return A stream that will emit response errors that are sent from the processing service.
     */
    subscribeToPaymentResponseErrors(): Observable<FlowException>

    /**
     * Subscribe to generic responses that are sent asynchronously to this client
     * 
     * @retun A stream of {@link Response} that are sent for every {@link Request} requested
     */
    subscribeToResponses(): Observable<Response>

    /**
     * Subscribe to ALL generic response errors sent back to this application
     * 
     * See {@link ErrorConstants} for details of the error codes that can be sent.
     * The {@link FlowException} also contains a message that is intended to be used for debugging purposes only. 
     * 
     * This message is not intended for the end user (merchant). Instead the `errorCode` value should be used to lookup a suitable message for your user.
     * 
     * @return A stream that will emit response errors that are sent from the processing service. 
     */
    subscribeToResponseErrors(): Observable<FlowException>
}