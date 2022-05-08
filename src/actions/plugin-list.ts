import { Application as Cli, Container as CliContainer, Contracts } from "@cauriland/core-cli";
import { Container } from "@cauriland/core-kernel";

import { Actions } from "../contracts";
import { Identifiers } from "../ioc";

@Container.injectable()
export class Action implements Actions.Action {
    @Container.inject(Container.Identifiers.ApplicationToken)
    private readonly token!: string;

    @Container.inject(Container.Identifiers.ApplicationNetwork)
    private readonly network!: string;

    @Container.inject(Identifiers.CLI)
    private readonly cli!: Cli;

    public name = "plugin.list";

    public async execute(params: any): Promise<any> {
        const pluginManager = this.cli.get<Contracts.PluginManager>(CliContainer.Identifiers.PluginManager);

        return (await pluginManager.list(this.token, this.network)).map((plugin) => {
            return {
                version: plugin.version,
                name: plugin.name,
            };
        });
    }
}
