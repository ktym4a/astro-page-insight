import lighthouse, { type RunnerResult } from "lighthouse";
import puppeteer from "puppeteer";
import {
	TestingEngine,
	type TestingEngineOptions,
	type TestingEngineRunResult,
} from "../base.js";
import { organizeLighthouseResult } from "./utils.js";

export class LighthouseEngine extends TestingEngine {
	readonly name = "lighthouse";
	readonly categories = [
		"Accessibility",
		"Best Practices",
		"Performance",
		"SEO",
	];

	override async run(
		options: TestingEngineOptions,
	): Promise<TestingEngineRunResult> {
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

		const categories = [
			"accessibility",
			"best-practices",
			"performance",
			"seo",
		];

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

		const processedResult = this.organizeResult(result, options.weight);

		return {
			result: processedResult,
			formFactor,
			rawResult: result, // Include raw result for caching
		};
	}

	override organizeResult(lhResult: unknown, weight: number) {
		return organizeLighthouseResult(lhResult as RunnerResult, weight);
	}

	override generateFileName(url: string): string {
		const urlObj = new URL(url);

		let fileName: string;
		if (urlObj.pathname === "/") {
			fileName = "index";
		} else {
			fileName = urlObj.pathname.replace(/\//g, "-").replace(/^-|-$/g, "");
		}

		if (urlObj.search) {
			fileName += urlObj.search.replace(/\//g, "").replace(/\?/g, "-");
		}

		return `${decodeURI(fileName)}.json`;
	}

	override serializeResult(rawResult: unknown): string {
		const lhResult = rawResult as RunnerResult;
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
		return JSON.stringify(report);
	}
}
