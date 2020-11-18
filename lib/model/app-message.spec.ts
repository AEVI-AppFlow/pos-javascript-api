import { AppMessage, InternalData } from './app-message';

describe('AppMessage', () => {
  it('should create an instance', () => {
    expect(new AppMessage()).toBeTruthy();
  });

  it('should serialise and deserialise correctly', () => {
    const internalData = new InternalData();
    internalData.senderApiVersion = '5.6.7';
    internalData.senderPackageName = 'com.me';
    internalData.additionalData.banana = 'ripe';
    const appMessage = AppMessage.from('blargh', 'bloop', internalData);

    const json = appMessage.toJson();
    console.log(json);
    const result = AppMessage.fromJson(json);

    expect(result.messageType).toBe('blargh');
    expect(result.messageData).toBe('bloop');
    expect(result.internalData).toBeTruthy();

    const intData = InternalData.fromJson(result.internalData);
    console.log(intData);

    expect(intData.additionalData.banana).toBe('ripe');
  });
});
