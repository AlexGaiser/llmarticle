---
description: How to make changes to the shared package and ensure they are reflected in frontend/backend
---

# Updating the Shared Package

This workflow describes how to update the shared package and ensure changes are propagated.

## 1. Make Changes

Modify or add files in `shared/src`.

- **Types**: Add interface/type definitions in `shared/src/types`.
- **Logic**: Add logic in `shared/src`.

## 2. Exports (Optional)

If adding a new subpath (e.g., `shared/utils`), update `shared/package.json` "exports":

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "default": "./dist/index.js"
  },
  "./types": {
    "types": "./dist/types/index.d.ts",
    "default": "./dist/types/index.js"
  }
}
```

## 3. Build

// turbo
Run the build command to compile TypeScript to `dist` folder.

```bash
cd shared
npm run build
```

## 4. Usage

- **Frontend**: `import { ... } from '@llmarticle/shared/types'`
- **Backend**: `import { ... } from '@llmarticle/shared/types'`

> [!IMPORTANT]
> To ensure strict type isolation, the root package `@llmarticle/shared` no longer re-exports types. You MUST import them from the `@llmarticle/shared/types` subpath.
