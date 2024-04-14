// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { CATEGORIES } from "../../src/constants";
import type { FilterTypes, LHResultForTooltip } from "../../src/types";
import { createFilter, createFilterButton } from "../../src/ui/filter";
import { createToolbar } from "../../src/ui/toolbar";
import { lhResult } from "../fixtures/dummy";
import { createShadowRoot } from "../utils";

describe("filter", () => {
	describe("createFilterButton", () => {
		it("should create a createFilterButton", () => {
			const shadowRoot = createShadowRoot();
			const type = "filter";
			const isFetching = false;
			const tooltip = "Filter the result.";

			const toolbarWrap = document.createElement("div");

			const button = createFilterButton(shadowRoot, toolbarWrap, isFetching);

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

			const button = createFilterButton(shadowRoot, toolbarWrap, isFetching);

			expect(button.disabled).toBe(true);
		});
	});

	describe("createFilter", () => {
		it("should create a createFilter with False", () => {
			const shadowRoot = createShadowRoot();
			const formFactor = "desktop";
			const testObj = lhResult[formFactor];
			const lHResultForTooltip: LHResultForTooltip = {
				consoleErrors: testObj.consoleErrors,
				elements: testObj.elements,
				metaErrors: testObj.metaErrors,
				pwaErrors: testObj.pwaErrors,
			};

			const filterCategories = CATEGORIES.reduce((acc, cur) => {
				return {
					// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
					...acc,
					[cur]: false,
				};
			}, {});

			const filter: FilterTypes = {
				categories: filterCategories,
				hideList: [],
			};

			const toolbarWrap = createToolbar(shadowRoot);
			createFilterButton(shadowRoot, toolbarWrap, false);

			createFilter(
				shadowRoot,
				formFactor,
				testObj.categoryCount,
				lHResultForTooltip,
				filter,
			);

			const modal = shadowRoot.querySelector(
				".astro-page-insight-modal-filter",
			);

			const details = modal?.children[2]?.children;

			expect(modal).not.toBeNull();
			expect(modal).toBeInstanceOf(HTMLDivElement);
			expect(modal?.childNodes[2]?.textContent).toBe(
				`Filter - (${formFactor.charAt(0).toUpperCase()}${formFactor.slice(
					1,
				)})`,
			);

			expect(details).lengthOf(4);

			if (details) {
				for (const detail of details) {
					expect(detail).toBeInstanceOf(HTMLDivElement);
					const child = detail.children[0] as HTMLDivElement;
					expect(child).toBeInstanceOf(HTMLDivElement);
					expect(child.style.background).toBe("");
				}
			}
		});

		it("should create a createFilter with True", () => {
			const shadowRoot = createShadowRoot();
			const formFactor = "desktop";
			const testObj = lhResult[formFactor];
			const lHResultForTooltip: LHResultForTooltip = {
				consoleErrors: testObj.consoleErrors,
				elements: testObj.elements,
				metaErrors: testObj.metaErrors,
				pwaErrors: testObj.pwaErrors,
			};

			const filterCategories = CATEGORIES.reduce((acc, cur) => {
				return {
					// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
					...acc,
					[cur]: true,
				};
			}, {});

			const filter: FilterTypes = {
				categories: filterCategories,
				hideList: [],
			};

			const toolbarWrap = createToolbar(shadowRoot);
			createFilterButton(shadowRoot, toolbarWrap, false);

			createFilter(
				shadowRoot,
				formFactor,
				testObj.categoryCount,
				lHResultForTooltip,
				filter,
			);

			const modal = shadowRoot.querySelector(
				".astro-page-insight-modal-filter",
			);

			const details = modal?.children[2]?.children;

			expect(modal).not.toBeNull();
			expect(modal).toBeInstanceOf(HTMLDivElement);
			expect(modal?.childNodes[2]?.textContent).toBe(
				`Filter - (${formFactor.charAt(0).toUpperCase()}${formFactor.slice(
					1,
				)})`,
			);

			expect(details).lengthOf(4);

			if (details) {
				for (const detail of details) {
					expect(detail).toBeInstanceOf(HTMLDivElement);
					const child = detail.children[0] as HTMLDivElement;
					expect(child).toBeInstanceOf(HTMLDivElement);
					expect(child.style.background).not.toBe("");
				}
			}
		});
	});
});
