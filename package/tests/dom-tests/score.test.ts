// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { createScore, createScoreButton } from "../../src/ui/score.ts";
import { createToolbar } from "../../src/ui/toolbar.ts";
import { lhResult } from "../fixtures/dummy.ts";
import { createShadowRoot } from "../utils.ts";

describe("score", () => {
	describe("createScoreButton", () => {
		it("should create a createScoreButton", () => {
			const shadowRoot = createShadowRoot();
			const type = "score";
			const isFetching = false;
			const tooltip = "Show the score of each category.";

			const toolbarWrap = document.createElement("div");

			const button = createScoreButton(shadowRoot, toolbarWrap, isFetching);

			expect(button).not.toBeNull();
			expect(button).toBeInstanceOf(HTMLButtonElement);
			expect(button.type).toBe("button");
			expect(button.disabled).toBe(false);
			expect(button.dataset.buttonType).toBe(type);
			expect(button.dataset.tooltip).toBe(tooltip);
			expect(
				button.parentElement?.classList.contains(
					`astro-page-insight-toolbar-button-wrap-${type}`,
				),
			).toBe(true);
		});

		it("should create a createScoreButton with isFetching true", () => {
			const shadowRoot = createShadowRoot();
			const isFetching = true;

			const toolbarWrap = document.createElement("div");

			const button = createScoreButton(shadowRoot, toolbarWrap, isFetching);

			expect(button.disabled).toBe(true);
		});
	});

	describe("createScore", () => {
		it("should create a createScore with no score data", () => {
			const shadowRoot = createShadowRoot();
			const formFactor = "desktop";

			const toolbarWrap = createToolbar(shadowRoot);
			createScoreButton(shadowRoot, toolbarWrap, false);

			createScore(shadowRoot, formFactor, {});

			const modal = shadowRoot.querySelector(".astro-page-insight-modal-score");

			expect(modal).not.toBeNull();
			expect(modal).toBeInstanceOf(HTMLDivElement);
			expect(modal?.childNodes[0]?.textContent).toBe(
				`Score - (${formFactor.charAt(0).toUpperCase()}${formFactor.slice(
					1,
				)})This result is by dev mode, so it may not be accurate.`,
			);
			expect(modal?.childNodes[1]?.textContent).toContain("No data.");
		});

		it("should create a createScore with data", () => {
			const shadowRoot = createShadowRoot();
			const formFactor = "desktop";
			const testObj = lhResult[formFactor];

			const toolbarWrap = createToolbar(shadowRoot);
			createScoreButton(shadowRoot, toolbarWrap, false);

			createScore(shadowRoot, formFactor, testObj.scoreList);

			const modal = shadowRoot.querySelector(".astro-page-insight-modal-score");

			expect(modal?.children[1]?.children).lengthOf(
				Object.keys(testObj.scoreList).length,
			);
			for (const detail of modal?.children[1]
				?.children as HTMLCollectionOf<HTMLDivElement>) {
				expect(detail).toBeInstanceOf(HTMLDivElement);
				expect(detail.dataset.type).toBeTruthy();
			}
		});
	});
});
