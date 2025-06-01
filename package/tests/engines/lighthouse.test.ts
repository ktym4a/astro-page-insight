import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TestingEngineOptions } from "../../src/engines/base.js";
import { LighthouseEngine } from "../../src/engines/lighthouse/index.js";

// Mock puppeteer and lighthouse
vi.mock("puppeteer", () => ({
	default: {
		launch: vi.fn(() =>
			Promise.resolve({
				newPage: vi.fn(() => Promise.resolve({})),
				close: vi.fn(() => Promise.resolve()),
			}),
		),
	},
}));

vi.mock("lighthouse", () => ({
	default: vi.fn(() =>
		Promise.resolve({
			lhr: {
				categories: {
					accessibility: {
						title: "Accessibility",
						score: 0.95,
						auditRefs: [
							{ id: "color-contrast", weight: 3, acronym: "CC" },
							{ id: "alt-text", weight: 2 },
						],
					},
					performance: {
						title: "Performance",
						score: 0.85,
						auditRefs: [{ id: "largest-contentful-paint", weight: 25 }],
					},
				},
				audits: {
					"color-contrast": {
						id: "color-contrast",
						title: "Color contrast",
						description:
							"Background and foreground colors have sufficient contrast",
						score: 0.5,
						scoreDisplayMode: "binary",
						details: {
							type: "table",
							items: [
								{
									node: {
										path: "1,HTML,1,BODY,1,DIV",
										selector: "div.example",
										boundingRect: { top: 10, left: 20, width: 100, height: 50 },
									},
								},
							],
						},
					},
					"alt-text": {
						id: "alt-text",
						title: "Image alt text",
						description: "Images have alt text",
						score: 1,
						scoreDisplayMode: "binary",
					},
				},
			},
			artifacts: {
				ConsoleMessages: [
					{ level: "error", text: "Test error", url: "http://localhost:3000" },
					{ level: "warning", text: "Test warning" },
					{ level: "info", text: "Test info" },
				],
				Accessibility: {
					violations: [
						{
							id: "color-contrast",
							impact: "serious",
							nodes: [
								{
									node: {
										devtoolsNodePath: "1,HTML,1,BODY,1,DIV",
										selector: "div.violation",
										boundingRect: { top: 0, left: 0, width: 50, height: 25 },
									},
								},
							],
						},
					],
					incomplete: [
						{
							id: "alt-text",
							impact: "minor",
							nodes: [
								{
									node: {
										devtoolsNodePath: "1,HTML,1,BODY,1,IMG",
										selector: "img.incomplete",
										boundingRect: {
											top: 100,
											left: 100,
											width: 200,
											height: 150,
										},
									},
								},
							],
						},
					],
				},
			},
		}),
	),
}));

