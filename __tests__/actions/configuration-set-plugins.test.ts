import "jest-extended";

import { Action } from "../../src/actions/configuration-set-plugins";
import { Sandbox } from "@cauriland/core-test-framework";

let sandbox: Sandbox;
let action: Action;
import fs from "fs-extra";

const writeJSONSync = jest.spyOn(fs, "writeJSONSync").mockImplementation();

beforeEach(() => {
    sandbox = new Sandbox();

    action = sandbox.app.resolve(Action);

    sandbox.app.configPath = jest.fn().mockReturnValue("/path/to/file");
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Configuration:SetPlugins", () => {
    it("should have name", () => {
        expect(action.name).toEqual("configuration.setPlugins");
    });

    it("should validate and save configuration", async () => {
        const params = { core: { plugins: [{ package: "@cauriland/core-manager" }] } };

        const result = await action.execute(params);

        expect(result).toEqual({});
        expect(writeJSONSync).toHaveBeenCalledWith("/path/to/file", params, { spaces: 4 });
    });

    it("should throw error - content cannot be resolved", async () => {
        const params = "invalid_params";
        await expect(action.execute(params)).rejects.toThrow("Content cannot be resolved");

        expect(writeJSONSync).not.toHaveBeenCalled();
    });

    it("should throw error - plugins keys are missing", async () => {
        const params = { core: {} };
        await expect(action.execute(params)).rejects.toThrow("core plugins array is missing");

        expect(writeJSONSync).not.toHaveBeenCalled();
    });

    it("should throw error - plugin is not a string", async () => {
        const params = { core: { plugins: [{ package: 123 }] } };
        await expect(action.execute(params)).rejects.toThrow("Package is not a string");

        expect(writeJSONSync).not.toHaveBeenCalled();
    });
});
