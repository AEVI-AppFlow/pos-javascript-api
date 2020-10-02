import { CloudFlowMessage } from './cloud-flow-message';
import { Payment } from './payment';

describe('CloudFlowMessage', () => {
    it('should create an instance', () => {
      expect(new CloudFlowMessage()).toBeTruthy();
    });

    it('should serialise and deserialise correctly', () => {
        var cfm = new CloudFlowMessage();
        cfm.source = "5675856";
        cfm.type = "cheese";
        cfm.target = "5675856";
        cfm.version = "5675856";
        cfm.originatingRequestId = "5675856";
        cfm.payload = new Payment();

        var json = cfm.toJson();
        console.log(json);
        var result = CloudFlowMessage.fromJson(json);

        expect(result.source).toBe("5675856");
        expect(result.target).toBe("5675856");
        expect(result.type).toBe("cheese");
        expect(result.version).toBe("5675856");
        expect(result.originatingRequestId).toBe("5675856");
        expect(result.payload).toBeTruthy();
    });  
});