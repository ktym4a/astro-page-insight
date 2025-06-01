# @page-insight/ui

UI components for Page Insight - displays Lighthouse results with a clean, accessible interface.

## Overview

This package contains all the UI components used by Page Insight to display Lighthouse audit results directly on web pages. Components are designed to work in Shadow DOM isolation to prevent style conflicts with the host page.

## Architecture

- `src/components/` - Individual UI components (toolbar, indicators, tooltips, etc.)
- `src/coordinator.ts` - Main coordinator that manages component lifecycle and data mapping
- `src/constants/` - Shared constants and configuration
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

## Key Components

- **Toolbar** (`toolbar.ts`) - Main toolbar interface with buttons and controls
- **Indicators** (`indicator.ts`) - Visual audit indicators showing mobile/desktop state
- **Score** (`score.ts`) - Lighthouse score display with color-coded results
- **Filter** (`filter.ts`) - Category filtering for audit results
- **Highlight** (`highlight.ts`) - Element highlighting on the page
- **Hide** (`hide.ts`) - Hide problematic elements functionality
- **Toast** (`toast.ts`) - Notification system for user feedback
- **Tooltip** (`tooltip.ts`) - Detailed audit information display
- **Console Alert** (`consoleAlert.ts`) - Console error reporting

## Development

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Watch mode for development
pnpm dev

# Build the package
pnpm build

# Type checking
pnpm typecheck

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:dev

# Run tests with coverage
pnpm test:coverage
```

## Testing

Tests are located in `tests/` and use Vitest with Happy DOM for component testing. The test setup includes:

- **Component tests**: Test individual UI component rendering and behavior
- **DOM tests**: Test component interactions with the DOM
- **Unit tests**: Test utility functions and data transformations

## Usage

This package is primarily consumed by the main `astro-page-insight` package:

```typescript
import {
  createToolbar,
  createScore,
  mappingData,
  type Buttons
} from "@page-insight/ui";
```

## Shadow DOM Architecture

All UI components render inside a `<page-insight-root>` custom element with Shadow DOM to ensure complete style isolation from the host page. This prevents CSS conflicts while maintaining full functionality.

## Browser Support

- Modern browsers with Shadow DOM support
- ES2022+ JavaScript environment
- CSS custom properties support