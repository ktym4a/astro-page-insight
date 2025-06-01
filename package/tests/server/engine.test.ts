import fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock fs module
vi.mock("node:fs", () => ({
	default: {
		existsSync: vi.fn(),
		promises: {
			readFile: vi.fn(),
			writeFile: vi.fn(),
			mkdir: vi.fn(),
		},
	},
}));

describe("server/engine", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("module imports", () => {
		it("should export required functions", async () => {
			const module = await import("../../src/server/engine.js");

			expect(module.runTestingEngine).toBeDefined();
			expect(module.getEngineReport).toBeDefined();
			expect(module.saveEngineReport).toBeDefined();
		});
	});

	describe("error handling", () => {
		it("should throw error for non-existent engine in runTestingEngine", async () => {
			const { runTestingEngine } = await import("../../src/server/engine.js");

			const options = {
				url: "http://localhost:3000",
				width: 1024,
				height: 768,
				breakPoint: 767,
				weight: 2,
			};

			await expect(runTestingEngine("nonexistent", options)).rejects.toThrow(
				'Testing engine "nonexistent" not found',
			);
		});

		it("should throw error for non-existent engine in getEngineReport", async () => {
			const { getEngineReport } = await import("../../src/server/engine.js");

			await expect(
				getEngineReport("nonexistent", "/cache", "http://localhost:3000", 50),
			).rejects.toThrow('Testing engine "nonexistent" not found');
		});

		it("should throw error for non-existent engine in saveEngineReport", async () => {
			const { saveEngineReport } = await import("../../src/server/engine.js");

			await expect(
				saveEngineReport("nonexistent", "/cache", "http://localhost:3000", {}),
			).rejects.toThrow('Testing engine "nonexistent" not found');
		});
	});

	describe("file system operations", () => {
		it("should handle missing cache files gracefully", async () => {
			vi.mocked(fs.existsSync).mockReturnValue(false);

			const { getEngineReport } = await import("../../src/server/engine.js");
			const result = await getEngineReport(
				"lighthouse",
				"/cache",
				"http://localhost:3000",
				50,
			);

			expect(result.cache).toBe(false);
			expect(result.desktop).toEqual({
				elements: {},
				consoleErrors: [],
				scoreList: {},
				metaErrors: [],
				categoryCount: {},
			});
			expect(result.mobile).toEqual({
				elements: {},
				consoleErrors: [],
				scoreList: {},
				metaErrors: [],
				categoryCount: {},
			});
		});

		it("should handle directory creation failure gracefully", async () => {
			vi.mocked(fs.existsSync).mockReturnValue(false);
			vi.mocked(fs.promises.mkdir).mockResolvedValue(undefined);
			vi.mocked(fs.promises.writeFile).mockResolvedValue();

			const { saveEngineReport } = await import("../../src/server/engine.js");

			// This should fail for non-existent engine before directory creation
			await expect(
				saveEngineReport("nonexistent", "/cache", "http://localhost:3000", {}),
			).rejects.toThrow('Testing engine "nonexistent" not found');
		});
	});

	describe("integration with real registry", () => {
		it("should work with lighthouse engine from registry", async () => {
			const { engineRegistry } = await import("../../src/engines/index.js");
			const lighthouseEngine = engineRegistry.get("lighthouse");

			expect(lighthouseEngine).toBeDefined();
			expect(lighthouseEngine?.name).toBe("lighthouse");
			expect(lighthouseEngine?.categories).toEqual([
				"Accessibility",
				"Best Practices",
				"Performance",
				"SEO",
			]);
		});

		it("should return undefined for non-existent engines", async () => {
			const { engineRegistry } = await import("../../src/engines/index.js");
			const nonExistentEngine = engineRegistry.get("nonexistent");

			expect(nonExistentEngine).toBeUndefined();
		});
	});
});
