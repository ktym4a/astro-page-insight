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
		/**
		 * @name pwa
		 * @default `false`
		 * @type `boolean`
		 * @description
		 * `pwa` is used to determine whether to include the PWA audit.
		 * if `pwa` is `true`, will include the PWA audit.
		 */
		pwa?: boolean;
	};
	/**
	 * @name firstFetch
	 * @default `none`
	 * @type `load` | `open` | `none`
	 * @description
	 * `firstFetch` is used for when to do the first fetch.
	 * if `firstFetch` is `load`, will fetch on page load.
	 * if `firstFetch` is `open`, will fetch on first app open.
	 * if `firstFetch` is `none`, only fetch on user interaction.
	 */
	firstFetch?: "load" | "open" | "none";

	/**
	 * @name experimentalCache
	 * @default `false`
	 * @type `boolean`
	 * @description
	 * `experimentalCache` is used to enable the cache feature.
	 * if `experimentalCache` is `true`, will enable to cache the lighthouse report.
	 */
	experimentalCache?: boolean;
};
export default function astroPageInsight(
	options?: PageInsightOptions,
): AstroIntegration;
