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

export enum AppMessageTypes {

    // Initiated by client apps
    REQUEST_MESSAGE = "request",
    PAYMENT_MESSAGE = "payment",
    PAYMENT_FLOW_CONFIG_REQUEST = "paymentFlowConfigRequest",
    RESPONSES_REQUEST = "responsesRequest",
    DEVICE_INFO_REQUEST = "deviceInfoRequest",

    // Sent from flow services
    RESPONSE_MESSAGE = "response",
    AUDIT_ENTRY = "auditEntry",
    FAILURE_MESSAGE = "failure",
    REQUEST_ACK_MESSAGE = "requestAck",

    // Sent by FPS
    FLOW_SERVICE_EVENT = "flowServiceEvent"
}
export enum ResponseMechanisms {
    MESSENGER_CONNECTION = "messengerConnection",
    RESPONSE_SERVICE = "responseService"
}

/**
 * Account type definitions representing possible account type choices for a payment card transaction.
 */
export enum  AccountTypes {

    ACCOUNT_TYPE_CREDIT = "credit",
    ACCOUNT_TYPE_DEBIT = "debit",
    ACCOUNT_TYPE_SAVINGS = "savings",
    ACCOUNT_TYPE_PREPAID = "prepaid",
    ACCOUNT_TYPE_CHEQUE = "cheque"
}

/**
 * General/common data keys used for various scenarios.
 */
export enum AdditionalDataKeys {

    DATA_KEY_TRANSACTION = "transaction",
    DATA_KEY_TRANSACTION_ID = "transactionId",
    DATA_KEY_AMOUNTS = "amounts",
    DATA_KEY_AMOUNT = "amount",
    DATA_KEY_BASKET = "basket",
    DATA_KEY_CUSTOMER = "customer",
    DATA_KEY_TOKEN = "token",
    DATA_KEY_TRANSACTION_LANGUAGE = "transactionLanguage",
    DATA_KEY_ACCESSIBLE_MODE = "accessibleMode",
    DATA_KEY_TAX_INFO = "taxInfo",
    DATA_KEY_CARD = "card",
    DATA_KEY_CURRENCY= "currency",

    /**
     * This key should be added to the additional data of a request if post auth tip adjustment is allowed
     */
    DATA_KEY_POST_AUTH_TIP_ADJUST = "postAuthTipAdjust"
}

/**
 * Identifiers to use for adding additional amounts.
 */
export enum AmountIdentifiers {

    AMOUNT_TIP = "tip",
    AMOUNT_CASHBACK = "cashback",
    AMOUNT_SURCHARGE = "surcharge",
    AMOUNT_CHARITY_DONATION = "charityDonation",
}

/**
 * Keys used to describe what type of data was augmented.
 */
export enum AugmentedDataKeys {

    AUGMENTED_DATA_AMOUNTS = "amounts",
    AUGMENTED_DATA_BASKET = "basket",
    AUGMENTED_DATA_CUSTOMER = "customer",
    AUGMENTED_DATA_CURRENCY = "currency",
    AUGMENTED_DATA_ADDITIONAL_DATA = "additionalData",
    AUGMENTED_DATA_PAYMENT = "payment",
    AUGMENTED_DATA_CANCELLED = "cancelled",
    AUGMENTED_DATA_REFERENCES = "references"
}

/**
 * Authorization methods for cards.
 */
export enum CardAuthorisationMethods {

    CARD_AUTH_METHOD_PIN = "pin",
    CARD_AUTH_METHOD_SIGNATURE = "signature",
    CARD_AUTH_METHOD_FINGERPRINT = "fingerprint",
    CARD_AUTH_METHOD_RETINAL_SCAN = "rentinalScan"
}

/**
 * Keys for additional information about cards.
 */
export enum CardDataKeys {

    CARD_DATA_NETWORK = "network",
    CARD_DATA_ENTRY_METHOD = "entryMethod",
    CARD_DATA_AUTHORISATION_METHOD = "authorisationMethod",
    CARD_DATA_ACCOUNT_TYPE = "accountType",
    CARD_DATA_AID = "aid",
    CARD_DATA_SERVICE_CODE = "serviceCode",
    CARD_DATA_CVV = "cvv",
    CARD_DATA_LANGUAGES = "languages",
    CARD_DATA_BALANCE = "balance"
}

