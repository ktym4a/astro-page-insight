import type { DevToolbarApp } from "astro";
import {
	fetchLighthouse,
	getLHData,
	showError,
	showInitialIcon,
	showSuccess,
} from "./clients/devTool.js";
import {
	createFetchButton,
	initPageInsight,
	initToolbar,
	updateCanvas,
} from "./clients/index.js";
import type {
	Buttons,
	LHResult,
	LoadOptionsType,
	PageInsightData,
	PageInsightStatus,
} from "./types/index.js";
import { getFormFactor } from "./ui/indicator.js";
import { createToastArea } from "./ui/toast.js";

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

		initPageInsight(canvas);
		getLHData();

		document.addEventListener("astro:after-swap", () => {
			initPageInsight(canvas);
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

					const initObj = initToolbar(canvas, fetchStatus.isFetching, options);
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
						showError(
							canvas,
							eventTarget,
							buttons,
							"The result is not for this page.\n Please try again.",
						);
						fetchStatus.isFetching = false;
						return;
					}

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

					showSuccess(canvas, eventTarget, buttons);
					fetchStatus.isFetching = false;
				},
			);

			import.meta.hot?.on(
				"astro-dev-toolbar:astro-page-insight-app:on-error",
				(message: string) => {
					showError(canvas, eventTarget, buttons, message);
					fetchStatus.isFetching = false;
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
