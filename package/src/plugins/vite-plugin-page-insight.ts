import fs from "node:fs";
import { type Plugin as VitePlugin, normalizePath } from "vite";

export const astroScriptsPlugin = (cacheDir: string): VitePlugin => {
	return {
		name: "vite-plugin-page-insight",
		apply: "build",
		buildStart() {
			const normalizeCachePath = normalizePath(cacheDir);
			const files = fs
				.readdirSync(normalizeCachePath, {
					recursive: true,
					withFileTypes: true,
				})
				.filter((dirent) => dirent.isFile())
				.map((dirent) => `${dirent.path}/${dirent.name}`);

			for (const filePath of files) {
				const normalizeFilePath = normalizePath(filePath);
				if (!normalizeFilePath.endsWith(".json")) {
					continue;
				}
				const content = fs.readFileSync(normalizeFilePath, "utf-8");
				this.emitFile({
					type: "asset",
					fileName: normalizeFilePath,
					source: JSON.stringify(JSON.parse(content)),
				});
			}
		},
	};
};
