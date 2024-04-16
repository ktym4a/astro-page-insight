import { fileURLToPath } from "node:url";
import { test as base } from "@playwright/test";
import * as Astro from "astro";

export function testFactory() {
	// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
	let devServer;

	const test = base.extend({
		// biome-ignore lint/correctness/noEmptyPattern: <explanation>
		async dev({}, use) {
			const root = fileURLToPath(
				new URL("./fixtures/ssg-no-cache/", import.meta.url),
			);

			devServer ??= await Astro.dev({
				root,
				logLevel: "silent",
				vite: {
					logLevel: "silent",
				},
			});
			await use(devServer);
		},
	});
	return test;
}
