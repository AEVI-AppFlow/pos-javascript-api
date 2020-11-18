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
import { JsonConvert, OperationMode } from 'json2typescript';

const jsonConvert = new JsonConvert(OperationMode.ENABLE);

export class Jsonable {
  public toJson(): string {
    return JSON.stringify(jsonConvert.serialize(this));
  }

  public static baseFromJson<T>(json: string, classReference: { new (): T;}): T {
    const deserialised = JSON.parse(json);
    return this.baseFromJsonObject(deserialised, classReference);
  }

  public static baseFromJsonObject<T>(jsonObj: any, classReference: { new (): T;}): T {
    return jsonConvert.deserializeObject(jsonObj, classReference);
  }
}
