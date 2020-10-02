import { AppMessage, InternalData } from './app-message';

describe('AppMessage', () => {
    it('should create an instance', () => {
      expect(new AppMessage()).toBeTruthy();
    });

    it('should serialise and deserialise correctly', () => {
        var internalData = new InternalData();
        internalData.senderApiVersion = "5.6.7";
        internalData.senderPackageName = "com.me";
        internalData.additionalData.banana = "ripe";
        var appMessage = AppMessage.from("blargh", "bloop", internalData);

        var json = appMessage.toJson();
        console.log(json);
        var result = AppMessage.fromJson(json);

        expect(result.messageType).toBe("blargh");
        expect(result.messageData).toBe("bloop");
        expect(result.internalData).toBeTruthy();

        var intData = InternalData.fromJson(result.internalData);
        console.log(intData);

        expect(intData.additionalData['banana']).toBe("ripe");

    });  
});