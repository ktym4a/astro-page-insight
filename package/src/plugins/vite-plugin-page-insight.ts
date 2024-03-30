import fs from "node:fs";
import { type Plugin as VitePlugin, normalizePath } from "vite";
import { getColorKey } from "../utils/color.ts";

export const astroScriptsPlugin = (
	resolve: (...path: string[]) => string,
): VitePlugin => {
	let ref1: string;
	return {
		name: "virtual:test",
		apply: "build",
		async resolveId(id) {
			if (id === "virtual:test") {
				return id;
			}
			return undefined;
		},

		async load(id) {
			if (id === "virtual:test") {
				return `const test = 'test'; console.log(test);`;
			}
			return null;
		},

		buildStart(option) {
			// console.log(option);
			const tset: string = resolve("./ui/hide.ts");

			ref1 = this.emitFile({
				type: "chunk",
				preserveSignature: "strict",
				fileName: "test.js",
				id: tset,
			});
		},

		// generateBundle(options, bundle) {
		// 	console.log(bundle);
		// },

		writeBundle(_, bundle) {
			console.log(_);

			for (const [_, chunk] of Object.entries(bundle)) {
				if (chunk.type !== "asset" && chunk.fileName === "test.js") {
					const chunkCode = chunk.code;
					this.emitFile({
						type: "asset",
						fileName: "aaa.js",
						source: chunkCode,
					});
				}
			}
		},
	};
};
