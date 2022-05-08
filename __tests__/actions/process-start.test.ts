import "jest-extended";

import { Action } from "../../src/actions/process-start";
import { Identifiers } from "../../src/ioc";
import { Sandbox } from "@cauriland/core-test-framework";

let sandbox: Sandbox;
let action: Action;

const mockCliManager = {
    runCommand: jest.fn(),
};

beforeEach(() => {
    sandbox = new Sandbox();

    sandbox.app.bind(Identifiers.CliManager).toConstantValue(mockCliManager);

    action = sandbox.app.resolve(Action);
});

afterEach(() => {
    delete process.env.CORE_API_DISABLED;
    jest.clearAllMocks();
});

describe("Process:Start", () => {
    it("should have name", () => {
        expect(action.name).toEqual("process.start");
    });

    it("should call start process", async () => {
        const result = await action.execute({ name: "core", args: "--network=testnet --env=test" });

        expect(result).toEqual({});
        expect(mockCliManager.runCommand).toHaveBeenCalledWith("core:start", "--network=testnet --env=test");
    });
});
