import { describe, expect, it } from "vitest";
import { LighthouseEngine } from "../src/engines/lighthouse/index.ts";
import type { CacheLHResultByFormFactor } from "../src/types/index.ts";
import { generateDefaultLHData } from "../src/utils/lh.ts";

describe("lh", () => {
	describe("LighthouseEngine.generateFileName", () => {
		const engine = new LighthouseEngine();

		it("should generate a filename with index.json", () => {
			const url = "https://example.com";
			const urlWithSlash = "https://example.com/";

			const correctFileName = "index.json";

			expect(engine.generateFileName(url)).toBe(correctFileName);
			expect(engine.generateFileName(urlWithSlash)).toBe(correctFileName);
		});

		it("should generate a filename with about.json", () => {
			const url = "https://example.com/about";
			const urlWithSlash = "https://example.com/about/";

			const correctFileName = "about.json";

			expect(engine.generateFileName(url)).toBe(correctFileName);
			expect(engine.generateFileName(urlWithSlash)).toBe(correctFileName);
		});

		it("should generate a filename with about-what.json", () => {
			const url = "https://example.com/about/what";
			const urlWithSlash = "https://example.com/about/what/";

			const correctFileName = "about-what.json";

			expect(engine.generateFileName(url)).toBe(correctFileName);
			expect(engine.generateFileName(urlWithSlash)).toBe(correctFileName);
		});

		it("should generate a filename with about-query=string.json", () => {
			const url = "https://example.com/about?query=string";
			const urlWithSlash = "https://example.com/about/?query=string";

			const correctFileName = "about-query=string.json";

			expect(engine.generateFileName(url)).toBe(correctFileName);
			expect(engine.generateFileName(urlWithSlash)).toBe(correctFileName);
		});
	});

	describe("getLHReport", () => {
		it("should generate a default LH data object", () => {
			const obj: CacheLHResultByFormFactor = {
				desktop: {
					elements: {},
					consoleErrors: [],
					scoreList: {},
					metaErrors: [],
					categoryCount: {},
				},
				mobile: {
					elements: {},
					consoleErrors: [],
					scoreList: {},
					metaErrors: [],
					categoryCount: {},
				},
				cache: false,
			};

			const defaultLHDataFalse = generateDefaultLHData();
			expect(defaultLHDataFalse).toStrictEqual(obj);
		});
	});
});
