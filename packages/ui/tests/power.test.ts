// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { createConsoleAlertButton } from "../src/components/consoleAlert.ts";
import { createFilterButton } from "../src/components/filter.ts";
import { createHideButton } from "../src/components/hide.ts";
import { createPowerButton } from "../src/components/power.ts";
import { createScoreButton } from "../src/components/score.ts";
import type { Buttons } from "../src/types/index.ts";
import { createShadowRoot } from "./utils.ts";

describe("power", () => {
	describe("createPowerButton", () => {
		it("should create a createPowerButton with showOnLoad true", () => {
			const shadowRoot = createShadowRoot();
			const showOnLoad = true;
			const type = "power";
			const isFetching = false;
			const tooltip = "Toggle the highlighted elements.";

			const toolbarWrap = document.createElement("div");

			const consoleAlertButton = createConsoleAlertButton(
				shadowRoot,
				toolbarWrap,
				isFetching,
			);
			const filterButton = createFilterButton(
				shadowRoot,
				toolbarWrap,
				isFetching,
			);
			const hideButton = createHideButton(shadowRoot, toolbarWrap, isFetching);
			const scoreButton = createScoreButton(
				shadowRoot,
				toolbarWrap,
				isFetching,
			);

			const buttons: Omit<Buttons, "fetchButton"> = {
				consoleAlertButton,
				filterButton,
				hideButton,
				scoreButton,
			};

			const button = createPowerButton(
				shadowRoot,
				showOnLoad,
				toolbarWrap,
				buttons,
			);

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
			expect(
				button.classList.contains("astro-page-insight-toolbar-button-alert"),
			).toBe(false);
			for (const button of Object.values(buttons)) {
				if (button) {
					expect(button.disabled).toBe(false);
				}
			}

			button.click();
			expect(
				button.classList.contains("astro-page-insight-toolbar-button-alert"),
			).not.toBe(false);
			for (const button of Object.values(buttons)) {
				if (button) {
					expect(button.disabled).not.toBe(false);
				}
			}
		});

		it("should create a createPowerButton with showOnLoad false", () => {
			const shadowRoot = createShadowRoot();
			const showOnLoad = false;
			const isFetching = false;

			const toolbarWrap = document.createElement("div");

			const consoleAlertButton = createConsoleAlertButton(
				shadowRoot,
				toolbarWrap,
				isFetching,
			);
			const filterButton = createFilterButton(
				shadowRoot,
				toolbarWrap,
				isFetching,
			);
			const hideButton = createHideButton(shadowRoot, toolbarWrap, isFetching);
			const scoreButton = createScoreButton(
				shadowRoot,
				toolbarWrap,
				isFetching,
			);

			const buttons: Omit<Buttons, "fetchButton"> = {
				consoleAlertButton,
				filterButton,
				hideButton,
				scoreButton,
			};

			const button = createPowerButton(
				shadowRoot,
				showOnLoad,
				toolbarWrap,
				buttons,
			);

			expect(
				button.classList.contains("astro-page-insight-toolbar-button-alert"),
			).toBe(true);

			button.click();
			expect(
				button.classList.contains("astro-page-insight-toolbar-button-alert"),
			).not.toBe(true);
		});
	});
});
