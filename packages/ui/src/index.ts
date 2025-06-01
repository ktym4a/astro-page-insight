// Main coordinator
export { mappingData } from "./coordinator.js";

// UI Components
export {
	createConsoleAlertButton,
	createConsoleErrorList,
} from "./components/consoleAlert.js";
export { initEvent } from "./components/event.js";
export { createFilter, createFilterButton } from "./components/filter.js";
export { createHideButton, createHideList } from "./components/hide.js";
export {
	createHighlight,
	refreshHighlightPositions,
} from "./components/highlight.js";
export {
	createIndicatorButton,
	getFormFactor,
} from "./components/indicator.js";
export { createPowerButton } from "./components/power.js";
export { createScore, createScoreButton } from "./components/score.js";
export { initStyle } from "./components/style.js";
export { createToastArea, showToast } from "./components/toast.js";
export {
	createToolbar,
	createToolbarButton,
	createToolbarContentWrapper,
	createToolbarElement,
	createToolbarSubTitle,
	createToolbarTitle,
	createToolbarWrapper,
	toggleToolbarWrapper,
} from "./components/toolbar.js";
export { createTooltip } from "./components/tooltip.js";

// Icons
export * from "./components/icons.js";

// Types
export type {
	AuditType,
	Buttons,
	CategoryCountType,
	ErrorTooltips,
	FilterCategoryType,
	FilterTypes,
	HideArguments,
	HideElement,
	LHResult,
	LHResultForTooltip,
	PositionType,
	ScoreListType,
	Tooltips,
	UpdateMappingType,
} from "./types/index.js";

// Constants
export { CATEGORIES, COLORS } from "./constants/index.js";

// Utils
export { getColorKey } from "./utils/color.js";
