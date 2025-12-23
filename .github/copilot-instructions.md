## Purpose

Quick reference for AI coding agents working on this AdonisJS TypeScript API starter.
Keep guidance short and actionable — focus on the project's structure, conventions, dev scripts, and concrete examples.

## Big picture (why & architecture)

- Framework: AdonisJS (TypeScript). Core pieces live under `app/`, runtime wiring under `start/`, and configuration in `config/`.
- HTTP API is organized by route groups in `start/routes.ts` (see `/api` → `/v1` → `/auth`). OpenAPI is integrated via the openapi package and routes are registered in `start/routes.ts` with `openapi.registerRoutes()`.
- Models use Lucid ORM (`app/models/*`). Auth uses `@adonisjs/auth` with the Lucid mixin (`withAuthFinder`) and DB-backed access tokens (see `app/models/user.ts`).
- Email and token flows use a `Token` model plus events/listeners under `app/events` and `app/listeners` (example: `UserRegistered.dispatch(user.id)` in `app/controllers/auth/register_controller.ts`).

## Key developer workflows (commands)

- Use the scripts in `package.json` (run via `pnpm`, `npm`, or `yarn` depending on the contributor):
  - dev: `node ace serve --hmr` (hot reload dev server) — script name: `dev`
  - build: `node ace build` — script name: `build`
  - start: `node bin/server.js` — script name: `start`
  - test: `node ace test` — script name: `test`
  - lint/format/typecheck: `lint`, `format`, `typecheck`

## Project-specific conventions & patterns

- Import aliases are defined in `package.json` under `imports`. Example mapping (see `package.json`):

```
controllers/* -> ./app/controllers/*.js
models/* -> ./app/models/*.js
validators/* -> ./app/validators/*.js
```

When editing, prefer using those aliases.

- Controllers are async classes that use request validators and OpenAPI decorators (`@ApiOperation`, `@ApiBody`, `@ApiResponse`) — see `app/controllers/auth/register_controller.ts`.
- Request validation is done via `request.validateUsing(<validator>)` and validators live in `app/validators` (validators often exported functions/objects).
- Events are dispatched for background tasks (email sending). Example: `UserRegistered.dispatch(user.id)` — listeners under `app/listeners/*` send notifications.
- Authentication uses the Lucid auth mixin (see `app/models/user.ts`) and `AuthMiddleware` (see `app/middleware/auth_middleware.ts`) which calls `ctx.auth.authenticateUsing(...)`.
- Token usage:
  - Access tokens via `User.accessTokens.create(user)` (DbAccessTokensProvider)
  - Password reset / email verify tokens are implemented as scoped relations on `User` model (`passwordResetTokens`, `verifyEmailTokens`).

## Routes & API structure (concrete example)

- Routes are grouped and prefixed in `start/routes.ts`. Example path -> handler mapping:
  - POST `/api/v1/auth/register` -> `app/controllers/auth/register_controller.ts::register`
  - POST `/api/v1/auth/login` -> `app/controllers/auth/login_controller.ts::login`
  - GET `/docs` redirects to OpenAPI UI (`/api`)

## Files to inspect for context before changing behavior

- `start/routes.ts` — routing and OpenAPI registration
- `app/controllers/auth/*` — auth endpoints & flows (register, login, password reset, verify email)
- `app/models/user.ts` — Lucid model, auth mixin, access tokens, token relations
- `app/middleware/auth_middleware.ts` — how requests are authenticated
- `app/listeners/*` and `app/events/*` — background email flows
- `config/*.ts` and `start/env.ts` — env-driven feature flags (e.g. skip emails during tests)

## Testing & test-patterns

- Tests run via `node ace test`. Tests should avoid sending real emails; the codebase already guards with `env.get('NODE_ENV') !== 'test'` before dispatching email events.
- Use provided Japa setup (`@japa/*` deps) and `tests/bootstrap.ts` for test bootstrapping.

## Small examples to reference

- Register flow (excerpt): `app/controllers/auth/register_controller.ts`:
  - validate: `const data = await request.validateUsing(registerValidator)`
  - create user: `await User.create({...})`
  - generate token: `await User.accessTokens.create(user)`
  - dispatch event: `UserRegistered.dispatch(user.id)`

## Tips for AI code edits (do this first)

1. Locate the route in `start/routes.ts` and the controller referenced by the route (follow the controllers import mapping in `package.json`).
2. Check validators in `app/validators` — preserve validation shapes and OpenAPI decorators when changing contracts.
3. If changing behavior that touches emails, ensure test environment still bypasses external delivery (`start/env.ts` + `config/*`).
4. Update OpenAPI decorators when request/response shapes change so OpenAPI reflects accurate docs.

## What not to assume

- Don't assume emails will be sent during tests (they are skipped by env guard).
- Don't change import aliases without updating `package.json` `imports` mapping.

## Where to run commands locally

- Use the repository root. Typical sequence for local work:
  - install: `pnpm install` (or `npm ci` / `yarn`)
  - run dev: `pnpm run dev`
  - tests: `pnpm test`

---

If anything above is unclear or you want additional examples (e.g., a sample test, or conventions for adding new listeners/controllers), tell me which part to expand.

