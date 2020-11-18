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
export class JsonOption {
  public value: any;

  public type?: string;

  public static from(value: any, type?: string): JsonOption {
    const jo = new JsonOption();
    if (type) {
      jo.type = type;
    } else {
      jo.type = this.getAppFlowJavaObject(value);
    }
    jo.value = value;
    return jo;
  }

  private static getAppFlowJavaObject(value: any): string {
    const type = Object(value) === value ? value.constructor.name : typeof (value);
    switch (type) {
      case 'AdditionalData':
      case 'Customer':
      case 'Device':
      case 'FlowEvent':
      case 'FlowException':
      case 'Request':
      case 'Response':
      case 'ResponseQuery':
      case 'Token':
        return `com.aevi.sdk.flow.model.${type}`;
      case 'Amount':
      case 'Amounts':
      case 'Basket':
      case 'BasketItem':
      case 'BasketItemModifier':
      case 'Card':
      case 'FlowAppInfo':
      case 'Measurement':
      case 'Merchant':
      case 'Payment':
      case 'PaymentFlowServiceInfo':
      case 'PaymentFlowServices':
      case 'PaymentResponse':
      case 'RoundingStrategy':
      case 'Transaction':
      case 'TransactionRequest':
      case 'TransactionResponse':
        return `com.aevi.sdk.pos.flow.model.${type}`;
      case 'ConfirmationRequest':
      case 'ConfirmationResponse':
      case 'FinalAmountRequest':
      case 'FinalAmountResponse':
      case 'NotifyAction':
      case 'ProgressMessage':
        return `com.aevi.sdk.pos.flow.model.event.${type}`;
      case 'number': return 'java.lang.Long';
      case 'string': return 'java.lang.String';
      case 'boolean': return 'java.lang.Boolean';
      default:
      case 'any': return 'java.lang.Object';
    }
  }

  public static isPrimative(javaType: string): boolean {
    switch (javaType) {
      case 'java.lang.Boolean':
      case 'java.lang.Long':
      case 'java.lang.Integer':
      case 'java.lang.Float':
      case 'java.lang.Double':
      case 'java.lang.String':
      case 'java.lang.Short':
      case 'java.lang.Char':
        return true;
      default:
        return false;
    }
  }
}
