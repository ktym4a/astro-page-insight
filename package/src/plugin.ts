import { type DevToolbarApp } from "astro";
import type {
	CategoryCountByFormFactor,
	FilterCategoryType,
	HideElementsByFormFactor,
	LHResult,
	LHResultByFormFactor,
	ScoreListByFormFactor,
	ScoreListType,
} from "./types/index.js";
import { createFilter, createFilterButton } from "./ui/filter.js";
import { createHideButton, createHideList } from "./ui/hide.js";
import { refreshHighlightPositions } from "./ui/highlight.js";
import { desktopIcon, mobileIcon } from "./ui/icons.js";
import {
	createIndicatorButton,
	getFormFactor,
	getIcon,
} from "./ui/indicator.js";
import { createScore, createScoreButton } from "./ui/score.js";
import { createToastArea, showToast } from "./ui/toast.js";
import { createToolbar } from "./ui/toolbar.js";
import { createFetchButton, mappingData } from "./utils/lh.js";

const astroPageInsightToolbar: DevToolbarApp = {
	id: "astro-page-insight-app",
	name: "PageInsight",
	icon: "file-search",
	init(canvas) {
		let isFetching = false;
		let fetchButton: HTMLButtonElement | undefined;
		let filterButton: HTMLButtonElement | undefined;
		let scoreButton: HTMLButtonElement | undefined;
		let hideButton: HTMLButtonElement | undefined;
		let breakPoint: number | undefined;
		let isFirstLoad = true;
		let filterCategories: FilterCategoryType;
		let scoreListByFormFactor: ScoreListByFormFactor;
		let categoryCountByFormFactor: CategoryCountByFormFactor;
		let lhResultByFormFactor: LHResultByFormFactor;
		let formFactor: "mobile" | "desktop" = "desktop";
		let hideElements: HideElementsByFormFactor;

		const isLightHouse =
			new URL(window.location.href).searchParams.get("astro-page-insight") ===
			"true";

		if (isLightHouse) return;

		initCanvas();
		document.addEventListener("astro:page-load", initCanvas);

		import.meta.hot?.on(
			"astro-dev-toolbar:astro-page-insight-app:options",
			({
				breakPoint: bp,
				categories,
			}: {
				breakPoint: number;
				categories: string[];
			}) => {
				breakPoint = bp;

				const toolbarWrap = createToolbar(canvas);
				createToastArea(canvas);

				hideButton = createHideButton(canvas, toolbarWrap);

				scoreButton = createScoreButton(canvas, toolbarWrap);

				filterButton = createFilterButton(canvas, toolbarWrap);

				fetchButton = createFetchButton(toolbarWrap, isFetching, fetchStart);

				formFactor = getFormFactor(breakPoint);

				const icon = getIcon(formFactor);
				createIndicatorButton(toolbarWrap, icon);

				const style = document.createElement("style");
				style.textContent = `
					@media (max-width: ${breakPoint}px) {
						*[data-form-factor="desktop"] {
							display: none !important;
						}
					}
					@media (min-width: ${breakPoint + 1}px) {
						*[data-form-factor="mobile"] {
							display: none !important;
						}
					}
				`;
				canvas.appendChild(style);

				const scoreList: ScoreListType = categories.reduce((acc, cur) => {
					// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
					return { ...acc, [cur]: null };
				}, {});
				scoreListByFormFactor = {
					mobile: scoreList,
					desktop: scoreList,
				};
				filterCategories = categories.reduce((acc, cur) => {
					return {
						// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
						...acc,
						[cur]: false,
					};
				}, {});
				categoryCountByFormFactor = {
					mobile: {},
					desktop: {},
				};
				lhResultByFormFactor = {
					mobile: {
						elements: {},
						metaErrors: [],
						consoleErrors: [],
					},
					desktop: {
						elements: {},
						metaErrors: [],
						consoleErrors: [],
					},
				};
				hideElements = {
					mobile: [],
					desktop: [],
				};

				createHideList(canvas, formFactor, hideElements[formFactor]);
				createScore(canvas, formFactor, scoreListByFormFactor[formFactor]);
				createFilter(
					canvas,
					formFactor,
					categoryCountByFormFactor[formFactor],
					filterCategories,
					lhResultByFormFactor[formFactor],
				);

				if (isFirstLoad) {
					const mediaQuery = window.matchMedia(`(max-width: ${breakPoint}px)`);

					const handleMediaQuery = (mql: MediaQueryListEvent) => {
						const indicatorButton = canvas.querySelector<HTMLButtonElement>(
							'button[data-button-type="indicator"]',
						);
						if (mql.matches) {
							formFactor = "mobile";
							if (indicatorButton) indicatorButton.innerHTML = mobileIcon;
						} else {
							formFactor = "desktop";
							if (indicatorButton) indicatorButton.innerHTML = desktopIcon;
						}
						mappingData(
							canvas,
							lhResultByFormFactor[formFactor],
							filterCategories,
						);
						createHideList(canvas, formFactor, hideElements[formFactor]);
						createScore(canvas, formFactor, scoreListByFormFactor[formFactor]);
						createFilter(
							canvas,
							formFactor,
							categoryCountByFormFactor[formFactor],
							filterCategories,
							lhResultByFormFactor[formFactor],
						);
					};
					mediaQuery.addEventListener("change", handleMediaQuery);
					isFirstLoad = false;
				}
			},
		);

		import.meta.hot?.on(
			"astro-dev-toolbar:astro-page-insight-app:on-success",
			(result: LHResult) => {
				if (result.url !== window.location.href) {
					errorToggle();

					showToast(
						"The result is not for this page.\n Please try again.",
						"error",
					);
					return;
				}

				lhResultByFormFactor[result.formFactor] = {
					elements: result.elements,
					metaErrors: result.metaErrors,
					consoleErrors: result.consoleErrors,
				};
				scoreListByFormFactor[result.formFactor] = result.scoreList;
				categoryCountByFormFactor[result.formFactor] = result.categoryCount;
				hideElements[result.formFactor] = [];

				mappingData(canvas, lhResultByFormFactor[formFactor], filterCategories);
				createScore(canvas, formFactor, scoreListByFormFactor[formFactor]);
				createFilter(
					canvas,
					formFactor,
					categoryCountByFormFactor[formFactor],
					filterCategories,
					lhResultByFormFactor[formFactor],
				);

				fetchSuccess();

				showToast("Analysis of lighthouse results is complete.", "success");
			},
		);

		import.meta.hot?.on(
			"astro-dev-toolbar:astro-page-insight-app:on-error",
			(message: string) => {
				errorToggle();

				showToast(message, "error");
			},
		);

		function initCanvas() {
			canvas.innerHTML += `
      <style>
        :host {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          color: #cdd6f4;
        }

		a {
			color: #89b4fa;
		}

		a:visted {
			color: #89b4fa;
		}

		svg {
			width: 100%;
			height: auto;
		}

        .toast {
          position: fixed;
          top: 20px;
          right: 10px;
          padding: 10px 20px;
          border-radius: 10px;
          background: #f38ba8;
          color: #11111b;
          border: 1px solid #a6adc8;
          z-index: 1000;
          font-size: 16px;
        }

		.astro-page-insight-highlight button {
            display: inline-flex;
            position: absolute;
			top: 0;
			right: 0;
			z-index: 200006;
            padding: 2px;
			border-radius: 3px;
            align-items: center;
			justify-content: center;
            border: 1px solid #cdd6f4;
            color: #cdd6f4;
            background-color: #181825;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

		.astro-page-insight-highlight button:hover {
            background-color: #45475a;
        }

		.astro-page-insight-highlight button:focus-visible {
            outline-offset: -2px;
            background-color: #45475a;
        }

		.astro-page-insight-highlight button:disabled {
            cursor: not-allowed;
            background-color: #6c7086 !important;
        }

		.astro-page-insight-highlight button > svg {
            width: 20px;
            height: 20px;
        }
      </style>
      `;
			if (isFirstLoad) {
				for (const event of ["scroll", "resize"]) {
					window.addEventListener(event, () => {
						refreshHighlightPositions(canvas);
					});
				}
			}
			import.meta.hot?.send("astro-dev-toolbar:astro-page-insight-app:init");
		}

		function fetchStart() {
			isFetching = true;
			if (hideButton) hideButton.disabled = isFetching;
			if (fetchButton) {
				fetchButton.classList.add("animate");
				fetchButton.disabled = isFetching;
			}
			if (filterButton) filterButton.disabled = isFetching;
			if (scoreButton) scoreButton.disabled = isFetching;
		}

		function fetchSuccess() {
			isFetching = false;
			if (hideButton) hideButton.disabled = isFetching;
			if (fetchButton) {
				fetchButton.classList.remove("animate");
				fetchButton.disabled = isFetching;
			}
			if (filterButton) filterButton.disabled = isFetching;
			if (scoreButton) scoreButton.disabled = isFetching;
		}

		function errorToggle() {
			isFetching = false;
			if (fetchButton) {
				fetchButton.classList.remove("animate");
				fetchButton.disabled = isFetching;
			}
		}
	},
};

export default astroPageInsightToolbar;
