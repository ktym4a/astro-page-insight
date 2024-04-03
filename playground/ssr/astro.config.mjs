import node from "@astrojs/node";
import svelte from "@astrojs/svelte";
import astroPageInsight from "astro-page-insight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	integrations: [
		svelte(),
		astroPageInsight({
			lh: {
				pwa: true,
			},
			// firstFetch: "load",
			experimentalCache: true,
			build: {
				bundle: true,
				showOnLoad: true,
			},
		}),
	],
});
