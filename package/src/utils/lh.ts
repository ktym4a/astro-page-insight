import type { RunnerResult } from "lighthouse";
import type {
	MetricSavings,
	Result,
	ScoreDisplayMode,
} from "lighthouse/types/lhr/audit-result";
import type {
	AuditType,
	CacheLHResultByFormFactor,
	Categories,
	CategoryCountType,
	FilterCategoryType,
	FilterTypes,
	HideArguments,
	LHResult,
	LHResultForTooltip,
	PositionType,
	ScoreListType,
	Tooltips,
	UpdateMappingType,
} from "../types/index.js";
import { createConsoleErrorList } from "../ui/consoleAlert.js";
import { createFilter } from "../ui/filter.js";
import { createHideList } from "../ui/hide.js";
import { createHighlight } from "../ui/highlight.js";
import { reloadCircleIcon } from "../ui/icons.js";
import { createScore } from "../ui/score.js";
import { createToolbarButton } from "../ui/toolbar.js";
import { createTooltip } from "../ui/tooltip.js";

export const updateCanvas = ({
	canvas,
	result,
	filter,
	formFactor,
	scoreList,
	categoryCount,
}: UpdateMappingType) => {
	mappingData(formFactor, canvas, result, filter);
	createHideList(canvas, formFactor, filter.hideList, result, filter);
	createScore(canvas, formFactor, scoreList);
	createFilter(canvas, formFactor, categoryCount, result, filter);
	createConsoleErrorList(
		canvas,
		formFactor,
		result.consoleErrors,
		result.metaErrors,
		result.pwaErrors,
	);
};

export const createFetchButton = (
	toolbarWrap: HTMLDivElement,
	fetchStart: () => void,
	isFetching: boolean,
) => {
	const fetchButton = createToolbarButton(
		reloadCircleIcon,
		toolbarWrap,
		isFetching,
		"fetch",
		fetchStart,
		"Fetch Lighthouse report.",
	);

	return fetchButton;
};

export const mappingData = (
	formFactor: LHResult["formFactor"],
	canvas: ShadowRoot,
	result: LHResultForTooltip,
	filter: FilterTypes,
) => {
	for (const highlight of canvas.querySelectorAll<HTMLDivElement>(
		".astro-page-insight-highlight",
	)) {
		highlight.remove();
	}
	for (const tooltip of canvas.querySelectorAll<HTMLDivElement>(
		".astro-page-insight-tooltip",
	)) {
		tooltip.remove();
	}

	for (const [selector, value] of Object.entries(result.elements)) {
		if (!value[0]) continue;
		if (
			filter.hideList.some((hideElement) => hideElement.selector === selector)
		)
			continue;

		const position = value[0].rect;
		const detailSelector = value[0].detailSelector;
		if (!checkAudit(selector, position)) continue;

		const { tooltips, selectorCategory } = createAuditData(
			value,
			selector,
			filter.categories,
		);

		if (Object.keys(tooltips).length === 0) continue;

		const hideArguments = {
			selector,
			hideHighlights: filter.hideList,
			detailSelector: detailSelector ?? "",
		};

		const render = {
			canvas,
			lhResult: result,
		};

		const mapElem = createMapElement(
			formFactor,
			hideArguments,
			position,
			tooltips,
			selectorCategory,
			filter,
			render,
		);

		if (mapElem) canvas.appendChild(mapElem);
	}
};

const checkAudit = (selector: string, position: PositionType) => {
	if (selector === "") return false;
	if (
		position.width === 0 &&
		position.height === 0 &&
		position.top === 0 &&
		position.left === 0
	)
		return false;

	return true;
};

