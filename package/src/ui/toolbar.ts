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
        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button {
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

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap:first-child > button {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }

		.astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button.astro-page-insight-toolbar-button-alert::before {
			content: "";
			position: absolute;
			top: 3px;
			right: 3px;
			width: 7.5px;
			height: 7.5px;
			background-color: #f38ba8;
			border-radius: 50%;
			z-index: 1000001;
		}

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap:not(:first-child) > button {
            margin-top: -1px;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap:last-child > button {
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }

		.astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button.active {
			background-color: #45475a;
		}

		.astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button.active + div {
			display: block !important;
		}

		.astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button.active:disabled + div {
			display: none !important;
		}

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button:hover {
            background-color: #45475a;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button:focus-visible {
            outline-offset: -2px;
            background-color: #45475a;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button:disabled {
            cursor: not-allowed;
            background-color: #6c7086 !important;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button > svg {
            width: 25px;
            height: 25px;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button.animate > svg {
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

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button[data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            top: 50%;
            right: 120%;
			transform: translateY(-50%);
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

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button[data-tooltip]:hover::after {
            display: block;
        }

        .astro-page-insight-toolbar .astro-page-insight-toolbar-wrap .astro-page-insight-toolbar-button-wrap > button[data-tooltip]:focus-visible::after {
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
	buttonParent: HTMLDivElement,
	disabled?: boolean,
	type?: string,
	onClick?: () => void,
	tooltip?: string,
) => {
	const button = document.createElement("button");

	button.innerHTML = icon;
	button.type = "button";
	if (disabled) button.disabled = true;
	if (type) button.dataset.buttonType = type;
	if (onClick) button.onclick = onClick;

	if (tooltip) {
		button.dataset.tooltip = tooltip;
	}

	const buttonWrap = document.createElement("div");
	buttonWrap.classList.add("astro-page-insight-toolbar-button-wrap");
	if(type) buttonWrap.classList.add(`astro-page-insight-toolbar-button-wrap-${type}`);
	buttonWrap.appendChild(button);

	buttonParent.appendChild(buttonWrap);

	return button;
};

export const createToolbarWrapper = (type: string) => {
	const toolbarWrapper = document.createElement("div");
	toolbarWrapper.dataset.type = type;

	toolbarWrapper.classList.add(`astro-page-insight-modal-${type}`);
	toolbarWrapper.style.position = "fixed";
	toolbarWrapper.style.background = "#181825";
	toolbarWrapper.style.color = "#cdd6f4";
	toolbarWrapper.style.borderRadius = "5px";
	toolbarWrapper.style.padding = "15px 10px";
	toolbarWrapper.style.border = "1px solid #cdd6f4";
	toolbarWrapper.style.maxWidth = "300px";
	toolbarWrapper.style.minWidth = "200px";
	toolbarWrapper.style.width = "50vw";
	toolbarWrapper.style.overflowY = "auto";
	toolbarWrapper.style.right = "65px";
	toolbarWrapper.style.bottom = "50px";
	toolbarWrapper.style.display = "none";
	toolbarWrapper.style.zIndex = "200010";
	toolbarWrapper.style.maxHeight = "40vh";
	toolbarWrapper.style.overflowY = "auto";

	return toolbarWrapper;
};

export const createToolbarTitle = (
	title: string,
	icon: string,
	subText?: string,
) => {
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
	titleWrap.style.flexWrap = "wrap";
	titleWrap.style.fontWeight = "normal";
	titleWrap.style.gap = "10px";
	titleWrap.style.fontSize = "16px";
	titleWrap.style.borderBottom = "1px solid #cdd6f4";
	titleWrap.style.paddingBottom = "15px";

	if (subText) {
		const subTextElement = document.createElement("p");
		subTextElement.textContent = subText;
		subTextElement.style.margin = "0";
		subTextElement.style.fontSize = "14px";
		subTextElement.style.fontWeight = "normal";
		subTextElement.style.color = "#cdd6f4";
		subTextElement.style.width = "100%";
		titleWrap.appendChild(subTextElement);
	}

	return titleWrap;
};

export const toggleToolbarWrapper = (canvas: ShadowRoot, type: string) => {
	const button = canvas.querySelector<HTMLButtonElement>(
		`[data-button-type="${type}"]`,
	);
	if (!button) return;
	const isOpen = button.classList.contains("active");

	const buttons =
		canvas.querySelectorAll<HTMLButtonElement>("[data-button-type]");
	for (const button of buttons) {
		button.classList.remove("active");
	}

	if (!isOpen) {
		button.classList.add("active");
	}
};

export const createToolbarElement = (isLast: boolean) => {
	const contentElement = document.createElement("div");

	if (!isLast) {
		contentElement.style.marginBottom = "7px";
		contentElement.style.borderBottom = "1px solid #cdd6f4";
		contentElement.style.paddingBottom = "7px";
	}

	return contentElement;
};

export const createToolbarSubTitle = (title: string) => {
	const textElement = document.createElement("p");
	textElement.textContent = title;
	textElement.style.margin = "0";
	textElement.style.fontSize = "14px";
	textElement.style.fontWeight = "bold";

	return textElement;
};

export const createToolbarContentWrapper = () => {
	const contentWrapper = document.createElement("div");
	contentWrapper.style.display = "flex";
	contentWrapper.style.justifyContent = "space-between";
	contentWrapper.style.alignItems = "center";
	contentWrapper.style.margin = "0";
	contentWrapper.style.fontSize = "14px";
	contentWrapper.style.wordBreak = "break-word";
	contentWrapper.style.padding = "5px";
	contentWrapper.style.borderRadius = "5px";
	contentWrapper.style.gap = "10px 5px";

	return contentWrapper;
};
