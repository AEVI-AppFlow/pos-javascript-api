import { JsonObject, JsonProperty } from "json2typescript";

import { Jsonable } from "./jsonable";
import { ResponseMechanisms } from "./constants";

@JsonObject
export class InternalData extends Jsonable {
    @JsonProperty("senderApiVersion", String)
    senderApiVersion: string;

    @JsonProperty("senderPackageName", String)
    senderPackageName: string;

    constructor() {
        super();
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
}

