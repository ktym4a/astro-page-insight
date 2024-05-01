import astroPageInsight from "astro-page-insight";
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	server: {
		port: 4325,
	},
	output: "hybrid",
	integrations: [
		astroPageInsight({
			lh: {
				breakPoint: 375,
			},
			cache: true,
			build: {
				bundle: true,
			},
		}),
	],
	adapter: node({
		mode: "standalone",
	}),
});
