import nodejs from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import astroPageInsight from "astro-page-insight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		astroPageInsight({
			lh: {
				pwa: true,
			},
			// firstFetch: "open",
			experimentalCache: true,
		}),
	],
	output: "server",
	adapter: nodejs({ mode: "standalone" }),
	vite: {
		define: {
			"process.env.TMDB_API_KEY": JSON.stringify(process.env.TMDB_API_KEY),
		},
	},
});
