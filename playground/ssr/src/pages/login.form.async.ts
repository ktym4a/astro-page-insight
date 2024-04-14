import type { APIRoute } from "astro";
export const POST: APIRoute = () => {
	return Response.json({
		ok: true,
		user: 1,
	});
};
