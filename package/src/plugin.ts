import type { DevToolbarApp } from "astro";
import {
	activeButtons,
	fetchLighthouse,
	getLHData,
	showError,
	showInitialIcon,
} from "./clients/devTool.js";
import { initCanvas, initPageInsight } from "./clients/index.js";
import type {
	Buttons,
	LHResult,
	LoadOptionsType,
	PageInsightData,
	PageInsightStatus,
} from "./types/index.js";
import { getFormFactor } from "./ui/indicator.js";
import { createToastArea, showToast } from "./ui/toast.js";
import { createFetchButton, updateCanvas } from "./utils/lh.js";

const astroPageInsightToolbar: DevToolbarApp = {
	id: "astro-page-insight-app",
	name: "PageInsight",
	icon: "file-search",
	init(canvas, eventTarget) {
		// if load from LH, then skip
		if (
			new URL(window.location.href).searchParams.get("astro-page-insight") ===
			"true"
		) {
			return;
		}

		// if move to another page, then close app
		document.addEventListener("astro:before-preparation", () => {
			eventTarget.dispatchEvent(
				new CustomEvent("toggle-app", {
					detail: {
						state: false,
					},
				}),
			);
		});

		const fetchStatus: PageInsightStatus = {
			firstFetch: "none",
			isFetching: false,
			isFirstFetch: false,
		};
		let buttons: Buttons;
		let pageInsightData: PageInsightData;
		let breakPoint = 768;

		initCanvas(canvas);
		getLHData();

		document.addEventListener("astro:page-load", () => {
			initCanvas(canvas);
			getLHData();
		});

		eventTarget.addEventListener("app-toggled", (event) => {
			let appOpen = false;
			if (event instanceof CustomEvent) appOpen = event.detail.state;
			if (
				fetchStatus.firstFetch === "open" &&
				appOpen &&
				!fetchStatus.isFirstFetch
			) {
				fetchStart();
			}
		});

		if (import.meta.hot) {
			import.meta.hot?.on(
				"astro-dev-toolbar:astro-page-insight-app:options",
				(options: LoadOptionsType) => {
					fetchStatus.isFirstFetch = false;
					fetchStatus.firstFetch = options.firstFetch;

					const initObj = initPageInsight(
						canvas,
						fetchStatus.isFetching,
						options,
					);
					createToastArea(canvas);

					breakPoint = initObj.breakPoint;
					pageInsightData = initObj.pageInsightData;

					buttons = {
						...initObj.buttons,
						fetchButton: createFetchButton(
							initObj.toolbarWrap,
							fetchStart,
							fetchStatus.isFetching,
						),
					};
					if (fetchStatus.isFetching && buttons.fetchButton)
						buttons.fetchButton.classList.add("animate");

					showInitialIcon(eventTarget, options.lhReports.cache);

					if (fetchStatus.firstFetch === "load" && !fetchStatus.isFirstFetch) {
						fetchStart();
					}
				},
			);

			import.meta.hot?.on(
				"astro-dev-toolbar:astro-page-insight-app:on-success",
				(result: LHResult) => {
					if (result.url !== window.location.href) {
						showError(canvas, eventTarget, buttons);
						fetchStatus.isFetching = false;
						return;
					}

					eventTarget.dispatchEvent(
						new CustomEvent("toggle-notification", {
							detail: {
								state: true,
								level: "info",
							},
						}),
					);

					pageInsightData.lhResultByFormFactor[result.formFactor] = {
						elements: result.elements,
						metaErrors: result.metaErrors,
						consoleErrors: result.consoleErrors,
						pwaErrors: result.pwaErrors,
					};
					pageInsightData.scoreListByFormFactor[result.formFactor] =
						result.scoreList;
					pageInsightData.categoryCountByFormFactor[result.formFactor] =
						result.categoryCount;
					pageInsightData.hideHighlights[result.formFactor] = [];

					const formFactor = getFormFactor(breakPoint);
					updateCanvas({
						canvas,
						result: pageInsightData.lhResultByFormFactor[formFactor],
						filter: {
							categories: pageInsightData.filterCategories,
							hideList: pageInsightData.hideHighlights[formFactor],
						},
						formFactor,
						scoreList: pageInsightData.scoreListByFormFactor[formFactor],
						categoryCount:
							pageInsightData.categoryCountByFormFactor[formFactor],
					});

					activeButtons(buttons);
					fetchStatus.isFetching = false;

					showToast(
						canvas,
						"Analysis of lighthouse results is complete.",
						"success",
					);
				},
			);

			import.meta.hot?.on(
				"astro-dev-toolbar:astro-page-insight-app:on-error",
				(message: string) => {
					activeButtons(buttons);

					fetchStatus.isFetching = false;

					showToast(canvas, message, "error");
					eventTarget.dispatchEvent(
						new CustomEvent("toggle-notification", {
							detail: {
								state: true,
								level: "error",
							},
						}),
					);
				},
			);
		}

		function fetchStart() {
			fetchStatus.isFirstFetch = true;
			if (fetchStatus.isFetching) return;
			eventTarget.dispatchEvent(
				new CustomEvent("toggle-notification", {
					detail: {
						state: true,
						level: "warning",
					},
				}),
			);

			fetchStatus.isFetching = true;
			const buttonList = Object.values(buttons);
			for (const button of buttonList) {
				if (button) {
					button.disabled = true;
				}
			}
			if (buttons.fetchButton) buttons.fetchButton.classList.add("animate");

			fetchLighthouse(
				document.documentElement.clientWidth,
				document.documentElement.clientWidth,
				window.location.href,
			);
		}
	},
};

export default astroPageInsightToolbar;
