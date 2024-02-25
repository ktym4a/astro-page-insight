import * as chromeLauncher from "chrome-launcher";
import lighthouse, { type RunnerResult } from "lighthouse";
import type {
	MetricSavings,
	Result,
	ScoreDisplayMode,
} from "lighthouse/types/lhr/audit-result";
import type {
	AuditType,
	Categories,
	CategoryCountType,
	LHOptions,
	LHResult,
	ScoreListType,
} from "../types/index.js";

export const startLH = async (options: LHOptions) => {
	const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

	const isMobile = options.width <= options.breakPoint;
	const formFactor = isMobile ? "mobile" : ("desktop" as const);

	const url = new URL(options.url);
	url.searchParams.set("astro-page-insight", "true");

	const result = await lighthouse(url.toString(), {
		port: chrome.port,
		output: "json",
		formFactor,
		disableFullPageScreenshot: true,
		onlyCategories: ["accessibility", "best-practices", "performance", "seo"],
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
	});

	await chrome.kill();

	return {
		result,
		formFactor,
	};
};

export const organizeLHResult = (lhResult: RunnerResult, weight: number) => {
	const { lhr, artifacts } = lhResult;

	const consoleErrors = artifacts.ConsoleMessages.filter(
		(msg) => msg.level === "error" || msg.level === "warning",
	).map((msg) => {
		let url: string | URL = "";
		if (msg.url) {
			url = new URL(msg.url);
			url.searchParams.delete("astro-dev-toolbar");
		}
		return {
			message: msg.text,
			level: msg.level,
			content: url.toString(),
		};
	});

	const categories: Categories = {};
	const scoreList = {} as ScoreListType;
	const categoryCount = {} as CategoryCountType;

	for (const value of Object.values(lhr.categories)) {
		scoreList[value.title] = value.score;
		categoryCount[value.title] = 0;
		for (const audit of value.auditRefs) {
			if (audit.weight < weight) continue;
			const auditValue = categories[audit.id];
			if (auditValue) {
				categories[audit.id] = Array.from(
					new Set([...auditValue, value.title]),
				);
			} else {
				categories[audit.id] = [value.title];
			}
			if (audit.acronym) {
				categories[audit.id]?.push(audit.acronym);
			}

			if (audit.relevantAudits) {
				for (const relevant of audit.relevantAudits) {
					const relevantValue = categories[relevant];
					if (relevantValue) {
						categories[relevant] = Array.from(
							new Set([...relevantValue, value.title]),
						);
					} else {
						categories[relevant] = [value.title];
					}
					if (audit.acronym) categories[relevant]?.push(audit.acronym);
				}
			}
		}
	}

	let elements = {} as LHResult["elements"];
	let metaErrors = [] as LHResult["metaErrors"];

	for (const incomplete of artifacts.Accessibility.violations) {
		if (categories[incomplete.id] === undefined) continue;
		const { title, description } = lhr.audits[incomplete.id] as Result;

		for (const { node } of incomplete.nodes) {
			if (node.devtoolsNodePath.includes("ASTRO-DEV-TOOLBAR")) continue;
			const category = categories[incomplete.id];

			const element: AuditType = {
				score: incomplete.impact === "serious" ? 0 : 0.5,
				scoreDisplayMode: "numeric",
				title,
				description,
				categories: category ?? [],
				rect: {
					...node.boundingRect,
				},
				detailSelector: node.selector,
			};

			const selector = getSelector(node.devtoolsNodePath);
			const audit = createAudit(
				elements,
				metaErrors,
				selector,
				element,
				categoryCount,
			);

			if (selector === "") {
				metaErrors = audit;
			} else {
				elements[selector] = audit;
			}
		}
	}

	for (const incomplete of artifacts.Accessibility.incomplete) {
		if (categories[incomplete.id] === undefined) continue;
		const { title, description } = lhr.audits[incomplete.id] as Result;

		for (const { node } of incomplete.nodes) {
			if (node.devtoolsNodePath.includes("ASTRO-DEV-TOOLBAR")) continue;
			const category = categories[incomplete.id];

			const element: AuditType = {
				score: incomplete.impact === "serious" ? 0 : 0.5,
				scoreDisplayMode: "numeric",
				title,
				description,
				categories: category ?? [],
				rect: {
					...node.boundingRect,
				},
				detailSelector: node.selector,
			};

			const selector = getSelector(node.devtoolsNodePath);
			const audit = createAudit(
				elements,
				metaErrors,
				selector,
				element,
				categoryCount,
			);

			if (selector === "") {
				metaErrors = audit;
			} else {
				elements[selector] = audit;
			}
		}
	}

	for (const audit of Object.values(lhr.audits)) {
		if (!audit.details) continue;
		if (audit.details.type !== "table" && audit.details.type !== "list")
			continue;
		if (audit.title === "Avoid an excessive DOM size") continue;
		if (categories[audit.id] === undefined) continue;

		const category = categories[audit.id] || [];

		const returnObj = findSelector(
			audit.details.items,
			audit.title,
			audit.description,
			audit.score,
			audit.scoreDisplayMode,
			category,
			elements,
			metaErrors,
			categoryCount,
			audit.metricSavings,
		);

		elements = returnObj.elements;
		metaErrors = returnObj.metaErrors;
	}

	return { elements, consoleErrors, scoreList, metaErrors, categoryCount };
};