/**
 * The standard set of card presentation methods.
 */
export enum CardEntryMethods {

    CARD_ENTRY_METHOD_INSERT = "insert",
    CARD_ENTRY_METHOD_SWIPE = "swipe",
    CARD_ENTRY_METHOD_TAP = "tap",
    CARD_ENTRY_METHOD_MANUAL = "manual"
}

/**
 * Card networks, also known as schemes.
 */
export enum CardNetworks {

    CARD_NETWORK_MASTERCARD = "mastercard",
    CARD_NETWORK_VISA = "visa",
    CARD_NETWORK_AMEX = "amex",
    CARD_NETWORK_DINERS = "diners",
    CARD_NETWORK_JCB = "jcb",
    CARD_NETWORK_UNION_PAY = "unionpay",
    CARD_NETWORK_MAESTRO = "maestro"
}

/**
 * The main FPS event types.
 */
export enum EventTypes {

    /**
     * When anything has changed in FPS related to settings, configurations, etc, this event will be triggered.
     * The data for the event will be populated with the relevant FPS state.
     * See {@link EventDataKeys} for breakdown of what has changed
     */
    EVENT_INTERNAL_STATE_CHANGED = "flowStateChanged",

    /**
     * When something external has changed, like devices connected/disconnected or apps added/removed/enabled/disabled, etc
     * See {@link EventDataKeys} for breakdown of what has changed
     */
    EVENT_EXTERNAL_STATE_CHANGED = "externalStateChanged"
}

/**
 * Keys for different event flags.
 */
export enum EventDataKeys {

    /**
     * For {@link EventTypes#EVENT_EXTERNAL_STATE_CHANGED} event.
     *
     * Flow services have changed, meaning apps should re-query for available flow services.
     */
    EVENT_KEY_FLOW_SERVICES_CHANGED = "eventKeyFlowServicesChanged",

    /**
     * For {@link EventTypes#EVENT_EXTERNAL_STATE_CHANGED} event.
     *
     * Devices have changed, meaning apps should re-query for available devices.
     */
    EVENT_KEY_DEVICES_CHANGED = "eventKeyDevicesChanged",

    /**
     * For {@link EventTypes#EVENT_INTERNAL_STATE_CHANGED} event.
     *
     * FPS settings have changed.
     */
    EVENT_KEY_SETTINGS_CHANGED = "eventKeySettingsChanged",

    /**
     * For {@link EventTypes#EVENT_INTERNAL_STATE_CHANGED} event.
     *
     * Flow configs have been updated.
     */
    EVENT_KEY_FLOW_CONFIGS_CHANGED = "eventKeyFlowConfigsChanged"
}

export enum FlowTypes {
    SALE = "sale",
    REFUND = "refund",
    MOTO_SALE = "motoSale",
    MOTO_REFUND = "motoRefund",
    PRE_AUTHORISATION = "preAuthorisation",
    PRE_AUTH_COMPLETION = "preAuthCompletion",
    DEPOSIT = "deposit",
    REVERSAL = "reversal",
    TOKENISATION = "tokenisation",
    BATCH_CLOSURE = "batchClosure",
    RECEIPT_DELIVERY = "receiptDelivery",
    BASKET_STATUS_UPDATE = "basketStatusUpdate",
    CUSTOMER_STATUS_UPDATE = "customerStatusUpdate"
}

export enum FlowStages {
    PRE_FLOW = "PRE_FLOW",
    SPLIT = "SPLIT",
    PRE_TRANSACTION = "PRE_TRANSACTION",
    PAYMENT_CARD_READING = "PAYMENT_CARD_READING",
    POST_CARD_READING = "POST_CARD_READING",
    TRANSACTION_PROCESSING = "TRANSACTION_PROCESSING",
    POST_TRANSACTION = "POST_TRANSACTION",
    POST_FLOW = "POST_FLOW",
    GENERIC = "GENERIC",
    POST_GENERIC = "POST_GENERIC",
    STATUS_UPDATE = "STATUS_UPDATE",
    FULFILLED_CHECK = "FULFILLED_CHECK",
}

