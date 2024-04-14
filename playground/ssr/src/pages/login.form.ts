export function POST() {
	return new Response(null, {
		status: 301,
		headers: {
			Location: "/",
		},
	});
}
