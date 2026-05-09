# 线上到本地 Debug 指南

> 适用场景：应用已经部署到 Velobase Cloud，线上页面、接口、Worker 或部署过程出错，需要把线上日志交给 IDE / AI 编码工具分析，再在本地复现和验证修复。

## 核心流程

```text
线上出问题
  -> 打开 Velobase Cloud 控制台的 logs 页面
  -> 复制最新错误日志
  -> 粘贴给 IDE / AI 编码工具分析
  -> 本地用 Docker 启动数据库和 Redis
  -> 本地 dev 复现、修复、验证
  -> 提交并 push，触发线上部署
```

不要直接根据线上现象盲改代码。先拿到日志，再让 IDE 结合代码上下文定位问题，最后在本地验证。

## 1. 从 Cloud 控制台复制日志

进入 Velobase Cloud 项目控制台后，打开 `logs` 页面。

优先看这两类日志：

| 日志类型 | 什么时候看 |
| --- | --- |
| `runtime logs` | 页面 500、接口报错、登录失败、Worker 执行异常、应用启动失败 |
| `deploy fail logs` | GitHub Actions 已推送镜像，但 Cloud 部署失败、migration 失败、容器无法启动 |

建议复制最近的一段完整日志，而不是只复制最后一行。至少包含：

- 报错堆栈或错误信息。
- 报错前后 50-100 行上下文。
- 发生错误的接口路径、任务名、migration 名称或 Pod / service 名称。
- 最近一次部署时间或 commit SHA。

如果日志里包含 API Key、用户 token、session、JWT、邮箱验证码、支付信息等敏感内容，先手动打码再粘贴给 IDE。

## 2. 把日志交给 IDE 分析

把日志粘贴到 IDE / AI 编码工具里，并同时说明：

- 用户执行了什么操作。
- 线上看到的现象是什么。
- 这是 `runtime logs` 还是 `deploy fail logs`。
- 最近改过哪些功能、数据库 schema、环境变量或第三方集成。
- 期望本地先复现，修复后再 push。

可以直接使用这样的提示：

```text
线上 Velobase Cloud 出错。下面是 logs 页面复制的最新日志。
请先判断问题属于应用代码、数据库 migration、环境变量、第三方服务还是部署启动问题。
然后在本地代码中定位相关文件，给出最小修复方案，并告诉我如何用本地 Docker 数据库验证。

<粘贴日志>
```

如果日志指向数据库字段、枚举、表不存在，优先检查 `prisma/schema.prisma` 和 `prisma/migrations/` 是否一致。线上容器启动只会执行 `prisma migrate deploy`，不会执行 `prisma db push`。

## 3. 本地启动数据库和 Redis

线上修复前，建议先在本地用 Docker 跑一遍。这样可以更快验证 schema、接口、Worker 和页面行为。

首次准备：

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm db:push
pnpm db:seed
```

日常调试：

```bash
docker compose up -d
pnpm db:push
pnpm dev
```

如果问题涉及 API 服务或 Worker，使用统一入口更接近线上多服务行为：

```bash
pnpm dev:all
```

也可以分开启动：

```bash
pnpm dev
pnpm api:dev
pnpm worker:dev
```

## 4. 本地复现并修复

按日志类型选择验证方式：

| 问题类型 | 本地验证重点 |
| --- | --- |
| 页面或接口报错 | 打开本地页面，复现同一操作；检查浏览器控制台和终端日志 |
| tRPC / API 报错 | 找到对应 router 和 service，准备相同输入重新请求 |
| Worker 报错 | 启动 `pnpm worker:dev` 或 `pnpm dev:all`，触发一次任务 |
| 数据库字段或枚举不存在 | 运行 `pnpm db:push` 快速同步本地库，再补 migration |
| 部署启动失败 | 本地运行 `pnpm build`，必要时构建 Docker 镜像验证启动 |
| 环境变量缺失 | 对照 `.env.example` 和 `src/env.js`，确认变量名与格式 |

如果修改了 `prisma/schema.prisma`，本地可以先用 `pnpm db:push` 快速验证；准备上线前必须生成 migration：

```bash
npx prisma migrate dev --name describe_your_change
```

线上部署时只执行 `prisma migrate deploy`。如果只做了 `db:push`，线上数据库不会更新。

## 5. 推送前检查

修复完成后，至少做一次本地检查：

```bash
pnpm typecheck
pnpm build
```

如果改了数据库：

```bash
npx prisma generate
npx prisma migrate dev --name describe_your_change
```

确认以下事项后再 push：

- 本地能复现问题，并已验证修复。
- 新增或修改的 migration 文件已提交。
- `.env`、API Key、token、日志片段等敏感文件没有提交。
- 线上所需环境变量已在 Velobase Cloud 控制台配置。
- GitHub Actions 会使用 `VELOBASE_API_KEY` 触发 Cloud 部署。

## 6. Push 后回到 Cloud 验证

push 到主分支后，GitHub Actions 会构建镜像并调用 Velobase Cloud 部署接口。部署完成后：

1. 打开 Velobase Cloud 控制台查看 deployment 状态。
2. 如果失败，进入 `logs -> deploy fail logs` 复制最新日志继续分析。
3. 如果成功但应用仍异常，进入 `logs -> runtime logs` 查看新版本运行日志。
4. 在线上重复触发原来的用户操作，确认问题消失。

## 常见判断

| 线上日志现象 | 常见原因 | 下一步 |
| --- | --- | --- |
| `column does not exist` / `relation does not exist` | 没有提交 migration，或 migration 没在线上执行 | 补 migration，本地验证后重新部署 |
| `Environment variable ... is required` | Cloud 控制台缺少环境变量 | 在控制台添加变量并重新部署 |
| `ECONNREFUSED 127.0.0.1:6379` | Redis 配置缺失，应用尝试连本机 Redis | 检查 `REDIS_URL` 或 `REDIS_HOST` / `REDIS_PORT` |
| `PrismaClientInitializationError` | 数据库连接串、网络或 migration 问题 | 对照 Cloud 环境变量和 migration 日志 |
| Worker 队列任务失败 | Redis、队列 processor 或第三方 API 异常 | 本地启动 Worker 复现 |
| 部署成功但页面仍是旧行为 | 新版本未触发、缓存或环境变量未生效 | 查 deployment commit、runtime logs 和环境变量 |

## 相关文档

- [框架快速启动与生产 Checklist](../../FRAMEWORK_GUIDE.md)
- [数据库集成文档](../integrations/database/README.md)
- [AI 完成后检查清单](../ai-completion-checklist.md)
