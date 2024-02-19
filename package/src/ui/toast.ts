import { COLORS } from "../constants/index.js";
import { alertTriangleIcon, circleCheckIcon } from "./icons.js";

const BR_REGEX = /\n/g;

export const createToastArea = () => {
	const toastArea = document.createElement("div");
	toastArea.style.position = "fixed";
	toastArea.style.top = "20px";
	toastArea.style.right = "10px";
	toastArea.style.display = "flex";
	toastArea.style.flexDirection = "column";
	toastArea.style.gap = "15px";
	toastArea.style.width = "380px";
	toastArea.style.zIndex = "4000000";

	return toastArea;
};

export const showToast = (
	toastArea: HTMLDivElement,
	message: string,
	type: "success" | "error",
) => {
	const colorKey = type === "success" ? "green" : ("red" as const);
	const icon = type === "success" ? circleCheckIcon : alertTriangleIcon;
	const color = COLORS[colorKey];
	const toast = document.createElement("div");
	toast.classList.add("astro-page-insight-toast");
	toast.style.padding = "10px 20px";
	toast.style.borderRadius = "5px";
	toast.style.background = "#181825";
	toast.style.border = "1px solid #cdd6f4";
	toast.style.color = "#cdd6f4";
	toast.style.display = "flex";
	toast.style.gap = "10px";
	toast.style.fontSize = "18px";
	toast.style.wordBreak = "break-word";

	toast.innerHTML = `
    <div style="color: ${color}; min-width: 24px; max-width: 24px;">${icon}</div>
    <p style="margin: 0;">${message.replace(BR_REGEX, "<br>")}</p>
  `;

	toastArea.appendChild(toast);

	setTimeout(() => {
		toast.remove();
	}, 5000);
};