describe("LighthouseEngine", () => {
	let engine: LighthouseEngine;
	let mockOptions: TestingEngineOptions;

	beforeEach(() => {
		engine = new LighthouseEngine();
		mockOptions = {
			url: "http://localhost:3000",
			width: 1024,
			height: 768,
			breakPoint: 767,
			weight: 2,
		};
		vi.clearAllMocks();
	});

	describe("basic properties", () => {
		it("should have correct name", () => {
			expect(engine.name).toBe("lighthouse");
		});

		it("should have correct categories", () => {
			expect(engine.categories).toEqual([
				"Accessibility",
				"Best Practices",
				"Performance",
				"SEO",
			]);
		});
	});

	describe("run method", () => {
		it("should run lighthouse and return formatted results", async () => {
			const result = await engine.run(mockOptions);

			expect(result.formFactor).toBe("desktop");
			expect(result.result).toHaveProperty("elements");
			expect(result.result).toHaveProperty("metaErrors");
			expect(result.result).toHaveProperty("consoleErrors");
			expect(result.result).toHaveProperty("scoreList");
			expect(result.result).toHaveProperty("categoryCount");
		});

		it("should detect mobile form factor correctly", async () => {
			const mobileOptions = { ...mockOptions, width: 375 };
			const result = await engine.run(mobileOptions);

			expect(result.formFactor).toBe("mobile");
		});

		it("should filter console messages correctly", async () => {
			const result = await engine.run(mockOptions);

			expect(result.result.consoleErrors).toHaveLength(2);
			expect(result.result.consoleErrors[0]).toEqual({
				level: "error",
				message: "Test error",
				content: "http://localhost:3000/",
			});
			expect(result.result.consoleErrors[1]).toEqual({
				level: "warning",
				message: "Test warning",
				content: "",
			});
		});

		it("should process scoreList correctly", async () => {
			const result = await engine.run(mockOptions);

			expect(result.result.scoreList).toEqual({
				Accessibility: 0.95,
				Performance: 0.85,
			});
		});

		it("should process audit elements correctly", async () => {
			const result = await engine.run(mockOptions);

			expect(result.result.elements).toHaveProperty(
				"html > body > *:nth-child(2)",
			);
			const elements = result.result.elements["html > body > *:nth-child(2)"];
			expect(elements.length).toBeGreaterThan(0);

			// Find the color contrast element specifically
			const colorContrastElement = elements.find(
				(el) => el.title === "Color contrast",
			);
			expect(colorContrastElement).toMatchObject({
				title: "Color contrast",
				description:
					"Background and foreground colors have sufficient contrast",
				score: 0, // This comes from accessibility violations (serious impact = 0)
				categories: ["Accessibility", "CC"], // CC comes from the audit ref acronym
			});
		});

		it("should filter audits by weight", async () => {
			const highWeightOptions = { ...mockOptions, weight: 5 };
			const result = await engine.run(highWeightOptions);

			// Should filter out audits with weight < 5
			expect(result.result.categoryCount.Accessibility).toBe(0);
		});
	});

	describe("generateFileName method", () => {
		it("should generate index.json for root path", () => {
			const fileName = engine.generateFileName("http://localhost:3000/");
			expect(fileName).toBe("index.json");
		});

		it("should generate filename for nested path", () => {
			const fileName = engine.generateFileName(
				"http://localhost:3000/about/team",
			);
			expect(fileName).toBe("about-team.json");
		});

		it("should handle query parameters", () => {
			const fileName = engine.generateFileName(
				"http://localhost:3000/search?q=test",
			);
			expect(fileName).toBe("search-q=test.json");
		});

		it("should decode URI components", () => {
			const fileName = engine.generateFileName(
				"http://localhost:3000/test%20page",
			);
			expect(fileName).toBe("test page.json");
		});
	});

	describe("serializeResult method", () => {
		it("should serialize lighthouse result correctly", () => {
			const mockResult = {
				lhr: {
					categories: { accessibility: { score: 0.95 } },
					audits: { "color-contrast": { score: 0.5 } },
				},
				artifacts: {
					ConsoleMessages: [{ level: "error", text: "test" }],
					Accessibility: {
						violations: [],
						incomplete: [],
					},
				},
			};

			const serialized = engine.serializeResult(mockResult);
			const parsed = JSON.parse(serialized);

			expect(parsed).toHaveProperty("lhr");
			expect(parsed).toHaveProperty("artifacts");
			expect(parsed.artifacts).toHaveProperty("ConsoleMessages");
			expect(parsed.artifacts).toHaveProperty("Accessibility");
		});
	});

	describe("organizeResult method", () => {
		it("should organize accessibility violations", () => {
			const mockResult = {
				lhr: {
					categories: {
						accessibility: {
							title: "Accessibility",
							score: 0.95,
							auditRefs: [{ id: "color-contrast", weight: 3 }],
						},
					},
					audits: {
						"color-contrast": {
							title: "Color contrast",
							description: "Test description",
						},
					},
				},
				artifacts: {
					ConsoleMessages: [],
					Accessibility: {
						violations: [
							{
								id: "color-contrast",
								impact: "serious",
								nodes: [
									{
										node: {
											devtoolsNodePath: "1,HTML,1,BODY,1,DIV",
											selector: "div.test",
											boundingRect: { top: 0, left: 0, width: 100, height: 50 },
										},
									},
								],
							},
						],
						incomplete: [],
					},
				},
			};

			const result = engine.organizeResult(mockResult, 0);

			expect(result.elements).toHaveProperty("html > body > *:nth-child(2)");
			expect(result.elements["html > body > *:nth-child(2)"][0]).toMatchObject({
				title: "Color contrast",
				description: "Test description",
				score: 0, // serious impact
				categories: ["Accessibility"],
			});
		});

		it("should handle incomplete accessibility items", () => {
			const mockResult = {
				lhr: {
					categories: {
						accessibility: {
							title: "Accessibility",
							score: 0.95,
							auditRefs: [{ id: "alt-text", weight: 2 }],
						},
					},
					audits: {
						"alt-text": {
							title: "Alt text",
							description: "Images have alt text",
						},
					},
				},
				artifacts: {
					ConsoleMessages: [],
					Accessibility: {
						violations: [],
						incomplete: [
							{
								id: "alt-text",
								impact: "minor",
								nodes: [
									{
										node: {
											devtoolsNodePath: "1,HTML,1,BODY,1,IMG",
											selector: "img.test",
											boundingRect: {
												top: 10,
												left: 10,
												width: 50,
												height: 50,
											},
										},
									},
								],
							},
						],
					},
				},
			};

			const result = engine.organizeResult(mockResult, 0);

			expect(result.elements).toHaveProperty("html > body > *:nth-child(2)");
			expect(result.elements["html > body > *:nth-child(2)"][0]).toMatchObject({
				title: "Alt text",
				score: 0.5, // minor impact
			});
		});

		it("should skip ASTRO-DEV-TOOLBAR elements", () => {
			const mockResult = {
				lhr: {
					categories: {
						accessibility: {
							title: "Accessibility",
							score: 0.95,
							auditRefs: [{ id: "color-contrast", weight: 3 }],
						},
					},
					audits: {
						"color-contrast": {
							title: "Color contrast",
							description: "Test description",
						},
					},
				},
				artifacts: {
					ConsoleMessages: [],
					Accessibility: {
						violations: [
							{
								id: "color-contrast",
								impact: "serious",
								nodes: [
									{
										node: {
											devtoolsNodePath: "ASTRO-DEV-TOOLBAR,1,DIV",
											selector: "div.toolbar",
											boundingRect: { top: 0, left: 0, width: 100, height: 50 },
										},
									},
								],
							},
						],
						incomplete: [],
					},
				},
			};

			const result = engine.organizeResult(mockResult, 0);

			expect(Object.keys(result.elements)).toHaveLength(0);
		});
	});
});
