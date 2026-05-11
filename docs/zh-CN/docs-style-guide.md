# 文档风格指南

**语言:** [English](../en/docs-style-guide.md) | 简体中文

新增或更新 Velobase Harness 文档时遵循本指南。

## 语言结构

- 根目录 `README.md` 是默认英文公开入口。
- 根目录 `README.zh-CN.md` 是简体中文公开入口。
- 长文档放在镜像目录：`docs/en/**` 和 `docs/zh-CN/**`。
- 迁移期间可以保留旧目录文档，但新的公开链接应优先指向镜像路径。

## 不翻译的内容

以下内容在不同语言版本中保持原样：

- 命令、参数和脚本
- 文件路径和目录名
- 环境变量名
- 包名和 API 名称
- 代码块和 schema 示例
- GitHub owner/repo 占位，除非值本身发生变化

## 必要内容

重要文档应包含：

- 顶部语言切换
- 文档目的和面向读者
- 稳定文件路径和命令
- 文档会影响生成代码时的 AI 引导
- 对应语言版本链接

## Launchpad 耦合

部分文档路径会被 Velobase Cloud Launchpad 生成的 Prompt 引用。修改这些路径时，需要同步更新：

- `velobase-cloud/src/modules/launchpad/services/prompt-generator.ts`
- `velobase-cloud/src/modules/launchpad/__tests__/prompt-generator.test.ts`
- 如果用户流程文案变化，同步更新 `messages/en.json` 和 `messages/zh.json`
