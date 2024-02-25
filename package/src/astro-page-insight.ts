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
		 * `weight` is the threshold value in the audit.
		 * All audit items have weights assigned by lighthouse and can be filtered by thresholds(`weight`).
		 *
		 * @default `0`
		 */
		weight: z.number().optional().default(0),
		/**
		 * `breakPoint` is used to determine whether on mobile or desktop.
		 * if the viewport width is less than the `breakPoint`, the lighthouse will run as a mobile device.
		 *
		 * @default `767`
		 */
		breakPoint: z.number().optional().default(767),
	}),
	setup({ options: { weight, breakPoint } }) {
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
						breakPoint,
						categories: CATEGORIES,
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
								breakPoint,
								weight,
							});
							if (lhData.result) {
								const result = organizeLHResult(lhData.result, weight);

								server.hot.send(
									"astro-dev-toolbar:astro-page-insight-app:on-success",
									{
										...result,
										url,
										formFactor: lhData.formFactor,
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
