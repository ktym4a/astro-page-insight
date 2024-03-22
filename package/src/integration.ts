import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { CATEGORIES } from "./constants/index.js";
import { integrationOptionsSchema } from "./schema/index.js";
import {
	getLHReport,
	organizeLHResult,
	saveLHReport,
	startLH,
} from "./server/index.js";

export default defineIntegration({
	name: "astro-page-insight",
	plugins: [...corePlugins],
	optionsSchema: integrationOptionsSchema,
	setup({ options }) {
		const { lh, firstFetch, experimentalCache } = options;
		const { resolve } = createResolver(import.meta.url);
		const cacheDir = ".pageinsight";

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
				server.hot.on(
					"astro-dev-toolbar:astro-page-insight-app:init",
					async ({ url }, client) => {
						const lhReports = await getLHReport(
							`${cacheDir}`,
							url,
							lh.weight,
							lh.pwa,
						);

						client.send("astro-dev-toolbar:astro-page-insight-app:options", {
							breakPoint: lh.breakPoint,
							categories: CATEGORIES,
							firstFetch,
							lhReports,
						});
					},
				);

				server.hot.on(
					"astro-dev-toolbar:astro-page-insight-app:run-lighthouse",
					async ({ width, height, url }, client) => {
						try {
							const lhData = await startLH({
								url,
								width,
								height,
								breakPoint: lh.breakPoint,
								weight: lh.weight,
								pwa: lh.pwa,
							});
							if (lhData.result) {
								if (experimentalCache)
									await saveLHReport(
										`${cacheDir}/${lhData.formFactor}`,
										url,
										lhData.result,
									);

								const result = organizeLHResult(
									lhData.result,
									lh.weight,
									lh.pwa,
								);

								client.send(
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
							client.send(
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
