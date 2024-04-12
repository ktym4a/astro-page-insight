// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import {
	createToolbar,
	createToolbarButton,
	createToolbarContentWrapper,
	createToolbarElement,
	createToolbarSubTitle,
	createToolbarTitle,
	createToolbarWrapper,
	toggleToolbarWrapper,
} from "../../src/ui/toolbar";

describe("toolbar", () => {
	describe("createToolbar", () => {
		it("should create a tooltip", () => {
			// shadow dom
			const shadowDom = document.createElement("div");
			shadowDom.attachShadow({ mode: "open" });
			document.body.appendChild(shadowDom);

			const toolbarWrap = createToolbar(shadowDom.shadowRoot as ShadowRoot);
			expect(toolbarWrap).not.toBeNull();
			expect(toolbarWrap).toBeInstanceOf(HTMLDivElement);
			expect(
				toolbarWrap.classList.contains("astro-page-insight-toolbar-wrap"),
			).toBe(true);
			expect(
				toolbarWrap.parentElement?.classList.contains(
					"astro-page-insight-toolbar",
				),
			).toBe(true);
		});
	});

	describe("createToolbarButton", () => {
		it("should create a toolbarButton", () => {
			const icon = "<svg></svg>";
			const buttonParent = document.createElement("div");

			const button = createToolbarButton(icon, buttonParent);

			expect(button).not.toBeNull();
			expect(button).toBeInstanceOf(HTMLButtonElement);
			expect(button.innerHTML).toBe(icon);
			expect(button.type).toBe("button");
			expect(button.disabled).toBe(false);
			expect(button.dataset.buttonType).toBe(undefined);
			expect(button.onclick).toBe(null);
			expect(button.dataset.tooltip).toBe(undefined);
			expect(
				button.parentElement?.classList.contains(
					"astro-page-insight-toolbar-button-wrap",
				),
			).toBe(true);
		});

		it("should create a toolbarButton with disabled false", () => {
			const icon = "<svg></svg>";
			const buttonParent = document.createElement("div");
			const disabled = false;

			const button = createToolbarButton(icon, buttonParent, disabled);

			expect(button.disabled).toBe(false);
		});

		it("should create a toolbarButton with disabled true", () => {
			const icon = "<svg></svg>";
			const buttonParent = document.createElement("div");
			const disabled = true;

			const button = createToolbarButton(icon, buttonParent, disabled);

			expect(button.disabled).toBe(true);
		});

		it("should create a toolbarButton with type", () => {
			const icon = "<svg></svg>";
			const buttonParent = document.createElement("div");
			const disabled = true;
			const type = "type";

			const button = createToolbarButton(icon, buttonParent, disabled, type);

			expect(button.dataset.buttonType).toBe(type);
			expect(
				button.parentElement?.classList.contains(
					`astro-page-insight-toolbar-button-wrap-${type}`,
				),
			).toBe(true);
		});

		it("should create a toolbarButton with onclick", () => {
			const icon = "<svg></svg>";
			const buttonParent = document.createElement("div");
			const disabled = true;
			const type = "type";
			const onClick = () => {};

			const button = createToolbarButton(
				icon,
				buttonParent,
				disabled,
				type,
				onClick,
			);

			expect(button.onclick).toBe(onClick);
		});

		it("should create a toolbarButton with tooltip", () => {
			const icon = "<svg></svg>";
			const buttonParent = document.createElement("div");
			const disabled = true;
			const type = "type";
			const onClick = () => {};
			const tooltip = "tooltip";

			const button = createToolbarButton(
				icon,
				buttonParent,
				disabled,
				type,
				onClick,
				tooltip,
			);

			expect(button.dataset.tooltip).toBe(tooltip);
		});
	});

	describe("createToolbarWrapper", () => {
		it("should create a toolbarWrapper", () => {
			const type = "type";

			const toolbarWrapper = createToolbarWrapper(type);

			expect(toolbarWrapper).not.toBeNull();
			expect(toolbarWrapper).toBeInstanceOf(HTMLDivElement);
			expect(toolbarWrapper.dataset.type).toBe(type);
			expect(
				toolbarWrapper.classList.contains(`astro-page-insight-modal-${type}`),
			).toBe(true);
		});
	});

	describe("createToolbarTitle", () => {
		it("should create a toolbarTitle", () => {
			const title = "title";
			const icon = "<svg></svg>";

			const toolbarTitle = createToolbarTitle(title, icon);

			expect(toolbarTitle).not.toBeNull();
			expect(toolbarTitle).toBeInstanceOf(HTMLDivElement);
			expect(toolbarTitle.childElementCount).toBe(2);
			if (toolbarTitle.children[0])
				expect(toolbarTitle.children[0].innerHTML).toBe(icon);
			if (toolbarTitle.children[1])
				expect(toolbarTitle.children[1].innerHTML).toBe(title);
		});

		it("should create a toolbarTitle with subText", () => {
			const title = "title";
			const icon = "<svg></svg>";
			const subText = "subText";

			const toolbarTitle = createToolbarTitle(title, icon, subText);

			expect(toolbarTitle).not.toBeNull();
			expect(toolbarTitle).toBeInstanceOf(HTMLDivElement);
			expect(toolbarTitle.childElementCount).toBe(3);
			if (toolbarTitle.children[0])
				expect(toolbarTitle.children[0].innerHTML).toBe(icon);
			if (toolbarTitle.children[1])
				expect(toolbarTitle.children[1].innerHTML).toBe(title);
			if (toolbarTitle.children[2])
				expect(toolbarTitle.children[2].innerHTML).toBe(subText);
		});
	});

	describe("toggleToolbarWrapper", () => {
		it("should toggle toolbarWrapper", () => {
			// shadow dom
			const shadowDom = document.createElement("div");
			shadowDom.attachShadow({ mode: "open" });
			document.body.appendChild(shadowDom);

			const icon = "<svg></svg>";
			const buttonParent = document.createElement("div");
			shadowDom.shadowRoot?.appendChild(buttonParent);
			const type = "type";

			const button = createToolbarButton(icon, buttonParent, false, type);

			toggleToolbarWrapper(shadowDom.shadowRoot as ShadowRoot, type);

			expect(button.classList.contains("active")).toBe(true);

			toggleToolbarWrapper(shadowDom.shadowRoot as ShadowRoot, type);

			expect(button.classList.contains("active")).toBe(false);
		});

		it("should not toggle toolbarWrapper", () => {
			// shadow dom
			const shadowDom = document.createElement("div");
			shadowDom.attachShadow({ mode: "open" });
			document.body.appendChild(shadowDom);

			const icon = "<svg></svg>";
			const buttonParent = document.createElement("div");
			shadowDom.shadowRoot?.appendChild(buttonParent);
			const type = "type";

			const button = createToolbarButton(icon, buttonParent, false, type);

			toggleToolbarWrapper(shadowDom.shadowRoot as ShadowRoot, "aaaa");

			expect(button.classList.contains("active")).toBe(false);

			toggleToolbarWrapper(shadowDom.shadowRoot as ShadowRoot, "aaaa");

			expect(button.classList.contains("active")).toBe(false);
		});
	});

	describe("createToolbarElement", () => {
		it("should create a toolbarElement by not last", () => {
			const toolbarElement = createToolbarElement(false);

			expect(toolbarElement).not.toBeNull();
			expect(toolbarElement).toBeInstanceOf(HTMLDivElement);
			expect(toolbarElement.style.marginBottom).toBe("7px");
			expect(toolbarElement.style.borderBottom).toBe("1px solid #cdd6f4");
			expect(toolbarElement.style.paddingBottom).toBe("7px");
		});

		it("should create a toolbarElement by last", () => {
			const toolbarElement = createToolbarElement(true);

			expect(toolbarElement).not.toBeNull();
			expect(toolbarElement).toBeInstanceOf(HTMLDivElement);
			expect(toolbarElement.style.marginBottom).toBe("");
			expect(toolbarElement.style.borderBottom).toBe("");
			expect(toolbarElement.style.paddingBottom).toBe("");
		});
	});

	describe("createToolbarSubTitle", () => {
		it("should create a toolbarSubTitle", () => {
			const title = "title";
			const toolbarSubTitle = createToolbarSubTitle(title);

			expect(toolbarSubTitle).not.toBeNull();
			expect(toolbarSubTitle).toBeInstanceOf(HTMLParagraphElement);
			expect(toolbarSubTitle.textContent).toBe(title);
			expect(toolbarSubTitle.style.margin).toBe("0px");
			expect(toolbarSubTitle.style.fontSize).toBe("14px");
			expect(toolbarSubTitle.style.fontWeight).toBe("bold");
		});
	});

	describe("createToolbarContentWrapper", () => {
		it("should create a toolbarContentWrapper", () => {
			const toolbarContentWrapper = createToolbarContentWrapper();

			expect(toolbarContentWrapper).not.toBeNull();
			expect(toolbarContentWrapper).toBeInstanceOf(HTMLDivElement);
		});
	});
});
