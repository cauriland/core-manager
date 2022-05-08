import { Application as Cli, Container as CliContainer, Services } from "@cauriland/core-cli";
import { Application, Container } from "@cauriland/core-kernel";

import { Actions } from "../contracts";
import { Identifiers } from "../ioc";
import { Utils } from "../utils";

interface Params {
    token: string;
}

@Container.injectable()
export class Action implements Actions.Action {
    @Container.inject(Container.Identifiers.Application)
    private readonly app!: Application;

    public name = "info.nextForgingSlot";

    public schema = {
        type: "object",
        properties: {
            token: {
                type: "string",
            },
        },
    };

    public async execute(params: Partial<Params>): Promise<any> {
        params = {
            token: this.app.token(),
            ...params,
        };

        return await this.getNextForgingSlot(params.token!);
    }

    private async getNextForgingSlot(token: string): Promise<any> {
        const cli = this.app.get<Cli>(Identifiers.CLI);

        const processManager = cli.get<Services.ProcessManager>(CliContainer.Identifiers.ProcessManager);

        const processName = Utils.getCoreOrForgerProcessName(Utils.getOnlineProcesses(processManager), token);

        const response = await processManager.trigger(processName, "forger.nextSlot");

        const result = Utils.parseProcessActionResponse(response);

        if (result.error) {
            throw new Error("Trigger returned error");
        }

        return result.response;
    }
}
