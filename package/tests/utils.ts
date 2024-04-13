export const createShadowRoot = () => {
	const shadowDom = document.createElement("div");
	shadowDom.attachShadow({ mode: "open" });
	document.body.appendChild(shadowDom);

	return shadowDom.shadowRoot as ShadowRoot;
};
