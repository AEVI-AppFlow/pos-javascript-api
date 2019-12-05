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
import { JsonObject, JsonProperty } from "json2typescript";

import { FlowStage, AppExecutionType } from "./flow-stage";
import { FlowApp } from "./flow-app";
import { FlowStages } from "../constants";

import { Jsonable } from "../jsonable";

const REQUEST_CLASS_GENERIC = "generic";
const REQUEST_CLASS_PAYMENT = "payment";

@JsonObject
export class FlowConfig {

    @JsonProperty("name")
    name: string = undefined;

    @JsonProperty("type")
    type: string = undefined;

    @JsonProperty("version")
    version: number = undefined;

    @JsonProperty("apiMajorVersion")
    apiMajorVersion: number = undefined;

    @JsonProperty("description", String, true)
    description: string = undefined;

    @JsonProperty("restrictedToApp", String, true)
    restrictedToApp: string = "";

    @JsonProperty("stages", [FlowStage])
    stages: Array<FlowStage> = [];

    @JsonProperty("processInBackground")
    processInBackground: boolean = false;

    @JsonProperty("generatedFromCustomType")
    generatedFromCustomType: boolean = false;

    private allStagesFlattened: Array<FlowStage>;
    private allStagesMap: Map<string, FlowStage>;

    constructor() {
        this.parseStageHierarchy();
    }

    private parseStageHierarchy() {
        this.allStagesFlattened = new Array<FlowStage>();
        this.allStagesMap = new Map<string, FlowStage>();
        this.getDeepStages(this.allStagesFlattened, this.stages);
    }

    private getDeepStages(allStages: Array<FlowStage>, toAdd: Array<FlowStage>) {
        if (toAdd != null) {
            for (let stage of toAdd) {
                allStages.push(stage);
                this.allStagesMap.set(this.normaliseStageName(stage.name), stage);
                if (stage.hasInnerFlow()) {
                    this.getDeepStages(allStages, stage.innerFlow.getStages(false));
                }
            }
        }
    }

    public static fromJson(json: string): FlowConfig {
        return Jsonable.baseFromJson(json, FlowConfig);
    }

    public static from(name: string, type: string, version: number, apiMajorVersion: number, description: string, restrictedToApp: string, stages?: Array<FlowStage>, processInBackground?: boolean) {
        var fc = new FlowConfig();
        fc.name = name;
        fc.type = type;
        fc.version = version;
        fc.apiMajorVersion = apiMajorVersion;
        fc.description = description;
        fc.restrictedToApp = restrictedToApp;
        if(stages) {
            fc.stages = stages;
        }
        if(processInBackground) {
            fc.processInBackground = processInBackground;
        }
        return fc;
    }

    /**
     * Check whether this flow has an app restriction defined or not.
     *
     * If there is an app restriction defined, this can be used to filter out configurations that should only be allowed for a certain client application.
     *
     * @return True if there is a filter, false otherwise
     */
    public hasAppRestriction(): boolean {
        return this.restrictedToApp != "";
    }

    /**
     * Verify whether a client app is allowed to read/initiate this flow configuration.
     *
     * @param clientPackageName The package name of the client application
     * @return True if the client app is allowed, false otherwise
     */
    public isClientAppAllowed(clientPackageName: string): boolean {
        return !this.hasAppRestriction() || this.restrictedToApp === clientPackageName;
    }

    /**
     * Get the stages for this flow.
     *
     * As stages can be nested (a stage can have an inner flow), the returned list can either be top level only or all stages flattened.
     *
     * @param flattened Set to true to get all the stages (top level and nested) in the returned list, or false if just to get top level
     * @return The stages for this flow
     */
    public getStages(flattened: boolean) : Array<FlowStage> {
        return flattened ? this.allStagesFlattened : this.stages;
    }

    /**
     * Get the request class for this flow, which indicates what type of request to use with it.
     *
     * If this flow is to be used by a {@link com.aevi.sdk.flow.model.Request}, then the return value will be {@link #REQUEST_CLASS_GENERIC}
     *
     * If this flow is to be used for a payment initiation, then the return value will be {@link #REQUEST_CLASS_PAYMENT}
     *
     * @return The request class for this flow
     */
    public getRequestClass(): string {
        return this.allStagesMap.has(this.normaliseStageName(FlowStages.TRANSACTION_PROCESSING)) ? REQUEST_CLASS_PAYMENT : REQUEST_CLASS_GENERIC;
    }

    public getAllStageNames(): Array<string> {
        return [...this.allStagesMap.keys()];
    }

    public getStage(stageName: string): FlowStage {
        return this.allStagesMap.get(this.normaliseStageName(stageName));
    }

    public hasStage(stage: string): boolean {
        return this.allStagesMap.has(this.normaliseStageName(stage));
    }

    public hasAppForStage(stage: string, appId?: string): boolean {
        stage = this.normaliseStageName(stage);
        if(appId) {
            return this.allStagesMap.has(stage) && this.scanAppList(this.allStagesMap.get(stage).flowApps, appId);
        } else {
            return this.allStagesMap.has(stage) && this.allStagesMap.get(stage).flowApps.length > 0;
        }
    }

    public getAppsForStage(stageName: string): Array<FlowApp> {
        if (this.hasStage(stageName)) {
            return this.getStage(stageName).flowApps;
        }
        return new Array();
    }

    public getFirstAppForStage(stageName: string): FlowApp {
        if (this.hasStage(stageName)) {
            var apps = this.getAppsForStage(stageName);
            if (apps.length > 0) {
                return apps[0];
            }
        }
        return null;
    }

    public containsApp(flowAppId: string): boolean {
        var found = false;
        for (let stage of this.getStages(true)) {
            found = found || this.scanAppList(stage.flowApps, flowAppId);
        }
        return found;
    }

    public getFlowApp(stage: string, appId: string): FlowApp {
        stage = this.normaliseStageName(stage);
        if (this.allStagesMap.has(stage)) {
            return this.findAppInList(this.allStagesMap.get(stage).flowApps, appId);
        }
        return null;
    }

    private findAppInList(apps: Array<FlowApp>, appId: string): FlowApp {
        if (apps != null) {
            for (let app of apps) {
                if (app.id === appId) {
                    return app;
                }
            }
        }
        return null;
    }

    private scanAppList(apps: Array<FlowApp>, appId: string): boolean {
        if (apps != null) {
            for (let app of apps) {
                if (app.id === appId) {
                    return true;
                }
            }
        }
        return false;
    }

    private normaliseStageName(stage: string): string {
        if (stage != null) {
            return stage.toUpperCase();
        }
        return null;
    }

    public setApps(stage: string, flowApps: Array<FlowApp>) {
        stage = this.normaliseStageName(stage);
        var flowStage = this.getStage(stage);
        if (flowStage == null) {
            flowStage = FlowStage.from(stage, AppExecutionType.MULTIPLE);
            flowStage.flowApps = flowApps;
            this.stages.push(flowStage);
            this.allStagesFlattened = null;
            this.allStagesMap = null;
            this.parseStageHierarchy();
        } else {
            flowStage.flowApps = flowApps;
        }
    }
}