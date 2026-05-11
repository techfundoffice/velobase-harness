# Documentation Style Guide

**Language:** English | [Simplified Chinese](../zh-CN/docs-style-guide.md)

Use this guide when adding or updating Velobase Harness documentation.

## Language Structure

- Root `README.md` is the default English public entry.
- Root `README.zh-CN.md` is the Simplified Chinese public entry.
- Canonical long-form docs live in mirrored directories: `docs/en/**` and `docs/zh-CN/**`.
- Legacy docs outside these directories may remain during migration, but new public links should point to the mirrored paths.

## Do Not Translate

Keep these items unchanged across languages:

- Commands, flags, and scripts
- File paths and directory names
- Environment variable names
- Package names and API names
- Code blocks and schema examples
- GitHub owner/repo placeholders unless the value itself changes

## Required Sections

For major docs, include:

- Language switch near the top
- Purpose and audience
- Stable file paths and commands
- AI guidance when the doc affects generated code
- Link to the paired language version

## Launchpad Coupling

Some documentation paths are embedded in Velobase Cloud Launchpad prompts. When changing these paths, update:

- `velobase-cloud/src/modules/launchpad/services/prompt-generator.ts`
- `velobase-cloud/src/modules/launchpad/__tests__/prompt-generator.test.ts`
- User-facing Launchpad copy in `messages/en.json` and `messages/zh.json` when the user workflow changes
