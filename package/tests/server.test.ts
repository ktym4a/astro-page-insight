import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
	generateDefaultLHData,
	generateLHReportFileName,
	getLHReport,
	saveLHReport,
} from "../src/server";
import type { CacheLHResultByFormFactor } from "../src/types";

describe("lh", () => {
	describe("saveLHReport", () => {
		it("should save a file", async () => {
			const cacheDir = "tests/fixtures/.pageinsight/desktop";
			const url = "https://example.com/";
			const fileName = generateLHReportFileName(url);

			const file = await fs.promises
				.readFile(`${cacheDir}/${fileName}`, { encoding: "utf-8" })
				.catch(() => null);

			//   remove the file if it exists
			expect(file).not.toBeNull();

			if (file) {
				await fs.promises.unlink(`${cacheDir}/${fileName}`).catch(() => null);
				await saveLHReport(cacheDir, url, JSON.parse(file));
				const newFile = await fs.promises
					.readFile(`${cacheDir}/${fileName}`, { encoding: "utf-8" })
					.catch(() => null);

				expect(newFile).not.toBeNull();

				if (newFile) {
					expect(JSON.parse(newFile)).toStrictEqual(JSON.parse(file));
				}
			}
		});
	});

	describe("getLHReport", () => {
		it("should return an empty object without pwa and cache false", async () => {
			const cacheDir = "tests/fixtures/.pageinsight";
			const url = "https://example.com/test";
			const weight = 0;
			const pwa = false;

			const obj = generateDefaultLHData(pwa);
			const result = await getLHReport(cacheDir, url, weight, pwa);

			expect(result).toStrictEqual(obj);
			expect(result.desktop.elements).not.toHaveProperty("pwa");
			expect(result.mobile.elements).not.toHaveProperty("pwa");
			expect(result.desktop).not.toHaveProperty("pwaErrors");
			expect(result.mobile).not.toHaveProperty("pwaErrors");
			expect(result.cache).toBe(false);
		});

		it("should return an empty object with pwa and cache false", async () => {
			const cacheDir = "tests/fixtures/.pageinsight";
			const url = "https://example.com/test";
			const weight = 0;
			const pwa = true;

			const obj = generateDefaultLHData(pwa);
			const result = await getLHReport(cacheDir, url, weight, pwa);

			expect(result).toStrictEqual(obj);
			expect(result.desktop.elements).toHaveProperty("pwa");
			expect(result.mobile.elements).toHaveProperty("pwa");
			expect(result.desktop).toHaveProperty("pwaErrors");
			expect(result.mobile).toHaveProperty("pwaErrors");
			expect(result.cache).toBe(false);
		});

		it("should return an LH result object without pwa and cache true", async () => {
			const cacheDir = "tests/fixtures/.pageinsight";
			const url = "https://example.com/";
			const weight = 0;
			const pwa = false;

			const obj = generateDefaultLHData(pwa);
			const result = await getLHReport(cacheDir, url, weight, pwa);

			expect(result).not.toStrictEqual(obj);
			expect(result.desktop).not.toHaveProperty("pwaErrors");
			expect(result.mobile).not.toHaveProperty("pwaErrors");
			expect(Object.keys(result.desktop.elements)).lengthOf(12);
			expect(Object.keys(result.mobile.elements)).lengthOf(5);
			expect(Object.keys(result.desktop.scoreList)).lengthOf(4);
			expect(Object.keys(result.mobile.scoreList)).lengthOf(4);
			expect(Object.keys(result.desktop.categoryCount)).lengthOf(4);
			expect(Object.keys(result.mobile.categoryCount)).lengthOf(4);
			expect(result.desktop.metaErrors?.length).toBeGreaterThan(0);
			expect(result.desktop.consoleErrors?.length).toBeGreaterThan(0);
			expect(result.cache).toBe(true);
		});

		it("should return an LH result object with pwa and cache true", async () => {
			const cacheDir = "tests/fixtures/.pageinsight";
			const url = "https://example.com/";
			const weight = 0;
			const pwa = true;

			const obj = generateDefaultLHData(pwa);
			const result = await getLHReport(cacheDir, url, weight, pwa);

			expect(result).not.toStrictEqual(obj);
			expect(result.desktop).toHaveProperty("pwaErrors");
			expect(result.mobile).toHaveProperty("pwaErrors");
			expect(Object.keys(result.desktop.scoreList)).lengthOf(5);
			expect(Object.keys(result.mobile.scoreList)).lengthOf(5);
			expect(Object.keys(result.desktop.categoryCount)).lengthOf(5);
			expect(Object.keys(result.mobile.categoryCount)).lengthOf(5);
			expect(result.desktop.pwaErrors?.length).toBeGreaterThan(0);
			expect(result.mobile.pwaErrors?.length).toBeGreaterThan(0);
			expect(result.desktop.metaErrors?.length).toBeGreaterThan(0);
			expect(result.desktop.consoleErrors?.length).toBeGreaterThan(0);
			expect(result.cache).toBe(true);
		});

		it("should return an LH result object filter by weight", async () => {
			const cacheDir = "tests/fixtures/.pageinsight";
			const url = "https://example.com/";
			const weight = 20;
			const pwa = false;

			const result = await getLHReport(cacheDir, url, weight, pwa);

			expect(Object.keys(result.desktop.elements)).lengthOf(8);
			expect(Object.keys(result.mobile.elements)).lengthOf(1);
		});

		it("should return an LH result object with Desktop", async () => {
			const cacheDir = "tests/fixtures/.pageinsight";
			const url = "https://example.com/releases-1_0";
			const weight = 0;
			const pwa = true;

			const obj = generateDefaultLHData(pwa);
			const result = await getLHReport(cacheDir, url, weight, pwa);

			expect(result.desktop).not.toStrictEqual(obj.desktop);
			expect(result.mobile).toStrictEqual(obj.mobile);
		});

		it("should return an LH result object with Desktop", async () => {
			const cacheDir = "tests/fixtures/.pageinsight";
			const url = "https://example.com/releases-1_8";
			const weight = 0;
			const pwa = true;

			const obj = generateDefaultLHData(pwa);
			const result = await getLHReport(cacheDir, url, weight, pwa);

			expect(result.desktop).toStrictEqual(obj.desktop);
			expect(result.mobile).not.toStrictEqual(obj.mobile);
		});
	});

	describe("generateLHReportFileName", () => {
		it("should generate a filename with index.json", () => {
			const url = "https://example.com";
			const urlWithSlash = "https://example.com/";

			const correctFileName = "index.json";

			expect(generateLHReportFileName(url)).toBe(correctFileName);
			expect(generateLHReportFileName(urlWithSlash)).toBe(correctFileName);
		});

		it("should generate a filename with about.json", () => {
			const url = "https://example.com/about";
			const urlWithSlash = "https://example.com/about/";

			const correctFileName = "about.json";

			expect(generateLHReportFileName(url)).toBe(correctFileName);
			expect(generateLHReportFileName(urlWithSlash)).toBe(correctFileName);
		});

		it("should generate a filename with about-what.json", () => {
			const url = "https://example.com/about/what";
			const urlWithSlash = "https://example.com/about/what/";

			const correctFileName = "about-what.json";

			expect(generateLHReportFileName(url)).toBe(correctFileName);
			expect(generateLHReportFileName(urlWithSlash)).toBe(correctFileName);
		});

		it("should generate a filename with about-query=string.json", () => {
			const url = "https://example.com/about?query=string";
			const urlWithSlash = "https://example.com/about/?query=string";

			const correctFileName = "about-query=string.json";

			expect(generateLHReportFileName(url)).toBe(correctFileName);
			expect(generateLHReportFileName(urlWithSlash)).toBe(correctFileName);
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

			const defaultLHDataFalse = generateDefaultLHData(false);

			expect(defaultLHDataFalse).toStrictEqual(obj);
			expect(defaultLHDataFalse.desktop.elements).not.toHaveProperty("pwa");
			expect(defaultLHDataFalse.mobile.elements).not.toHaveProperty("pwa");
			expect(defaultLHDataFalse.desktop.pwaErrors).not.toBeDefined();
			expect(defaultLHDataFalse.mobile.pwaErrors).not.toBeDefined();

			const defaultLHDataTrue = generateDefaultLHData(true);

			expect(defaultLHDataTrue).not.toStrictEqual(obj);
			expect(defaultLHDataTrue.desktop.elements).toHaveProperty("pwa");
			expect(defaultLHDataTrue.mobile.elements).toHaveProperty("pwa");
			expect(defaultLHDataTrue.desktop.pwaErrors).toBeDefined();
			expect(defaultLHDataTrue.mobile.pwaErrors).toBeDefined();
		});
	});
});
