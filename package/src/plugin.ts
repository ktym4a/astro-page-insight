import { type DevToolbarApp } from "astro";
import type { LHResult } from "./types/index.js";
import { createFilter } from "./ui/filter.js";
import { refreshHighlightPositions } from "./ui/highlight.js";
import { analyticsIcon, filterIcon, reloadCircleIcon } from "./ui/icons.js";
import { createScore } from "./ui/score.js";
import { createToastArea, showToast } from "./ui/toast.js";
import {
	createToolbar,
	createToolbarButton,
	toggleToolbarWrapper,
} from "./ui/toolbar.js";
import { fetchLighthouse, mappingData, resetLH } from "./utils/lh.js";

const astroPageInsightToolbar: DevToolbarApp = {
	id: "astro-page-insight-app",
	name: "PageInsight",
	icon: "file-search",
	init(canvas) {
		let isFetching = false;
		let fetchButton: HTMLButtonElement;
		let toastArea: HTMLDivElement;
		let showCategory: string[];
		let filterCategory: string[];
		let filterButton: HTMLButtonElement;
		let filterElement: HTMLDivElement | null;
		let filterButtonWrap: HTMLDivElement;
		let scoreButton: HTMLButtonElement;
		let scoreElement: HTMLDivElement | null;
		let scoreButtonWrap: HTMLDivElement;
		let lhResult: LHResult;
		let breakPoint: number;

		initCanvas();

		document.addEventListener("astro:after-swap", initCanvas);

		import.meta.hot?.send('astro-dev-toolbar:astro-page-insight-app:ready');
		import.meta.hot?.on('astro-dev-toolbar:astro-page-insight-app:ready', ({ breakPoint: bp }) => {
			breakPoint = bp;
		});

		import.meta.hot?.on(
			"astro-dev-toolbar:astro-page-insight-app:on-success",
			(result: LHResult) => {
				resetLH(canvas);
				if (result.url !== window.location.href) {
					errorToggle();

					showToast(
						toastArea,
						"The result is not for this page.\n Please try again.",
						"error",
					);
					return;
				}

				lhResult = result;
				showCategory = filterCategory = Object.keys(lhResult.scoreList).sort();

				mappingData(canvas, lhResult, filterCategory);

				filterElement = createFilter(canvas, showCategory, {
					filterCategory,
					lhResult,
				});
				filterButtonWrap.appendChild(filterElement);

				scoreElement = createScore(lhResult.scoreList);
				scoreButtonWrap.appendChild(scoreElement);

				fetchSuccess();

				showToast(
					toastArea,
					"Analysis of lighthouse results is complete.",
					"success",
				);
			},
		);

		import.meta.hot?.on(
			"astro-dev-toolbar:astro-page-insight-app:on-error",
			(message: string) => {
				resetLH(canvas);
				errorToggle();

				showToast(toastArea, message, "error");
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
			const toolbarWrap = createToolbar(canvas);
			toastArea = createToastArea();
			canvas.appendChild(toastArea);

			scoreButton = createToolbarButton(
				analyticsIcon,
				"score",
				() => {
					if (!scoreElement) return;
					toggleToolbarWrapper(canvas, "score");
				},
				"Show the score of each category.",
			);
			scoreButton.disabled = true;
			scoreButtonWrap = document.createElement("div");
			scoreButtonWrap.classList.add("astro-page-insight-toolbar-button-wrap");
			scoreButtonWrap.appendChild(scoreButton);
			toolbarWrap.appendChild(scoreButtonWrap);

			filterButton = createToolbarButton(
				filterIcon,
				"filter",
				() => {
					if (!filterElement) return;
					toggleToolbarWrapper(canvas, "filter");
				},
				"Filter the result.",
			);
			filterButton.disabled = true;
			filterButtonWrap = document.createElement("div");
			filterButtonWrap.classList.add("astro-page-insight-toolbar-button-wrap");
			filterButtonWrap.appendChild(filterButton);
			toolbarWrap.appendChild(filterButtonWrap);

			fetchButton = createToolbarButton(
				reloadCircleIcon,
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

			if (isFetching) {
				fetchStart();
			}
			const fetchButtonWrap = document.createElement("div");
			fetchButtonWrap.classList.add("astro-page-insight-toolbar-button-wrap");
			fetchButtonWrap.appendChild(fetchButton);
			toolbarWrap.appendChild(fetchButtonWrap);

			for (const event of ["scroll", "resize"]) {
				window.addEventListener(event, () => refreshHighlightPositions(canvas));
			}
		}

		function fetchStart() {
			isFetching = true;
			fetchButton.classList.add("animate");
			fetchButton.disabled = true;
			filterButton.disabled = true;
			scoreButton.disabled = true;
		}

		function fetchSuccess() {
			isFetching = false;
			fetchButton.classList.remove("animate");
			fetchButton.disabled = false;
			filterButton.disabled = false;
			scoreButton.disabled = false;
		}

		function errorToggle() {
			isFetching = false;
			fetchButton.classList.remove("animate");
			fetchButton.disabled = false;
			filterButton.disabled = true;
			scoreButton.disabled = true;
		}
	},
};

export default astroPageInsightToolbar;
