import { COLORS } from "../constants/index.js";
import type { LHResult, ScoreListType } from "../types/index.js";
import { getColorKey } from "../utils/color.js";
import { analyticsIcon } from "./icons.js";
import {
	createToolbarButton,
	createToolbarContentWrapper,
	createToolbarElement,
	createToolbarSubTitle,
	createToolbarTitle,
	createToolbarWrapper,
	toggleToolbarWrapper,
} from "./toolbar.js";

export const createScoreButton = (
	canvas: ShadowRoot,
	toolbarWrap: HTMLDivElement,
	isFetching: boolean,
) => {
	const scoreButton = createToolbarButton(
		analyticsIcon,
		toolbarWrap,
		isFetching,
		"score",
		() => {
			toggleToolbarWrapper(canvas, "score");
		},
		"Show the score of each category.",
	);

	return scoreButton;
};

export const createScore = (
	canvas: ShadowRoot,
	formFactor: LHResult["formFactor"],
	scoreList: ScoreListType,
) => {
	const existingScore = canvas.querySelector(".astro-page-insight-modal-score");
	if (existingScore) {
		existingScore.remove();
	}

	const scoreWrapper = createToolbarWrapper("score");

	const titleElement = createToolbarTitle(
		`Score - (${formFactor.charAt(0).toUpperCase()}${formFactor.slice(1)})`,
		analyticsIcon,
		"This result is by dev mode, so it may not be accurate.",
	);
	scoreWrapper.appendChild(titleElement);

	const contentWrapper = document.createElement("div");
	contentWrapper.style.marginTop = "10px";

	const scoreListKeys = Object.keys(scoreList).sort();
	if (scoreListKeys.length === 0) {
		const textElement = createToolbarSubTitle("No data.");
		contentWrapper.appendChild(textElement);
	}

	for (let i = 0; i < scoreListKeys.length; i++) {
		const category = scoreListKeys[i];
		if (category) {
			const content = createContent(
				category,
				scoreList[category],
				i === scoreListKeys.length - 1,
			);
			contentWrapper.appendChild(content);
		}
	}

	scoreWrapper.appendChild(contentWrapper);

	const toolbarWrap = canvas.querySelector(
		".astro-page-insight-toolbar-button-wrap-score",
	) as HTMLDivElement;

	toolbarWrap.appendChild(scoreWrapper);
};

const createContent = (
	category: string,
	score: number | null | undefined,
	isLast: boolean,
) => {
	const color = getColorKey(score);
	const contentElement = createToolbarElement(isLast);
	const contentWrapper = createToolbarContentWrapper();
	contentWrapper.style.flexWrap = "wrap";
	contentElement.appendChild(contentWrapper);

	const titleWrap = document.createElement("h3");
	titleWrap.style.margin = "0";
	titleWrap.style.fontSize = "16px";
	titleWrap.style.fontWeight = "normal";
	titleWrap.style.display = "flex";
	titleWrap.style.flexDirection = "space-between";
	titleWrap.style.alignItems = "center";
	titleWrap.style.gap = "5px";
	titleWrap.style.width = "100%";

	const textElement = createToolbarSubTitle(category);
	textElement.style.flex = "1";
	titleWrap.appendChild(textElement);

	const scoreElement = document.createElement("p");
	scoreElement.style.margin = "0";
	if (score === null || score === undefined) {
		scoreElement.textContent = "No data.";
	} else {
		scoreElement.textContent = `${(score * 100).toFixed(0)}`;
		scoreElement.style.color = COLORS[color];
		scoreElement.style.fontWeight = "bold";
	}
	titleWrap.appendChild(scoreElement);

	contentWrapper.appendChild(titleWrap);

	if (score !== null && score !== undefined) {
		const scoreBar = document.createElement("div");
		scoreBar.style.width = "100%";
		scoreBar.style.height = "7px";
		scoreBar.style.backgroundColor = "#45475a";
		scoreBar.style.borderRadius = "5px";
		scoreBar.style.position = "relative";
		contentWrapper.appendChild(scoreBar);

		const scoreBarFill = document.createElement("div");
		scoreBarFill.style.width = `${score * 100}%`;
		scoreBarFill.style.height = "100%";
		scoreBarFill.style.backgroundColor = COLORS[color];
		scoreBarFill.style.borderRadius = "5px";
		scoreBar.appendChild(scoreBarFill);
	}

	return contentElement;
};
