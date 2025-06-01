import {
	addVitePlugin,
	createResolver,
	defineIntegration,
} from "astro-integration-kit";
import { engineRegistry } from "./engines/index.js";
import { astroPageInsightPlugin } from "./plugins/vite-plugin-page-insight.js";
import { integrationOptionsSchema } from "./schema/index.js";
import {
	getEngineReport,
	runTestingEngine,
	saveEngineReport,
} from "./server/engine.js";

export default defineIntegration({
	name: "astro-page-insight",
	optionsSchema: integrationOptionsSchema,
	setup({ options }) {
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
							const engineName = "lighthouse";
							const engineReports = await getEngineReport(
								engineName,
								cacheDir,
								url,
								lh.weight,
							);

							const engine = engineRegistry.get(engineName);
							const categories = engine?.categories;

							toolbar.send("astro-dev-toolbar:astro-page-insight-app:options", {
								breakPoint: lh.breakPoint,
								categories,
								firstFetch,
								reports: engineReports,
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
								const engineName = "lighthouse";
								const engineData = await runTestingEngine(engineName, {
									url,
									width,
									height,
									breakPoint: lh.breakPoint,
									weight: lh.weight,
								});

								if (engineData.result) {
									if (experimentalCache || cache) {
										if (engineData.rawResult) {
											await saveEngineReport(
												engineName,
												`${cacheDir}/${engineData.formFactor}`,
												url,
												engineData.rawResult,
											);
										}
									}

									const result = engineData.result;

									toolbar.send(
										"astro-dev-toolbar:astro-page-insight-app:on-success",
										{
											...result,
											url,
											formFactor: engineData.formFactor,
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
