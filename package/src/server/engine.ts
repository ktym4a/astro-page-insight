import fs from "node:fs";
import { type TestingEngineOptions, engineRegistry } from "../engines/index.js";
import type { CacheLHResultByFormFactor } from "../types/index.js";

export const runTestingEngine = async (
	engineName: string,
	options: TestingEngineOptions,
) => {
	const engine = engineRegistry.get(engineName);
	if (!engine) {
		throw new Error(`Testing engine "${engineName}" not found`);
	}

	return engine.run(options);
};

export const getEngineReport = async (
	engineName: string,
	cacheDir: string,
	url: string,
	weight: number,
): Promise<CacheLHResultByFormFactor> => {
	const engine = engineRegistry.get(engineName);
	if (!engine) {
		throw new Error(`Testing engine "${engineName}" not found`);
	}

	const defaultResult = generateDefaultEngineData();
	const fileName = engine.generateFileName(url);
	const filePathDesktop = `${cacheDir}/desktop/${fileName}`;
	const filePathMobile = `${cacheDir}/mobile/${fileName}`;

	if (fs.existsSync(filePathDesktop)) {
		const file = await fs.promises
			.readFile(filePathDesktop, { encoding: "utf-8" })
			.catch(() => null);
		if (file) {
			const rawResult = engine.deserializeResult(file);
			const result = engine.organizeResult(rawResult, weight);
			defaultResult.desktop = result;
			defaultResult.cache = true;
		}
	}

	if (fs.existsSync(filePathMobile)) {
		const file = await fs.promises
			.readFile(filePathMobile, { encoding: "utf-8" })
			.catch(() => null);
		if (file) {
			const rawResult = engine.deserializeResult(file);
			const result = engine.organizeResult(rawResult, weight);
			defaultResult.mobile = result;
			defaultResult.cache = true;
		}
	}

	return defaultResult;
};

export const saveEngineReport = async (
	engineName: string,
	cacheDir: string,
	url: string,
	rawResult: unknown,
) => {
	const engine = engineRegistry.get(engineName);
	if (!engine) {
		throw new Error(`Testing engine "${engineName}" not found`);
	}

	const serializedResult = engine.serializeResult(rawResult);
	const fileName = engine.generateFileName(url);
	const filePath = `${cacheDir}/${fileName}`;

	if (!fs.existsSync(cacheDir)) {
		await fs.promises.mkdir(cacheDir, { recursive: true });
	}

	await fs.promises.writeFile(filePath, serializedResult, {
		encoding: "utf-8",
	});
};

const generateDefaultEngineData = (): CacheLHResultByFormFactor => {
	return {
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
};
