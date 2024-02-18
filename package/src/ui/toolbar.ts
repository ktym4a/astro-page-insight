export const createToolbar = (canvas: ShadowRoot) => {
	const toolbar = document.createElement("div");
	toolbar.classList.add("astro-page-insight-toolbar");
	toolbar.style.position = "fixed";
	toolbar.style.bottom = "50px";
	toolbar.style.right = "20px";
	toolbar.style.zIndex = "1000001";

	toolbar.innerHTML = `
    <style>
        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap > button {
            display: inline-flex;
            position: relative;
            padding: 5px;
            align-items: center;
            border: 1px solid #cdd6f4;
            color: #cdd6f4;
            background-color: #181825;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap > button:first-child {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap > button:not(:first-child) {
            margin-top: -1px;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap > button:last-child {
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap > button:hover {
            background-color: #45475a;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap > button:focus-visible {
            outline-offset: -2px;
            background-color: #45475a;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap > button:disabled {
            cursor: not-allowed;
            background-color: #6c7086 !important;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap > button > svg {
            width: 25px;
            height: 25px;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap > button.animate > svg {
            animation: rotate 1s infinite;
        }

        @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
        }
        `;

	const toolbarWrap = document.createElement("div");
	toolbarWrap.classList.add("astro-page-insight-toolbar-wrap");
	toolbarWrap.style.display = "inline-flex";
	toolbarWrap.style.isolation = "isolate";
	toolbarWrap.style.borderRadius = "5px";
	toolbarWrap.style.flexDirection = "column";

	toolbar.appendChild(toolbarWrap);

	canvas.appendChild(toolbar);

	return toolbarWrap;
};

export const createToolbarButton = (icon: string, onClick: () => void) => {
	const button = document.createElement("button");

	button.innerHTML = icon;
	button.addEventListener("click", onClick);

	return button;
};

export const reloadIcon =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -6.986 -6.918a8.095 8.095 0 0 0 -8.019 3.918" /><path d="M4 13a8.1 8.1 0 0 0 15 3" /><path d="M19 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M5 8m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>';

export const listIcon =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l11 0" /><path d="M9 12l11 0" /><path d="M9 18l11 0" /><path d="M5 6l0 .01" /><path d="M5 12l0 .01" /><path d="M5 18l0 .01" /></svg>';
