# Deploy To Velobase Cloud

This guide is the English canonical deployment entry for Velobase Harness.

Use the Velobase Cloud CLI for project setup, adaptation, deployment checks, and operations.

## 1. Install The CLI

```bash
npm install -g @velobaseai/cloud-cli@latest
```

The CLI binary is `velobase-cloud`.

## 2. Sign In And Connect GitHub

```bash
velobase-cloud login
velobase-cloud github connect
```

The CLI uses browser-based login and stores local credentials under `~/.velobase-cloud/`.

## 3. Initialize The Project

Run this from your Harness repository root:

```bash
velobase-cloud init
```

`init` scans the project, detects Velobase Harness, creates a Cloud project and infrastructure, writes `.github/workflows/deploy-velobase.yml`, configures GitHub secrets when possible, and stores project binding under `.velobase/config.json`.

## 4. Adapt For Cloud

- Install dependencies with `pnpm install`.
- Configure `.env` from `.env.example`.
- Confirm database, Redis, auth, and any required provider keys are available.
- Run the relevant checks from `docs/en/ai/completion-checklist.md`.

Generate AI deployment context:

```bash
velobase-cloud adapt
```

This writes `.velobase/ai-prompt.md`. Open it in the IDE and let the local AI adapt the project to Cloud constraints when needed.

## 5. Choose A Runtime Mode

Use `SERVICE_MODE`:

- `all` for combined local or small deployments.
- `web`, `api`, and `worker` for split production deployments.
- `web,api` or other comma-separated combinations when needed.

See `docs/en/architecture/web-api-service-split.md`.

## 6. Verify

Before deploy:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

If schema changed, ensure migrations are committed and deploy with `prisma migrate deploy`.

Then run the CLI readiness check:

```bash
velobase-cloud doctor
```

`doctor` checks deployment requirements such as Dockerfile, port `3000`, health endpoint, migration setup, workflow, secrets, and environment validation.

## 7. Deploy

The default deployment path is GitHub Actions:

```bash
git push origin main
```

You can also trigger a deployment from the CLI:

```bash
velobase-cloud deploy trigger --branch main --watch
```

For multi-service deployments (Web + API + Worker), the Deploy API request must include `exposed_service` to specify which service receives traffic on the primary domain (`{subdomain}.velobase.app`). Single-service deployments do not require this field. See `deploy-velobase-multi.yml` for a working example.

## 8. Operate

Use the CLI for status, deployment runs, logs, environment variables, and rollback:

```bash
velobase-cloud status
velobase-cloud deploy runs
velobase-cloud logs deploy
velobase-cloud logs pods
velobase-cloud env list
velobase-cloud deploy rollback <deployment-id>
```

- Check Web, API, and Worker health endpoints.
- Confirm required modules initialize from logs.
- For production issues, collect Cloud runtime logs first, then follow `docs/en/debugging/online-local-debug.md`.
