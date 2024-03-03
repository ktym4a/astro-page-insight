import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";
import { CATEGORIES } from "./constants/index.js";
import { organizeLHResult, startLH } from "./server/index.js";

export default defineIntegration({
	name: "astro-page-insight",
	plugins: [...corePlugins],
	optionsSchema: z.object({
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
	}),
	setup({ options: { lh, firstFetch } }) {
		const { resolve } = createResolver(import.meta.url);

		return {
			"astro:config:setup": ({
				addDevToolbarApp,
				command,
				watchIntegration,
			}) => {
				watchIntegration(resolve());

				if (command === "dev") {
					addDevToolbarApp(resolve("./plugin.ts"));
				}
			},
			"astro:server:setup": async ({ server, logger }) => {
				server.hot.on("astro-dev-toolbar:astro-page-insight-app:init", () => {
					server.hot.send("astro-dev-toolbar:astro-page-insight-app:options", {
						breakPoint: lh.breakPoint,
						categories: CATEGORIES,
						firstFetch,
					});
				});

				server.hot.on(
					"astro-dev-toolbar:astro-page-insight-app:run-lighthouse",
					async ({ width, height, url }) => {
						try {
							const lhData = await startLH({
								url,
								width,
								height,
								breakPoint: lh.breakPoint,
								weight: lh.weight,
							});
							if (lhData.result) {
								const result = organizeLHResult(lhData.result, lh.weight);

								server.hot.send(
									"astro-dev-toolbar:astro-page-insight-app:on-success",
									{
										...result,
										url,
										formFactor: lhData.formFactor,
										lhData,
									},
								);
							}
						} catch (error) {
							logger.error("Something went wrong.");
							console.error(error);
							server.hot.send(
								"astro-dev-toolbar:astro-page-insight-app:on-error",
								"Something went wrong.\nPlease try again.",
							);
						}
					},
				);
			},
		};
	},
});
