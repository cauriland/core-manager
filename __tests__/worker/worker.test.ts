import * as GenerateLogFactory from "../../src/workers/generate-log-factory";

const mockGenerateLog = {
    execute: jest.fn(),
};
// @ts-ignore
GenerateLogFactory.generateLogFactory = jest.fn().mockReturnValue(mockGenerateLog);

describe("Worker", () => {
    it("should call generate log action", async () => {
        require("../../src/workers/worker");

        expect(mockGenerateLog.execute).toHaveBeenCalled();
    });
});
