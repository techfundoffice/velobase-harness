# 集成指南

**语言:** [English](../en/integration-guide.md) | 简体中文

本文说明 Velobase Harness 如何组织第三方集成，以及 AI Agent 应该如何安全扩展这些集成。

迁移期间，完整旧版指南仍保留在 [../integration-guide.md](../integration-guide.md)。

## 框架定位

Velobase Harness 弥补“产品想法”到“可上线 SaaS 应用”之间的基础设施缺口：

- 开发者提供产品想法并做产品判断。
- AI 实现产品特定功能。
- 框架提供成熟基础：认证、数据库、计费、支付、邮件、队列、存储、分析和运营钩子。

框架不替产品决定降级策略、产品页面或自定义业务逻辑，这些都属于产品层。

## 集成分层

| 层级 | 目的 | 示例 |
| --- | --- | --- |
| 核心基础 | 大多数 SaaS 必需 | Auth、Email、Database、Payment、Storage、Queue |
| 增长集成 | 获客、分析和增长常用 | PostHog、Google Ads、AI/LLM |
| 运营支撑 | 按需启用 | Lark、Telegram、Turnstile、Support、Deployment |

## 可插拔架构

可选集成应实现为可插拔模块：

1. 在 `src/config/modules.ts` 添加启停开关。
2. 在 `src/server/modules/<name>.ts` 实现 `FrameworkModule`。
3. 订阅 `src/server/events/bus.ts` 中的框架事件。
4. 在 `src/server/modules/index.ts` 注册模块。
5. 文档化所需环境变量和第三方后台配置。

不要从核心支付、订单、认证或计费流程中直接调用可选集成。核心流程只发事件，模块自己响应。

## 六步集成流程

1. **选型:** 选择 Provider 并说明原因。
2. **架构:** 定义目录、Provider、数据流和边界。
3. **接口:** 为产品代码暴露小而清晰的类型化 API。
4. **配置:** 列出环境变量、后台设置、Webhook URL 和密钥。
5. **异常处理:** 说明重试、幂等和人工介入路径。
6. **AI 引导:** 用类型、默认行为、示例和 `AGENTS.md` 规则约束 AI。

## AI 规则

- 优先使用类型化 API 和 Provider 接口，不要随手散落 SDK 调用。
- Provider 特定逻辑留在集成目录。
- 产品特定行为放到 `src/modules/<feature>/`。
- 新增环境变量时同步更新 `.env.example` 和 `src/env.js`。
- 有副作用的集成使用事件总线，并确保失败不影响核心流程。
