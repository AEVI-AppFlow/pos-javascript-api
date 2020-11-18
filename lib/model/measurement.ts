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
import { JsonObject, JsonProperty } from 'json2typescript';

/**
 * Represents a measurement with a value and unit.
 *
 * Examples are "2.5 kilograms" or "13.45 feet".
 */
@JsonObject
export class Measurement {
  @JsonProperty('value')
  value: number = undefined;

  @JsonProperty('unit')
  unit: string = undefined;

  /**
     * Create and return a measuremnet object from the values given
     *
     * @param value The amount the measurement represents (can be a float if required)
     * @param unit The unit of measurement e.g g, kg, m, cm, mm
     *
     * @returns The newly created measurement object
     */
  public static from(value: number, unit: string): Measurement {
    const m = new Measurement();
    m.value = value;
    m.unit = unit;
    return m;
  }
}
