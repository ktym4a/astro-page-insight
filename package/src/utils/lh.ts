export const fetchLighthouse = (
	fetchButton: HTMLButtonElement,
	document: Document,
) => {
	fetchButton.classList.add("animate");
	fetchButton.disabled = true;

	const width = document.documentElement.clientWidth;
	const height = document.documentElement.clientHeight;
	const url = window.location.href;

	import.meta.hot?.send(
		"astro-dev-toolbar:astro-page-insight-app:run-lighthouse",
		{
			width,
			height,
			url,
		},
	);
};
