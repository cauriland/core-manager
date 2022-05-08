import "jest-extended";

import { Container } from "@cauriland/core-kernel";
import { Identifiers } from "../../../src/ioc/identifiers";
import { SimpleTokenValidator } from "../../../src/server/validators/token";
import { Sandbox } from "@cauriland/core-test-framework";

let sandbox: Sandbox;
let validator;

let mockToken: string | undefined = "dummy_token";
const mockPluginConfiguration = {
    get: jest.fn().mockImplementation(() => {
        return mockToken;
    }),
};

beforeEach(() => {
    sandbox = new Sandbox();

    sandbox.app.bind(Container.Identifiers.PluginConfiguration).toConstantValue(mockPluginConfiguration);
    sandbox.app.bind(Identifiers.TokenValidator).to(SimpleTokenValidator);

    validator = sandbox.app.get(Identifiers.TokenValidator);
});

describe("SimpleTokenValidator", () => {
    it("should be valid", async () => {
        await expect(validator.validate("dummy_token")).resolves.toBeTrue();
    });

    it("should be invalid if token is invalid", async () => {
        await expect(validator.validate("invalid token")).resolves.toBeFalse();
    });

    it("should be invalid if token is not set", async () => {
        mockToken = undefined;

        await expect(validator.validate("dummy_token")).resolves.toBeFalse();
    });
});
