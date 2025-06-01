import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { LighthouseEngine } from "../src/engines/lighthouse/index.ts";
import { getEngineReport, saveEngineReport } from "../src/server/engine.ts";
import { generateDefaultLHData } from "../src/utils/lh.ts";

describe("lh", () => {
	describe("saveEngineReport", () => {
		it("should save a file", async () => {
			const engine = new LighthouseEngine();
			const cacheDir = "tests/fixtures/.pageinsight/desktop";
			const url = "https://example.com/";
			const fileName = engine.generateFileName(url);

			const file = await fs.promises
				.readFile(`${cacheDir}/${fileName}`, { encoding: "utf-8" })
				.catch(() => null);

			//   remove the file if it exists
			expect(file).not.toBeNull();

			if (file) {
				await fs.promises.unlink(`${cacheDir}/${fileName}`).catch(() => null);
				await saveEngineReport("lighthouse", cacheDir, url, JSON.parse(file));
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

	describe("getEngineReport", () => {
		it("should return an empty object without cache false", async () => {
			const cacheDir = "tests/fixtures/.pageinsight";
			const url = "https://example.com/test";
			const weight = 0;

			const obj = generateDefaultLHData();
			const result = await getEngineReport("lighthouse", cacheDir, url, weight);

			expect(result).toStrictEqual(obj);
			expect(result.cache).toBe(false);
		});

		it("should return an LH result object with cache true", async () => {
			const cacheDir = "tests/fixtures/.pageinsight";
			const url = "https://example.com/";
			const weight = 0;

			const obj = generateDefaultLHData();
			const result = await getEngineReport("lighthouse", cacheDir, url, weight);

			expect(result).not.toStrictEqual(obj);
			expect(Object.keys(result.desktop.elements)).lengthOf(6);
			expect(Object.keys(result.mobile.elements)).lengthOf(5);
			expect(Object.keys(result.desktop.scoreList)).lengthOf(4);
			expect(Object.keys(result.mobile.scoreList)).lengthOf(4);
			expect(Object.keys(result.desktop.categoryCount)).lengthOf(4);
			expect(Object.keys(result.mobile.categoryCount)).lengthOf(4);
			expect(result.desktop.metaErrors?.length).toBeGreaterThan(0);
			expect(result.desktop.consoleErrors?.length).toBeGreaterThan(0);
			expect(result.cache).toBe(true);
		});

		it("should return an LH result object filter by weight", async () => {
			const cacheDir = "tests/fixtures/.pageinsight";
			const url = "https://example.com/";
			const weight = 2;

			const result = await getEngineReport("lighthouse", cacheDir, url, weight);

			expect(Object.keys(result.desktop.elements)).lengthOf(4);
			expect(Object.keys(result.mobile.elements)).lengthOf(4);
		});

		it("should return an LH result object with Desktop", async () => {
			const cacheDir = "tests/fixtures/.pageinsight";
			const url = "https://example.com/releases-1_0";
			const weight = 0;

			const obj = generateDefaultLHData();
			const result = await getEngineReport("lighthouse", cacheDir, url, weight);

			expect(result.desktop).not.toStrictEqual(obj.desktop);
			expect(result.mobile).toStrictEqual(obj.mobile);
		});

		it("should return an LH result object with Mobile", async () => {
			const cacheDir = "tests/fixtures/.pageinsight";
			const url = "https://example.com/releases-1_8";
			const weight = 0;

			const obj = generateDefaultLHData();
			const result = await getEngineReport("lighthouse", cacheDir, url, weight);

			expect(result.desktop).toStrictEqual(obj.desktop);
			expect(result.mobile).not.toStrictEqual(obj.mobile);
		});
	});
});
