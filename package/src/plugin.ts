import { type DevToolbarApp } from "astro";
import type {
	CategoryCountByFormFactor,
	FilterCategoryType,
	LHResult,
	ScoreListByFormFactor,
	ScoreListType,
} from "./types/index.js";
import { createFilter, createFilterButton } from "./ui/filter.js";
import { refreshHighlightPositions } from "./ui/highlight.js";
import { desktopIcon, mobileIcon, reloadCircleIcon } from "./ui/icons.js";
import { createScore, createScoreButton } from "./ui/score.js";
import { createToastArea, showToast } from "./ui/toast.js";
import { createToolbar, createToolbarButton } from "./ui/toolbar.js";
import { fetchLighthouse, mappingData, resetLH } from "./utils/lh.js";

const astroPageInsightToolbar: DevToolbarApp = {
	id: "astro-page-insight-app",
	name: "PageInsight",
	icon: "file-search",
	init(canvas) {
		let isFetching = false;
		let fetchButton: HTMLButtonElement | undefined;
		let filterButton: HTMLButtonElement | undefined;
		let scoreButton: HTMLButtonElement | undefined;
		let breakPoint: number | undefined;
		let isFirstLoad = true;
		let filterCategories: FilterCategoryType;
		let scoreListByFormFactor: ScoreListByFormFactor;
		let categoryCountByFormFactor: CategoryCountByFormFactor;
		let formFactor: "mobile" | "desktop" = "desktop";

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

				scoreButton = createScoreButton(canvas, toolbarWrap);

				filterButton = createFilterButton(canvas, toolbarWrap);

				fetchButton = createToolbarButton(
					reloadCircleIcon,
					toolbarWrap,
					false,
					"fetch",
					() => {
						if (isFetching) return;
						fetchStart();
						fetchLighthouse(
							document.documentElement.clientWidth,
							document.documentElement.clientWidth,
							window.location.href,
						);
					},
					"Fetch Lighthouse report.",
				);

				formFactor =
					document.documentElement.clientWidth <= breakPoint
						? "mobile"
						: "desktop";
				const icon = formFactor === "mobile" ? mobileIcon : desktopIcon;
				createToolbarButton(
					icon,
					toolbarWrap,
					true,
					"indicator",
					() => {},
					"Here is current checked device.",
				);

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

				createScore(canvas, formFactor, scoreListByFormFactor[formFactor]);
				createFilter(
					canvas,
					formFactor,
					categoryCountByFormFactor[formFactor],
					filterCategories,
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
						createScore(canvas, formFactor, scoreListByFormFactor[formFactor]);
						createFilter(
							canvas,
							formFactor,
							categoryCountByFormFactor[formFactor],
							filterCategories,
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

				resetLH(canvas, result.formFactor);

				// if (!categories) {
				// 	categories = Object.keys(result.scoreList)
				// 		.sort()
				// 		.reduce((acc, cur) => {
				// 			// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
				// 			return { ...acc, [cur]: true };
				// 		}, {});
				// }

				// mappingData(canvas, result, categories);

				// if (filterButtonWrap) {
				// 	filterElement = createFilter(canvas, categories, result);
				// 	filterButtonWrap.appendChild(filterElement);
				// }

				scoreListByFormFactor[result.formFactor] = result.scoreList;
				categoryCountByFormFactor[result.formFactor] = result.categoryCount;
				createScore(canvas, formFactor, scoreListByFormFactor[formFactor]);
				createFilter(
					canvas,
					formFactor,
					categoryCountByFormFactor[formFactor],
					filterCategories,
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
			if (fetchButton) {
				fetchButton.classList.add("animate");
				fetchButton.disabled = isFetching;
			}
			if (filterButton) filterButton.disabled = isFetching;
			if (scoreButton) scoreButton.disabled = isFetching;
		}

		function fetchSuccess() {
			isFetching = false;
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
