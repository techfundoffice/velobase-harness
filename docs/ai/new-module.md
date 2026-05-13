# New Business Module Guide

Use this when creating a product-specific module under `src/modules/<name>/`.

If the module touches auth, payment, email, storage, analytics, ads, queue, database, or security, also read the matching `docs/integrations/*/README.md`.

## 1. Preconditions

Confirm:

- Module name uses kebab-case.
- Main entity and owner are known.
- Required integrations are known.
- Test coverage target is known.

## 2. Standard Structure

Create only needed folders:

```text
src/modules/<name>/
├── README.md
├── server/
│   ├── schema.ts
│   ├── service.ts
│   ├── router.ts
│   └── service.test.ts
├── worker/
│   ├── queue.ts
│   ├── processor.ts
│   └── index.ts
└── components/
    └── <name>-page.tsx
```

Rules:

- Business logic goes in `server/service.ts`.
- Routers validate input and call services only.
- Add worker files only when async or retryable work is needed.

## 3. Prisma Model

Add product entities to `prisma/schema.prisma`. Do not modify framework-reserved tables unless requested.

```prisma
model ExampleItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  status    ExampleStatus @default(DRAFT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

Use `cuid()`, ownership fields, timestamps, enums for states, and indexes. Committed schema changes require migrations.

## 4. Zod Schemas

Create `server/schema.ts`.

```ts
import { z } from "zod";

export const listItemsInput = z.object({
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export const getItemInput = z.object({ id: z.string().min(1) });
export const createItemInput = z.object({ title: z.string().min(1).max(200) });
```

Never trust client-provided `userId`; derive it from session.

## 5. Service

Create `server/service.ts`.

```ts
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";

export const exampleService = {
  async getById(userId: string, id: string) {
    const item = await db.exampleItem.findFirst({ where: { id, userId } });
    if (!item) throw new TRPCError({ code: "NOT_FOUND" });
    return item;
  },
};
```

Rules:

- Services enforce ownership.
- Services throw `TRPCError` for expected business errors.
- Use framework abstractions for billing, queues, storage, email, and events.

## 6. Router

Create `server/router.ts`.

```ts
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { exampleService } from "./service";
import { createItemInput, getItemInput, listItemsInput } from "./schema";

export const exampleRouter = createTRPCRouter({
  list: protectedProcedure.input(listItemsInput).query(({ ctx, input }) =>
    exampleService.list(ctx.session.user.id, input),
  ),
  getById: protectedProcedure.input(getItemInput).query(({ ctx, input }) =>
    exampleService.getById(ctx.session.user.id, input.id),
  ),
  create: protectedProcedure.input(createItemInput).mutation(({ ctx, input }) =>
    exampleService.create(ctx.session.user.id, input),
  ),
});
```

Register in `src/server/api/root.ts`:

```ts
import { exampleRouter } from "@/modules/example/server/router";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
});
```

Rules: reads are queries, writes are mutations, mutations are protected unless intentionally public, and router bodies stay thin.

## 7. UI

Create routes in `src/app/` and import module components:

```tsx
import { ExamplePage } from "@/modules/example/components/example-page";

export default function Page() {
  return <ExamplePage />;
}
```

Client calls:

```ts
const query = api.example.list.useQuery({ limit: 20 });
const mutation = api.example.create.useMutation();
```

User-visible copy must use `useTranslations()` or `getTranslations()`.

## 8. Workers And Events

Workers:

- Read `docs/integrations/queue/README.md`.
- Export queues and processors from central worker indexes.
- Use `createWorkerInstance()`.
- Make jobs idempotent.

Events:

```ts
import { appEvents } from "@/server/events/bus";

appEvents.emit("example:created", { itemId: item.id, userId });
```

Add event payload types. Do not call pluggable modules directly from core module code.

## 9. Tests And Completion

Before tests, read `docs/ai/testing.md`.

Minimum:

- `server/service.test.ts` for business rules.
- Router integration tests for ownership, auth, or persistence.
- Processor tests for worker jobs.
- E2E only for critical product flows.

Before final response:

- Run the narrowest relevant validation command.
- If schema changed, confirm migration status.
- Run `docs/ai-completion-checklist.md`.
