import { COLORS } from "../constants/index.js";

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
	onClick?: () => void,
	tooltip?: string,
) => {
	const button = document.createElement("button");

	button.innerHTML = icon;
	button.type = "button";
	if (onClick) button.onclick = onClick;

	if (tooltip) {
		button.dataset.tooltip = tooltip;
	}

	return button;
};

export const createToolbarWrapper = (type: string) => {
	const toolbarWrapper = document.createElement("div");
	toolbarWrapper.dataset.type = type;

	toolbarWrapper.classList.add(`astro-page-insight-${type}`);
	toolbarWrapper.style.position = "fixed";
	toolbarWrapper.style.background = "#181825";
	toolbarWrapper.style.color = "#cdd6f4";
	toolbarWrapper.style.borderRadius = "5px";
	toolbarWrapper.style.padding = "15px 10px";
	toolbarWrapper.style.border = "1px solid #cdd6f4";
	toolbarWrapper.style.width = "300px";
	toolbarWrapper.style.overflowY = "auto";
	toolbarWrapper.style.right = "65px";
	toolbarWrapper.style.bottom = "50px";
	toolbarWrapper.style.display = "none";
	toolbarWrapper.style.zIndex = "200010";

	return toolbarWrapper;
};

export const createToolbarTitle = (title: string, icon: string) => {
	const titleWrap = document.createElement("h2");

	titleWrap.innerHTML = `<div style="color: ${COLORS.blue}; min-width: 24px; max-width: 24px;">${icon}</div>`;

	const titleElement = document.createElement("p");
	titleElement.textContent = title;
	titleElement.style.flex = "1";
	titleElement.style.margin = "0";

	titleWrap.appendChild(titleElement);

	titleWrap.style.display = "flex";
	titleWrap.style.justifyContent = "center";
	titleWrap.style.alignItems = "center";
	titleWrap.style.marginTop = "0";
	titleWrap.style.marginBottom = "15px";
	titleWrap.style.fontWeight = "normal";
	titleWrap.style.gap = "10px";
	titleWrap.style.fontSize = "16px";
	titleWrap.style.borderBottom = "1px solid #cdd6f4";
	titleWrap.style.paddingBottom = "15px";

	return titleWrap;
};

export const createDetails = (isLast: boolean) => {
	const details = document.createElement("details");
	details.open = true;
	if (!isLast) {
		details.style.paddingBottom = "15px";
	}

	return details;
};

export const createSummary = (category: string) => {
	const summary = document.createElement("summary");
	summary.textContent = `${category}`;
	summary.style.cursor = "pointer";
	summary.style.background = "#45475a";
	summary.style.fontWeight = "normal";
	summary.style.padding = "5px 10px";
	summary.style.borderRadius = "5px";

	return summary;
};
