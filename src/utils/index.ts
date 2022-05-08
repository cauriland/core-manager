import { getConnectionData } from "./api-connection";
import { HttpClient } from "./http-client";
import { getCoreOrForgerProcessName, getOnlineProcesses } from "./process";
import { parseProcessActionResponse } from "./process-actions";

export const Utils: Record<string, any> = {
    getConnectionData,
    getCoreOrForgerProcessName,
    getOnlineProcesses,
    HttpClient,
    parseProcessActionResponse,
};