/**
 * Keys related to loyalty information.
 */
export enum LoyaltyDataKeys {

    LOYALTY_SCHEME_NAME = "schemeName",
    LOYALTY_REWARDS_PROCESSED = "rewardsProcessed",
    LOYALTY_REWARD_MESSAGE = "rewardMessage",
    LOYALTY_TOTAL_POINTS = "totalPoints",
    LOYALTY_TOTAL_VALUE = "totalValue",
    LOYALTY_EARN_POINTS = "earnPoints",
    LOYALTY_EARN_VALUE = "earnValue",
    LOYALTY_REDEEM_POINTS = "redeemPoints",
    LOYALTY_REDEEM_VALUE = "redeemValue"
}

export enum ModifierTypes {
    TAX = "tax",
    EXTRA = "extra",
    DEDUCTION = "deduction",
    DISCOUNT = "discount"
}

/**
 * Data that can be passed to payment apps in particular.
 */
export enum PaymentDataKeys {

    DATA_KEY_MERCHANT_ID = "merchantId",

    /**
     * See {@link CardEntryMethods} for possible values.
     * Should be passed as a String[].
     */
    CARD_ENTRY_METHODS = "cardEntryMethods",

    /**
     * See {@link PaymentMethods} for possible values.
     * Should be passed as String[].
     */
    CARD_PAYMENT_METHODS = "paymentMethods",

    /**
     * Also known as card schemes.
     * See {@link CardNetworks} for possible values.
     * Should be passed as String[].
     */
    CARD_NETWORKS = "cardNetworks",

    /**
     * See {@link AccountTypes} for possible values.
     * Should be passed as String[].
     */
    ACCOUNT_TYPES = "accountTypes"
}

/**
 * Defined methods of payment.
 */
export enum PaymentMethods {

    PAYMENT_METHOD_CARD = "card",
    PAYMENT_METHOD_CREDIT_CARD = "creditCard",
    PAYMENT_METHOD_DEBIT_CARD = "debitCard",
    PAYMENT_METHOD_CHARGE_CARD = "chargeCard",
    PAYMENT_METHOD_CASH = "cash",
    PAYMENT_METHOD_LOYALTY_POINTS = "points",
    PAYMENT_METHOD_REWARD = "reward",
    PAYMENT_METHOD_GIFT_CARD = "giftCard",
    PAYMENT_METHOD_BANK_ACCOUNT = "bankAccount",
    PAYMENT_METHOD_CHEQUE = "cheque",
    PAYMENT_METHOD_EBT = "ebt",
    PAYMENT_METHOD_INVOICE = "invoice"
}

/**
 * Receipt data keys for receipt related requests.
 */
export enum ReceiptKeys {
    RECEIPT_PAYMENT_METHOD = "receiptPaymentMethod",
    RECEIPT_AMOUNTS = "receiptAmounts",
    RECEIPT_OUTCOME = "receiptOutcome",
    RECEIPT_BASKET = "receiptBasket"
}

/**
 * Keys for reference data being passed back in responses
 */
export enum ReferenceKeys {

    REFERENCE_KEY_MERCHANT_ID = "merchantId",
    REFERENCE_KEY_MERCHANT_NAME = "merchantName",
    REFERENCE_KEY_TERMINAL_ID = "terminalId",

    /**
     * ms since epoch
     *
     * The value of this parameter should be provided as a long
     */
    REFERENCE_KEY_TRANSACTION_DATE_TIME = "transactionDateTime", // ms since epoch

    /**
     * For terminals that provide a transaction number representing the count of transactions performed on a terminal so far.
     *
     * <strong>This is not the same as transactionId</strong>
     */
    REFERENCE_KEY_TRANSACTION_NUMBER = "transactionNumber",
    REFERENCE_KEY_PAYMENT_SERVICE = "paymentService",
}

/**
 * Keys for additional flow service info.
 */
export enum ServiceInfoDataKeys {

