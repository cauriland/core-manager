import "jest-extended";

import { Container } from "@cauriland/core-kernel";
import { Action } from "../../src/actions/info-current-delegate";
import { Identifiers } from "../../src/ioc";
import { Utils } from "../../src/utils";
import { Sandbox } from "@cauriland/core-test-framework";

import { TriggerResponses } from "../__fixtures__";

let sandbox: Sandbox;
let action: Action;

let mockCli;
let mockTrigger;
let spyOnGetCoreOrForgerProcessName;

beforeEach(() => {
    spyOnGetCoreOrForgerProcessName = jest.spyOn(Utils, "getCoreOrForgerProcessName").mockReturnValue("cauri-core");
    jest.spyOn(Utils, "getOnlineProcesses").mockReturnValue([]);

    mockTrigger = jest.fn().mockReturnValue({
        stdout: TriggerResponses.forgetCurrentDelegateResponse,
    });

    mockCli = {
        get: jest.fn().mockReturnValue({
            trigger: mockTrigger,
        }),
    };

    sandbox = new Sandbox();

    sandbox.app.bind(Container.Identifiers.ApplicationToken).toConstantValue("cauri");
    sandbox.app.bind(Identifiers.CLI).toConstantValue(mockCli);

    action = sandbox.app.resolve(Action);
});

afterEach(() => {
    delete process.env.CORE_API_DISABLED;
    jest.clearAllMocks();
});

describe("Info:CurrentDelegate", () => {
    it("should have name", () => {
        expect(action.name).toEqual("info.currentDelegate");
    });

    it("should return current delegate", async () => {
        const result = await action.execute({});

        expect(result).toEqual({ rank: 16, username: "genesis_25" });

        expect(spyOnGetCoreOrForgerProcessName).toHaveBeenCalledWith([], "cauri");
    });

    it("should return current delegate using token in params", async () => {
        const result = await action.execute({ token: "customToken" });

        expect(result).toEqual({ rank: 16, username: "genesis_25" });

        expect(spyOnGetCoreOrForgerProcessName).toHaveBeenCalledWith([], "customToken");
    });

    it("should throw error if trigger responded with error", async () => {
        mockTrigger = jest.fn().mockReturnValue({
            stdout: TriggerResponses.forgetCurrentDelegateError,
        });

        mockCli.get = jest.fn().mockReturnValue({
            trigger: mockTrigger,
        });

        await expect(action.execute({})).rejects.toThrow("Trigger returned error");
    });
});
