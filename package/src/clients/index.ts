import {
	type Buttons,
	CATEGORIES,
	type UpdateMappingType,
	createConsoleAlertButton,
	createConsoleErrorList,
	createFilter,
	createFilterButton,
	createHideButton,
	createHideList,
	createIndicatorButton,
	createPowerButton,
	createScore,
	createScoreButton,
	createToolbar,
	desktopIcon,
	getFormFactor,
	initEvent,
	initStyle,
	mappingData,
	mobileIcon,
} from "@page-insight/ui";

import { clientEngineRegistry } from "../engines/client-registry.js";
import type { LoadOptionsType, PageInsightData, CacheLHResultByFormFactor } from "../types/index.js";

export const initPageInsightForClient = async (
	assetsDir: string,
	showOnLoad: boolean,
	weight: number,
	breakPoint: number,
) => {
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
	let hasCache = false;

	const engineName = "lighthouse";
	const engine = clientEngineRegistry.get(engineName);

	if (engine) {
		const fileName = engine.generateFileName(window.location.href);

		const filePathDesktop = `/${assetsDir}/pageinsight/desktop/${fileName}`;
		const responseDesktop = await fetch(filePathDesktop, {
			cache: "no-store",
		});
		if (responseDesktop.ok) {
			const serializedData = await responseDesktop.text();
			const rawResult = engine.deserializeResult(serializedData);
			const result = engine.organizeResult(rawResult, weight);

			lhResult.desktop = result;
			hasCache = true;
		}

		const filePathMobile = `/${assetsDir}/pageinsight/mobile/${fileName}`;
		const responseMobile = await fetch(filePathMobile, {
			cache: "no-store",
		});
		if (responseMobile.ok) {
			const serializedData = await responseMobile.text();
			const rawResult = engine.deserializeResult(serializedData);
			const result = engine.organizeResult(rawResult, weight);

			lhResult.mobile = result;
			hasCache = true;
		}
	}

	if (!hasCache) return;

	const pageInsightRoot = document.createElement("page-insight-root");
	document.body.appendChild(pageInsightRoot);

	if (!pageInsightRoot.shadowRoot) return;

	initPageInsight(pageInsightRoot.shadowRoot);

	const options: Omit<LoadOptionsType, "firstFetch"> = {
		breakPoint: breakPoint,
		categories: CATEGORIES,
		reports: lhResult,
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
	const existingToolbars = root.querySelectorAll(".astro-page-insight-toolbar");
	for (const toolbar of existingToolbars) {
		toolbar.remove();
	}

	const toolbarWrap = createToolbar(root);

	const formFactor = getFormFactor(options.breakPoint);
	const indicatorButton = createIndicatorButton(toolbarWrap, formFactor);

	const buttons = {
		consoleAlertButton: createConsoleAlertButton(root, toolbarWrap, isFetching),
		hideButton: createHideButton(root, toolbarWrap, isFetching),
		scoreButton: createScoreButton(root, toolbarWrap, isFetching),
		filterButton: createFilterButton(root, toolbarWrap, isFetching),
	};

	const scoreListByFormFactor = {
		mobile: options.reports.mobile.scoreList,
		desktop: options.reports.desktop.scoreList,
	};

	const filterCategories = options.categories.reduce(
		(acc, cur) => {
			acc[cur] = false;
			return acc;
		},
		{} as Record<string, boolean>,
	);

	const categoryCountByFormFactor = {
		mobile: options.reports.mobile.categoryCount,
		desktop: options.reports.desktop.categoryCount,
	};

	const lhResultByFormFactor = {
		mobile: {
			elements: options.reports.mobile.elements,
			metaErrors: options.reports.mobile.metaErrors,
			consoleErrors: options.reports.mobile.consoleErrors,
		},
		desktop: {
			elements: options.reports.desktop.elements,
			metaErrors: options.reports.desktop.metaErrors,
			consoleErrors: options.reports.desktop.consoleErrors,
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
		let formFactor: "mobile" | "desktop";
		if (mql.matches) {
			formFactor = "mobile";
			if (indicatorButton) {
				indicatorButton.innerHTML = mobileIcon;
				indicatorButton.dataset.formFactor = formFactor;
			}
		} else {
			formFactor = "desktop";
			if (indicatorButton) {
				indicatorButton.innerHTML = desktopIcon;
				indicatorButton.dataset.formFactor = formFactor;
			}
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
	);
};
