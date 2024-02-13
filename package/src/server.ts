import * as chromeLauncher from "chrome-launcher";
import lighthouse, { type RunnerResult } from "lighthouse";
import type {
	Result,
	ScoreDisplayMode,
} from "lighthouse/types/lhr/audit-result";
import { CATEGORIES } from "./constants.js";
import type {
	Categories,
	ElementType,
	LHOptions,
	LHResult,
} from "./types.js";

export const startLH = async (options: LHOptions) => {
	const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

	const isMobile = options.width <= options.breakPoint;

	const result = await lighthouse(options.url, {
		port: chrome.port,
		output: "json",
		formFactor: isMobile ? "mobile" : "desktop",
		disableFullPageScreenshot: true,
		onlyCategories: CATEGORIES,
		screenEmulation: {
			mobile: isMobile,
			width: options.width,
			height: options.height,
			deviceScaleFactor: 1,
		},
		throttlingMethod: "provided",
		emulatedUserAgent: false,
	});

	await chrome.kill();

	return result;
};

export const organizeLHResult = (lhResult: RunnerResult, weight: number) => {
	const { lhr, artifacts } = lhResult;

	const consoleMessages = artifacts.ConsoleMessages.filter(
		(msg) => msg.level === "error",
	).map((msg) => (msg.url ? `${msg.text}: ${msg.url}` : msg.text));

	const categories: Categories = {};
	const scoreList = {} as { [key: string]: number | null };

	for (const value of Object.values(lhr.categories)) {
		scoreList[value.title] = value.score;
		for (const audit of value.auditRefs) {
			if (audit.weight < weight) continue;
			const auditValue = categories[audit.id];
			const type = audit.acronym ?? value.title;
			if (auditValue) {
				categories[audit.id] = Array.from(new Set([...auditValue, type]));
			} else {
				categories[audit.id] = [type];
			}

			if (audit.relevantAudits) {
				for (const relevant of audit.relevantAudits) {
					const relevantValue = categories[relevant];
					if (relevantValue) {
						categories[relevant] = Array.from(
							new Set([...relevantValue, type]),
						);
					} else {
						categories[relevant] = [type];
					}
				}
			}
		}
	}

	let elements = {} as LHResult["elements"];

	for (const incomplete of artifacts.Accessibility.violations) {
		if (categories[incomplete.id] === undefined) continue;
		const { title, description } = lhr.audits[incomplete.id] as Result;

		for (const { node } of incomplete.nodes) {
			if (node.devtoolsNodePath.includes("ASTRO-DEV-TOOLBAR")) continue;
			const category = categories[incomplete.id];

			const element: ElementType = {
				score: incomplete.impact === "serious" ? 0 : 0.5,
				scoreDisplayMode: "numeric",
				title,
				description,
				categories: category ?? [],
				rect: {
					...node.boundingRect,
				},
			};

			elements[getSelector(node.devtoolsNodePath)] = createElement(
				elements,
				getSelector(node.devtoolsNodePath),
				element,
			);
		}
	}

	for (const incomplete of artifacts.Accessibility.incomplete) {
		if (categories[incomplete.id] === undefined) continue;
		const { title, description } = lhr.audits[incomplete.id] as Result;

		for (const { node } of incomplete.nodes) {
			if (node.devtoolsNodePath.includes("ASTRO-DEV-TOOLBAR")) continue;
			const category = categories[incomplete.id];

			const element: ElementType = {
				score: incomplete.impact === "serious" ? 0 : 0.5,
				scoreDisplayMode: "numeric",
				title,
				description,
				categories: category ?? [],
				rect: {
					...node.boundingRect,
				},
			};

			elements[getSelector(node.devtoolsNodePath)] = createElement(
				elements,
				getSelector(node.devtoolsNodePath),
				element,
			);
		}
	}

	for (const audit of Object.values(lhr.audits)) {
		if (!audit.details) continue;
		if (audit.details.type !== "table" && audit.details.type !== "list")
			continue;
		if (audit.title === "Avoid an excessive DOM size") continue;
		if (categories[audit.id] === undefined) continue;

		const category = categories[audit.id] || [];

		elements = findSelector(
			audit.details.items,
			audit.title,
			audit.description,
			audit.score,
			audit.scoreDisplayMode,
			category,
			elements,
		);
	}

	return { elements, console: consoleMessages, scoreList };
};

const createElement = (
	elements: LHResult["elements"],
	selector: string,
	element: ElementType,
) => {
	const elementsValue = elements[selector];
	if (elementsValue) {
		if (elementsValue.some((el) => el.title === element.title))
			return elementsValue;
		return [...elementsValue, element];
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
) => {
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
			);
		}
		if (item.node) {
			if (item.node.path.includes("ASTRO-DEV-TOOLBAR")) continue;
			const element: ElementType = {
				score:
					scoreDisplayMode === "manual" ||
					scoreDisplayMode === "informative" ||
					scoreDisplayMode === "notApplicable" ||
					scoreDisplayMode === "error"
						? null
						: score,
				scoreDisplayMode,
				title,
				description,
				categories: category,
				rect: {
					...item.node.boundingRect,
				},
			};

			elements[getSelector(item.node.path)] = createElement(
				elements,
				getSelector(item.node.path),
				element,
			);
		}
	}

	return elements;
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
