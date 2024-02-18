import { type DevToolbarApp } from "astro";
import type { DevToolbarTooltipSection } from "astro/runtime/client/dev-toolbar/ui-library/tooltip.js";
import { CATEGORIES } from "./constants.js";
import type { ErrorTooltips, LHResult, Tooltips } from "./types.js";
import {
	createHighlight,
	refreshHighlightPositions,
	resetHighlights,
} from "./ui/highlight.js";
import {
	createToolbar,
	createToolbarButton,
	reloadIcon,
} from "./ui/toolbar.js";
import { createTooltip } from "./ui/tooltip.js";
import { fetchLighthouse } from "./utils/lh.js";

const BR_REGEX = /\n/g;

const astroPageInsightToolbar: DevToolbarApp = {
	id: "astro-page-insight-app",
	name: "PageInsight",
	icon: "file-search",
	init(canvas) {
		let isFetching = false;
		let fetchButton: HTMLButtonElement;

		initCanvas();

		document.addEventListener("astro:after-swap", initCanvas);

		import.meta.hot?.on(
			"astro-dev-toolbar:astro-page-insight-app:on-success",
			(result: LHResult) => {
				if (result.url !== window.location.href) {
					errorToast("The result is not for this page.\n Please try again.");

					isFetching = false;
					fetchButton.classList.remove("animate");
					fetchButton.disabled = false;
					return;
				}

				isFetching = false;
				fetchButton.classList.remove("animate");
				fetchButton.disabled = false;
				resetHighlights(canvas);

				const metaErrors = [] as DevToolbarTooltipSection[];

				if (
					result.consoleErrors.length !== 0 ||
					result.metaErrors.length !== 0
				) {
					const tooltips: ErrorTooltips = {};
					for (const consoleMessage of result.consoleErrors) {
						const category = "Console";
						const content = consoleMessage.content ?? "";
						tooltips[category] = [
							...(tooltips[category] ?? []),
							{
								title: consoleMessage.message,
								score: consoleMessage.level === "error" ? 0 : 0.5,
								content,
							},
						];
					}

					for (const metaError of result.metaErrors) {
						const category = "Meta";
						tooltips[category] = [
							...(tooltips[category] ?? []),
							{
								title: metaError.title,
								score: metaError.score,
								content: metaError.description,
							},
						];
					}
					const errorTooltips = createTooltip(tooltips, {
						text: "There are some errors in the console or meta tags.",
					});
					errorTooltips.style.display = "block";
					errorTooltips.style.top = "20px";
					errorTooltips.style.right = "10px";
					errorTooltips.style.left = "auto";
					errorTooltips.style.position = "fixed";
					errorTooltips.classList.add("non-element");
					canvas.appendChild(errorTooltips);
				}

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
						highlight.dataset.detailSelector = value[0].detailSelector;

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
							value[0].rect,
						);
						highlight.appendChild(toolTip);

						canvas.appendChild(highlight);
					} catch (e) {
						console.error(e);
					}
				}
			},
		);

		import.meta.hot?.on(
			"astro-dev-toolbar:astro-page-insight-app:on-error",
			(message: string) => {
				isFetching = false;
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

			fetchButton = createToolbarButton(
				reloadIcon,
				() => {
					if (isFetching) return;

					fetchLighthouse(fetchButton, document);
					isFetching = true;
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
