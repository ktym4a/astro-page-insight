import type { LoadOptionsType } from "../types";
import { createConsoleAlertButton } from "../ui/consoleAlert";
import { initEvent } from "../ui/event";
import { createFilterButton } from "../ui/filter";
import { createHideButton } from "../ui/hide";
import { createIndicatorButton, getFormFactor, getIcon } from "../ui/indicator";
import { createScoreButton } from "../ui/score";
import { initStyle } from "../ui/style";
import { createToolbar } from "../ui/toolbar";
import { updateCanvas } from "../utils/lh";

export const initCanvas = (root: ShadowRoot) => {
	initStyle(root);
	initEvent(root);
};

export const initPageInsight = (
	root: ShadowRoot,
	isFetching: boolean,
	options: LoadOptionsType,
) => {
	const toolbarWrap = createToolbar(root);

	const consoleAlertButton = createConsoleAlertButton(
		root,
		toolbarWrap,
		isFetching,
	);

	const hideButton = createHideButton(root, toolbarWrap, isFetching);

	const scoreButton = createScoreButton(root, toolbarWrap, isFetching);

	const filterButton = createFilterButton(root, toolbarWrap, isFetching);

	const formFactor = getFormFactor(options.breakPoint);

	const icon = getIcon(formFactor);
	createIndicatorButton(toolbarWrap, icon);

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
};
