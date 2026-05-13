# Velobase Harness 文档

**语言:** [English](../en/README.md) | 简体中文

本目录是 Velobase Harness 的中文文档入口。文档迁移期间，部分深层参考文档仍保留在旧的中文优先 `docs/` 目录中。下方稳定入口会被根 README 和 Velobase Cloud Launchpad 生成的 IDE Prompt 引用。

## 从这里开始

| 文档 | 用途 |
| --- | --- |
| [AI 领域设计指南](../ai/design.md) | **阶段零** — 产品理解、领域建模、Schema 和 API 设计（写代码之前） |
| [框架指南](../../FRAMEWORK_GUIDE.md) | 架构、本地启动、代码边界、模块系统、生产 Checklist |
| [集成指南](../integration-guide.md) | 第三方集成如何组织，以及 AI 如何安全扩展 |
| [AI 测试指南](../ai/testing.md) | 测试策略、分层模式（单元 / 集成 / E2E）、AI 生成测试规范 |
| [AI 完成检查清单](../ai-completion-checklist.md) | commit、push 或部署前的必要自检 |
| [Web/API/Worker 拆分](../architecture/web-api-service-split.md) | 运行时拆分、`SERVICE_MODE`、Docker、Kubernetes 和部署模式 |
| [AI Agent 规则](../../AGENTS.md) | AI Agent 修改代码前必须阅读的稳定规则 |

## 参考区域

| 区域 | 当前位置 |
| --- | --- |
| API 约定 | [../conventions/api.md](../conventions/api.md) |
| Debug 流程 | [../debugging/online-local-debug.md](../debugging/online-local-debug.md) |
| 第三方集成 | [../integrations/](../integrations/) |
| 内置功能 | [../features/](../features/) |
| 模块示例 | [../../src/modules/example/README.md](../../src/modules/example/README.md) |
| AI Chat 模块 | [../../src/modules/ai-chat/README.md](../../src/modules/ai-chat/README.md) |

## 文档规则

- 根目录 `README.md` 保持英文默认入口，`README.zh-CN.md` 作为中文入口。
- 只有公开文档入口保留在 `docs/en/**` 和 `docs/zh-CN/**`；AI 专用指南统一放在英文 `docs/ai/**`。
- 不翻译命令、环境变量、文件路径、包名、API 名称和代码块。
- 如果某个文档路径被 Velobase Cloud Launchpad Prompt 引用，修改文档结构时必须同步修改 Cloud 的 Prompt Generator。
