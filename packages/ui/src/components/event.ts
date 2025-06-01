import { refreshHighlightPositions } from "./highlight.js";

export const initEvent = (canvas: ShadowRoot) => {
	for (const event of ["scroll", "resize"]) {
		window.addEventListener(event, () => {
			refreshHighlightPositions(canvas);
		});
	}
};
