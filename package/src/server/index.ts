import fs from "node:fs";
import lighthouse, { type RunnerResult } from "lighthouse";
import puppeteer from "puppeteer";
import type { CacheLHResultByFormFactor, LHOptions } from "../types/index.js";
import {
	generateDefaultLHData,
	generateLHReportFileName,
	organizeLHResult,
} from "../utils/lh.js";

export const startLH = async (options: LHOptions) => {
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
		ignoreDefaultArgs: ["--enable-automation"],
	});

	const page = await browser.newPage();

	const isMobile = options.width <= options.breakPoint;
	const formFactor = isMobile ? "mobile" : ("desktop" as const);

	const url = new URL(options.url);
	url.searchParams.set("astro-page-insight", "true");

	const categories = options.pwa
		? ["accessibility", "best-practices", "performance", "seo", "pwa"]
		: ["accessibility", "best-practices", "performance", "seo"];

	const result = await lighthouse(
		url.toString(),
		{
			output: "json",
			formFactor,
			skipAudits: ["screenshot-thumbnails", "final-screenshot"],
			disableFullPageScreenshot: true,
			onlyCategories: categories,
			screenEmulation: {
				mobile: isMobile,
				width: options.width,
				height: options.height,
				deviceScaleFactor: 1,
			},
			throttlingMethod: "simulate",
			throttling: {
				rttMs: 40,
				throughputKbps: 10 * 1024,
				cpuSlowdownMultiplier: 1,
			},
			emulatedUserAgent: false,
		},
		undefined,
		page,
	);

	await browser.close();

	return {
		result,
		formFactor,
	};
};

export const getLHReport = async (
	cacheDir: string,
	url: string,
	weight: number,
	pwa: boolean,
): Promise<CacheLHResultByFormFactor> => {
	const lhResult = generateDefaultLHData(pwa);

	const fileName = generateLHReportFileName(url);
	const filePathDesktop = `${cacheDir}/desktop/${fileName}`;
	const filePathMobile = `${cacheDir}/mobile/${fileName}`;

	if (fs.existsSync(filePathDesktop)) {
		const file = await fs.promises
			.readFile(filePathDesktop, { encoding: "utf-8" })
			.catch(() => null);
		if (file) {
			const result = organizeLHResult(JSON.parse(file), weight, pwa);
			lhResult.desktop = result;
			lhResult.cache = true;
		}
	}

	if (fs.existsSync(filePathMobile)) {
		const file = await fs.promises
			.readFile(filePathMobile, { encoding: "utf-8" })
			.catch(() => null);
		if (file) {
			const result = organizeLHResult(JSON.parse(file), weight, pwa);
			lhResult.mobile = result;
			lhResult.cache = true;
		}
	}

	return lhResult;
};

export const saveLHReport = async (
	cacheDir: string,
	url: string,
	lhResult: RunnerResult,
) => {
	const report = {
		artifacts: {
			ConsoleMessages: lhResult.artifacts.ConsoleMessages,
			Accessibility: {
				violations: lhResult.artifacts.Accessibility.violations,
				incomplete: lhResult.artifacts.Accessibility.incomplete,
			},
		},
		lhr: {
			categories: lhResult.lhr.categories,
			audits: lhResult.lhr.audits,
		},
	};
	const fileName = generateLHReportFileName(url);
	const filePath = `${cacheDir}/${fileName}`;
	if (!fs.existsSync(cacheDir)) {
		await fs.promises.mkdir(cacheDir, { recursive: true });
	}

	await fs.promises.writeFile(filePath, JSON.stringify(report), {
		encoding: "utf-8",
	});
};
