# AI 开发完成检查清单

本文档用于 AI 完成功能开发、修复或重构后，在提交代码前按流程自检。目标不是机械跑所有命令，而是确认本次改动已经覆盖正确性、数据库、部署和安全边界。

## 适用时机

- 完成一个功能模块、Bug 修复、重构或集成接入后
- 准备 commit / push / 创建 PR 前
- 修改数据库、环境变量、支付、认证、Worker、Webhook 等高风险区域后

## 1. 变更范围检查

先确认改动范围符合用户需求：

- 查看 `git diff`，确认没有混入无关文件、临时日志、调试代码或格式化噪音。
- 未经用户要求，不回滚用户已有改动，不删除框架核心文件。
- 如果改动了框架通用层，确认没有把业务定制逻辑写进通用能力里。
- 如果新增依赖，确认确实必要，并且已经通过包管理器写入 lockfile。

## 2. 必跑质量命令

在项目根目录运行：

```bash
pnpm lint
pnpm typecheck
pnpm build
```

如果只做文档改动，可以不跑构建，但应检查 Markdown 链接和命令示例是否准确。

建议补充：

```bash
pnpm format:check
```

如果项目已有测试或本次新增了测试，运行相关测试命令；没有统一测试脚本时，至少运行与改动模块对应的最小验证命令。

## 3. Prisma / 数据库检查

只要修改了 `prisma/schema.prisma`，必须检查以下事项：

- 已生成并提交 `prisma/migrations/<timestamp>_<name>/migration.sql`。
- 不只依赖 `pnpm db:push` 或 `npx prisma db push`，因为线上只执行 `prisma migrate deploy`。
- 运行 `npx prisma generate` 或确认 `postinstall` / migration 流程会重新生成 Prisma Client。
- 新增字段如果是必填字段，确认已有数据迁移策略安全，例如默认值、分步迁移或可空过渡。
- 手写 migration 使用幂等 SQL，避免重复执行失败。

推荐流程：

```bash
npx prisma migrate dev --name describe_your_change
npx prisma generate
```

如果本地数据库已经用 `db:push` 超前于 migration 历史，参考 `FRAMEWORK_GUIDE.md` 的数据库变更流程处理 drift。

## 4. 运行时配置检查

如果新增或修改环境变量：

- 更新 `.env.example`，包含注释、是否必填、示例值或获取方式。
- 更新 `src/env.js` 的 T3 Env 校验，不直接读取 `process.env`。
- 确认生产环境缺失变量时会尽早失败，或有明确的模块禁用逻辑。
- 如果变量控制可插拔模块，确认 `src/config/modules.ts` 里集中管理启停逻辑。

## 5. API 与权限检查

涉及 tRPC、Hono、Next.js API Route 或 Server Action 时：

- 所有 mutation 使用 `protectedProcedure`，除非它明确是公开端点。
- 所有用户输入经过 Zod 或等价 schema 校验。
- 列表查询有分页，默认 limit 合理。
- API 错误不泄露密钥、token、数据库连接串或第三方原始敏感响应。
- 新增 router 已挂载到 `src/server/api/root.ts`，禁用模块时路由不会暴露。

## 6. 安全与数据边界检查

高风险改动必须额外检查：

- 认证：不在客户端保存敏感 token，不绕过 `useLogin()` 和 NextAuth 约定。
- 支付：不在前端直接调用支付 SDK，不硬编码价格，Webhook 校验签名，权益发放走既有 fulfillment / billing 流程。
- 文件上传：校验文件类型、大小和访问权限，使用统一 storage 封装。
- 管理后台：管理员权限校验覆盖页面、API 和操作入口。
- 日志：不打印 API Key、session、JWT、支付卡信息、用户隐私数据。

## 7. 模块与副作用检查

如果新增通知、分析、广告追踪、运营自动化等副作用：

- 通过事件总线 `appEvents.emit()` 和可插拔模块订阅实现。
- 不在核心支付、订单、认证流程中直接调用 PostHog、Google Ads、Lark、Telegram 等模块。
- 新增事件已补充 `EventPayload` 类型。
- 事件处理器异常有日志，不影响核心业务主流程。

## 8. Worker / 队列检查

涉及后台任务时：

- 新队列在 `src/workers/queues/index.ts` 和 `src/workers/processors/index.ts` 导出。
- Worker 通过 `createWorkerInstance()` 创建，不直接 `new Worker()`。
- 任务具备幂等性，重复执行不会重复扣费、重复发放权益或写入重复数据。
- 失败重试策略合理，永久失败会留下可排查日志。
- `SERVICE_MODE=worker` 下不依赖 Next.js-only API。

## 9. 前端与国际化检查

涉及用户界面时：

- 用户可见文案使用 `useTranslations()` 或 `getTranslations()`，不在 JSX 中硬编码英文字符串。
- loading、empty、error、unauthorized 状态都有可用 UI。
- 表单提交有禁用重复提交或 loading 状态。
- 移动端和窄屏布局基本可用。
- 新页面入口、导航、SEO metadata 按需求补齐。

## 10. 文档与种子数据检查

如果改动影响使用方式：

- 更新相关 README、集成文档或 `FRAMEWORK_GUIDE.md`。
- 新增配置、Webhook、第三方后台操作步骤需要写清楚。
- 新增默认产品、Agent、模板或运营配置时，更新 seed 脚本并保持幂等。
- 示例代码和命令能在当前项目结构下运行。

## 11. 最终人工验证

根据改动类型至少做一条真实路径验证：

- 登录 / 注册 / 权限：走一遍页面或 API。
- 支付 / 订阅 / 退款：使用测试环境验证完整链路。
- 数据库改动：确认本地迁移成功，关键查询可正常返回。
- Worker：触发一次任务，确认入队、执行、失败日志都可观察。
- Webhook：用测试事件或本地转发验证签名和幂等。

## 12. 提交前确认

提交前最后确认：

- `git status` 只包含本次任务相关文件。
- 没有提交 `.env`、密钥、私有证书、临时导出文件或本地数据库文件。
- lockfile 变化与依赖变化一致。
- migration、seed、文档和代码改动互相匹配。
- 最终回复用户时说明已运行哪些检查，哪些因环境限制未运行。
