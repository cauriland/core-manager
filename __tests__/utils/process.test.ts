import "jest-extended";

import { getCoreOrForgerProcessName, getOnlineProcesses } from "../../src/utils/process";

let processManager;
const processes = [{ name: "cauri-core" }, { name: "cauri-forger" }, { name: "cauri-relay" }];

beforeEach(() => {
    processManager = {
        list: jest.fn().mockReturnValue(processes),
        isOnline: jest.fn().mockReturnValue(true),
    };
});

describe("getOnlineProcesses", () => {
    it("should filter online processes", async () => {
        expect(getOnlineProcesses(processManager)).toEqual(processes);
    });
});

describe("getCoreOrForgerProcessName", () => {
    it("should return cauri-core", async () => {
        expect(getCoreOrForgerProcessName(processes)).toEqual("cauri-core");
    });

    it("should throw error if cauri-core or cauri-forger is not online process", async () => {
        expect(() => {
            getCoreOrForgerProcessName([]);
        }).toThrowError("Process with name cauri-forger or cauri-core is not online");
    });
});
