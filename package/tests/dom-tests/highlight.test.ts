// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import type { LHResultForTooltip } from "../../src/types/index.ts";
import { createHighlight } from "../../src/ui/highlight.ts";
import { highlightObj } from "../fixtures/dummy.ts";
import { createShadowRoot } from "../utils.ts";

describe("highlight", () => {
	describe("createHighlight", () => {
		it("should create highlight", () => {
			const shadowRoot = createShadowRoot();
			const formFactor = "desktop";

			const render = {
				canvas: shadowRoot,
				lhResult: highlightObj.render.lhResult as LHResultForTooltip,
			};

			const highlight = createHighlight(
				formFactor,
				highlightObj.hideArguments,
				highlightObj.rect,
				highlightObj.filter,
				render,
				highlightObj.categories,
			);

			expect(highlight).not.toBeNull();
			expect(highlight).toBeInstanceOf(HTMLElement);
			expect(highlight.style.position).toBe("absolute");
			expect(highlight.classList.contains("astro-page-insight-highlight")).toBe(
				true,
			);
			expect(highlight.style.left).toBe(`${highlightObj.rect.left - 10}px`);
			expect(highlight.style.top).toBe(`${highlightObj.rect.top - 10}px`);
			expect(highlight.style.width).toBe(`${highlightObj.rect.width + 15}px`);
			expect(highlight.style.height).toBe(`${highlightObj.rect.height + 15}px`);

			const button = highlight.querySelector("button");
			expect(button).not.toBeNull();
			expect(button).toBeInstanceOf(HTMLButtonElement);
		});
	});
});
