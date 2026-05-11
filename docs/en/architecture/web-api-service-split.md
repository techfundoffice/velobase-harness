# Web, API, and Worker Split

**Language:** English | [Simplified Chinese](../../zh-CN/architecture/web-api-service-split.md)

This document is the English entry for the Velobase Harness runtime split. For the full legacy Chinese architecture note during migration, see [../../architecture/web-api-service-split.md](../../architecture/web-api-service-split.md).

## Runtime Responsibilities

| Runtime | Responsibility | Entry | Local command | Port |
| --- | --- | --- | --- | --- |
| Web | Browser-facing Next.js app, SEO, pages, tRPC | Next.js server / `src/web/start.ts` | `pnpm dev` | `3000` |
| API | Standalone Hono HTTP surface for webhooks and integrations | `src/api/index.ts` | `pnpm api:dev` | `3002` |
| Worker | Queue consumers, schedulers, reconciliation, long tasks | `src/workers/index.ts` | `pnpm worker:dev` | `3001` |
| Combined | Starts selected services in one process | `src/server/standalone.ts` | `pnpm dev:all` | multiple |

All runtimes share the same database and Redis configuration, but they do not share in-process memory.

## SERVICE_MODE

| `SERVICE_MODE` | Services | Typical use |
| --- | --- | --- |
| `all` | Web + API + Worker | Local development, small deployments |
| `web` | Web only | Split production Web deployment |
| `api` | API only | Split production API deployment |
| `worker` | Worker only | Split production Worker deployment |
| `web,api` | Web + API | Medium deployments with Worker separated |

## Cloud Deployment Contract

When deployed through Velobase Cloud, the application must provide:

- A root `Dockerfile`
- HTTP listening on port `3000`
- Runtime configuration through environment variables
- Prisma migration through `npx prisma migrate deploy`
- `GET /healthz` for readiness

Multi-service Cloud deployment should align service definitions with Web/API/Worker responsibilities and resource limits.

## Local Verification

Use the combined entry for fast checks:

```bash
pnpm dev:all
```

Use split processes when debugging runtime isolation:

```bash
pnpm dev
pnpm api:dev
pnpm worker:dev
```

Service-mode smoke validation is documented by `docker-compose.test.yml` and `scripts/test-service-mode.mjs`.
