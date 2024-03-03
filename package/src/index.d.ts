import type { AstroIntegration } from "astro";

type PageInsightOptions = {
	/**
	 * @name lighthouse options
	 * @description
	 * `lh` is an object that contains the threshold value and breakpoint for lighthouse audit.
	 * ```js
	 * lh: {
	 *  weight: 0,
	 *  breakPoint: 767
	 * }
	 * ```
	 */
	lh?: {
		/**
		 * @name weight
		 * @default `0`
		 * @type `number`
		 * @description
		 * `weight` is the threshold value in the audit.
		 * All audit items have weights assigned by lighthouse and can be filtered by thresholds(`weight`).
		 */
		weight?: number;
		/**
		 * @name breakPoint
		 * @default `767`
		 * @type `number`
		 * @description
		 * `breakPoint` is used to determine whether on mobile or desktop.
		 * if the viewport width is less than the `breakPoint`, the lighthouse will run as a mobile device.
		 */
		breakPoint?: number;
	};
	/**
	 * @name firstFetch
	 * @default `click`
	 * @type `load` | `open` | `click`
	 * @description
	 * `firstFetch` is used to determine whether to run first fetch lighthouse result.
	 * if `firstFetch` is `load`, lighthouse will run on page load.
	 * if `firstFetch` is `open`, lighthouse will run on app open.
	 * if `firstFetch` is `click`, lighthouse will run on click `fetch` button.
	 */
	firstFetch?: "load" | "open" | "click";
};
export default function astroPageInsight(
	options?: PageInsightOptions,
): AstroIntegration;
