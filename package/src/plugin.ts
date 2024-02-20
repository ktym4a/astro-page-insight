import { type DevToolbarApp } from "astro";
import type { LHResult } from "./types/index.js";
import { createFilter } from "./ui/filter.js";
import { refreshHighlightPositions } from "./ui/highlight.js";
import { filterIcon, reloadCircleIcon } from "./ui/icons.js";
import { createToastArea, showToast } from "./ui/toast.js";
import { createToolbar, createToolbarButton } from "./ui/toolbar.js";
import { fetchLighthouse, mappingData, resetLH } from "./utils/lh.js";

const astroPageInsightToolbar: DevToolbarApp = {
	id: "astro-page-insight-app",
	name: "PageInsight",
	icon: "file-search",
	init(canvas) {
		let isFetching = false;
		let fetchButton: HTMLButtonElement;
		let filterButton: HTMLButtonElement;
		let toastArea: HTMLDivElement;
		let showCategory: string[];
		let filterCategory: string[];
		let filterElement: HTMLDivElement | null;
		let lhResult: LHResult;

		initCanvas();

		document.addEventListener("astro:after-swap", initCanvas);

		import.meta.hot?.on(
			"astro-dev-toolbar:astro-page-insight-app:on-success",
			(result: LHResult) => {
				resetLH(canvas);
				if (result.url !== window.location.href) {
					isFetching = false;
					fetchButton.classList.remove("animate");
					fetchButton.disabled = false;
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
				canvas.appendChild(filterElement);

				isFetching = false;
				fetchButton.classList.remove("animate");
				fetchButton.disabled = false;
				filterButton.disabled = false;

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
				isFetching = false;
				fetchButton.classList.remove("animate");
				fetchButton.disabled = false;

				showToast(toastArea, message, "error");
			},
		);

		function initCanvas() {
			canvas.innerHTML += `
      <style>
        :host {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          color: rgba(191, 193, 201, 1);
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

			filterButton = createToolbarButton(
				filterIcon,
				() => {
					if (!filterElement) return;
					filterElement.style.display =
						filterElement.style.display === "none" ? "block" : "none";
				},
				"Filter the result.",
			);
			filterButton.disabled = true;
			toolbarWrap.appendChild(filterButton);

			fetchButton = createToolbarButton(
				reloadCircleIcon,
				() => {
					if (isFetching) return;
					isFetching = true;
					fetchButton.classList.add("animate");
					fetchButton.disabled = true;
					filterButton.disabled = true;

					fetchLighthouse(
						document.documentElement.clientWidth,
						document.documentElement.clientWidth,
						window.location.href,
					);
				},
				"Fetch Lighthouse report.",
			);

			if (isFetching) {
				fetchButton.classList.add("animate");
				fetchButton.disabled = true;
			}

			toolbarWrap.appendChild(fetchButton);

			for (const event of ["scroll", "resize"]) {
				window.addEventListener(event, () => refreshHighlightPositions(canvas));
			}
		}
	},
};

export default astroPageInsightToolbar;
