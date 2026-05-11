# Velobase Harness 文档

**语言:** [English](../en/README.md) | 简体中文

本目录是 Velobase Harness 的中文文档入口。文档迁移期间，部分深层参考文档仍保留在旧的中文优先 `docs/` 目录中。下方稳定入口会被根 README 和 Velobase Cloud Launchpad 生成的 IDE Prompt 引用。

## 从这里开始

| 文档 | 用途 |
| --- | --- |
| [框架指南](./framework-guide.md) | 架构、本地启动、代码边界、模块系统、生产 Checklist |
| [集成指南](./integration-guide.md) | 第三方集成如何组织，以及 AI 如何安全扩展 |
| [AI 完成检查清单](./ai-completion-checklist.md) | commit、push 或部署前的必要自检 |
| [Web/API/Worker 拆分](./architecture/web-api-service-split.md) | 运行时拆分、`SERVICE_MODE`、Docker、Kubernetes 和部署模式 |
| [文档风格指南](./docs-style-guide.md) | 双语文档结构、翻译规则和 Launchpad Prompt 耦合说明 |
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
- 长文档逐步迁移到 `docs/en/**` 和 `docs/zh-CN/**` 镜像目录。
- 不翻译命令、环境变量、文件路径、包名、API 名称和代码块。
- 如果某个文档路径被 Velobase Cloud Launchpad Prompt 引用，修改文档结构时必须同步修改 Cloud 的 Prompt Generator。
