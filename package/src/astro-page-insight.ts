import {
	createResolver,
	defineIntegration,
	defineOptions,
} from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { type Options, optionsSchema } from "./types.js";
import { organizeLHResult, startLH } from "./server.js";

export default defineIntegration({
	name: "astro-page-insight",
	plugins: [...corePlugins],
	options: defineOptions<Options>({ weight: 0, breakPoint: 768 }),
	setup({ options: inputOptions }) {
		const { weight = 0, breakPoint = 768 } = optionsSchema.parse(inputOptions);
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
				server.ws.on(
					"astro-dev-toolbar:astro-page-insight-app:run-lighthouse",
					async ({ width, height, url }) => {
						try {
							const lhResult = await startLH({
								url,
								width,
								height,
								breakPoint,
								weight,
							});
							if (lhResult) {
								const result = organizeLHResult(lhResult, weight);

								server.ws.send(
									"astro-dev-toolbar:astro-page-insight-app:on-success",
									{
										...result,
										url,
									},
								);
							}
						} catch (error) {
							logger.error("Something went wrong");
							console.error(error);
							server.ws.send(
								"astro-dev-toolbar:astro-page-insight-app:on-error",
								"Something went wrong\nPlease try again",
							);
						}
					},
				);
			},
		};
	},
});
