import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();
	const content = await response.text();

	// Add a script tag to the end of the body
	// const script = `<script type="module">
	// ${test()};</script>`;
	const script = `<script type="module"></script>`;
	return new Response(content.replace("</body>", `${script}</body>`), response);
});
