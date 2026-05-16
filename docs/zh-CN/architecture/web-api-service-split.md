# Web、API 与 Worker 拆分

Velobase Harness 可以在开发环境中以组合进程运行，也可以在生产环境中拆分为 Web、API 和 Worker 服务。

## 服务类型

| 服务 | 职责 | 入口 | 常见端口 |
| --- | --- | --- | --- |
| Web | Next.js App Router、页面、tRPC client/server | Next production server 或 `src/web/start.ts` | `3000` |
| API | 独立 Hono HTTP 服务、webhooks、health routes | `src/api/index.ts` | `3002` |
| Worker | BullMQ processors、schedulers、可重试副作用 | `src/workers/index.ts` | `3001` |
| Combined | 本地或小规模部署模式 | `src/server/standalone.ts` | 多端口 |

## `SERVICE_MODE`

`SERVICE_MODE` 控制启动哪些 runtime：

- `all`：启动 Web、API 和 Worker。
- `web`：只启动 Web。
- `api`：只启动 API。
- `worker`：只启动 Worker。
- `web,api`：组合启动指定服务。

## 部署模式

小规模部署可以把所有服务放在一个容器中。生产部署通常拆成三个 pod 或 service：

- Web 按用户流量扩缩容。
- API 按 webhook 和外部 HTTP 流量扩缩容。
- Worker 按队列深度和长任务扩缩容。

## AI 规则

- Hono API 代码不要导入 Next.js-only APIs。
- Worker 代码不要依赖 request-scoped Next.js APIs。
- 共享业务逻辑放在 Web、API、Worker 都能运行的 services 中。
- 需要重试的副作用走队列。
- 各 service mode 的 health 和 readiness 行为保持一致。
