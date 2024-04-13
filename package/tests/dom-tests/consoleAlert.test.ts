// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import {
	createConsoleAlertButton,
	createConsoleErrorList,
} from "../../src/ui/consoleAlert";
import { createToolbar } from "../../src/ui/toolbar";
import { lhResult } from "../fixtures/lhResult";
import { createShadowRoot } from "../utils";

describe("consoleAlert", () => {
	describe("createConsoleAlertButton", () => {
		it("should create a createConsoleAlertButton", () => {
			const shadowRoot = createShadowRoot();
			const type = "console-alert";
			const isFetching = false;
			const tooltip = "Show non-element errors.";

			const toolbarWrap = document.createElement("div");

			const button = createConsoleAlertButton(
				shadowRoot,
				toolbarWrap,
				isFetching,
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
		});

		it("should create a createConsoleAlertButton with isFetching true", () => {
			const shadowRoot = createShadowRoot();
			const isFetching = true;

			const toolbarWrap = document.createElement("div");

			const button = createConsoleAlertButton(
				shadowRoot,
				toolbarWrap,
				isFetching,
			);

			expect(button.disabled).toBe(true);
		});
	});

	describe("createConsoleErrorList", () => {
		it("should create a createConsoleErrorList with Desktop", () => {
			const shadowRoot = createShadowRoot();
			const formFactor = "desktop";
			const testObj = lhResult[formFactor];

			const toolbarWrap = createToolbar(shadowRoot);
			createConsoleAlertButton(shadowRoot, toolbarWrap, false);

			createConsoleErrorList(
				shadowRoot,
				formFactor,
				testObj.consoleErrors,
				testObj.metaErrors,
				testObj.pwaErrors,
			);

			const modal = shadowRoot.querySelector(
				".astro-page-insight-modal-console-alert",
			);
			const button = shadowRoot.querySelector(
				"[data-button-type='console-alert']",
			);
			const details = modal?.querySelectorAll("details");

			expect(modal).not.toBeNull();
			expect(modal).toBeInstanceOf(HTMLDivElement);
			expect(modal?.firstChild?.textContent).toBe(
				`Non-element errors - (${formFactor
					.charAt(0)
					.toUpperCase()}${formFactor.slice(1)})`,
			);
			expect(
				button?.classList.contains("astro-page-insight-toolbar-button-alert"),
			).toBe(true);
			expect(details).lengthOf(3);
		});

		it("should create a createConsoleErrorList with Mobile", () => {
			const shadowRoot = createShadowRoot();
			const formFactor = "mobile";
			const testObj = lhResult[formFactor];

			const toolbarWrap = createToolbar(shadowRoot);
			createConsoleAlertButton(shadowRoot, toolbarWrap, false);

			createConsoleErrorList(
				shadowRoot,
				formFactor,
				testObj.consoleErrors,
				testObj.metaErrors,
				testObj.pwaErrors,
			);

			const modal = shadowRoot.querySelector(
				".astro-page-insight-modal-console-alert",
			);
			const button = shadowRoot.querySelector(
				"[data-button-type='console-alert']",
			);
			const details = modal?.querySelectorAll("details");

			expect(modal).not.toBeNull();
			expect(modal).toBeInstanceOf(HTMLDivElement);
			expect(modal?.firstChild?.textContent).toBe(
				`Non-element errors - (${formFactor
					.charAt(0)
					.toUpperCase()}${formFactor.slice(1)})`,
			);
			expect(
				button?.classList.contains("astro-page-insight-toolbar-button-alert"),
			).toBe(true);
			expect(details).lengthOf(3);
		});

		it("should create a createConsoleErrorList with consoleErrors", () => {
			const shadowRoot = createShadowRoot();
			const formFactor = "mobile";
			const testObj = lhResult[formFactor];

			const toolbarWrap = createToolbar(shadowRoot);
			createConsoleAlertButton(shadowRoot, toolbarWrap, false);

			createConsoleErrorList(
				shadowRoot,
				formFactor,
				testObj.consoleErrors,
				[],
				[],
			);

			const modal = shadowRoot.querySelector(
				".astro-page-insight-modal-console-alert",
			);
			const details = modal?.querySelectorAll("details");

			expect(details).lengthOf(1);
		});

		it("should create a createConsoleErrorList with consoleErrors", () => {
			const shadowRoot = createShadowRoot();
			const formFactor = "mobile";
			const testObj = lhResult[formFactor];

			const toolbarWrap = createToolbar(shadowRoot);
			createConsoleAlertButton(shadowRoot, toolbarWrap, false);

			createConsoleErrorList(
				shadowRoot,
				formFactor,
				[],
				testObj.metaErrors,
				[],
			);

			const modal = shadowRoot.querySelector(
				".astro-page-insight-modal-console-alert",
			);
			const details = modal?.querySelectorAll("details");

			expect(details).lengthOf(1);
		});

		it("should create a createConsoleErrorList with no data", () => {
			const shadowRoot = createShadowRoot();
			const formFactor = "mobile";

			const toolbarWrap = createToolbar(shadowRoot);
			createConsoleAlertButton(shadowRoot, toolbarWrap, false);

			createConsoleErrorList(shadowRoot, formFactor, [], [], []);

			const modal = shadowRoot.querySelector(
				".astro-page-insight-modal-console-alert",
			);
			const button = shadowRoot.querySelector(
				"[data-button-type='console-alert']",
			);
			const details = modal?.querySelectorAll("details");

			expect(modal).not.toBeNull();
			expect(modal).toBeInstanceOf(HTMLDivElement);
			expect(modal?.firstChild?.textContent).toBe(
				`Non-element errors - (${formFactor
					.charAt(0)
					.toUpperCase()}${formFactor.slice(1)})`,
			);
			expect(modal?.textContent).toContain("No non-element errors found.");
			expect(
				button?.classList.contains("astro-page-insight-toolbar-button-alert"),
			).toBe(false);
			expect(details).lengthOf(0);
		});
	});
});
