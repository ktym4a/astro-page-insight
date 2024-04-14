import { CATEGORIES } from "../constants/index.js";

import type {
	AuditType,
	Buttons,
	FilterCategoryType,
	FilterTypes,
	HideArguments,
	LHResult,
	LHResultForTooltip,
	LoadOptionsType,
	PageInsightData,
	PositionType,
	Tooltips,
	UpdateMappingType,
} from "../types/index.js";
import {
	createConsoleAlertButton,
	createConsoleErrorList,
} from "../ui/consoleAlert.js";
import { initEvent } from "../ui/event.js";
import { createFilter, createFilterButton } from "../ui/filter.js";
import { createHideButton, createHideList } from "../ui/hide.js";
import { createHighlight } from "../ui/highlight.js";
import { desktopIcon, mobileIcon, reloadCircleIcon } from "../ui/icons.js";
import {
	createIndicatorButton,
	getFormFactor,
	getIcon,
} from "../ui/indicator.js";
import { createPowerButton } from "../ui/power.js";
import { createScore, createScoreButton } from "../ui/score.js";
import { initStyle } from "../ui/style.js";
import { createToolbar, createToolbarButton } from "../ui/toolbar.js";
import { createTooltip } from "../ui/tooltip.js";
import {
	generateDefaultLHData,
	generateLHReportFileName,
	organizeLHResult,
} from "../utils/lh.js";

export const initPageInsightForClient = async (
	assetsDir: string,
	showOnLoad: boolean,
	weight: number,
	pwa: boolean,
	breakPoint: number,
) => {
	const lhResult = generateDefaultLHData(pwa);
	let hasCache = false;

	const fileName = generateLHReportFileName(window.location.href);

	const filePathDesktop = `/${assetsDir}/pageinsight/desktop/${fileName}`;
	const responseDesktop = await fetch(filePathDesktop, {
		cache: "no-store",
	});
	if (responseDesktop.ok) {
		const data = await responseDesktop.json();
		const result = organizeLHResult(data, weight, pwa);

		lhResult.desktop = result;
		hasCache = true;
	}

	const filePathMobile = `/${assetsDir}/pageinsight/mobile/${fileName}`;
	const responseMobile = await fetch(filePathMobile, {
		cache: "no-store",
	});
	if (responseMobile.ok) {
		const data = await responseMobile.json();
		const result = organizeLHResult(data, weight, pwa);

		lhResult.mobile = result;
		hasCache = true;
	}

	if (!hasCache) return;

	const pageInsightRoot = document.createElement("page-insight-root");
	document.body.appendChild(pageInsightRoot);

	if (!pageInsightRoot.shadowRoot) return;

	initPageInsight(pageInsightRoot.shadowRoot);

	const options: Omit<LoadOptionsType, "firstFetch"> = {
		breakPoint: breakPoint,
		categories: CATEGORIES,
		lhReports: lhResult,
	};

	const initObj = initToolbar(pageInsightRoot.shadowRoot, !showOnLoad, options);
	createPowerButton(
		pageInsightRoot.shadowRoot,
		showOnLoad,
		initObj.toolbarWrap,
		initObj.buttons,
	);

	const elements = pageInsightRoot.shadowRoot.querySelectorAll(
		".astro-page-insight-highlight",
	);

	if (!showOnLoad) {
		for (const element of elements) {
			if (element instanceof HTMLElement) {
				element.style.display = "none";
			}
		}
	}
};

export const removePageInsightRoot = () => {
	const pageInsightRoot = document.querySelector("page-insight-root");
	if (pageInsightRoot) {
		document.body.removeChild(pageInsightRoot);
	}
};

export const initPageInsight = (root: ShadowRoot) => {
	initStyle(root);
	initEvent(root);
};

