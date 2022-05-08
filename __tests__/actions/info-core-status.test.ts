import "jest-extended";

import { ProcessState } from "@cauriland/core-cli/dist/contracts";
import { Container } from "@cauriland/core-kernel";
import { Action } from "../../src/actions/info-core-status";
import { Identifiers } from "../../src/ioc";
import { HttpClient } from "../../src/utils/http-client";
import { Sandbox } from "@cauriland/core-test-framework";

let sandbox: Sandbox;
let action: Action;

let mockCli;
let mockProcessManager;

beforeEach(() => {
    mockProcessManager = {
        status: jest.fn().mockReturnValue(ProcessState.Online),
    };

    mockCli = {
        get: jest.fn().mockReturnValue(mockProcessManager),
    };

    HttpClient.prototype.get = jest.fn().mockReturnValue({
        data: {
            syncing: true,
        },
    });

    sandbox = new Sandbox();

    sandbox.app.bind(Container.Identifiers.ApplicationToken).toConstantValue("cauri");
    sandbox.app.bind(Identifiers.CLI).toConstantValue(mockCli);

    action = sandbox.app.resolve(Action);
});

afterEach(() => {
    delete process.env.CORE_API_DISABLED;
    jest.clearAllMocks();
});

describe("Info:CoreStatus", () => {
    it("should have name", () => {
        expect(action.name).toEqual("info.coreStatus");
    });

    it("should return status and syncing using HTTP", async () => {
        const promise = action.execute({});

        await expect(promise).toResolve();

        const result = await promise;

        expect(result).toEqual({ processStatus: "online", syncing: true });

        expect(mockProcessManager.status).toHaveBeenCalledWith("cauri-core");
    });

    it("should return status and syncing using HTTP when token is passed", async () => {
        const promise = action.execute({ token: "customToken" });

        await expect(promise).toResolve();

        const result = await promise;

        expect(result).toEqual({ processStatus: "online", syncing: true });

        expect(mockProcessManager.status).toHaveBeenCalledWith("customToken-core");
    });

    it("should return status and syncing using HTTPS", async () => {
        process.env.CORE_API_DISABLED = "true";

        const promise = action.execute({});

        await expect(promise).toResolve();

        const result = await promise;

        expect(result).toEqual({ processStatus: "online", syncing: true });
    });

    it("should return syncing = false if error on request", async () => {
        HttpClient.prototype.get = jest.fn().mockImplementation(async () => {
            throw new Error();
        });

        const promise = action.execute({});

        await expect(promise).toResolve();

        const result = await promise;

        expect(result).toEqual({ processStatus: "online", syncing: undefined });
    });

    it("should return status undefined if process status is undefined", async () => {
        mockCli.get = jest.fn().mockReturnValue({
            status: jest.fn().mockReturnValue(undefined),
        });

        const promise = action.execute({});

        await expect(promise).toResolve();

        const result = await promise;

        expect(result).toEqual({ processStatus: "undefined", syncing: true });
    });
});
