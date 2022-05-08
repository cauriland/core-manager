import "jest-extended";

import { Action } from "../../src/actions/plugin-remove";
import { Identifiers } from "../../src/ioc";
import { Sandbox } from "@cauriland/core-test-framework";
import { Container } from "@cauriland/core-kernel";

let sandbox: Sandbox;
let action: Action;

let mockProcessManager;
const token = "cauri";
const network = "testnet";
const name = "@cauriland/core-manager";

beforeEach(() => {
    mockProcessManager = {
        remove: jest.fn(),
    };

    const mockCli = {
        get: jest.fn().mockReturnValue(mockProcessManager),
    };

    sandbox = new Sandbox();

    sandbox.app.bind(Identifiers.CLI).toConstantValue(mockCli);
    sandbox.app.bind(Container.Identifiers.ApplicationToken).toConstantValue(token);
    sandbox.app.bind(Container.Identifiers.ApplicationNetwork).toConstantValue(network);

    action = sandbox.app.resolve(Action);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Process:List", () => {
    it("should have name", () => {
        expect(action.name).toEqual("plugin.remove");
    });

    it("should return plugin list", async () => {
        const promise = action.execute({ name });

        const result = await promise;

        expect(result).toEqual({});
        expect(mockProcessManager.remove).toHaveBeenCalledWith(token, network, name);
    });
});
