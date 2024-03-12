# `astro-page-insight`

![](https://raw.githubusercontent.com/ktym4a/astro-page-insight/main/.github/demo.png)

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
| `lh.pwa` | `boolean` | `false` | `pwa` is used to enable the PWA audit. |
| `firstFetch` | `load`, `open`, `none` | `none` | `firstFetch` is used for when to do the first fetch.<br />if `firstFetch` is `load`, will fetch on page load.<br />if `firstFetch` is `open`, will fetch on first app open.<br />if `firstFetch` is `none`, only fetch on user interaction. |
| `experimentalCache` | `boolean` | `false` | `experimentalCache` is used to enable the experimental cache.<br />if `experimentalCache` is `true`, will enable to cache the lighthouse report. |

### Example

```.ts
import pageInsight from "astro-page-insight";

export default defineConfig({
  integrations: [
    pageInsight({
      lh: {
        weight: 0.5,
        breakPoint: 1024,
        pwa: true,
      },
      firstFetch: "open",
      experimentalCache: true,
    }),
  ],
});
```

### gitignore

If you want to ignore the cache, add the following to your `.gitignore`:

```.gitignore
.pageinsight
```

### Notification

You can see that the notification is displayed in the app.

There are three types of notifications:

| Color | Description |
| --- | --- |
| blue | `blue` means that results are fresh. |
| yellow | `yellow` has two meanings.<br />One is that the results are from the cache.<br />The other is that fetching is in progress. |
| red | `red` means that fetching failed. |

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground with blog:

```bash
pnpm playground:blog
```

Start the playground with ssr:

```bash
pnpm playground:ssr
```

Start the playground with view transitions:

```bash
pnpm playground:vw
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/ktym4a/astro-page-insight/blob/main/LICENSE). Made with ❤️ by [ktym4a](https://github.com/ktym4a).

<!-- ## Acknowledgements

TODO: -->
