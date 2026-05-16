# Web, API, And Worker Split

Velobase Harness can run as one combined process in development or as separate Web, API, and Worker services in production.

## Service Types

| Service | Responsibility | Entry | Typical Port |
| --- | --- | --- | --- |
| Web | Next.js App Router, pages, tRPC client/server | Next production server or `src/web/start.ts` | `3000` |
| API | Standalone Hono HTTP service, webhooks, health routes | `src/api/index.ts` | `3002` |
| Worker | BullMQ processors, schedulers, retryable side effects | `src/workers/index.ts` | `3001` |
| Combined | Local or small deployment mode | `src/server/standalone.ts` | multiple |

## `SERVICE_MODE`

`SERVICE_MODE` controls which runtime starts:

- `all`: start Web, API, and Worker.
- `web`: start only Web.
- `api`: start only API.
- `worker`: start only Worker.
- `web,api`: start selected services together.

## Deployment Patterns

Small deployments can run all services in one container. Production deployments usually split them into three pods or services:

- Web scales with user traffic.
- API scales with webhook and external HTTP traffic.
- Worker scales with queue depth and long-running jobs.

## AI Rules

- Hono API code must not import Next.js-only APIs.
- Worker code must not depend on request-scoped Next.js APIs.
- Shared business logic belongs in services that can run in Web, API, or Worker.
- Side effects that need retries should go through queues.
- Keep health and readiness behavior consistent across service modes.
