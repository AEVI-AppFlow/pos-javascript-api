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
import { FlowEvent } from './model/flow-event';
import { Device } from './model/device';
import { FlowException } from './model/flow-exception';

export interface PaymentClientOptions {
  [name: string]: string
}

export interface PaymentClient {

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
     * Send a flow event to the processing service. This event will picked up by services/flow apps registered for listening to events
     *
     * @param flowEvent The event to send
     */
  sendEvent(flowEvent: FlowEvent): Promise<void>;

  /**
     * Query for devices connected to the processing service, if multi-device is enabled.
     *
     * It is up to the flow processing service configuration if multi-device is enabled or not. See {@link PaymentSettings} for more details.
     *
     * Returns a promise of a list of currently connected devices.
     *
     * This should be queried each time a selection is required to ensure an up-to-date list.
     *
     * You can subscribe to [[subscribeToSystemEvents]] for updates on changes to the available devices.
     *
     * @return Observable stream emitting a list of {@link Device} objects containing basic device info
     */
  getDevices(): Promise<Array<Device>>;

  /**
     * Update device details.
     *
     * Not all fields of devices are able to be updated. The exact fields allowed will be dependent on the underlying implementation
     *
     * @param device The device object to update
     */
  updateDevice(device: Device): Promise<Device>;

  /**
     * Subscribe to general system events.
     *
     * Examples are when there are changed to devices, applications or system settings.
     *
     * @return A stream that will emit {@link FlowEvent} items
     */
  subscribeToSystemEvents(): Observable<FlowEvent>;

  /**
     * Subscribe to flow events.
     *
     * Examples are when there are changed to devices, applications or system settings.
     *
     * @return A stream that will emit {@link FlowEvent} items
     */
  subscribeToFlowEvents(): Observable<FlowEvent>;

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
