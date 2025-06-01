# Architecture Refactor Plan: Modular Page Insight

## Overview

This document outlines the plan to refactor `astro-page-insight` into a modular, framework-agnostic architecture that can be used with any Vite-based framework while maintaining the current functionality for Astro users.

## Current State Analysis

### Tightly Coupled to Astro
- **Dev Toolbar Integration**: Uses Astro's `defineToolbarApp` API
- **Integration Hooks**: Leverages Astro-specific lifecycle events
- **Client Communication**: Built around Astro's dev toolbar event system
- **Script Injection**: Uses Astro's `injectScript` API

### Already Framework-Agnostic
- **Lighthouse Runner**: Pure Node.js implementation with Puppeteer
- **UI Components**: Vanilla JavaScript with Shadow DOM isolation
- **Vite Plugin**: Standard Vite plugin for build-time bundling
- **Utilities**: Result processing, color utils, hash generation

## Proposed Package Architecture

### @page-insight/core
**Purpose**: Framework-agnostic Lighthouse execution and result processing

**Responsibilities**:
- Lighthouse runner with Puppeteer
- Cache management system
- Result organization and filtering
- Core configuration schema
- Shared types and constants

**Key Files to Extract**:
- `server/index.ts` → Core runner
- `utils/lh.ts` → Result organization
- `utils/color.ts` → Color utilities
- `schema/index.ts` → Core schema (partial)
- `types/index.ts` → Core types (partial)
- `constants/index.ts` → Shared constants

**Dependencies**:
- `lighthouse`
- `puppeteer`

### @page-insight/ui
**Purpose**: Reusable UI components for displaying Lighthouse results

**Responsibilities**:
- All UI components (toolbar, score, tooltip, etc.)
- Shadow DOM setup and management
- Event handling system
- Theme support (light/dark)
- Responsive handling

**Key Files to Extract**:
- All files from `ui/` directory
- `clients/index.ts` → Main client logic
- Style injection and management
- Component initialization

**Dependencies**: None (pure vanilla JS)

### @page-insight/vite
**Purpose**: Vite plugin for build-time integration

**Responsibilities**:
- Bundle cache files during build
- Generate virtual modules
- Handle production mode serving

**Key Files to Extract**:
- `plugins/vite-plugin-page-insight.ts`
- Build configuration types

**Dependencies**:
- `vite` (peer dependency)
- `@page-insight/core` (for types)

### @page-insight/astro
**Purpose**: Astro-specific integration layer

**Responsibilities**:
- Astro integration setup
- Dev toolbar app
- Astro-specific event handling
- Script injection for Astro

**Key Files to Retain**:
- `integration.ts` → Main integration
- `plugin.ts` → Dev toolbar app
- `clients/devTool.ts` → Toolbar client

**Dependencies**:
- `astro` (peer dependency)
- `astro-integration-kit`
- `@page-insight/core`
- `@page-insight/ui`
- `@page-insight/vite`

## Migration Strategy

### Phase 1: Repository Structure
1. Convert to pnpm workspace monorepo
2. Create package directories:
   ```
   packages/
   ├── core/
   ├── ui/
   ├── vite/
   └── astro/
   ```
3. Set up shared TypeScript configuration
4. Configure build tooling for each package

### Phase 2: Extract Core Package
1. Move Lighthouse runner and utilities
2. Extract core types and interfaces
3. Create framework-agnostic configuration schema
4. Set up testing for core functionality
5. Publish as `@page-insight/core`

### Phase 3: Extract UI Package
1. Move all UI components
2. Extract client-side logic
3. Create public API for UI initialization
4. Document component usage
5. Publish as `@page-insight/ui`

### Phase 4: Extract Vite Package
1. Move Vite plugin
2. Create plugin configuration interface
3. Document plugin API
4. Publish as `@page-insight/vite`

### Phase 5: Refactor Astro Package
1. Update imports to use new packages
2. Remove extracted code
3. Focus on Astro-specific integration
4. Maintain backward compatibility
5. Publish as `@page-insight/astro`

### Phase 6: Create Migration Guide
1. Document breaking changes
2. Provide migration examples
3. Update all documentation

## API Design

### Core API
```typescript
// @page-insight/core
export interface PageInsightCore {
  runLighthouse(url: string, options: LighthouseOptions): Promise<Results>
  getCached(url: string, formFactor: FormFactor): Results | null
  clearCache(): void
}
```

### UI API
```typescript
// @page-insight/ui
export interface PageInsightUI {
  init(container: Element, options: UIOptions): void
  update(results: Results): void
  destroy(): void
}
```

### Vite Plugin API
```typescript
// @page-insight/vite
export function pageInsightPlugin(options: PluginOptions): Plugin
```

### Framework Integration Pattern
```typescript
// Example: @page-insight/nuxt
export default defineNuxtModule({
  setup(options, nuxt) {
    // Use @page-insight/core for Lighthouse
    // Use @page-insight/ui for display
    // Use @page-insight/vite for builds
  }
})
```

## Benefits

1. **Framework Agnostic**: Any Vite-based framework can use Page Insight
2. **Reduced Bundle Size**: Install only needed packages
3. **Easier Maintenance**: Clear separation of concerns
4. **Better Testing**: Test each package independently
5. **Community Contributions**: Easier to contribute framework integrations
6. **Vite Ecosystem**: Leverage Vite's plugin ecosystem

## Backward Compatibility

- Current `astro-page-insight` package becomes a meta-package
- Re-exports all functionality from `@page-insight/astro`
- Deprecation warnings guide users to new packages
- Major version bump for the refactor

## Future Possibilities

1. **Framework Integrations**:
   - `@page-insight/nuxt`
   - `@page-insight/sveltekit`
   - `@page-insight/vite-plugin-vue`
   - `@page-insight/vite-plugin-react`

2. **Additional Analysis Tools**:
   - `@page-insight/bundle-analyzer`
   - `@page-insight/accessibility`
   - `@page-insight/seo`

3. **UI Variants**:
   - `@page-insight/ui-react`
   - `@page-insight/ui-vue`
   - `@page-insight/ui-svelte`

## Timeline Estimate

- Phase 1-2: 1 week (Core extraction)
- Phase 3-4: 1 week (UI and Vite extraction)
- Phase 5-6: 1 week (Astro refactor and documentation)
- Testing & QA: 1 week

Total: ~1 month for complete refactor

## Open Questions

1. Should we maintain the current package name for backward compatibility?
2. What versioning strategy for the monorepo (independent vs. synchronized)?
3. Should UI components be further split (e.g., toolbar as separate package)?
4. How to handle dev mode communication for non-Astro frameworks?
5. Should we create a CLI tool for non-Vite environments?