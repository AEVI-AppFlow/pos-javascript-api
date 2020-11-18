# AppFlow Typescript Payment Initiation API

This project is a Typescript implementation of the original Java based AppFlow API.

It is intended to be a 1-to-1 mapping from the Java API so anyone switching from Java to Javascript should find this API extremely similar to use.

However, of course in some places the API has been adjusted to accomodate changes needed for either Typescript of Javascript.

This API itself contains only the models and API interfaces. It must be used in conjunction with an implementation of the API to be useful. For example you may choose to use the [AppFlow-Cordova-Plugin](https://github.com/AEVI-AppFlow/appflow-cordova-plugin) to add the API to your application.

## Integrate

This API is published to npm. To install the latest version into your project use

```
npm install appflow-payment-initiation-api
```

## Building

The API is written in Typescript and so can be built using `npm` and `tsc` the typescript complier.

```
npm run build
```

## Bugs and Feedback
For bugs, feature requests and questions please use GitHub Issues.

## Contributions
Contributions to any of our repos via pull requests are welcome. We follow the git flow branching model.

## LICENSE
Copyright 2020 AEVI International GmbH

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.