// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import type { FilterTypes, LHResultForTooltip } from "../../src/types/index.ts";
import { createHideButton, createHideList } from "../../src/ui/hide.ts";
import { createToolbar } from "../../src/ui/toolbar.ts";
import { lhResult } from "../fixtures/dummy.ts";
import { createShadowRoot } from "../utils.ts";

describe("hide", () => {
	describe("createHideButton", () => {
		it("should create a createHideButton", () => {
			const shadowRoot = createShadowRoot();
			const type = "hide";
			const isFetching = false;
			const tooltip = "Show the hidden highlights.";

			const toolbarWrap = document.createElement("div");

			const button = createHideButton(shadowRoot, toolbarWrap, isFetching);

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

		it("should create a createFilterButton with isFetching true", () => {
			const shadowRoot = createShadowRoot();
			const isFetching = true;

			const toolbarWrap = document.createElement("div");

			const button = createHideButton(shadowRoot, toolbarWrap, isFetching);

			expect(button.disabled).toBe(true);
		});
	});

	describe("createHideList", () => {
		it("should create a createHideList with no hide data", () => {
			const shadowRoot = createShadowRoot();
			const formFactor = "desktop";
			const testObj = lhResult[formFactor];
			const lHResultForTooltip: LHResultForTooltip = {
				consoleErrors: testObj.consoleErrors,
				elements: testObj.elements,
				metaErrors: testObj.metaErrors,
				pwaErrors: testObj.pwaErrors,
			};

			const filter: FilterTypes = {
				categories: {},
				hideList: [],
			};

			const toolbarWrap = createToolbar(shadowRoot);
			createHideButton(shadowRoot, toolbarWrap, false);

			createHideList(shadowRoot, formFactor, lHResultForTooltip, filter);

			const modal = shadowRoot.querySelector(".astro-page-insight-modal-hide");
			const button = shadowRoot.querySelector("[data-button-type='hide']");

			expect(modal).not.toBeNull();
			expect(modal).toBeInstanceOf(HTMLDivElement);
			expect(modal?.childNodes[2]?.textContent).toBe(
				`Hide highlights - (${formFactor
					.charAt(0)
					.toUpperCase()}${formFactor.slice(1)})`,
			);
			expect(modal?.textContent).toContain("No hidden highlights found.");
			expect(
				button?.classList.contains("astro-page-insight-toolbar-button-alert"),
			).toBe(false);
		});

		it("should create a createHideList with data", () => {
			const shadowRoot = createShadowRoot();
			const formFactor = "desktop";
			const testObj = lhResult[formFactor];
			const lHResultForTooltip: LHResultForTooltip = {
				consoleErrors: testObj.consoleErrors,
				elements: testObj.elements,
				metaErrors: testObj.metaErrors,
				pwaErrors: testObj.pwaErrors,
			};

			const filter: FilterTypes = {
				categories: {},
				hideList: [
					{
						selector: "h1",
						detailSelector: "h1",
					},
					{
						selector: "h2",
						detailSelector: "h2",
					},
				],
			};

			const toolbarWrap = createToolbar(shadowRoot);
			createHideButton(shadowRoot, toolbarWrap, false);

			createHideList(shadowRoot, formFactor, lHResultForTooltip, filter);

			const modal = shadowRoot.querySelector(".astro-page-insight-modal-hide");
			const button = shadowRoot.querySelector("[data-button-type='hide']");

			expect(modal).not.toBeNull();
			expect(modal).toBeInstanceOf(HTMLDivElement);
			expect(modal?.childNodes[2]?.textContent).toBe(
				`Hide highlights - (${formFactor
					.charAt(0)
					.toUpperCase()}${formFactor.slice(1)})`,
			);
			expect(modal?.textContent).not.toContain("No hidden highlights found.");
			expect(
				button?.classList.contains("astro-page-insight-toolbar-button-alert"),
			).toBe(true);
			expect(modal?.children[2]?.children).lengthOf(2);
			for (const detail of modal?.children[2]
				?.children as HTMLCollectionOf<HTMLDivElement>) {
				expect(detail).toBeInstanceOf(HTMLDivElement);
				expect(detail.dataset.type).toBeTruthy();
			}
		});
	});
});
