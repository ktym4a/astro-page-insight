import {
	addVitePlugin,
	createResolver,
	defineIntegration,
} from "astro-integration-kit";
import { CATEGORIES } from "./constants/index.js";
import { astroPageInsightPlugin } from "./plugins/vite-plugin-page-insight.js";
import { integrationOptionsSchema } from "./schema/index.js";
import { getLHReport, saveLHReport, startLH } from "./server/index.js";
import { organizeLHResult } from "./utils/lh.js";

export default defineIntegration({
	name: "astro-page-insight",
	optionsSchema: integrationOptionsSchema,
	setup({ options }) {
		// TODO: remove experimentalCache in the next major release
		const { lh, firstFetch, experimentalCache, cache, build } = options;
		const { resolve } = createResolver(import.meta.url);
		let cacheDir = ".pageinsight";

		return {
			hooks: {
				"astro:config:setup": (params) => {
					const { addDevToolbarApp, command, injectScript, config, logger } =
						params;

					cacheDir = new URL(cacheDir, config.root).pathname;

					const assetsDir = config.build.assets;

					if (command === "dev") {
						addDevToolbarApp({
							id: "astro-page-insight-app",
							name: "PageInsight",
							icon: "file-search",
							entrypoint: resolve("./plugin.js"),
						});
					}

					if (build.bundle && command === "build") {
						const bundleId: string = resolve("./clients/index.js");
						injectScript(
							"page",
							`import { initPageInsightForClient, removePageInsightRoot } from "${bundleId}";
							class PageInsightRoot extends HTMLElement {
								constructor() {
									super();
									this.attachShadow({ mode: "open" });
								}
							}
							customElements.define("page-insight-root", PageInsightRoot);
							initPageInsightForClient("${assetsDir}", ${build.showOnLoad}, ${lh.weight}, ${lh.breakPoint});
							document.addEventListener("astro:after-swap", () => {
								initPageInsightForClient("${assetsDir}", ${build.showOnLoad}, ${lh.weight}, ${lh.breakPoint});
							});
							document.addEventListener("astro:before-preparation", () => {
								removePageInsightRoot();
							});`,
						);

						addVitePlugin(params, {
							plugin: astroPageInsightPlugin(cacheDir, assetsDir, logger),
						});
					}
				},
				"astro:server:setup": async ({ logger, toolbar }) => {
					toolbar.on<{
						url: string;
					}>(
						"astro-dev-toolbar:astro-page-insight-app:init",
						async ({ url }) => {
							const lhReports = await getLHReport(cacheDir, url, lh.weight);

							toolbar.send("astro-dev-toolbar:astro-page-insight-app:options", {
								breakPoint: lh.breakPoint,
								categories: CATEGORIES,
								firstFetch,
								lhReports,
							});
						},
					);

					toolbar.on<{
						url: string;
						width: number;
						height: number;
					}>(
						"astro-dev-toolbar:astro-page-insight-app:run-lighthouse",
						async ({ url, width, height }) => {
							try {
								const lhData = await startLH({
									url,
									width,
									height,
									breakPoint: lh.breakPoint,
									weight: lh.weight,
								});
								if (lhData.result) {
									// TODO: remove experimentalCache in the next major release
									if (experimentalCache || cache) {
										await saveLHReport(
											`${cacheDir}/${lhData.formFactor}`,
											url,
											lhData.result,
										);
									}

									const result = organizeLHResult(lhData.result, lh.weight);

									toolbar.send(
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
								toolbar.send(
									"astro-dev-toolbar:astro-page-insight-app:on-error",
									"Something went wrong.\nPlease try again.",
								);
							}
						},
					);
				},
			},
		};
	},
});