export const initToolbar = (
	root: ShadowRoot,
	isFetching: boolean,
	options: Omit<LoadOptionsType, "firstFetch">,
): {
	buttons: Omit<Buttons, "fetchButton">;
	toolbarWrap: HTMLDivElement;
	breakPoint: number;
	pageInsightData: PageInsightData;
} => {
	const toolbarWrap = createToolbar(root);

	const formFactor = getFormFactor(options.breakPoint);
	const icon = getIcon(formFactor);
	createIndicatorButton(toolbarWrap, icon);

	const buttons = {
		consoleAlertButton: createConsoleAlertButton(root, toolbarWrap, isFetching),
		hideButton: createHideButton(root, toolbarWrap, isFetching),
		scoreButton: createScoreButton(root, toolbarWrap, isFetching),
		filterButton: createFilterButton(root, toolbarWrap, isFetching),
	};

	const scoreListByFormFactor = {
		mobile: options.lhReports.mobile.scoreList,
		desktop: options.lhReports.desktop.scoreList,
	};

	const filterCategories = options.categories.reduce((acc, cur) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
			...acc,
			[cur]: false,
		};
	}, {});

	const categoryCountByFormFactor = {
		mobile: options.lhReports.mobile.categoryCount,
		desktop: options.lhReports.desktop.categoryCount,
	};

	const lhResultByFormFactor = {
		mobile: {
			elements: options.lhReports.mobile.elements,
			metaErrors: options.lhReports.mobile.metaErrors,
			consoleErrors: options.lhReports.mobile.consoleErrors,
			pwaErrors: options.lhReports.mobile.pwaErrors,
		},
		desktop: {
			elements: options.lhReports.desktop.elements,
			metaErrors: options.lhReports.desktop.metaErrors,
			consoleErrors: options.lhReports.desktop.consoleErrors,
			pwaErrors: options.lhReports.desktop.pwaErrors,
		},
	};

	const hideHighlights = {
		mobile: [],
		desktop: [],
	};

	updateCanvas({
		canvas: root,
		result: lhResultByFormFactor[formFactor],
		filter: {
			categories: filterCategories,
			hideList: hideHighlights[formFactor],
		},
		formFactor,
		scoreList: scoreListByFormFactor[formFactor],
		categoryCount: categoryCountByFormFactor[formFactor],
	});

	const mediaQuery = window.matchMedia(`(max-width: ${options.breakPoint}px)`);

	const handleMediaQuery = (mql: MediaQueryListEvent) => {
		const indicatorButton = root.querySelector<HTMLButtonElement>(
			'button[data-button-type="indicator"]',
		);

		let formFactor: "mobile" | "desktop";
		if (mql.matches) {
			formFactor = "mobile";
			if (indicatorButton) indicatorButton.innerHTML = mobileIcon;
		} else {
			formFactor = "desktop";
			if (indicatorButton) indicatorButton.innerHTML = desktopIcon;
		}
		updateCanvas({
			canvas: root,
			result: lhResultByFormFactor[formFactor],
			filter: {
				categories: filterCategories,
				hideList: hideHighlights[formFactor],
			},
			formFactor,
			scoreList: scoreListByFormFactor[formFactor],
			categoryCount: categoryCountByFormFactor[formFactor],
		});
	};

	mediaQuery.addEventListener("change", handleMediaQuery);

	document.addEventListener("astro:before-preparation", () => {
		mediaQuery.removeEventListener("change", handleMediaQuery);
	});

	return {
		buttons,
		toolbarWrap,
		breakPoint: options.breakPoint,
		pageInsightData: {
			scoreListByFormFactor,
			categoryCountByFormFactor,
			lhResultByFormFactor,
			hideHighlights,
			filterCategories,
		},
	};
};

export const updateCanvas = ({
	canvas,
	result,
	filter,
	formFactor,
	scoreList,
	categoryCount,
}: UpdateMappingType) => {
	mappingData(formFactor, canvas, result, filter);
	createHideList(canvas, formFactor, result, filter);
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
