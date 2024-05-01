import type { ErrorTooltips, LHResult } from "../types/index.js";
import { alertDocumentIcon } from "./icons.js";
import {
	createToolbarButton,
	createToolbarSubTitle,
	createToolbarTitle,
	createToolbarWrapper,
	toggleToolbarWrapper,
} from "./toolbar.js";
import {
	createContent,
	createContentTitle,
	createDetails,
	createSummary,
} from "./tooltip.js";

export const createConsoleAlertButton = (
	canvas: ShadowRoot,
	toolbarWrap: HTMLDivElement,
	isFetching: boolean,
) => {
	const hideButton = createToolbarButton(
		alertDocumentIcon,
		toolbarWrap,
		isFetching,
		"console-alert",
		() => {
			toggleToolbarWrapper(canvas, "console-alert");
		},
		"Show non-element errors.",
	);

	return hideButton;
};

export const createConsoleErrorList = (
	canvas: ShadowRoot,
	formFactor: LHResult["formFactor"],
	consoleErrors: LHResult["consoleErrors"],
	metaErrors: LHResult["metaErrors"],
	pwaErrors: LHResult["pwaErrors"],
) => {
	const existingConsoleError = canvas.querySelector(
		".astro-page-insight-modal-console-alert",
	);
	if (existingConsoleError) {
		existingConsoleError.remove();
	}

	const consoleErrorWrapper = createToolbarWrapper("console-alert");

	const titleElement = createToolbarTitle(
		`Non-element errors - (${formFactor
			.charAt(0)
			.toUpperCase()}${formFactor.slice(1)})`,
		alertDocumentIcon,
	);
	consoleErrorWrapper.appendChild(titleElement);

	const contentWrapper = document.createElement("div");
	contentWrapper.style.marginTop = "10px";

	const tooltips = createErrorTooltipsData(
		consoleErrors,
		metaErrors,
		pwaErrors,
	);

	const tooltipEntries = Object.entries(tooltips).sort((a, b) =>
		a[0].localeCompare(b[0]),
	);

	const button = canvas.querySelector("[data-button-type='console-alert']");
	if (tooltipEntries.length === 0) {
		const subTitle = createToolbarSubTitle("No non-element errors found.");
		contentWrapper.appendChild(subTitle);
		if (button)
			button.classList.remove("astro-page-insight-toolbar-button-alert");
	} else {
		if (button) button.classList.add("astro-page-insight-toolbar-button-alert");
	}

	const tooltipsLength = tooltipEntries.length;

	for (const [index, tooltips] of tooltipEntries.entries()) {
		const tooltip = tooltipEntries[index];
		if (!tooltip) continue;

		const category = tooltip[0];
		const details = createDetails(index === tooltipsLength - 1, category);

		const summary = createSummary(category, tooltips[1].length);
		details.appendChild(summary);

		const summaryWrapper = document.createElement("div");
		summaryWrapper.style.marginTop = "10px";

		for (const [index, tooltip] of tooltips[1].entries()) {
			const contentElement = document.createElement("div");

			const contentTitle = createContentTitle(
				tooltip.title,
				tooltip.score,
				tooltip.scoreDisplayMode,
				tooltip.subTitle,
			);
			contentElement.appendChild(contentTitle);

			if (tooltip.content) {
				const content = createContent(
					tooltip.content,
					index === tooltips[1].length - 1,
				);
				contentElement.appendChild(content);
			}

			summaryWrapper.appendChild(contentElement);
		}
		details.appendChild(summaryWrapper);

		contentWrapper.appendChild(details);
	}

	consoleErrorWrapper.appendChild(contentWrapper);

	const toolbarWrap = canvas.querySelector(
		".astro-page-insight-toolbar-button-wrap-console-alert",
	) as HTMLDivElement;

	toolbarWrap.appendChild(consoleErrorWrapper);
};

const createErrorTooltipsData = (
	consoleErrors: LHResult["consoleErrors"],
	metaErrors: LHResult["metaErrors"],
	pwaErrors: LHResult["pwaErrors"],
) => {
	const tooltips: ErrorTooltips = {};
	if (pwaErrors !== undefined) {
		for (const pwaError of pwaErrors) {
			const category = "PWA";
			const content = pwaError.content ?? "";
			tooltips[category] = [
				...(tooltips[category] ?? []),
				{
					title: pwaError.message,
					score: pwaError.level === "error" ? 0 : 0.5,
					scoreDisplayMode: "",
					content,
				},
			];
		}
	}

	for (const consoleMessage of consoleErrors) {
		const category = "Console";
		const content = consoleMessage.content ?? "";
		tooltips[category] = [
			...(tooltips[category] ?? []),
			{
				title: consoleMessage.message,
				score: consoleMessage.level === "error" ? 0 : 0.5,
				scoreDisplayMode: "",
				content,
			},
		];
	}

	for (const metaError of metaErrors) {
		const category = "Document";
		tooltips[category] = [
			...(tooltips[category] ?? []),
			{
				title: metaError.title,
				score: metaError.score,
				scoreDisplayMode: "",
				content: metaError.description,
			},
		];
	}

	return tooltips;
};
