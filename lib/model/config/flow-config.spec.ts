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
import { FlowConfig } from "./flow-config";
import { FlowApp } from "./flow-app";

var flowConfig = FlowConfig.from("blarp", "river", 1, 2, "A description", "yes");
var apps = new Array<FlowApp>();

function setupDefaultApps()  {
    var app1 = getFlowApp("hydrogen");
    var app2 = getFlowApp("oxygen");
    apps.push(app1);
    apps.push(app2);

    flowConfig.setApps("cauliflower", apps);
    flowConfig.setApps("burps", apps);
    return apps;
}

function getFlowApp(id: string) {
    var fa = new FlowApp();
    fa.id = id;    
    return fa;
}

function checkAppNotReturned(stage: string, appId: string) {
    var app = flowConfig.getFlowApp(stage, appId);
    expect(app).toBeNull();
}

function checkAppNotReturnedFromStage(stage: string) {
    var app = flowConfig.getFirstAppForStage(stage);
    expect(app).toBeNull();
}

function checkHasAppForStage(stage: string, expected: boolean) {
    expect(flowConfig.hasAppForStage(stage)).toBe(expected);
}

describe('FlowConfig', () => {

    it('should create a flow config', () => {
        expect(new FlowConfig()).toBeTruthy();
    });

    it('can get apps for any stage', () => {
        var apps = flowConfig.getAppsForStage("sausage");

        expect(apps).toBeDefined();
        expect(apps.length).toBe(0);
    })

    it('can add stages', () => {
        flowConfig.setApps("cauliflower", new Array<FlowApp>());
        flowConfig.setApps("carrot", new Array<FlowApp>());

        var stages = flowConfig.getAllStageNames();
        expect(stages).toBeDefined();
        expect(stages).toHaveLength(2);
        expect(stages).toEqual(expect.arrayContaining(["CAULIFLOWER", "CARROT"]));
    });

    it('can add apps for stage', () => {
        setupDefaultApps();

        var result = flowConfig.getAppsForStage("cauliflower");
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result).toEqual(expect.arrayContaining(apps));
        expect(flowConfig.containsApp("hydrogen")).toBeTruthy();
        expect(flowConfig.containsApp("oxygen")).toBeTruthy();
        expect(flowConfig.containsApp("helium")).toBeFalsy();

        var result2 = flowConfig.getAppsForStage("raddish");
        expect(result2).toBeDefined();
        expect(result2).toHaveLength(0);
    });

    it('check can get app for stage and will return first', () => {
        setupDefaultApps();

        var app = flowConfig.getFirstAppForStage("cauliflower");

        expect(app).toBeDefined();
        expect(app.id).toBe("hydrogen");
    });

    it('check can get app for specific stage', () => {
        setupDefaultApps();

        var app = flowConfig.getFlowApp("cauliflower", "hydrogen");

        expect(app).toBeDefined();
        expect(app.id).toBe("hydrogen");
    });

    it('check wont get app for specified stage if invalid', () => {
        setupDefaultApps();

        checkAppNotReturnedFromStage("raddish");
        checkAppNotReturnedFromStage("");
        checkAppNotReturnedFromStage(null);
    });

    it('check wont get app for specified stage is not present', () => {
        setupDefaultApps();

        checkAppNotReturned("cauliflower", "irridium");
        checkAppNotReturned("raddish", "hydrogen");
        checkAppNotReturned(null, "hydrogen");
        checkAppNotReturned("cauliflower", null);
        checkAppNotReturned("", "hydrogen");
        checkAppNotReturned("cauliflower", "");
    });
    
    it('check has app for specified stage', () => {
        setupDefaultApps();

        checkHasAppForStage("cauliflower", true);
        checkHasAppForStage("burps", true);
        checkHasAppForStage("", false);
        checkHasAppForStage(null, false);
    });
});