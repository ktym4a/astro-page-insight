import { beforeEach, describe, expect, it } from "vitest";
import type {
	TestingEngineOptions,
	TestingEngineRunResult,
} from "../../src/engines/base.js";
import { EngineRegistry, TestingEngine } from "../../src/engines/index.js";

// Mock testing engine for tests
class MockEngine extends TestingEngine {
	readonly name = "mock";
	readonly categories = ["Mock Category"];

	async run(options: TestingEngineOptions): Promise<TestingEngineRunResult> {
		return {
			result: {
				elements: {},
				metaErrors: [],
				consoleErrors: [],
				scoreList: { "Mock Category": 1.0 },
				categoryCount: { "Mock Category": 0 },
			},
			formFactor: options.width <= options.breakPoint ? "mobile" : "desktop",
			rawResult: { mock: "data" },
		};
	}

	organizeResult() {
		return {
			elements: {},
			metaErrors: [],
			consoleErrors: [],
			scoreList: { "Mock Category": 1.0 },
			categoryCount: { "Mock Category": 0 },
		};
	}

	generateFileName(url: string): string {
		return "mock.json";
	}
}

class AnotherMockEngine extends TestingEngine {
	readonly name = "another";
	readonly categories = ["Another Category"];

	async run(options: TestingEngineOptions): Promise<TestingEngineRunResult> {
		return {
			result: {
				elements: {},
				metaErrors: [],
				consoleErrors: [],
				scoreList: { "Another Category": 0.8 },
				categoryCount: { "Another Category": 1 },
			},
			formFactor: "desktop",
			rawResult: { another: "data" },
		};
	}

	organizeResult() {
		return {
			elements: {},
			metaErrors: [],
			consoleErrors: [],
			scoreList: { "Another Category": 0.8 },
			categoryCount: { "Another Category": 1 },
		};
	}

	generateFileName(url: string): string {
		return "another.json";
	}
}

describe("EngineRegistry", () => {
	let registry: EngineRegistry;

	beforeEach(() => {
		registry = new EngineRegistry();
	});

	describe("initialization", () => {
		it("should register lighthouse engine by default", () => {
			const lighthouse = registry.get("lighthouse");
			expect(lighthouse).toBeDefined();
			expect(lighthouse?.name).toBe("lighthouse");
		});

		it("should have lighthouse in engine names", () => {
			const names = registry.getNames();
			expect(names).toContain("lighthouse");
		});

		it("should have lighthouse in all engines", () => {
			const engines = registry.getAll();
			expect(engines.some((engine) => engine.name === "lighthouse")).toBe(true);
		});
	});

	describe("register method", () => {
		it("should register a new engine", () => {
			const mockEngine = new MockEngine();
			registry.register(mockEngine);

			const retrieved = registry.get("mock");
			expect(retrieved).toBe(mockEngine);
		});

		it("should replace existing engine with same name", () => {
			const mockEngine1 = new MockEngine();
			const mockEngine2 = new MockEngine();

			registry.register(mockEngine1);
			registry.register(mockEngine2);

			const retrieved = registry.get("mock");
			expect(retrieved).toBe(mockEngine2);
		});

		it("should register multiple different engines", () => {
			const mockEngine = new MockEngine();
			const anotherEngine = new AnotherMockEngine();

			registry.register(mockEngine);
			registry.register(anotherEngine);

			expect(registry.get("mock")).toBe(mockEngine);
			expect(registry.get("another")).toBe(anotherEngine);
		});
	});

	describe("get method", () => {
		it("should return undefined for non-existent engine", () => {
			const result = registry.get("nonexistent");
			expect(result).toBeUndefined();
		});

		it("should return correct engine for valid name", () => {
			const mockEngine = new MockEngine();
			registry.register(mockEngine);

			const result = registry.get("mock");
			expect(result).toBe(mockEngine);
		});
	});

	describe("getAll method", () => {
		it("should return all registered engines", () => {
			const mockEngine = new MockEngine();
			const anotherEngine = new AnotherMockEngine();

			registry.register(mockEngine);
			registry.register(anotherEngine);

			const engines = registry.getAll();
			expect(engines).toHaveLength(3); // lighthouse + mock + another
			expect(engines).toContain(mockEngine);
			expect(engines).toContain(anotherEngine);
		});

		it("should return empty array for fresh registry without defaults", () => {
			// Create fresh registry without defaults
			const freshRegistry = new (class extends EngineRegistry {
				constructor() {
					super();
					// Clear the default lighthouse engine for this test
					this.engines.clear();
				}
			})();

			const engines = freshRegistry.getAll();
			expect(engines).toHaveLength(0);
		});
	});

	describe("getNames method", () => {
		it("should return all engine names", () => {
			const mockEngine = new MockEngine();
			const anotherEngine = new AnotherMockEngine();

			registry.register(mockEngine);
			registry.register(anotherEngine);

			const names = registry.getNames();
			expect(names).toHaveLength(3);
			expect(names).toContain("lighthouse");
			expect(names).toContain("mock");
			expect(names).toContain("another");
		});

		it("should return unique names only", () => {
			const mockEngine1 = new MockEngine();
			const mockEngine2 = new MockEngine();

			registry.register(mockEngine1);
			registry.register(mockEngine2); // Should replace, not duplicate

			const names = registry.getNames();
			const mockCount = names.filter((name) => name === "mock").length;
			expect(mockCount).toBe(1);
		});
	});

	describe("engine functionality", () => {
		it("should allow running registered engines", async () => {
			const mockEngine = new MockEngine();
			registry.register(mockEngine);

			const options: TestingEngineOptions = {
				url: "http://localhost:3000",
				width: 1024,
				height: 768,
				breakPoint: 767,
				weight: 2,
			};

			const engine = registry.get("mock");
			const result = await engine?.run(options);

			expect(result).toBeDefined();
			expect(result?.formFactor).toBe("desktop");
			expect(result?.result.scoreList).toEqual({ "Mock Category": 1.0 });
		});

		it("should maintain separate engine states", async () => {
			const mockEngine = new MockEngine();
			const anotherEngine = new AnotherMockEngine();

			registry.register(mockEngine);
			registry.register(anotherEngine);

			const options: TestingEngineOptions = {
				url: "http://localhost:3000",
				width: 1024,
				height: 768,
				breakPoint: 767,
				weight: 2,
			};

			const mockResult = await registry.get("mock")?.run(options);
			const anotherResult = await registry.get("another")?.run(options);

			expect(mockResult?.result.scoreList).toEqual({ "Mock Category": 1.0 });
			expect(anotherResult?.result.scoreList).toEqual({
				"Another Category": 0.8,
			});
		});
	});
});
