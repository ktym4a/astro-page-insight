import { z } from "astro/zod";

export const integrationOptionsSchema = z
	.object({
		/**
		 * @name lighthouse options
		 * @description
		 * `lh` is an object that contains the threshold value, breakpoint and pwa for lighthouse audit.
		 * ```js
		 * lh: {
		 *  weight: 0,
		 *  breakPoint: 767
		 * }
		 * ```
		 */
		lh: z
			.object({
				/**
				 * @name weight
				 * @default `0`
				 * @type `number`
				 * @description
				 * `weight` is the threshold value in the audit.
				 * All audit items have weights assigned by lighthouse and can be filtered by thresholds(`weight`).
				 */
				weight: z.number().optional().default(0),
				/**
				 * @name breakPoint
				 * @default `767`
				 * @type `number`
				 * @description
				 * `breakPoint` is used to determine whether on mobile or desktop.
				 * if the viewport width is less than the `breakPoint`, the lighthouse will run as a mobile device.
				 */
				breakPoint: z.number().optional().default(767),
				/**
				 * @name pwa
				 * @default `false`
				 * @type `boolean`
				 * @description
				 * `pwa` is used to determine whether to include the PWA audit.
				 * if `pwa` is `true`, will include the PWA audit.
				 */
				pwa: z.boolean().optional().default(false),
			})
			.optional()
			.default({
				weight: 0,
				breakPoint: 767,
			}),
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
		firstFetch: z.enum(["load", "open", "none"]).optional().default("none"),

		// TODO: remove experimentalCache in the next major release
		/**
		 * @deprecated Use `cache` instead. it will be removed in the next major release.
		 */
		experimentalCache: z.boolean().optional().default(false),

		/**
		 * @name cache
		 * @default `false`
		 * @type `boolean`
		 * @description
		 * `cache` is used to enable the cache feature.
		 * if `cache` is `true`, will enable to cache the lighthouse report.
		 */
		cache: z.boolean().optional().default(false),

		build: z
			.object({
				/**
				 * @name bundle
				 * @default `false`
				 * @type `boolean`
				 * @description
				 * `bundle` is used to determine whether to bundle the page insight.
				 * if `bundle` is `true`, will bundle the page insight. so you can see the insight after build.
				 */
				bundle: z.boolean().optional().default(false),

				/**
				 * @name showOnLoad
				 * @default `false`
				 * @type `boolean`
				 * @description
				 * `showOnLoad` is used to determine whether to show the page insight on page load.
				 * if `showOnLoad` is `true`, will show the page insight on page load.
				 */
				showOnLoad: z.boolean().optional().default(false),
			})
			.optional()
			.default({
				bundle: false,
				showOnLoad: false,
			}),
	})
	.optional()
	.default({
		lh: {
			weight: 0,
			breakPoint: 767,
		},
		firstFetch: "none",
		// TODO: remove experimentalCache in the next major release
		experimentalCache: false,
		cache: false,
		build: {
			bundle: false,
			showOnLoad: false,
		},
	});

export type IntegrationOptions = z.infer<typeof integrationOptionsSchema>;
