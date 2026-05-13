# Phase 0 Domain Design

Use this before writing product code for a new SaaS on Velobase Harness.

Do not implement until the final gate is satisfied.

## 1. Ask Missing Questions

Required:

- Product one-liner.
- Target users: developer, creator, enterprise, consumer, marketplace, operator, or other.
- 3-5 core user stories.
- Business model: free, freemium, subscription, credits, hybrid, one-time, or enterprise.
- AI capability: chat, generation, analysis, agents, multimodal, document parsing, or other.

## 2. Product Brief

Output this before implementation:

```yaml
product:
  name: string
  one_liner: string
  target_users: string[]
  core_user_stories: string[] # min 3
  business_model: free | freemium | subscription | credits | hybrid | one_time | enterprise
  ai_capabilities: string[]
  target_regions: string[]
  third_party_services: string[]
```

Assertions:

- At least 3 user stories.
- Business model is known.
- At least 1 AI capability.
- Paid products have payment provider or `TBD`.

## 3. Domain Decisions

Use one state: `reuse_framework`, `configure`, `design_needed`, or `not_needed`.

```yaml
domains:
  user: [auth_methods, roles_permissions, profile_fields]
  billing: [billing_model, sku_catalog, credit_consumption]
  operations: [analytics_events, notifications, lifecycle_touch]
  integrations: [auth_provider, payment_provider, email_provider, storage_provider, analytics_provider, ai_provider]
  non_functional: [security, deployment_mode, observability]
```

## 4. User Domain

Decide:

- Auth methods.
- Roles: default `user/admin` via `isAdmin`, or custom roles.
- Profile extension fields.
- Lifecycle: signup, activation, trial, paid, renewal, downgrade, churn, win-back.

Output custom roles only if needed:

```yaml
roles:
  - name: string
    permissions: string[]
```

Output user extensions only if needed:

```yaml
user_extensions:
  - field: string
    type: string
    required: boolean
    reason: string
```

## 5. Billing Domain

Choose `none`, `credits`, `subscription`, `hybrid`, or `enterprise`.

If not `none`:

```yaml
billing:
  model: credits | subscription | hybrid | enterprise
  skus:
    - key: string
      type: free | subscription_monthly | subscription_yearly | credit_pack | enterprise
      price: string
      credits: number | null
      validity: string
  credit_rules:
    - operation: string
      cost: number
      reason: string
```

If implementing payment code, read `docs/integrations/payment/README.md`.

## 6. Operations And Growth

Define only product-specific behavior:

```yaml
operations:
  analytics_events:
    - name: string
      trigger: string
      location: client | server
  notifications:
    - event: string
      internal: boolean
      email: boolean
      in_app: boolean
  funnel:
    - step: string
      event: string
```

Read integration docs when touching analytics, ads, email, Lark, or Telegram.

## 7. Integration Decisions

Mark each as `enable`, `disable`, or `later`:

```yaml
integrations:
  oauth_google: decision
  oauth_github: decision
  stripe: decision
  nowpayments: decision
  storage: decision
  posthog: decision
  google_ads: decision
  lark_or_telegram: decision
  turnstile: decision
  ai_provider: { provider: string, models: string[] }
```

## 8. Data, API, Events

Do not modify framework-reserved auth, billing, order, payment, membership, promo, affiliate, touch, support, or webhook log tables unless requested.

```yaml
entities:
  - name: string
    owner: user | admin | system | shared
    fields: string[]
    relations: string[]
    indexes: string[]
modules:
  - name: string
    path: src/modules/<name>
    router:
      - procedure: string
        type: query | mutation
        access: public | protected | admin
        pagination: boolean
    events:
      - name: string
        trigger: string
        subscribers: string[]
```

Rules:

- Use `cuid()`, ownership fields, timestamps, enums for finite states, and indexes.
- Routers are thin; services own business logic.
- Side effects flow through `appEvents.emit()`.

## 9. Test Plan

```yaml
tests:
  - module: string
    service_unit: required | optional | none
    router_integration: required | optional | none
    worker: required | optional | none
    e2e: required | optional | none
```

Read `docs/ai/testing.md` before writing tests.

## 10. Final Gate

Proceed only when:

- Product brief is complete.
- Domain decisions are marked.
- Entities are listed.
- Router procedures are planned.
- Integration decisions are marked.
- Billing model is decided, even if `none`.
- Test plan is listed.

Then continue with `docs/ai/new-module.md`.
