import "jest-extended";

import { ProcessState } from "@cauriland/core-cli/dist/contracts";
import { Action } from "../../src/actions/process.stop";
import { Identifiers } from "../../src/ioc";
import { Sandbox } from "@cauriland/core-test-framework";

let sandbox: Sandbox;
let action: Action;

let mockCli;
let mockProcessManagerStatus;

beforeEach(() => {
    mockProcessManagerStatus = ProcessState.Stopped;

    mockCli = {
        get: jest.fn().mockReturnValue({
            status: jest.fn().mockImplementation(() => {
                return mockProcessManagerStatus;
            }),
            stop: jest.fn(),
        }),
    };

    sandbox = new Sandbox();

    sandbox.app.bind(Identifiers.CLI).toConstantValue(mockCli);

    action = sandbox.app.resolve(Action);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Process:Stop", () => {
    it("should have name", () => {
        expect(action.name).toEqual("process.stop");
    });

    it("should return stopped process status", async () => {
        const result = await action.execute({ name: "cauri-core" });

        expect(result).toEqual({
            name: "cauri-core",
            status: "stopped",
        });
    });

    it("should return undefined status", async () => {
        mockProcessManagerStatus = undefined;

        const result = await action.execute({ name: "cauri-core" });

        expect(result).toEqual({
            name: "cauri-core",
            status: "undefined",
        });
    });
});
