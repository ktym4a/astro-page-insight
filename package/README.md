# `astro-page-insight`

![](../.github/demo.png)

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that shows everything to improve from Lighthouse results directly on the page.

## Usage

### Prerequisites

You need to have Chrome.

if you see errors like `ERR_LAUNCHER_NOT_INSTALLED`, you may need to install Chrome.


### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-page-insight
```

```bash
npx astro add astro-page-insight
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
+import pageInsight from "astro-page-insight";

export default defineConfig({
  integrations: [
+    pageInsight(),
  ],
});
```

### Configuration


Here is the options:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `lh.weight` | `number` | `0` | `weight` is the threshold value in the audit. |
| `lh.breakPoint` | `number` | `767` | `breakPoint` is used to determine whether on mobile or desktop. |

### Example

```.ts
import pageInsight from "astro-page-insight";

export default defineConfig({
  integrations: [
    pageInsight({
      lh: {
        weight: 0.5,
        breakPoint: 1024,
      },
    }),
  ],
});
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
