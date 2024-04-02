import { CATEGORIES } from "../constants";
import type { Buttons, LoadOptionsType, PageInsightData } from "../types";
import { createConsoleAlertButton } from "../ui/consoleAlert";
import { initEvent } from "../ui/event";
import { createFilterButton } from "../ui/filter";
import { createHideButton } from "../ui/hide";
import { desktopIcon, mobileIcon } from "../ui/icons";
import { createIndicatorButton, getFormFactor, getIcon } from "../ui/indicator";
import { createScoreButton } from "../ui/score";
import { initStyle } from "../ui/style";
import { createToolbar } from "../ui/toolbar";
import {
	generateDefaultLHData,
	generateLHReportFileName,
	organizeLHResult,
	updateCanvas,
} from "../utils/lh";

export const initPageInsightForClient = async (
	cacheDir: string,
	weight: number,
	pwa: boolean,
	breakPoint: number,
) => {
	const lhResult = generateDefaultLHData(pwa);
	let hasCache = false;

	const fileName = generateLHReportFileName(window.location.href);

	const filePathDesktop = `/${cacheDir}/desktop/${fileName}`;
	const responseDesktop = await fetch(filePathDesktop);
	if (responseDesktop.ok) {
		const data = await responseDesktop.json();
		const result = organizeLHResult(data, weight, pwa);

		lhResult.desktop = result;
		hasCache = true;
	}

	const filePathMobile = `/${cacheDir}/mobile/${fileName}`;
	const responseMobile = await fetch(filePathMobile);
	if (responseMobile.ok) {
		const data = await responseMobile.json();
		const result = organizeLHResult(data, weight, pwa);

		lhResult.mobile = result;
		hasCache = true;
	}

	if (!hasCache) return;

	class PageInsightRoot extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: "open" });
		}
	}

	customElements.define("page-insight-root", PageInsightRoot);
	const pageInsightRoot = document.createElement("page-insight-root");
	document.body.appendChild(pageInsightRoot);

	if (!pageInsightRoot.shadowRoot) return;

	initPageInsight(pageInsightRoot.shadowRoot);

	const options: Omit<LoadOptionsType, "firstFetch"> = {
		breakPoint: breakPoint,
		categories: CATEGORIES,
		lhReports: lhResult,
	};

	initToolbar(pageInsightRoot.shadowRoot, false, options);
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
