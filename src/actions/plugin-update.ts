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

    public name = "plugin.update";

    public schema = {
        type: "object",
        properties: {
            name: {
                type: "string",
            },
        },
        required: ["name"],
    };

    public async execute(params: { name: string }): Promise<any> {
        const pluginManager = this.cli.get<Contracts.PluginManager>(CliContainer.Identifiers.PluginManager);

        await pluginManager.update(this.token, this.network, params.name);

        return {};
    }
}
