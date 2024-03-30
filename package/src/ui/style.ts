export const initStyle = (canvas: ShadowRoot) => {
	canvas.innerHTML += `
    <style>
      :host {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        color: #cdd6f4;
      }

      a {
          color: #89b4fa;
      }

      a:visted {
          color: #89b4fa;
      }

      svg {
          width: 100%;
          height: auto;
      }

      .toast {
        position: fixed;
        top: 20px;
        right: 10px;
        padding: 10px 20px;
        border-radius: 10px;
        background: #f38ba8;
        color: #11111b;
        border: 1px solid #a6adc8;
        z-index: 1000;
        font-size: 16px;
      }

      .astro-page-insight-highlight button {
          display: inline-flex;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 200006;
          padding: 2px;
          border-radius: 3px;
          align-items: center;
          justify-content: center;
          border: 1px solid #cdd6f4;
          color: #cdd6f4;
          background-color: #181825;
          cursor: pointer;
          transition: background-color 0.2s ease;
      }

      .astro-page-insight-highlight button:hover {
          background-color: #45475a;
      }

      .astro-page-insight-highlight button:focus-visible {
          outline-offset: -2px;
          background-color: #45475a;
      }

      .astro-page-insight-highlight button:disabled {
          cursor: not-allowed;
          background-color: #6c7086 !important;
      }

      .astro-page-insight-highlight button > svg {
          width: 20px;
          height: 20px;
      }
    </style>
    `;
};