## Purpose

Quick reference for AI coding agents working on this AdonisJS TypeScript API starter.
Keep guidance short and actionable — focus on the project's structure, conventions, dev scripts, and concrete examples.

## Big picture (why & architecture)

- Framework: AdonisJS (TypeScript). Core pieces live under `app/`, runtime wiring under `start/`, and configuration in `config/`.
- HTTP API is organized by route groups in `start/routes.ts` (see `/api` → `/v1` → `/auth`). OpenAPI is integrated via `@foadonis/openapi` and routes are registered in `start/routes.ts` with `openapi.registerRoutes()`.
- Models use Lucid ORM (`app/models/*`). Auth uses `@adonisjs/auth` with the Lucid mixin (`withAuthFinder`) and DB-backed access tokens (see `app/models/user.ts`).
- Email and token flows use a `Token` model plus events/listeners under `app/events` and `app/listeners` (example: `UserRegistered.dispatch(user.id)` in `app/controllers/auth/register_controller.ts`).

## Key developer workflows (commands)

- Use the scripts in `package.json` (run via `pnpm`, `npm`, or `yarn` depending on the contributor):
  - dev: `node ace serve --hmr` (hot reload dev server) — script name: `dev`
  - build: `node ace build` — script name: `build`
  - start: `node bin/server.js` — script name: `start`
  - test: `node ace test` — script name: `test`
  - lint/format/typecheck: `lint`, `format`, `typecheck`

## Project-specific conventions & patterns

- Import aliases are defined in package.json 'imports'. Example mapping (see `package.json`):

```json
    "#controllers/*": "./app/controllers/*.js",
    "#models/*": "./app/models/*.js",
    "#validators/*": "./app/validators/*.js"
```

When editing, prefer using those aliases.

- Controllers are async classes that use request validators and OpenAPI decorators (`@ApiOperation`, `@ApiBody`, `@ApiResponse`) — see `app/controllers/auth/register_controller.ts`.
- Request validation is done via `request.validateUsing(<validator>)` and validators live in `app/validators` (validators often exported functions/objects).
- Events are dispatched for background tasks (email sending). Example: `UserRegistered.dispatch(user.id)` — listeners under `app/listeners/*` send notifications.
- Authentication uses the Lucid auth mixin (see `app/models/user.ts`) and `AuthMiddleware` (see `app/middleware/auth_middleware.ts`) which calls `ctx.auth.authenticateUsing(...)`.
- Token usage:
  - Access tokens via `User.accessTokens.create(user)` (DbAccessTokensProvider)
  - Password reset / email verify tokens are implemented as scoped relations on `User` model (`passwordResetTokens`, `verifyEmailTokens`).

## Routes & API structure (concrete example)

- Routes are grouped and prefixed in `start/routes.ts`. Example path -> handler mapping:
  - POST `/api/v1/auth/register` -> `app/controllers/auth/register_controller.ts::register`
  - POST `/api/v1/auth/login` -> `app/controllers/auth/login_controller.ts::login`
  - GET `/docs` redirects to OpenAPI UI (`/api`)

## Files to inspect for context before changing behavior

- `start/routes.ts` — routing and OpenAPI registration
- `app/controllers/auth/*` — auth endpoints & flows (register, login, password reset, verify email)
- `app/models/user.ts` — Lucid model, auth mixin, access tokens, token relations
- `app/middleware/auth_middleware.ts` — how requests are authenticated
- `app/listeners/*` and `app/events/*` — background email flows
- `config/*.ts` and `start/env.ts` — env-driven feature flags (e.g. skip emails during tests)

## Testing & test-patterns

- Tests run via `node ace test`. Tests should avoid sending real emails; the codebase already guards with `env.get('NODE_ENV') !== 'test'` before dispatching email events.
- Use provided Japa setup (`@japa/*` deps) and `tests/bootstrap.ts` for test bootstrapping.

## Small examples to reference

- Register flow (excerpt): `app/controllers/auth/register_controller.ts`:
  - validate: `const data = await request.validateUsing(registerValidator)`
  - create user: `await User.create({...})`
  - generate token: `await User.accessTokens.create(user)`
  - dispatch event: `UserRegistered.dispatch(user.id)`

## Tips for AI code edits (do this first)

1. Locate the route in start/routes.ts and the controller referenced by the route (follow the controllers import mapping in `package.json`).
2. Check validators in `app/validators` — preserve validation shapes and OpenAPI decorators when changing contracts.
3. If changing behavior that touches emails, ensure test environment still bypasses external delivery (`start/env.ts` + `config/*`).
4. Update OpenAPI decorators when request/response shapes change so `@foadonis/openapi` reflects accurate docs.

## What not to assume

- Don't assume emails will be sent during tests (they are skipped by env guard).
- Don't change import aliases without updating `package.json` `imports` mapping.

## Where to run commands locally

- Use the repository root. Typical sequence for local work:
  - install: `pnpm install` (or `npm ci` / `yarn`)
  - run dev: `pnpm run dev`
  - tests: `pnpm test`

---

If anything above is unclear or you want additional examples (e.g., a sample test, or conventions for adding new listeners/controllers), tell me which part to expand.
