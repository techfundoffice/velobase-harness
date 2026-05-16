# Deploy to Velobase Cloud

Deploy your Harness project to Velobase Cloud using the CLI. If you are working in an AI IDE (Cursor, Windsurf, etc.), paste the commands below — the IDE AI will continue from there until your app is live.

Full Velobase Cloud documentation: https://docs.velobase.cloud/ (AI index: https://docs.velobase.cloud/llms.txt)

## Step 1: Install and authenticate

```bash
npm install -g @velobaseai/cloud-cli@latest

velobase-cloud login
velobase-cloud github connect
```

## Step 2: Initialize and adapt

```bash
velobase-cloud init
velobase-cloud adapt
```

After `velobase-cloud adapt`, read `.velobase/ai-prompt.md` and follow its instructions to adapt this project for Cloud deployment.

## Step 3: Verify and deploy

```bash
velobase-cloud doctor
git add -A && git commit -m "feat: adapt for velobase cloud" && git push origin main
velobase-cloud status
```

## What each step does

| Step | What happens |
|------|-------------|
| `login` | Opens browser to sign in to Velobase Cloud |
| `github connect` | Links your GitHub account for repository access |
| `init` | Scans the project, creates Cloud resources (PostgreSQL, Redis, R2, K8s, domain), writes the GitHub Actions deploy workflow, and configures secrets |
| `adapt` | Generates `.velobase/ai-prompt.md` — the AI adaptation guide for your IDE |
| `doctor` | Runs 7 readiness checks (Dockerfile, port 3000, /healthz, DB migration, workflow, secrets, env) |
| `git push` | Triggers GitHub Actions to build, push image, and deploy via Velobase Deploy API |
| `status` | Shows deployment progress and live URL (`https://{subdomain}.velobase.app`) |

## Ongoing operations

```bash
velobase-cloud env list              # View environment variables
velobase-cloud env set KEY value     # Set an environment variable
velobase-cloud deploy trigger        # Trigger a new deployment
velobase-cloud deploy runs           # List recent deployments
velobase-cloud deploy rollback <id>  # Rollback to a previous deployment
velobase-cloud logs pods             # List running pods
velobase-cloud logs pod <name>       # View pod logs
```