    MERCHANTS = "merchants",
    SUPPORTS_MANUAL_ENTRY = "supportsManualEntry",
    PRINTS_RECEIPTS = "printsReceipts",
    REQUIRES_CARD_TOKEN = "requiresCardToken"
}

/**
 * Data keys related to splitting transactions.
 */
export enum SplitDataKeys {

    DATA_KEY_SPLIT_TXN = "splitTxn",
    DATA_KEY_NUM_SPLITS = "numSplits",
    DATA_KEY_SPLIT_TYPE = "splitType",
    SPLIT_TYPE_BASKET = "splitBasketItems",
    SPLIT_TYPE_AMOUNTS = "splitAmounts",
}

/**
 * Keys for status update data.
 */
export enum StatusUpdateKeys {

    // Basket keys
    STATUS_UPDATE_BASKET_MODIFIED = "basketUpdated",
    STATUS_UPDATE_BASKET_ITEMS_ADDED = "basketItemsAdded",
    STATUS_UPDATE_BASKET_ITEMS_REMOVED = "basketItemsRemoved",
    STATUS_UPDATE_BASKET_ITEM_MODIFIED = "basketItemUpdated",

    // Customer keys
    STATUS_UPDATE_CUSTOMER = "customerUpdate"

}

/**
 * Defined set of error constants that may be passed back to the client.
 */
export enum ErrorConstants {

    /**
     * A general purpose error that will be sent for fatal failures in a flow service
     */
    FLOW_SERVICE_ERROR = "flowServiceError",

    /**
     * Sent if the processing service if not installed
     */
    PROCESSING_SERVICE_NOT_INSTALLED = "notInstalled",

    /**
     * Sent if the processing service rejects a request because it is busy processing another
     */
    PROCESSING_SERVICE_BUSY = "busy",

    /**
     * Sent if the processing service fails to cancel a flow
     */
    PROCESSING_SERVICE_CANCEL_FAILED = "cancelFailed",

    /**
     * Sent if the processing service fails to resume a flow
     */
    PROCESSING_SERVICE_RESUME_FAILED = "resumeFailed",

    /**
     * Sent if an unknown/unsupported request type is sent to the processing service
     */
    UNSUPPORTED_OPERATION = "unsupportedOperation",

    /**
     * Sent if the processing service has received an unexpected message type
     */
    INVALID_MESSAGE_TYPE = "invalidMessageType",

    /**
     * Sent if the flow type or name in the request is not valid
     */
    INVALID_FLOW_IDENTIFIER = "invalidFlowIdentifier",

    /**
     * The processing service has received an invalid or unreadable message. This usually indicates a message has been corrupted.
     */
    INVALID_REQUEST = "invalidRequest",

    /**
     * Sent if the client application is missing a response listener service implementation
     */
    MISSING_RESPONSE_LISTENER = "missingResponseListener",

    /**
     * Sent if a flow service does not support the stage it has just been called for
     */
    STAGE_NOT_SUPPORTED = "stageNotSupported",

    /**
     * Sent if the processing service cannot find a handler(s) for a stage
     */
    CONFIG_ERROR = "configError",

    /**
     * Sent if the processing service detects there is more than one config provider installed that provides flow configs
     */
    MULTIPLE_CONFIG_PROVIDERS = "multipleConfigProviders",

    /**
     * Sent if the processing service detects there is no config provider installed that provides flow configs
     */
    NO_CONFIG_PROVIDER = "noConfigProvider",

    /**
     * Sent if there are no flow services installed on the device that can handle any requests
     */
    NO_FLOW_SERVICES = "noFlowServices",

    /**
     * Sent if there are no flows configured and/or accepted by FPS
     */
    NO_AVAILABLE_FLOWS = "noAvailableFlows",

    /**
     * Sent if the client is using an API that is not the same major version as the one implemented by the processing service
     */
    INCOMPATIBLE_API_VERSION = "incompatibleApiVersion",

    /**
     * Sent if the client sends a request with the same id as a previously initiated request
     */
    DUPLICATE_REQUEST_ID = "duplicateRequestId",

    /**
     * Something unexpected happened
     */
    UNEXPECTED_ERROR = "unexpectedError"
}
