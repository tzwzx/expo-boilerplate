# Expo Boilerplate

Opinionated starter for React Native with Expo 55, React 19, TypeScript, and an Ultracite-driven lint pipeline.

## Install Dependencies

Use Bun to install dependencies when setting up the project for the first time.

```bash
bun i
```

## Scripts

Run each script with `bun <script>`.

### Start Dev Server

Launch the Expo development server with Dev Client.

```bash
bun dev
```

### Run on iOS Simulator

Build and run on a specific iOS simulator device.

```bash
bun ios:18
bun ios:26
```

### Build with EAS

Build for different environments using EAS Build.

```bash
bun build:dev:ios
bun build:preview:ios
bun build:prod:ios
```

### Submit to App Store

Submit the latest production build to App Store Connect.

```bash
bun submit:ios
```

### Run Lint Checks

Execute Ultracite static analysis (Oxfmt + Oxlint).

```bash
bun lint
```

### Apply Lint Fixes

Apply automatic fixes provided by Ultracite.

```bash
bun fix
```

### Type Check

Run `tsgo --noEmit` to validate TypeScript types.

```bash
bun tsc
```

### Lint Semver Ranges

Validate semver ranges in `package.json` with Syncpack.

```bash
bun package-lint-semver-ranges
```

### Detect Unused Code

Use Knip to find unused files, exports, and dependencies.

```bash
bun knip
```

### Run Unit Tests

Execute the Bun unit test suite.

```bash
bun test:unit
```

### Run E2E Tests (Web)

Run Playwright end-to-end tests in headless mode.

```bash
bun test:e2e:web
```

### Run E2E Tests (App)

Run Maestro end-to-end tests on a running simulator.

```bash
bun test:e2e:app
```

### Quality Gate

Run linting, type checks, Knip, package format validation, and unit tests together.

```bash
bun codesweep:check
```

### Quality Gate (Auto Fix)

Apply automatic fixes, then run type checks, Knip, package format validation, and unit tests.

```bash
bun codesweep:fix
```

### Version Management

Check, update app version and iOS build number.

```bash
bun check-version
bun update-version 1.0.0
bun update-build-number 2
```
