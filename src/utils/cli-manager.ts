import * as Cli from "@cauriland/core-cli";
import { Container } from "@cauriland/core-kernel";
import { dirname, join } from "path";
import parseArgvString from "string-to-argv";

import { Identifiers } from "../ioc";

@Container.injectable()
export class CliManager {
    @Container.inject(Identifiers.CLI)
    private readonly cli!: Cli.Application;

    public async runCommand(name: string, args: string = ""): Promise<void> {
        const commands = this.discoverCommands();

        const command: Cli.Commands.Command = commands[name];

        if (!command) {
            throw new Error(`Command ${name} does not exists.`);
        }

        const argv = parseArgvString(args);

        if (argv.length === 0) {
            argv.push("");
        }

        argv.unshift(name);

        command.register(argv);

        await command.run();
    }

    private discoverCommands(): Cli.Contracts.CommandList {
        const discoverer = this.cli.resolve(Cli.Commands.DiscoverCommands);
        return discoverer.within(join(dirname(require.resolve("@cauriland/core")), "commands"));
    }
}
