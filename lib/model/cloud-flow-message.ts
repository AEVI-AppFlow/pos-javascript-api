import { JsonObject, JsonProperty } from "json2typescript";
import { Jsonable } from "./jsonable";
import { Payment } from "./payment";
import { PaymentResponse } from "./payment-response";
import { Request } from "./request";
import { Response } from "./response";
import { FlowEvent } from "./flow-event";
import { FlowException } from "./flow-exception";

export enum CloudFlowMessageTypes {
    // Initiating messages
    REQUEST_MESSAGE = "request",
    PAYMENT_MESSAGE = "payment",

    // Other messages
    RESPONSE_MESSAGE = "response",
    PAYMENT_RESPONSE_MESSAGE = "paymentResponse",
    FLOW_EVENT_MESSAGE = "flowEvent",
    FLOW_EXCEPTION_MESSAGE = "flowException"
}

@JsonObject
export class CloudFlowMessage extends Jsonable {

    @JsonProperty("source", String, true)
    source: string = undefined;

    @JsonProperty("target", String, true)
    target: string = undefined;

    @JsonProperty("format", String)
    format: string = "appflow";

    @JsonProperty("type", String)
    type: string = undefined;

    @JsonProperty("version", String)
    version: string = undefined;

    @JsonProperty("requestId", String, true)
    requestId: string = undefined;

    @JsonProperty("originatingRequestId", String, true)
    originatingRequestId: string = undefined;

    @JsonProperty("payload", Payment, PaymentResponse, Request, Response, FlowException, FlowEvent, true)
    payload: any = undefined;

    constructor() {
        super();
    }

    /**
     * Convert a JSON string into an {@link CloudFlowMessage} object if possible
     * 
     * @param json The JSON to convert
     * 
     * @returns A CloudFlowMessage object
     */
    public static fromJson(json: string): CloudFlowMessage {
        return super.baseFromJson(json, CloudFlowMessage);
    }
}