# Web、API 与 Worker 拆分

**语言:** [English](../../en/architecture/web-api-service-split.md) | 简体中文

本文是 Velobase Harness 运行时拆分的中文入口。迁移期间，完整旧版架构说明仍保留在 [../../architecture/web-api-service-split.md](../../architecture/web-api-service-split.md)。

## 运行时职责

| 运行时 | 职责 | 入口 | 本地命令 | 端口 |
| --- | --- | --- | --- | --- |
| Web | 面向浏览器的 Next.js 应用、SEO、页面、tRPC | Next.js server / `src/web/start.ts` | `pnpm dev` | `3000` |
| API | 独立 Hono HTTP 服务，用于 Webhook 和集成接口 | `src/api/index.ts` | `pnpm api:dev` | `3002` |
| Worker | 队列消费者、定时任务、对账、长耗时任务 | `src/workers/index.ts` | `pnpm worker:dev` | `3001` |
| 组合模式 | 在一个进程中启动选定服务 | `src/server/standalone.ts` | `pnpm dev:all` | 多端口 |

所有运行时共享同一套数据库和 Redis 配置，但不共享进程内存。

## SERVICE_MODE

| `SERVICE_MODE` | 服务 | 典型场景 |
| --- | --- | --- |
| `all` | Web + API + Worker | 本地开发、小规模部署 |
| `web` | 仅 Web | 生产拆分 Web 部署 |
| `api` | 仅 API | 生产拆分 API 部署 |
| `worker` | 仅 Worker | 生产拆分 Worker 部署 |
| `web,api` | Web + API | Worker 独立的中等规模部署 |

## Cloud 部署约定

通过 Velobase Cloud 部署时，应用需要提供：

- 根目录 `Dockerfile`
- HTTP 监听 `3000` 端口
- 通过运行时环境变量读取配置
- 通过 `npx prisma migrate deploy` 执行 Prisma migration
- 用于就绪检查的 `GET /healthz`

多服务 Cloud 部署应让 service definition 与 Web/API/Worker 职责和资源限制保持一致。

## 本地验证

快速验证使用组合入口：

```bash
pnpm dev:all
```

调试运行时隔离时使用拆分进程：

```bash
pnpm dev
pnpm api:dev
pnpm worker:dev
```

服务模式冒烟验证见 `docker-compose.test.yml` 和 `scripts/test-service-mode.mjs`。
