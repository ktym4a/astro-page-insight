// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { initStyle } from "../src/components/style.ts";
import { createShadowRoot } from "./utils.ts";

describe("style", () => {
	describe("initStyle", () => {
		it("should has style tag", () => {
			const shadowRoot = createShadowRoot();
			initStyle(shadowRoot);

			expect(shadowRoot.innerHTML.includes("<style>")).toBe(true);
			expect(shadowRoot.children).lengthOf(1);
		});
	});
});
