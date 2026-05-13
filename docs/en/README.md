# Velobase Harness Documentation

**Language:** English | [Simplified Chinese](../zh-CN/README.md)

This directory is the English documentation entry for Velobase Harness. During the documentation migration, some deep reference pages still live in the legacy Chinese-first `docs/` tree. The stable public entry points below are the paths that README files and Velobase Cloud Launchpad prompts should use.

## Start Here

| Document | Purpose |
| --- | --- |
| [AI Domain Design Guide](../ai/design.md) | **Phase 0** — product understanding, domain modeling, schema & API design before coding |
| [Framework Guide](../../FRAMEWORK_GUIDE.md) | Architecture, local startup, code boundaries, module system, and production checklist |
| [Integration Guide](../integration-guide.md) | How third-party integrations are organized and how AI should extend them |
| [AI Testing Guide](../ai/testing.md) | Test strategy, layered patterns (unit / integration / E2E), and AI test generation rules |
| [AI Completion Checklist](../ai-completion-checklist.md) | Required self-check before commit, push, or deployment |
| [Web/API/Worker Split](../architecture/web-api-service-split.md) | Runtime split, `SERVICE_MODE`, Docker, Kubernetes, and deployment modes |
| [AI Agent Rules](../../AGENTS.md) | Stable rules that AI agents must read before editing code |

## Reference Areas

| Area | Current location |
| --- | --- |
| API conventions | [../conventions/api.md](../conventions/api.md) |
| Debugging workflow | [../debugging/online-local-debug.md](../debugging/online-local-debug.md) |
| Integrations | [../integrations/](../integrations/) |
| Built-in features | [../features/](../features/) |
| Module examples | [../../src/modules/example/README.md](../../src/modules/example/README.md) |
| AI Chat module | [../../src/modules/ai-chat/README.md](../../src/modules/ai-chat/README.md) |

## Documentation Rules

- Keep `README.md` as the English default and `README.zh-CN.md` as the Chinese root entry.
- Keep only public documentation entries mirrored under `docs/en/**` and `docs/zh-CN/**`; keep AI-only guides under `docs/ai/**` in English.
- Do not translate commands, environment variables, file paths, package names, API names, or code blocks.
- When a documentation path is used by Velobase Cloud Launchpad prompts, update the prompt generator in the Cloud repository in the same change.
