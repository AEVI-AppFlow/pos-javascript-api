import { JsonObject, JsonProperty, JsonCustomConvert, JsonConverter } from "json2typescript";

import { Jsonable } from "./jsonable";
import { ResponseMechanisms, AppMessageTypes } from "./constants";
import { AdditionalData } from "./additional-data";
import { Payment } from "./payment";
import { Request } from "./request";

const API_COMPATIBILITY_VERSION = "2.1.2";

@JsonObject
export class InternalData extends Jsonable {
    @JsonProperty("senderApiVersion", String)
    senderApiVersion: string;

    @JsonProperty("senderPackageName", String)
    senderPackageName: string;

    @JsonProperty("additionalData", Object)
    additionalData: { [name: string]: string } = {};

    constructor() {
        super();
    }

    public static fromJson(json: string): InternalData {
        return super.baseFromJson(json, InternalData);
    }
}

@JsonObject
export class AppMessage extends Jsonable {

    @JsonProperty("messageType", String)
    messageType: string = undefined; // See AppMessageTypes

    @JsonProperty("messageData", String)
    messageData: string = undefined; // The message data in JSON

    @JsonProperty("responseMechanism", String)
    responseMechanism: string = undefined; // See ResponseMechanisms

    @JsonProperty("internalData", String)
    internalData: string = undefined; // Data that may be useful for internal use, such as API version, etc

    constructor() {
        super();
    }

    public static from(messageType: string, messageData: string, internalData: InternalData, responseMechanism: string = ResponseMechanisms.RESPONSE_SERVICE): AppMessage {
        var appMess = new AppMessage();
        appMess.messageType = messageType;
        appMess.messageData = messageData;
        appMess.internalData = internalData.toJson();
        appMess.responseMechanism = responseMechanism;
        return appMess;
    }

    /**
     * Convert a JSON string into an {@link AppMessage} object if possible
     * 
     * @param json The JSON to convert
     * 
     * @returns A AppMessage object
     */
    public static fromJson(json: string): AppMessage {
        return super.baseFromJson(json, AppMessage);
    }

    public static wrapPayment(payment: Payment, responseMechanism: string): AppMessage {
        var paymentData = new AdditionalData();
        paymentData.addData(AppMessageTypes.PAYMENT_MESSAGE, payment);
        var request = Request.from(payment.flowType, paymentData);
        request.deviceId = payment.deviceId;
        var appMessage = AppMessage.from(AppMessageTypes.PAYMENT_MESSAGE, request.toJson(), this.getInternalData(), responseMechanism);
        return appMessage;
    }

    public static wrapRequest(request: Request, responseMechanism: string): AppMessage {
        return AppMessage.from(AppMessageTypes.REQUEST_MESSAGE, request.toJson(), this.getInternalData(), responseMechanism);
    }

    public static getVersion(): string {
        return API_COMPATIBILITY_VERSION;
    }

    private static getInternalData(): InternalData {
        var internalData = new InternalData();
        internalData.senderApiVersion = this.getVersion();
        internalData.senderPackageName = "appflow-payment-initiation-api";
        return internalData;
    }
}

