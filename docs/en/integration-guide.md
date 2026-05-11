# Integration Guide

**Language:** English | [Simplified Chinese](../zh-CN/integration-guide.md)

This guide explains how Velobase Harness organizes third-party integrations and how AI agents should extend them safely.

For the full legacy Chinese guide during migration, see [../integration-guide.md](../integration-guide.md).

## Framework Positioning

Velobase Harness closes the gap between a product idea and a production SaaS app:

- Developers provide the idea and make product decisions.
- AI implements product-specific features.
- The framework provides mature foundations: auth, database, billing, payment, email, queues, storage, analytics, and operational hooks.

The framework does not decide product-specific fallbacks, product pages, or custom business logic. Those belong in the product layer.

## Integration Layers

| Layer | Purpose | Examples |
| --- | --- | --- |
| Core foundation | Required for most SaaS apps | Auth, email, database, payment, storage, queue |
| Growth integrations | Usually needed for acquisition and measurement | PostHog, Google Ads, AI/LLM |
| Operations support | Optional, enabled as needed | Lark, Telegram, Turnstile, support, deployment |

## Pluggable Architecture

Optional integrations should be implemented as pluggable modules:

1. Add the enable/disable switch in `src/config/modules.ts`.
2. Implement `FrameworkModule` in `src/server/modules/<name>.ts`.
3. Subscribe to framework events from `src/server/events/bus.ts`.
4. Register the module in `src/server/modules/index.ts`.
5. Document required environment variables and third-party setup.

Do not call optional integrations directly from core payment, order, auth, or billing flows. Emit an event and let the module react.

## Six-Step Integration Process

1. **Selection:** choose providers and explain why.
2. **Architecture:** define directories, providers, data flow, and boundaries.
3. **Interface:** expose a small, typed API for product code.
4. **Configuration:** list env vars, dashboard setup, webhook URLs, and secrets.
5. **Error handling:** document retry, idempotency, and manual-intervention paths.
6. **AI guidance:** add types, defaults, examples, and `AGENTS.md` rules where needed.

## AI Rules

- Prefer typed APIs and provider interfaces over ad hoc SDK calls.
- Keep provider-specific logic inside integration directories.
- Keep product-specific behavior inside `src/modules/<feature>/`.
- Update `.env.example` and `src/env.js` when adding environment variables.
- If an integration causes side effects, use the event bus and keep failures isolated from the core flow.
