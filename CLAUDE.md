# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Vue 3 + TypeScript + Vite application with modern tooling including Pinia for state management, Vue Router for routing, and a comprehensive linting setup using ESLint and Oxlint.

## Package Manager

This project uses **pnpm** exclusively. All commands should be run with pnpm, not npm or yarn.

## Common Development Commands

```bash
# Install dependencies
pnpm install

# Development server with hot reload
pnpm dev

# Build for production (runs type-check + build-only)
pnpm build

# Type checking only
pnpm type-check

# Lint and fix (runs oxlint + eslint in sequence)
pnpm lint

# Format code with Prettier
pnpm format

# Preview production build
pnpm preview
```

## Architecture

### Build System
- **Vite** with Rolldown as the bundler (`vite` aliased to `rolldown-vite`)
- Vue 3 with TypeScript support via `vue-tsc`
- Path alias: `@` points to `src/` directory

### State Management
- **Pinia** stores using Composition API syntax (see `src/stores/counter.ts`)
- Store pattern: `defineStore` with setup function returning reactive state and actions

### Routing
- **Vue Router 4** with history mode
- Route-level code splitting for lazy loading (see About route in `src/router/index.ts`)

### Linting & Formatting
- **Dual linting**: Oxlint for correctness + ESLint for Vue/TypeScript rules
- **Prettier** for code formatting with Oxc plugin
- ESLint config uses flat config format with Vue + TypeScript presets

### TypeScript Configuration
- Composite project setup with separate configs for app and node environments
- Vue SFC type support via `vue-tsc`

## Node.js Version Requirements

Requires Node.js `^20.19.0 || >=22.12.0` as specified in package.json engines.