# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
yarn dev:sandbox        # Local sandboxed dev server (dummy data via src/index.js)
yarn dev:integrated     # Watch build for integration with Bahmni (serves dist/federation/)

# Build
yarn build              # Production federated build
yarn build:dev          # Development federated build

# Testing
yarn test               # Jest with coverage (TZ=UTC)
yarn test:ci            # CI test run
# Run a single test file:
yarn test -- --testPathPattern="ComponentName"

# Lint
yarn lint               # ESLint on src/**/*.{js,jsx}
```

## Architecture

This is a **React micro-frontend** for OpenMRS In-Patient Department (IPD), integrated into the Bahmni platform via **Webpack Module Federation**. It exposes three federated entry points:

- `./Dashboard` → `src/entries/Dashboard.jsx`
- `./IpdDashboard` → `src/entries/Dashboard/IpdDashboard.jsx`
- `./CareViewDashboard` → `src/entries/CareViewDashboard/`

The webpack config has two configurations: `federation` (for Bahmni integration, public path `/ipd/`) and `sandbox` (isolated local dev). React/React-DOM are declared as singletons shared with the host app.

## Code Organization

```
src/
├── entries/          # Federated module entry points
├── features/         # Feature modules (drug chart, nursing tasks, care view, etc.)
├── components/       # Shared reusable components
├── context/          # React Context providers (IPD, CareView, Medications, Slider, etc.)
├── hooks/            # Custom hooks (data fetching)
└── utils/            # Shared utilities (CommonUtils, DateTimeUtils, DrugChartUtils)
```

Each feature follows the pattern: `FeatureName.jsx` + `FeatureName.scss` + `FeatureName.spec.jsx` + optional `utils/` subfolder.

## Key Patterns

- **State management**: React Context API only — no Redux or external state library.
- **UI components**: Carbon Components v10 (`carbon-components-react`) and `bahmni-carbon-ui`.
- **Date/time**: Moment.js throughout; tests use `MockDate` and run with `TZ=UTC`.
- **Styles**: SCSS/SASS; some components use CSS modules (`.module.scss`).
- **i18n**: React Intl (`react-intl` v3); translation files managed via Transifex (`.tx/`).
- **API calls**: Axios; tests use `axios-mock-adapter` and `jest-fetch-mock`.
- **Testing**: React Testing Library with `@testing-library/jest-dom` matchers. Snapshot tests exist alongside behavioral tests.
- **SVGs**: Loaded as React components via `react-svg-loader`.

## Feature Toggles

Features are gated via feature toggles checked at runtime. Example: `enableNurseAcknowledgement` gates the task filter view. Check existing toggle usage before adding new behavior.
