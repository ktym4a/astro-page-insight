import { defineConfig } from "tsup";
import { devDependencies, peerDependencies } from "./package.json";

export default defineConfig((options) => {
	const dev = !!options.watch;
	return {
		entry: ["src/**/*.(ts|js)"],
		format: ["esm"],
		target: "node18",
		bundle: true,
		dts: true,
		sourcemap: true,
		clean: true,
		splitting: false,
		minify: !dev,
		external: [
			...Object.keys(peerDependencies),
			...Object.keys(devDependencies),
		],
		tsconfig: "tsconfig.json",
	};
});
