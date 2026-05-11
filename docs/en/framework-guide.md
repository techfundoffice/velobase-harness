# Framework Guide

**Language:** English | [Simplified Chinese](../zh-CN/framework-guide.md)

This guide explains how to build an AI SaaS product on top of Velobase Harness without breaking the reusable framework layer.

For the full legacy Chinese guide during migration, see [../../FRAMEWORK_GUIDE.md](../../FRAMEWORK_GUIDE.md).

## Runtime Overview

Velobase Harness uses one repository with three runtime entries:

| Runtime | Responsibility | Local command | Default port |
| --- | --- | --- | --- |
| Web | Next.js App Router pages, SEO, browser-facing app, tRPC routes | `pnpm dev` | `3000` |
| API | Standalone Hono HTTP surface for integrations, webhooks, and decoupled APIs | `pnpm api:dev` | `3002` |
| Worker | BullMQ consumers, scheduled jobs, reconciliation, and long-running work | `pnpm worker:dev` | `3001` |
| Combined | Starts Web, API, and Worker from `src/server/standalone.ts` | `pnpm dev:all` | all of the above |

`SERVICE_MODE` controls production composition. Supported values include `all`, `web`, `api`, `worker`, and combinations such as `web,api`.

## Local Startup

```bash
pnpm install
cp .env.example .env
pnpm docker:db:up
pnpm db:push
pnpm db:seed
pnpm dev:all
```

Use split commands when you need separate logs or want to mirror production:

```bash
pnpm dev
pnpm api:dev
pnpm worker:dev
```

## Code Boundaries

Treat the codebase as three layers:

| Layer | Examples | Rule |
| --- | --- | --- |
| Framework core | `src/server/auth/`, `src/server/db.ts`, `src/server/redis.ts`, `src/server/api/trpc.ts`, `src/server/events/`, `src/server/modules/` | Reuse and call. Do not add product-specific logic here unless the framework itself changes. |
| Configurable framework | `src/config/modules.ts`, products/pricing config, providers, feature constants | Adapt with small, explicit product configuration. |
| Product layer | `src/modules/<feature>/`, product pages, product-specific services, landing copy | Build product-specific behavior here. |

When in doubt, create or modify a product module under `src/modules/<feature>/` and call framework services from there.

## Feature Development Flow

1. Read [AI Agent Rules](../../AGENTS.md).
2. Read the relevant integration or feature docs.
3. Define data changes in `prisma/schema.prisma`.
4. Create a migration with `npx prisma migrate dev --name <description>`.
5. Implement the product module under `src/modules/<feature>/`.
6. Add a tRPC router and mount it in `src/server/api/root.ts`.
7. Update user-facing copy in `messages/en.json` and `messages/zh.json`.
8. Run the [AI Completion Checklist](./ai-completion-checklist.md).

## Pluggable Modules

Pluggable modules subscribe to the event bus instead of being called directly from core business flows. This keeps payment, auth, and order logic stable when optional integrations are disabled.

| Module | Enables | Typical trigger |
| --- | --- | --- |
| PostHog | Product analytics and feature flags | Auth, billing, navigation events |
| Google Ads | Offline conversion uploads | Payment success |
| Lark / Telegram | Ops notifications | Payment, risk, support events |
| NowPayments | Crypto payments | Checkout and webhook events |
| Affiliate | Referral and commission flows | Order fulfillment and refund events |
| Touch | Lifecycle messaging | Subscription and user lifecycle events |
| AI Chat | Chat, tools, and model routing | Product-specific AI workflows |

## Production Notes

- Use `pnpm build` and `pnpm start` for the Next.js web runtime.
- Use `pnpm api:prod` and `pnpm worker:prod` for split services.
- Use `pnpm start:all` for a combined standalone runtime.
- Cloud deployments must provide `Dockerfile`, port `3000`, runtime env vars, Prisma migration, and `GET /healthz`.
- For service split and Kubernetes details, read [Web/API/Worker Split](./architecture/web-api-service-split.md).
