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
export class PreConditions {
  private PreConditions() {
  }

  public static checkState(check: boolean, message: string) {
    if (!check) {
      throw new InvalidArgumentError(message);
    }
  }

  public static checkArgument(check: boolean, message: string) {
    if (!check) {
      throw new InvalidArgumentError(message);
    }
  }

  public static checkNotNull(object: any, message: string) {
    if (object == null) {
      throw new InvalidArgumentError(message);
    }
  }

  public static checkStringNotEmpty(str: string, message: string) {
    if (str == null || str === '') {
      throw new InvalidArgumentError(message);
    }
  }

  public static checkNotEmpty(array: any[], message: string) {
    if (array == null || array.length === 0) {
      throw new InvalidArgumentError(message);
    }
  }

  public static checkNotNegative(number: number, message: string) {
    if (number < 0) {
      throw new InvalidArgumentError(message);
    }
  }
}

export class InvalidArgumentError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = InvalidArgumentError.name;
  }
}
