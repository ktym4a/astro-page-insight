import {
	createResolver,
	defineIntegration,
	defineOptions,
} from "astro-integration-kit";
import { type Options, optionsSchema } from "../types/server";
import { organizeLHResult, startLH } from "./server";

export default defineIntegration({
	name: "astro-page-insight",
	options: defineOptions<Options>({ weight: 0, breakPoint: 768 }),
	setup({ options: inputOptions }) {
		return {
			"astro:config:setup": ({ addDevToolbarApp, command }) => {
				if (command === "dev") {
					const { resolve } = createResolver(import.meta.url);
					addDevToolbarApp(resolve("./astro-page-insight-toolbar.ts"));
				}
			},
			"astro:server:setup": async ({ server }) => {
				const { weight = 0, breakPoint = 768 } =
					optionsSchema.parse(inputOptions);

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
