const SLIDE_FORWARDS_ANIMATION = {
	old: {
		name: "slideBack",
		duration: "0.3s",
		easing: "ease-in-out",
		fillMode: "forwards",
	},
	new: {
		name: "slide",
		duration: "0.3s",
		easing: "ease-in-out",
		fillMode: "backwards",
	},
};

const SLIDE_BACKWARDS_ANIMATION = {
	old: {
		name: "slideBack",
		duration: "0.3s",
		easing: "ease-in-out",
		fillMode: "forwards",
	},
	new: {
		name: "slide",
		duration: "0.3s",
		easing: "ease-in-out",
		fillMode: "backwards",
	},
};

export const MAIN_SLIDE_ANIMATION = {
	forwards: SLIDE_FORWARDS_ANIMATION,
	backwards: SLIDE_BACKWARDS_ANIMATION,
};
