import * as Cli from "@cauriland/core-cli";
import { Application, Container } from "@cauriland/core-kernel";
import { readJSONSync } from "fs-extra";
import latestVersion from "latest-version";
import { join } from "path";

import { Actions } from "../contracts";
import { Identifiers } from "../ioc";

@Container.injectable()
export class Action implements Actions.Action {
    @Container.inject(Container.Identifiers.Application)
    private readonly app!: Application;

    @Container.inject(Identifiers.CLI)
    private readonly cli!: Cli.Application;

    @Container.inject(Identifiers.Version)
    private readonly currentManagerVersion!: string;

    public name = "info.coreVersion";

    public async execute(params: object): Promise<any> {
        return {
            currentVersion: this.app.version(),
            installedVersion: this.getInstalledVersion(),
            latestVersion: await this.getLatestVersion(),
            manager: {
                currentVersion: this.currentManagerVersion,
                installedVersion: this.getInstalledManagerVersion(),
                latestVersion: await this.getLatestManagerVersion(),
            },
        };
    }

    private async getLatestVersion(): Promise<string> {
        return latestVersion("@cauriland/core", {
            version: this.getChannel(),
        });
    }

    private getInstalledVersion(): string {
        return readJSONSync(require.resolve("@cauriland/core-kernel/package.json")).version;
    }

    private async getLatestManagerVersion(): Promise<string> {
        return latestVersion("@cauriland/core-manager");
    }

    private getInstalledManagerVersion(): string {
        return readJSONSync(join(__dirname, "../../package.json")).version;
    }

    private getChannel(): string {
        return this.cli.resolve(Cli.Services.Config).get("channel");
    }
}
