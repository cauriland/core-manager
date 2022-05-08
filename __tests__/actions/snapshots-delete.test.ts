import "jest-extended";

import { Container } from "@cauriland/core-kernel";
import { Action } from "../../src/actions/snaphsots-delete";
import { Sandbox } from "@cauriland/core-test-framework";

let sandbox: Sandbox;
let action: Action;

let mockFilesystem;

beforeEach(() => {
    mockFilesystem = {
        exists: jest.fn().mockResolvedValue(true),
        delete: jest.fn().mockResolvedValue(true),
    };

    sandbox = new Sandbox();

    sandbox.app.bind(Container.Identifiers.FilesystemService).toConstantValue(mockFilesystem);

    action = sandbox.app.resolve(Action);
});

describe("Snapshots:Delete", () => {
    it("should have name", () => {
        expect(action.name).toEqual("snapshots.delete");
    });

    it("should delete snapshot", async () => {
        const result = await action.execute({ name: "1-10" });

        expect(result).toEqual({});
    });

    it("should throw error if snapshot is not found", async () => {
        mockFilesystem.exists = jest.fn().mockResolvedValue(false);

        await expect(action.execute({ name: "1-10" })).rejects.toThrow("Snapshot not found");
    });

    it("should throw error if snapshot is not deleted", async () => {
        mockFilesystem.delete = jest.fn().mockResolvedValue(false);

        await expect(action.execute({ name: "1-10" })).rejects.toThrow("Cannot delete snapshot");
    });
});
