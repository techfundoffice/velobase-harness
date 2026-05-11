# AI 完成检查清单

**语言:** [English](../en/ai-completion-checklist.md) | 简体中文

AI Agent 完成功能、修复、重构或集成改动后，使用本清单在 commit 或 push 前确认正确性、数据安全、部署可用性和文档同步。

迁移期间，完整旧版清单仍保留在 [../ai-completion-checklist.md](../ai-completion-checklist.md)。

## 变更范围

- 查看 `git diff`，确认只包含本次请求相关改动。
- 未经明确要求，不回滚用户已有改动。
- 不提交 `.env`、密钥、本地数据库文件、调试导出或临时日志。
- 如果改动了框架共享层，确认没有把产品特定逻辑写进框架核心。

## 质量命令

根据改动范围运行最小有效验证：

```bash
pnpm lint
pnpm typecheck
```

范围更大时补充：

```bash
pnpm check
pnpm format:check
pnpm build
```

纯文档改动可按情况跳过完整构建，但必须检查链接、命令和引用路径是否准确。

## 数据库与 Prisma

如果修改了 `prisma/schema.prisma`：

- 使用 `npx prisma migrate dev --name <description>` 创建 migration。
- 生产变更不要只依赖 `pnpm db:push`。
- 确认 `npx prisma generate` 已运行，或被 install/deploy 流程覆盖。
- 检查必填字段、默认值、已有数据和发布顺序是否安全。

## 环境变量

如果配置发生变化：

- 更新 `.env.example`。
- 更新 `src/env.js` 校验。
- 文档说明变量获取位置。
- 如果变量控制可插拔模块，同步更新 `src/config/modules.ts`。

## API 与安全

- mutation 默认使用 `protectedProcedure`，除非明确是公开接口。
- 用户输入使用 Zod 或等价 schema 校验。
- 列表接口保留分页。
- 不打印 API Key、token、支付卡信息、数据库 URL 或用户隐私。
- 管理页面和管理 API 都要校验管理员权限。

## 副作用与 Worker

- 分析、广告、通知和运营自动化通过 `appEvents.emit()` 与可插拔模块订阅实现。
- 不在核心支付、订单、认证流程中直接调用 PostHog、Google Ads、Lark、Telegram 等可选模块。
- Worker 任务必须具备幂等性。
- 新队列同时注册到 queue 和 processor index。
- 确认 `SERVICE_MODE=worker` 下不依赖 Next.js-only API。

## 前端与国际化

- 用户可见文案使用 `messages/en.json` 和 `messages/zh.json`。
- 重要界面具备 loading、empty、error、unauthorized 状态。
- 新用户页面检查窄屏布局。
- 新增重要页面时同步 SEO metadata 和导航入口。

## 文档

- 使用方式变化时，更新 README、集成文档、功能文档或框架文档。
- 如果某个文档路径被 Velobase Cloud Launchpad Prompt 引用，必须同步更新 Cloud Prompt Generator 和测试。
- 英文和中文文档保持同步。

## 最终回复

告知用户改了什么、运行了哪些检查，以及哪些检查跳过或无法运行。
