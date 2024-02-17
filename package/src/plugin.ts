import { type DevToolbarApp } from "astro";
import type { DevToolbarTooltipSection } from "astro/runtime/client/dev-toolbar/ui-library/tooltip.js";
import { CATEGORIES } from "./constants.js";
import type { LHResult, Tooltips } from "./types.js";
import {
	createHighlight,
	refreshHighlightPositions,
	resetHighlights,
} from "./ui/highlight.js";
import { createTooltip } from "./ui/tooltip.js";

const BR_REGEX = /\n/g;

const astroPageInsightToolbar: DevToolbarApp = {
	id: "astro-page-insight-app",
	name: "PageInsight",
	icon: "file-search",
	init(canvas) {
		let isFetching = false;
		let areaElm: HTMLDivElement;
		let fetchButton: HTMLButtonElement;
		// let previewButton: HTMLButtonElement;
		// let elements: LHResult['elements'];

		initCanvas();

		document.addEventListener("astro:after-swap", initCanvas);

		import.meta.hot?.on(
			"astro-dev-toolbar:astro-page-insight-app:on-success",
			(result: LHResult) => {
				if (result.url !== window.location.href) {
					errorToast("The result is not for this page.\n Please try again.");
					if (isFetching) {
						isFetching = false;
						// previewButton.disabled = true;
						// previewButton.innerHTML = eyeXSvg;
						fetchButton.classList.remove("animate");
						fetchButton.disabled = false;
					}
					return;
				}

				isFetching = false;
				// previewButton.disabled = false;
				// previewButton.innerHTML = eyeSvg;
				fetchButton.classList.remove("animate");
				fetchButton.disabled = false;

				const metaErrors = [] as DevToolbarTooltipSection[];

				// elements = result.elements;

				for (const [selector, value] of Object.entries(result.elements)) {
					let selectorCategory = [] as string[];
					const tooltips: Tooltips = {};

					let score: number | null = 1;
					if (!value[0]) continue;

					for (const audit of value) {
						if (selector === "") {
							metaErrors.push({
								title: audit.title,
								content: audit.description,
							});
							continue;
						}

						score =
							audit.score === null || score === null
								? null
								: Math.min(score ?? 1, audit.score);
						selectorCategory = [
							...Array.from(
								new Set([...selectorCategory, ...audit.categories]),
							),
						];
						for (const category of audit.categories) {
							if (!CATEGORIES.includes(category.toLowerCase())) continue;

							tooltips[category] = [
								...(tooltips[category] ?? []),
								{
									title: audit.title,
									content: audit.description,
									score: audit.score,
									subTitle: audit.categories,
									id: selector,
								},
							];
						}
					}

					try {
						if (selector === "") continue;
						const position = value[0].rect;
						if (
							position.width === 0 &&
							position.height === 0 &&
							position.top === 0 &&
							position.left === 0
						)
							continue;

						const highlight = createHighlight(
							selector,
							value[0].rect,
							selectorCategory,
						);
						highlight.dataset.selector = selector;

						let title: string | undefined;
						if (highlight.dataset.target === "rect") {
							title =
								"No element found or Find multiple elements, so the position is maybe not correct.";
						}

						createTooltip(highlight, tooltips, title);

						canvas.appendChild(highlight);
					} catch (e) {
						// console.error(e);
					}
				}

				const globalTooltips = [] as DevToolbarTooltipSection[];

				if (metaErrors.length > 0) {
					globalTooltips.push(
						{
							title: "Error in the meta tag.",
						},
						...metaErrors,
					);
				}

				if (result.console.length > 0) {
					globalTooltips.push(
						{
							title: "Error in console.",
						},
						...result.console.map((message) => ({
							content: message,
						})),
					);
				}

				//   if (globalTooltips.length > 0) {
				//     const tooltip = createTooltip(globalTooltips, 0, true);

				//     tooltip.style.position = 'fixed';
				//     tooltip.style.width = '200px';
				//     tooltip.style.bottom = '0';
				//     tooltip.dataset.show = 'true';

				//     canvas.appendChild(tooltip);
				//   }
			},
		);

		import.meta.hot?.on(
			"astro-dev-toolbar:astro-page-insight-app:on-error",
			(message: string) => {
				isFetching = false;
				// previewButton.disabled = false;
				// previewButton.innerHTML = eyeSvg;
				fetchButton.classList.remove("animate");
				fetchButton.disabled = false;

				errorToast(message);
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

        .button-wrapper {
          position: fixed;
          bottom: 20px;
          right: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          justify-content: center;
          z-index: 1000;
        }
        .button-wrapper button {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: none;
          background: #181825;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #a6adc8;
        }

        .button-wrapper button svg {
          width: 30px;
          height: 30px;
          color: #cdd6f4;
        }

        .button-wrapper button.animate svg {
          animation: rotate 1s infinite;
        }

        .button-wrapper button:disabled {
          cursor: not-allowed;
          background: #585b70;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
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

			areaElm = createPageInsightToolArea(canvas);

			fetchButton = createButton(analyzeSvg, () => {
				resetHighlights(canvas);
				fetchLighthouse();
			});

			if (isFetching) {
				fetchButton.classList.add("animate");
				fetchButton.disabled = true;
			}

			// previewButton = createButton(eyeXSvg, () => {});
			// previewButton.disabled = true;

			// areaElm.appendChild(previewButton);
			areaElm.appendChild(fetchButton);

			for (const event of ["scroll", "resize"]) {
				window.addEventListener(event, () => refreshHighlightPositions(canvas));
			}
		}

		function createButton(innerHTML: string, action: () => void) {
			const button = document.createElement("button");
			button.innerHTML = innerHTML;
			button.addEventListener("click", action);
			return button;
		}

		function createPageInsightToolArea(canvas: ShadowRoot) {
			const wrapper = document.createElement("div");
			wrapper.classList.add("button-wrapper");

			canvas.appendChild(wrapper);
			return wrapper;
		}

		function fetchLighthouse() {
			if (isFetching) return;

			isFetching = true;
			// previewButton.disabled = true;
			// previewButton.innerHTML = eyeXSvg;
			fetchButton.classList.add("animate");
			fetchButton.disabled = true;

			const width = document.documentElement.clientWidth;
			const height = document.documentElement.clientHeight;
			const url = window.location.href;

			import.meta.hot?.send(
				"astro-dev-toolbar:astro-page-insight-app:run-lighthouse",
				{
					width,
					height,
					url,
				},
			);
		}

		function errorToast(message: string) {
			const toast = document.createElement("div");
			toast.classList.add("toast");
			toast.innerHTML = message.replace(BR_REGEX, "<br>");
			canvas.appendChild(toast);
			setTimeout(() => {
				toast.remove();
			}, 5000);
		}
	},
};

export default astroPageInsightToolbar;

const analyzeSvg =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -6.986 -6.918a8.095 8.095 0 0 0 -8.019 3.918" /><path d="M4 13a8.1 8.1 0 0 0 15 3" /><path d="M19 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M5 8m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>';

// const eyeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>';

// const eyeXSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M13.048 17.942a9.298 9.298 0 0 1 -1.048 .058c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6a17.986 17.986 0 0 1 -1.362 1.975" /><path d="M22 22l-5 -5" /><path d="M17 22l5 -5" /></svg>';
