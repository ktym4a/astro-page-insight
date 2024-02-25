import { COLORS } from "../constants/index.js";
import type { LHResult, ScoreListType } from "../types/index.js";
import { getColorKey } from "../utils/color.js";
import { analyticsIcon } from "./icons.js";
import {
	createToolbarButton,
	createToolbarTitle,
	createToolbarWrapper,
	toggleToolbarWrapper,
} from "./toolbar.js";

export const createScoreButton = (
	canvas: ShadowRoot,
	toolbarWrap: HTMLDivElement,
) => {
	const scoreButton = createToolbarButton(
		analyticsIcon,
		toolbarWrap,
		false,
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
		`Score - (${formFactor})`,
		analyticsIcon,
	);
	scoreWrapper.appendChild(titleElement);

	const contentWrapper = document.createElement("div");
	contentWrapper.style.marginTop = "10px";

	const scoreListKeys = Object.keys(scoreList).sort();
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
	const contentWrap = document.createElement("div");

	const titleWrap = document.createElement("h3");
	titleWrap.style.margin = "0";
	titleWrap.style.fontSize = "16px";
	titleWrap.style.fontWeight = "normal";
	titleWrap.style.display = "flex";
	titleWrap.style.flexDirection = "space-between";
	titleWrap.style.alignItems = "center";
	titleWrap.style.gap = "5px";

	const titleElement = document.createElement("p");
	titleElement.innerHTML = category;
	titleElement.style.margin = "0";
	titleElement.style.fontSize = "14px";
	titleElement.style.fontWeight = "bold";
	titleElement.style.flex = "1";
	titleWrap.appendChild(titleElement);

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

	contentWrap.appendChild(titleWrap);

	if (score !== null && score !== undefined) {
		titleWrap.style.marginBottom = "10px";
		const scoreBar = document.createElement("div");
		scoreBar.style.width = "100%";
		scoreBar.style.height = "7px";
		scoreBar.style.backgroundColor = "#45475a";
		scoreBar.style.borderRadius = "5px";
		scoreBar.style.position = "relative";
		contentWrap.appendChild(scoreBar);

		const scoreBarFill = document.createElement("div");
		scoreBarFill.style.width = `${score * 100}%`;
		scoreBarFill.style.height = "100%";
		scoreBarFill.style.backgroundColor = COLORS[color];
		scoreBarFill.style.borderRadius = "5px";
		scoreBar.appendChild(scoreBarFill);
	}

	if (!isLast) {
		contentWrap.style.marginBottom = "12px";
		contentWrap.style.borderBottom = "1px solid #cdd6f4";
		contentWrap.style.paddingBottom = "12px";
	}

	return contentWrap;
};
