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

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap > button[data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            top: 110%;
            right: 0;
            padding: 5px;
            background-color: #181825;
            color: #cdd6f4;
            border-radius: 5px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000002;
            display: none;
            border: 1px solid #cdd6f4;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap > button[data-tooltip]:hover::after {
            display: block;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap > button[data-tooltip]:focus-visible::after {
            display: block;
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

export const createToolbarButton = (
	icon: string,
	onClick: () => void,
	tooltip?: string,
) => {
	const button = document.createElement("button");

	button.innerHTML = icon;
	button.addEventListener("click", onClick);

	if (tooltip) {
		button.dataset.tooltip = tooltip;
	}

	return button;
};