const createAudit = (
	elements: LHResult["elements"],
	metaErrors: LHResult["metaErrors"],
	selector: string,
	element: AuditType,
	categoryCount: CategoryCountType,
) => {
	if (selector === "") {
		if (metaErrors.some((el) => el.title === element.title)) return metaErrors;
		return [...metaErrors, element];
	}
	const elementsValue = elements[selector];

	if (elementsValue) {
		if (elementsValue.some((el) => el.title === element.title))
			return elementsValue;

		for (const val of element.categories) {
			if (val in categoryCount) {
				categoryCount[val] += 1;
			}
		}

		return [...elementsValue, element];
	}

	for (const val of element.categories) {
		if (val in categoryCount) {
			categoryCount[val] += 1;
		}
	}

	return [element];
};

const findSelector = (
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	items: Array<any>,
	title: string,
	description: string,
	score: number | null,
	scoreDisplayMode: ScoreDisplayMode,
	category: string[],
	elements: LHResult["elements"],
	metaErrors: LHResult["metaErrors"],
	categoryCount: CategoryCountType,
	metricSavings?: MetricSavings,
) => {
	const returnElements = elements;
	let returnMMetaErrors = metaErrors;

	for (const item of items) {
		if (item.items) {
			findSelector(
				item.items,
				title,
				description,
				score,
				scoreDisplayMode,
				category,
				elements,
				metaErrors,
				categoryCount,
				metricSavings,
			);
		}
		if (item.node) {
			if (item.node.path.includes("ASTRO-DEV-TOOLBAR")) continue;
			let scoreValue = score;
			if (
				scoreDisplayMode === "manual" ||
				scoreDisplayMode === "informative" ||
				scoreDisplayMode === "notApplicable" ||
				scoreDisplayMode === "error"
			) {
				scoreValue = null;
			}
			if (scoreDisplayMode === "metricSavings" && metricSavings !== undefined) {
				if (Object.keys(metricSavings).length > 0) {
					const metricScore = Object.values(metricSavings).filter(
						(el) => typeof el === "number",
					) as number[];
					if (metricScore.length > 0) {
						scoreValue = Math.min(...metricScore);
					}
				}
			}

			const element: AuditType = {
				score: scoreValue,
				scoreDisplayMode,
				title,
				description,
				categories: category,
				rect: {
					...item.node.boundingRect,
				},
				detailSelector: item.node.selector,
			};

			const selector = getSelector(item.node.path);
			const audit = createAudit(
				elements,
				metaErrors,
				selector,
				element,
				categoryCount,
			);

			if (selector === "") {
				returnMMetaErrors = audit;
			} else {
				returnElements[selector] = audit;
			}
		}
	}

	return {
		elements: returnElements,
		metaErrors: returnMMetaErrors,
	};
};

const getSelector = (node: string) => {
	return node
		.split(",")
		.slice(3)
		.reduce((acc, cur, index) => {
			const elemIndex = parseInt(cur);
			if (Number.isNaN(elemIndex)) return acc;

			const elem = `*:nth-child(${elemIndex + 1})`;

			if (index === 1) return `html > body > ${acc}${elem}`;
			return `${acc} > ${elem}`;
		}, "");
};
