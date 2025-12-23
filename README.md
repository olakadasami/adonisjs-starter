# Additions on top of the AdonisJS starter kit

This project starts from the AdonisJS TypeScript starter and layers several practical integrations and conventions used by the app. This README documents the extra wiring and behaviours you should know before making changes.

Prerequisite: be familiar with AdonisJS file conventions

- The project follows AdonisJS layout and conventions. Before editing, make sure you understand how Adonis organizes `app/`, `start/`, `config/`, `resources/`, and `database/` (routes in `start/routes.ts`, controllers under `app/controllers`, models under `app/models`, validators under `app/validators`).

What's added (concise)

- OpenAPI integration: `@foadonis/openapi` is used to generate API docs. Routes register the OpenAPI UI via `openapi.registerRoutes()` in `start/routes.ts`. Controllers contain OpenAPI decorators like `@ApiOperation`, `@ApiBody`, and `@ApiResponse`.
- Auth & tokens: `User` uses Adonis Lucid auth mixin and `DbAccessTokensProvider` (see `app/models/user.ts`). Access tokens are created with `User.accessTokens.create(user)`.
- Email & token flows: password reset and email verification are implemented with a `Token` model and an event/listener pattern. See `app/events/*` and `app/listeners/*` and mail templates in `resources/mails` and `resources/views/mails`.
- Import aliases: `package.json` defines import aliases under `imports` (for controllers, models, validators, etc.). Prefer using these aliases when editing files.

Key files to inspect when changing behaviour

- `start/routes.ts` — route grouping/prefixing and OpenAPI registration
- `app/controllers/auth/*` — register/login/logout/password reset/verify flows
- `app/models/user.ts` — auth mixin, accessTokens provider, token relations
- `app/listeners/*` and `app/events/*` — email sending and background flow
- `app/validators/*` — validation schemas used by controllers
- `resources/mails/*` and `resources/views/mails/*` — email templates

Developer workflows (commands)
Run these from the repository root.

```bash
# install deps (recommended: pnpm)
pnpm install

# development with hot reload
pnpm run dev    # runs: node ace serve --hmr

# run tests
pnpm test       # runs: node ace test

# build for production
pnpm run build  # runs: node ace build
```

Important project conventions and gotchas

- Validators: controllers call `request.validateUsing(<validator>)`. When changing request/response shapes, update the validator and OpenAPI decorators.
- Events & tests: the codebase guards email dispatch during tests with an env check (e.g. `env.get('NODE_ENV') !== 'test'`). Preserve this guard when modifying listeners or dispatch sites to avoid sending real emails during CI.
- OpenAPI decorators: keep response types and examples in sync when changing controller outputs — the OpenAPI UI is generated from these decorators.
- Import aliases: do not change `package.json` `imports` mapping unless you update all affected imports.

Example: register flow (quick trace)

1. Route: POST `/api/v1/auth/register` — defined in `start/routes.ts` under the `/api/v1/auth` group.
2. Controller: `app/controllers/auth/register_controller.ts` — validates input (`request.validateUsing(registerValidator)`), creates `User.create(...)`, creates access token via `User.accessTokens.create(user)`, and dispatches `UserRegistered.dispatch(user.id)` (guarded by NODE_ENV).
3. Listener: `app/listeners/send_verification_email.ts` — builds and sends the verification email using templates in `resources/mails`.

If you want me to also:

- add a minimal test for the register flow (happy path), or
- produce a short checklist to run when updating OpenAPI decorators,
  tell me which one and I'll implement it next.
