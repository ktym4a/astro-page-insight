---
"astro-page-insight": major
"@page-insight/ui": major
---

Extract UI components into separate packages/ui package

This is a major architectural refactoring that moves all UI components from the main package into a dedicated @page-insight/ui package. This change improves code organization and modularity but requires updating imports for any code that directly imported UI components.