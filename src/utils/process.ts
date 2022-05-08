import { Services } from "@cauriland/core-cli";

export const getOnlineProcesses = (processManager: Services.ProcessManager): { name: string }[] => {
    return processManager.list().filter((x) => processManager.isOnline(x.name)) as [{ name: string }];
};

export const getCoreOrForgerProcessName = (processes: { name: string }[], token: string = "cauri") => {
    const process = processes.find((x) => x.name === `${token}-forger` || x.name === `${token}-core`);

    if (!process) {
        throw new Error("Process with name cauri-forger or cauri-core is not online");
    }

    return process.name;
};
