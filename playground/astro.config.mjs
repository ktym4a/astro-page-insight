import tailwind from "@astrojs/tailwind";
import astroPageInsight from "astro-page-insight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		astroPageInsight({
			// firstFetch: "open",
			experimentalCache: true,
		}),
	],
});
