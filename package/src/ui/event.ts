import { refreshHighlightPositions } from "./highlight";

export const initEvent = (canvas: ShadowRoot) => {
	for (const event of ["scroll", "resize"]) {
		window.addEventListener(event, () => {
			refreshHighlightPositions(canvas);
		});
	}
};
