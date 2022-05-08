import { Commands, Container, Contracts, Utils } from "@cauriland/core-cli";
import { Networks } from "@cauriland/crypto";
import Joi from "joi";

/**
 * @export
 * @class Command
 * @extends {Commands.Command}
 */
@Container.injectable()
export class Command extends Commands.Command {
    /**
     * The console command signature.
     *
     * @type {string}
     * @memberof Command
     */
    public signature: string = "manager:start";

    /**
     * The console command description.
     *
     * @type {string}
     * @memberof Command
     */
    public description: string = "Start the Manger process.";

    /**
     * Configure the console command.
     *
     * @returns {void}
     * @memberof Command
     */
    public configure(): void {
        this.definition
            .setFlag("token", "The name of the token.", Joi.string().default("cauri"))
            .setFlag("network", "The name of the network.", Joi.string().valid(...Object.keys(Networks)))
            .setFlag("env", "", Joi.string().default("production"))
            .setFlag("daemon", "Start the Core process as a daemon.", Joi.boolean().default(true));
    }

    /**
     * Execute the console command.
     *
     * @returns {Promise<void>}
     * @memberof Command
     */
    public async execute(): Promise<void> {
        const flags: Contracts.AnyObject = { ...this.getFlags() };

        this.actions.abortRunningProcess(`${flags.token}-manager`);

        await this.actions.daemonizeProcess(
            {
                name: `${flags.token}-manager`,
                script: require.main!.filename,
                args: `manager:run ${Utils.castFlagsToString(flags, ["daemon"])}`,
            },
            flags,
        );
    }
}
