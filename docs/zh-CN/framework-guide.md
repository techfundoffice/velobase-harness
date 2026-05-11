# 框架指南

**语言:** [English](../en/framework-guide.md) | 简体中文

本文说明如何基于 Velobase Harness 开发 AI SaaS 产品，并保持框架层、配置层和业务层边界清晰。

迁移期间，完整旧版指南仍保留在 [../../FRAMEWORK_GUIDE.md](../../FRAMEWORK_GUIDE.md)。

## 运行时概览

Velobase Harness 是一个仓库、三类运行时入口：

| 运行时 | 职责 | 本地命令 | 默认端口 |
| --- | --- | --- | --- |
| Web | Next.js App Router 页面、SEO、面向浏览器的应用、tRPC 路由 | `pnpm dev` | `3000` |
| API | 独立 Hono HTTP 服务，用于集成、Webhook 和解耦 API | `pnpm api:dev` | `3002` |
| Worker | BullMQ 消费者、定时任务、对账、长耗时任务 | `pnpm worker:dev` | `3001` |
| 组合模式 | 通过 `src/server/standalone.ts` 同时启动 Web、API、Worker | `pnpm dev:all` | 以上端口 |

`SERVICE_MODE` 控制生产组合方式，支持 `all`、`web`、`api`、`worker`，以及 `web,api` 等组合。

## 本地启动

```bash
pnpm install
cp .env.example .env
pnpm docker:db:up
pnpm db:push
pnpm db:seed
pnpm dev:all
```

需要分开看日志或模拟生产拆分时，使用：

```bash
pnpm dev
pnpm api:dev
pnpm worker:dev
```

## 代码边界

按三层理解代码：

| 层级 | 示例 | 规则 |
| --- | --- | --- |
| 框架核心层 | `src/server/auth/`、`src/server/db.ts`、`src/server/redis.ts`、`src/server/api/trpc.ts`、`src/server/events/`、`src/server/modules/` | 复用和调用。除非是在改框架本身，否则不要写入产品特定逻辑。 |
| 框架配置层 | `src/config/modules.ts`、产品/定价配置、Provider、功能常量 | 用少量明确配置适配产品。 |
| 产品业务层 | `src/modules/<feature>/`、产品页面、产品服务、Landing 文案 | 产品差异化功能放在这里。 |

不确定放哪里时，优先在 `src/modules/<feature>/` 创建或修改产品模块，并从那里调用框架服务。

## 功能开发流程

1. 阅读 [AI Agent 规则](../../AGENTS.md)。
2. 阅读相关集成或功能文档。
3. 在 `prisma/schema.prisma` 定义数据变化。
4. 使用 `npx prisma migrate dev --name <description>` 创建 migration。
5. 在 `src/modules/<feature>/` 实现产品模块。
6. 添加 tRPC router，并挂载到 `src/server/api/root.ts`。
7. 更新 `messages/en.json` 和 `messages/zh.json` 中的用户可见文案。
8. 按 [AI 完成检查清单](./ai-completion-checklist.md) 自检。

## 可插拔模块

可插拔模块通过事件总线订阅业务事件，不从核心支付、认证或订单流程中直接调用。这样即使可选集成被禁用，也不会影响核心业务链路。

| 模块 | 提供能力 | 常见触发 |
| --- | --- | --- |
| PostHog | 产品分析和 Feature Flag | 认证、计费、导航事件 |
| Google Ads | 离线转化回传 | 支付成功 |
| Lark / Telegram | 运营通知 | 支付、风控、客服事件 |
| NowPayments | 加密货币支付 | Checkout 和 Webhook |
| Affiliate | 邀请、返佣、提现 | 订单履约、退款事件 |
| Touch | 生命周期触达 | 订阅和用户生命周期事件 |
| AI Chat | 对话、工具和模型路由 | 产品特定 AI 工作流 |

## 生产说明

- Web 运行时使用 `pnpm build` 和 `pnpm start`。
- 拆分服务使用 `pnpm api:prod` 和 `pnpm worker:prod`。
- 组合运行时使用 `pnpm start:all`。
- Cloud 部署需要 `Dockerfile`、`3000` 端口、运行时环境变量、Prisma migration 和 `GET /healthz`。
- 服务拆分和 Kubernetes 细节见 [Web/API/Worker 拆分](./architecture/web-api-service-split.md)。
