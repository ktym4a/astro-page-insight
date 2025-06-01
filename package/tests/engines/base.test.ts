import { beforeEach, describe, expect, it } from "vitest";
import { TestingEngine } from "../../src/engines/base.js";
import type {
	TestingEngineOptions,
	TestingEngineRunResult,
} from "../../src/engines/base.js";

// Concrete implementation for testing the abstract base class
class TestEngine extends TestingEngine {
	readonly name = "test";
	readonly categories = ["Test Category"];

	async run(options: TestingEngineOptions): Promise<TestingEngineRunResult> {
		return {
			result: {
				elements: {
					"test-selector": [
						{
							score: 0.5,
							scoreDisplayMode: "binary",
							title: "Test Audit",
							description: "Test description",
							categories: ["Test Category"],
							rect: { top: 0, left: 0, width: 100, height: 50 },
						},
					],
				},
				metaErrors: [
					{
						score: 0,
						scoreDisplayMode: "binary",
						title: "Meta Error",
						description: "Meta error description",
						categories: ["Test Category"],
						rect: { top: 0, left: 0, width: 0, height: 0 },
					},
				],
				consoleErrors: [
					{
						message: "Test console error",
						level: "error",
						content: "http://localhost:3000",
					},
				],
				scoreList: { "Test Category": 0.75 },
				categoryCount: { "Test Category": 2 },
			},
			formFactor: options.width <= options.breakPoint ? "mobile" : "desktop",
			rawResult: { test: "data" }, // Mock raw result
		};
	}

	organizeResult(rawResult: unknown, weight: number) {
		const mockResult = rawResult as { score: number };
		return {
			elements: {},
			metaErrors: [],
			consoleErrors: [],
			scoreList: { "Test Category": mockResult.score },
			categoryCount: { "Test Category": 1 },
		};
	}

	generateFileName(url: string): string {
		const urlObj = new URL(url);
		return `${urlObj.pathname.replace(/\//g, "-").replace(/^-|-$/g, "") || "index"}.json`;
	}
}

