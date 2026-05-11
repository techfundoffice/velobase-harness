# AI Completion Checklist

**Language:** English | [Simplified Chinese](../zh-CN/ai-completion-checklist.md)

Use this checklist after an AI agent completes a feature, bug fix, refactor, or integration change. The goal is to verify correctness, data safety, deployment readiness, and documentation consistency before commit or push.

For the full legacy Chinese checklist during migration, see [../ai-completion-checklist.md](../ai-completion-checklist.md).

## Scope Check

- Review `git diff` and confirm the change only covers the requested work.
- Do not revert user changes unless explicitly asked.
- Do not commit `.env`, secrets, local database files, debug exports, or temporary logs.
- If a shared framework layer changed, confirm product-specific logic did not leak into framework core.

## Quality Commands

Run the smallest meaningful validation for the change:

```bash
pnpm lint
pnpm typecheck
```

For broader changes, also run:

```bash
pnpm check
pnpm format:check
pnpm build
```

Documentation-only changes may skip full build when appropriate, but links, commands, and referenced paths must be checked.

## Database and Prisma

If `prisma/schema.prisma` changed:

- Create a migration with `npx prisma migrate dev --name <description>`.
- Do not rely only on `pnpm db:push` for production changes.
- Ensure `npx prisma generate` runs or is covered by install/deploy flow.
- Check required fields, defaults, existing data, and safe rollout order.

## Environment Variables

If configuration changed:

- Update `.env.example`.
- Update `src/env.js` validation.
- Document where to obtain the value.
- If the variable controls a pluggable module, update `src/config/modules.ts`.

## API and Security

- Use `protectedProcedure` for mutations unless the route is intentionally public.
- Validate user input with Zod or an equivalent schema.
- Keep pagination on list endpoints.
- Do not log API keys, tokens, payment card data, database URLs, or private user data.
- Verify admin-only pages and APIs enforce admin authorization.

## Side Effects and Workers

- Use `appEvents.emit()` and pluggable module subscribers for analytics, ads, notifications, and operational automation.
- Do not call PostHog, Google Ads, Lark, Telegram, or other optional modules directly from core payment/order/auth flows.
- Make worker jobs idempotent.
- Register new queues in both queue and processor indexes.
- Ensure `SERVICE_MODE=worker` does not depend on Next.js-only APIs.

## Frontend and i18n

- User-facing copy should use `messages/en.json` and `messages/zh.json`.
- Include loading, empty, error, and unauthorized states where relevant.
- Check narrow screen behavior for new user-facing pages.
- Update SEO metadata and navigation when adding important pages.

## Documentation

- Update README, integration docs, feature docs, or framework docs when usage changes.
- If documentation paths are used by Velobase Cloud Launchpad prompts, update the Cloud prompt generator and tests in the same change.
- Keep English and Chinese docs synchronized.

## Final Response

Tell the user what changed, which checks ran, and which checks were skipped or could not run.
