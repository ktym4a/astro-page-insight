import fs from "node:fs";
import { type ConfigEnv, type Plugin as VitePlugin, normalizePath } from "vite";

export const astroScriptsPlugin = (cacheDir: string): VitePlugin => {
	let env: ConfigEnv | undefined = undefined;
	return {
		name: "vite-plugin-page-insight",
		apply: "build",
		config(_config, _env) {
			env = _env;
		},
		buildStart() {
			const isSsrBuild = env?.isSsrBuild;
			if (env?.command === "build" && !isSsrBuild) {
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
			}
		},
	};
};