describe("TestingEngine", () => {
	let engine: TestEngine;

	beforeEach(() => {
		engine = new TestEngine();
	});

	describe("abstract properties", () => {
		it("should implement name property", () => {
			expect(engine.name).toBe("test");
		});

		it("should implement categories property", () => {
			expect(engine.categories).toEqual(["Test Category"]);
		});
	});

	describe("abstract methods", () => {
		it("should implement run method", async () => {
			const options: TestingEngineOptions = {
				url: "http://localhost:3000",
				width: 1024,
				height: 768,
				breakPoint: 767,
				weight: 2,
			};

			const result = await engine.run(options);

			expect(result).toBeDefined();
			expect(result.formFactor).toBe("desktop");
			expect(result.result).toHaveProperty("elements");
			expect(result.result).toHaveProperty("metaErrors");
			expect(result.result).toHaveProperty("consoleErrors");
			expect(result.result).toHaveProperty("scoreList");
			expect(result.result).toHaveProperty("categoryCount");
		});

		it("should detect mobile form factor correctly", async () => {
			const options: TestingEngineOptions = {
				url: "http://localhost:3000",
				width: 375,
				height: 667,
				breakPoint: 767,
				weight: 2,
			};

			const result = await engine.run(options);
			expect(result.formFactor).toBe("mobile");
		});

		it("should implement organizeResult method", () => {
			const mockRawResult = { score: 0.85 };
			const result = engine.organizeResult(mockRawResult, 50);

			expect(result).toHaveProperty("elements");
			expect(result).toHaveProperty("metaErrors");
			expect(result).toHaveProperty("consoleErrors");
			expect(result).toHaveProperty("scoreList");
			expect(result).toHaveProperty("categoryCount");
			expect(result.scoreList["Test Category"]).toBe(0.85);
		});

		it("should implement generateFileName method", () => {
			const fileName = engine.generateFileName("http://localhost:3000/about");
			expect(fileName).toBe("about.json");
		});
	});

	describe("default implementations", () => {
		describe("serializeResult", () => {
			it("should serialize object to JSON string", () => {
				const testObject = { key: "value", number: 42, nested: { prop: true } };
				const serialized = engine.serializeResult(testObject);

				expect(serialized).toBe(JSON.stringify(testObject));
				expect(typeof serialized).toBe("string");
			});

			it("should handle null and undefined", () => {
				expect(engine.serializeResult(null)).toBe("null");
				expect(engine.serializeResult(undefined)).toBe(undefined);
			});

			it("should handle arrays", () => {
				const testArray = [1, 2, 3, { key: "value" }];
				const serialized = engine.serializeResult(testArray);

				expect(serialized).toBe(JSON.stringify(testArray));
			});

			it("should handle primitive values", () => {
				expect(engine.serializeResult("string")).toBe('"string"');
				expect(engine.serializeResult(123)).toBe("123");
				expect(engine.serializeResult(true)).toBe("true");
			});
		});

		describe("deserializeResult", () => {
			it("should deserialize JSON string to object", () => {
				const testObject = { key: "value", number: 42, nested: { prop: true } };
				const serialized = JSON.stringify(testObject);
				const deserialized = engine.deserializeResult(serialized);

				expect(deserialized).toEqual(testObject);
			});

			it("should handle null and primitive values", () => {
				expect(engine.deserializeResult("null")).toBeNull();
				expect(engine.deserializeResult('"string"')).toBe("string");
				expect(engine.deserializeResult("123")).toBe(123);
				expect(engine.deserializeResult("true")).toBe(true);
			});

			it("should handle arrays", () => {
				const testArray = [1, 2, 3, { key: "value" }];
				const serialized = JSON.stringify(testArray);
				const deserialized = engine.deserializeResult(serialized);

				expect(deserialized).toEqual(testArray);
			});

			it("should throw error for invalid JSON", () => {
				expect(() => {
					engine.deserializeResult("invalid json");
				}).toThrow();
			});
		});

		describe("round-trip serialization", () => {
			it("should maintain data integrity through serialize/deserialize cycle", () => {
				const testData = {
					string: "test",
					number: 42,
					boolean: true,
					null: null,
					array: [1, 2, 3],
					nested: {
						prop: "value",
						deep: { level: 2 },
					},
				};

				const serialized = engine.serializeResult(testData);
				const deserialized = engine.deserializeResult(serialized);

				expect(deserialized).toEqual(testData);
			});
		});
	});

	describe("result structure", () => {
		it("should return properly structured result from run method", async () => {
			const options: TestingEngineOptions = {
				url: "http://localhost:3000/test",
				width: 1024,
				height: 768,
				breakPoint: 767,
				weight: 2,
			};

			const result = await engine.run(options);

			// Check elements structure
			expect(result.result.elements).toHaveProperty("test-selector");
			const element = result.result.elements["test-selector"][0];
			expect(element).toMatchObject({
				score: expect.any(Number),
				scoreDisplayMode: expect.any(String),
				title: expect.any(String),
				description: expect.any(String),
				categories: expect.any(Array),
				rect: expect.objectContaining({
					top: expect.any(Number),
					left: expect.any(Number),
					width: expect.any(Number),
					height: expect.any(Number),
				}),
			});

			// Check metaErrors structure
			expect(result.result.metaErrors).toHaveLength(1);
			const metaError = result.result.metaErrors[0];
			expect(metaError).toMatchObject({
				score: expect.any(Number),
				scoreDisplayMode: expect.any(String),
				title: expect.any(String),
				description: expect.any(String),
				categories: expect.any(Array),
			});

			// Check consoleErrors structure
			expect(result.result.consoleErrors).toHaveLength(1);
			const consoleError = result.result.consoleErrors[0];
			expect(consoleError).toMatchObject({
				message: expect.any(String),
				level: expect.any(String),
				content: expect.any(String),
			});

			// Check scoreList and categoryCount
			expect(result.result.scoreList).toEqual(
				expect.objectContaining({
					"Test Category": expect.any(Number),
				}),
			);
			expect(result.result.categoryCount).toEqual(
				expect.objectContaining({
					"Test Category": expect.any(Number),
				}),
			);
		});
	});
});
