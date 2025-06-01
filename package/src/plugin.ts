import {
	createToastArea,
	createToolbarButton,
	getFormFactor,
	reloadCircleIcon,
} from "@page-insight/ui";
import { defineToolbarApp } from "astro/toolbar";
import { showError, showInitialIcon, showSuccess } from "./clients/devTool.js";
import { initPageInsight, initToolbar, updateCanvas } from "./clients/index.js";
import type {
	Buttons,
	LHResult,
	LoadOptionsType,
	PageInsightData,
	PageInsightStatus,
} from "./types/index.js";

export default defineToolbarApp({
	init(canvas, app, server) {
		if (
			new URL(window.location.href).searchParams.get("astro-page-insight") ===
			"true"
		) {
			return;
		}

		document.addEventListener("astro:before-preparation", () => {
			app.toggleState({
				state: false,
			});
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
		server.send("astro-dev-toolbar:astro-page-insight-app:init", {
			url: window.location.href,
		});

		document.addEventListener("astro:after-swap", () => {
			initPageInsight(canvas);
			server.send("astro-dev-toolbar:astro-page-insight-app:init", {
				url: window.location.href,
			});
		});

		app.onToggled((options) => {
			if (
				fetchStatus.firstFetch === "open" &&
				options.state &&
				!fetchStatus.isFirstFetch
			) {
				fetchStart(server);
			}
		});

		server.on(
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
					fetchButton: createToolbarButton(
						reloadCircleIcon,
						initObj.toolbarWrap,
						fetchStatus.isFetching,
						"fetch",
						() => fetchStart(server),
						"Fetch Lighthouse report.",
					),
				};
				if (fetchStatus.isFetching && buttons.fetchButton)
					buttons.fetchButton.classList.add("animate");

				showInitialIcon(app, options.reports.cache);

				if (fetchStatus.firstFetch === "load" && !fetchStatus.isFirstFetch) {
					fetchStart(server);
				}
			},
		);

		server.on(
			"astro-dev-toolbar:astro-page-insight-app:on-success",
			(result: LHResult) => {
				if (result.url !== window.location.href) {
					showError(
						canvas,
						app,
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
					categoryCount: pageInsightData.categoryCountByFormFactor[formFactor],
				});

				showSuccess(canvas, app, buttons);
				fetchStatus.isFetching = false;
			},
		);

		server.on(
			"astro-dev-toolbar:astro-page-insight-app:on-error",
			(message: string) => {
				showError(canvas, app, buttons, message);
				fetchStatus.isFetching = false;
			},
		);

		function fetchStart(sender: typeof server) {
			fetchStatus.isFirstFetch = true;
			if (fetchStatus.isFetching) return;
			app.toggleNotification({
				state: true,
				level: "warning",
			});

			fetchStatus.isFetching = true;
			const buttonList = Object.values(buttons);
			for (const button of buttonList) {
				if (button) {
					button.disabled = true;
				}
			}
			if (buttons.fetchButton) buttons.fetchButton.classList.add("animate");

			sender.send("astro-dev-toolbar:astro-page-insight-app:run-lighthouse", {
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight,
				url: window.location.href,
			});
		}
	},
});
