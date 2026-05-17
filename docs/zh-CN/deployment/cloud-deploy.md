# 部署到 Velobase Cloud

本文是 Velobase Harness 的中文部署入口。

使用 Velobase Cloud CLI 完成项目初始化、Cloud 适配、部署检查和运维操作。

## 1. 安装 CLI

```bash
npm install -g @velobaseai/cloud-cli@latest
```

CLI 命令是 `velobase-cloud`。

## 2. 登录并连接 GitHub

```bash
velobase-cloud login
velobase-cloud github connect
```

CLI 使用浏览器登录，并把本地凭证保存到 `~/.velobase-cloud/`。

## 3. 初始化项目

在 Harness 仓库根目录运行：

```bash
velobase-cloud init
```

`init` 会扫描项目、识别 Velobase Harness、创建 Cloud project 和基础设施、写入 `.github/workflows/deploy-velobase.yml`、尽可能配置 GitHub secrets，并把项目绑定信息保存到 `.velobase/config.json`。

## 4. 适配 Cloud

- 使用 `pnpm install` 安装依赖。
- 根据 `.env.example` 配置 `.env`。
- 确认 database、Redis、auth 和必需 provider keys 可用。
- 执行 `docs/zh-CN/ai/completion-checklist.md` 中的相关检查。

生成 AI 部署适配上下文：

```bash
velobase-cloud adapt
```

该命令会写入 `.velobase/ai-prompt.md`。在 IDE 中打开它，让本地 AI 按 Cloud 约束调整项目。

## 5. 选择 Runtime Mode

使用 `SERVICE_MODE`：

- `all` 用于本地组合模式或小规模部署。
- `web`、`api`、`worker` 用于生产拆分部署。
- 需要时使用 `web,api` 等逗号分隔组合。

详见 `docs/zh-CN/architecture/web-api-service-split.md`。

## 6. 验证

部署前：

```bash
pnpm lint
pnpm typecheck
pnpm build
```

如果 schema 变更，确认 migrations 已提交，线上使用 `prisma migrate deploy`。

然后运行 CLI readiness check：

```bash
velobase-cloud doctor
```

`doctor` 会检查 Dockerfile、端口 `3000`、health endpoint、migration setup、workflow、secrets 和环境变量校验等部署要求。

## 7. 部署

默认部署路径是 GitHub Actions：

```bash
git push origin main
```

也可以通过 CLI 触发部署：

```bash
velobase-cloud deploy trigger --branch main --watch
```

## 8. 运维

使用 CLI 查看状态、部署记录、日志、环境变量和回滚：

```bash
velobase-cloud status
velobase-cloud deploy runs
velobase-cloud logs deploy
velobase-cloud logs pods
velobase-cloud env list
velobase-cloud deploy rollback <deployment-id>
```

- 检查 Web、API 和 Worker health endpoints。
- 从日志确认必需模块已初始化。
- 生产问题先收集 Cloud runtime logs，再按 `docs/zh-CN/debugging/online-local-debug.md` 排查。
