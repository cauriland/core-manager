import "jest-extended";

import { Sandbox } from "@cauriland/core-test-framework";
import { Container } from "@cauriland/core-kernel";
import { Action } from "../../src/actions/info-core-version";
import { Identifiers } from "../../src/ioc";
import {readJSONSync} from "fs-extra";

jest.mock("fs-extra", () => {
    return {
        readJSONSync: jest.fn(),
    };
});

let sandbox: Sandbox;
let action: Action;

const mockCliConfig = {
    get: jest.fn().mockReturnValue("next"),
};

const mockCli = {
    resolve: jest.fn().mockReturnValue(mockCliConfig),
};

beforeEach(() => {
    sandbox = new Sandbox();

    sandbox.app.bind(Container.Identifiers.ApplicationVersion).toConstantValue("3.0.0");
    sandbox.app.bind(Identifiers.CLI).toConstantValue(mockCli);
    sandbox.app.bind(Identifiers.Version).toConstantValue("3.0.1");

    action = sandbox.app.resolve(Action);
});

describe("Info:CoreVersion", () => {
    it("should have name", () => {
        expect(action.name).toEqual("info.coreVersion");
    });

    it("should return current and latest version", async () => {
        readJSONSync
            .mockReturnValueOnce({ version: "3.0.0" }) // core-kernel
            .mockReturnValueOnce({ version: "3.0.2" }); // core-manager

        const promise = action.execute({});

        await expect(promise).toResolve();

        const result = await promise;

        await expect(result.currentVersion).toBe("3.0.0");
        await expect(result.installedVersion).toBe("3.0.0");
        await expect(result.latestVersion).toBeString();
        await expect(result.manager.currentVersion).toBe("3.0.1");
        await expect(result.manager.installedVersion).toBe("3.0.2");
        await expect(result.manager.latestVersion).toBeString();
    }, 10000);
});
