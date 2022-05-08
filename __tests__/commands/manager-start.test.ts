import { Container } from "@cauriland/core-cli";
import { Console } from "@cauriland/core-test-framework";
import { Command } from "../../src/commands/manager-start";
import os from "os";
import { dirSync, setGracefulCleanup } from "tmp";

let cli;
let processManager;
beforeEach(() => {
    process.env.CORE_PATH_CONFIG = dirSync().name;

    cli = new Console();
    processManager = cli.app.get(Container.Identifiers.ProcessManager);
});

afterAll(() => setGracefulCleanup());

describe("StartCommand", () => {
    it("should throw if the process does not exist", async () => {
        jest.spyOn(os, "freemem").mockReturnValue(99999999999);
        jest.spyOn(os, "totalmem").mockReturnValue(99999999999);

        const spyStart = jest.spyOn(processManager, "start").mockImplementation(undefined);

        await cli.execute(Command);

        expect(spyStart).toHaveBeenCalledWith(
            {
                args: "manager:run --token='cauri' --network='testnet' --v=0 --env='production'",
                env: {
                    CORE_ENV: "production",
                    NODE_ENV: "production",
                },
                name: "cauri-manager",
                node_args: undefined,
                script: __filename,
            },
            { "kill-timeout": 30000, "max-restarts": 5, name: "cauri-manager" },
        );
    });
});
