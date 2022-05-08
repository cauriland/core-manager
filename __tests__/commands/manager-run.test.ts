import { Command } from "../../src/commands/manager-run";
import { executeCommand } from "../__support__/app";

const app = {
    bootstrap: jest.fn(),
    boot: jest.fn(),
};

jest.mock("@cauriland/core-kernel", () => ({
    __esModule: true,
    Application: jest.fn(() => app),
    Container: {
        Container: jest.fn(),
    },
}));

beforeEach(() => {});

describe("RunCommand", () => {
    it("should throw if the process does not exist", async () => {
        const spyBootstrap = jest.spyOn(app, "bootstrap").mockImplementation(undefined);
        const spyBoot = jest.spyOn(app, "boot").mockImplementation(undefined);

        executeCommand(Command);

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });

        expect(spyBootstrap).toHaveBeenCalled();
        expect(spyBoot).toHaveBeenCalled();
    });
});
