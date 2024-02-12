# `astro-page-insight`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that make Astro site insights easier and more visual.

## Usage

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-page-insight
```

```bash
npm astro add astro-page-insight
```

```bash
yarn astro add astro-page-insight
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-page-insight
```

```bash
npm install astro-page-insight
```

```bash
yarn add astro-page-insight
```

2. Add the integration to your astro config

```diff
+import astroPageInsight from "astro-page-insight";

export default defineConfig({
  integrations: [
+    astroPageInsight(),
  ],
});
```

### Configuration

Here is the TypeScript type:

```ts
export type Options = {
  weight?: number;
  breakPoint?: number;
}
```

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground:

```bash
pnpm playground:dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/ktym4a/astro-page-insight/blob/main/LICENSE). Made with ❤️ by [ktym4a](https://github.com/ktym4a).

<!-- ## Acknowledgements

TODO: -->