const createAuditData = (
	value: AuditType[],
	selector: string,
	filterCategory: FilterCategoryType,
) => {
	let score: number | null = 1;
	let selectorCategory = [] as string[];
	const tooltips: Tooltips = {};

	for (const audit of value) {
		if (selector === "") {
			continue;
		}
		if (
			!audit.categories.some((category) => filterCategory[category] === false)
		)
			continue;

		score =
			audit.score === null || score === null
				? null
				: Math.min(score ?? 1, audit.score);
		selectorCategory = [
			...Array.from(new Set([...selectorCategory, ...audit.categories])),
		];
		for (const category of audit.categories) {
			if (
				filterCategory[category] === true ||
				filterCategory[category] === undefined
			)
				continue;

			tooltips[category] = [
				...(tooltips[category] ?? []),
				{
					title: audit.title,
					content: audit.description,
					score: audit.score,
					subTitle: audit.categories,
					scoreDisplayMode: audit.scoreDisplayMode,
					id: selector,
				},
			];
		}
	}

	return {
		tooltips,
		selectorCategory,
	};
};

const createMapElement = (
	formFactor: LHResult["formFactor"],
	hideArguments: HideArguments,
	position: PositionType,
	tooltips: Tooltips,
	selectorCategory: string[],
	filter: FilterTypes,
	render: {
		canvas: ShadowRoot;
		lhResult: LHResultForTooltip;
	},
) => {
	try {
		const highlight = createHighlight(
			formFactor,
			hideArguments,
			position,
			filter,
			render,
			selectorCategory,
		);

		let title: string | undefined;
		if (highlight.dataset.target === "rect") {
			title =
				"No element found or Find multiple elements, so the position is maybe not correct.";
		}

		const toolTip = createTooltip(
			tooltips,
			{
				text: title,
				icon: true,
			},
			position,
		);
		highlight.appendChild(toolTip);

		return highlight;
	} catch (e) {
		console.error(e);
		return undefined;
	}
};

export const organizeLHResult = (
	lhResult: RunnerResult,
	weight: number,
	pwa: boolean,
): Omit<LHResult, "url" | "formFactor"> => {
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
		if (!pwa && value.id === "pwa") continue;
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
	let pwaErrors: LHResult["pwaErrors"];
	if (pwa) {
		pwaErrors = [];
	}

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
		if (categories[audit.id] === undefined) continue;
		const category = categories[audit.id] || [];

		if (pwa && category.includes("PWA")) {
			if (audit.score !== null && audit.score < 1) {
				if (pwaErrors !== undefined) {
					pwaErrors.push({
						message: audit.title,
						level: audit.score === 0 ? "error" : "warning",
						content: audit.description,
					});
				}
			}
			continue;
		}

		if (!audit.details) continue;
		if (audit.details.type !== "table" && audit.details.type !== "list")
			continue;
		if (audit.title === "Avoid an excessive DOM size") continue;

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

	if (pwa && pwaErrors !== undefined) {
		return {
			elements,
			metaErrors,
			consoleErrors,
			scoreList,
			categoryCount,
			pwaErrors,
		};
	}
	return {
		elements,
		metaErrors,
		consoleErrors,
		scoreList,
		categoryCount,
	};
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
			if (item.node.path === undefined) continue;
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
			const elemIndex = Number.parseInt(cur);
			if (Number.isNaN(elemIndex)) return acc;

			const elem = `*:nth-child(${elemIndex + 1})`;

			if (index === 1) return `html > body > ${acc}${elem}`;
			return `${acc} > ${elem}`;
		}, "");
};

/**
 * Generate a file name for the LH report
 * @param url - The URL of the page
 * @returns The file name
 * @description
 * `""`and `"/"` to `index.json`, `"/about/"`and `"/about"` to `about.json`, `"/what/about"` and `"/what/about/"` to `what-about.json`,
 * `"/?query=string"` to `index-query=string.json`, `"/?query=string/"` to `index-query=string.json`,
 * `"/about?query=string"` to `about-query=string.json`, `"/about/?query=string"` to `about-query=string.json`
 */
export const generateLHReportFileName = (url: string) => {
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
};

export const generateDefaultLHData = (pwa: boolean) => {
	const lhResult: CacheLHResultByFormFactor = {
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
	if (pwa) {
		lhResult.desktop.elements.pwa = [];
		lhResult.mobile.elements.pwa = [];
	}

	return lhResult;
};
