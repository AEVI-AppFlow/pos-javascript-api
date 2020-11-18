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

export enum ConfirmationInputTypes {
  CONFIRMATION_INPUT_TYPE_TEXT = 'text',
  CONFIRMATION_INPUT_TYPE_NUMERIC = 'numeric',
  CONFIRMATION_INPUT_TYPE_PHONE = 'phone',
  CONFIRMATION_INPUT_TYPE_EMAIL = 'email',
  CONFIRMATION_INPUT_TYPE_WEB = 'web',
}

export enum ConfirmationOptionValues {
  CONFIRMATION_OPTION_APPROVE = 'approve',
  CONFIRMATION_OPTION_REJECT = 'reject',
  CONFIRMATION_OPTION_YES = 'yes',
  CONFIRMATION_OPTION_NO = 'no',
  CONFIRMATION_OPTION_OK = 'ok',
  CONFIRMATION_OPTION_CANCEL = 'cancel',
}

export enum ConfirmationTypes {
  CONFIRMATION_TYPE_CARD = 'card',
  CONFIRMATION_TYPE_SIGNATURE = 'signature',
}

export enum FlowEventTypes {
  EVENT_CONFIRMATION_REQUEST = 'confirmationRequest',
  EVENT_CONFIRMATION_RESPONSE = 'confirmationResponse',
  EVENT_FINAL_AMOUNT_REQUEST = 'finalAmountRequest',
  EVENT_FINAL_AMOUNT_RESPONSE = 'finalAmountResponse',
  EVENT_NOTIFY_ACTION = 'notifyAction',
  EVENT_PROGRESS_MESSAGE = 'progressMessage',
  EVENT_RECEIPT = 'receipt',
}

export enum NotifyActionTypes {
  ABORT = 'abort',
  DUPLICATE_RECEIPT = 'duplicateReceipt',
  EMV_RECEIPT_PRINT = 'emvReceiptPrint',
  EFT_COMMUNICATION_FINISHED = 'eftFinished',
  COMMUNICATION_FINISHED = 'communicationFinished',
  COMMUNICATION_STARTED = 'communicationStarted',
}
