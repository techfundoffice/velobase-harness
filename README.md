<p align="center">
  <img src="public/logo.svg" alt="Velobase Harness" width="80" />
</p>

<h1 align="center">Velobase Harness</h1>

<p align="center">
  <strong>The open-source framework that turns your AI app into a revenue machine.</strong>
</p>

<p align="center">
  Extracted from the stack behind an 8-figure ARR product.<br/>
  Every line of growth & monetization code we wrote — now yours, for free.
</p>

<p align="center">
  <a href="https://github.com/velobase/velobase-harness/stargazers"><img src="https://img.shields.io/github/stars/velobase/velobase-harness?style=social" alt="Stars" /></a>
  <a href="https://github.com/velobase/velobase-harness/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
  <a href="https://discord.gg/velobase"><img src="https://img.shields.io/discord/YOUR_ID?label=Discord&logo=discord&logoColor=white" alt="Discord" /></a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-why-harness">Why Harness</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-deploy">Deploy</a> •
  <a href="#-docs">Docs</a> •
  <a href="#-community">Community</a>
</p>

---

## The Problem

Thousands of AI wrappers launch every week. Almost none of them make a dollar.

Not because the product is bad — but because **billing, attribution, affiliates, email campaigns, anti-abuse, and admin dashboards** are each a 2-month rabbit hole that has nothing to do with your actual product.

**Harness gives you all of that on day one**, so you can focus on the thing that matters: building something people want.

---

## ✨ Features

### 💰 Monetization — Built In, Not Bolted On

| Module | What It Does |
|--------|-------------|
| **Usage-Based Billing** | Credit ledger, subscriptions, promo codes, multi-currency — financial-grade accuracy |
| **Payments** | Stripe + NowPayments (crypto), webhooks, renewals, refunds, dispute handling |
| **Affiliate Engine** | Commission tracking, payout management, referral links — your users become your salesforce |
| **Order Management** | Full lifecycle: create → fulfill → invoice → cashflow tracking |

### 📈 Growth — From Zero to Traction

| Module | What It Does |
|--------|-------------|
| **Ad Attribution** | Google Ads, X (Twitter), PropellerAds — know exactly which dollar brought which user |
| **Email Campaigns** | Built-in outreach with A/B testing, templates, failover, and deliverability tracking |
| **Analytics** | PostHog integration, event tracking, conversion funnels, retention metrics |
| **Referral & Retention** | Referral programs, retention bonuses, user lifecycle management |
| **SEO** | Programmatic SEO tooling built into the framework |

### 🛡️ Production Infrastructure

| Module | What It Does |
|--------|-------------|
| **Auth & Security** | NextAuth with anti-abuse, rate limiting, bot detection |
| **Admin Dashboard** | User management, financial overview, system health — out of the box |
| **Background Jobs** | BullMQ workers for payment reconciliation, notifications, credit processing |
| **AI Chat Module** | Pre-wired AI chat integration — plug in your model and go |

---

## 🤔 Why Harness?

<table>
<tr>
<td width="50%">

**Without Harness**
- Week 1-2: Set up auth & billing
- Week 3-4: Build payment integration
- Week 5-6: Add email system
- Week 7-8: Attribution & analytics
- Week 9-10: Admin dashboard
- Week 11-12: Affiliate system
- **3 months before your first dollar**

</td>
<td width="50%">

**With Harness**
- `pnpm install`
- Configure `.env`
- `pnpm dev:all`
- **Revenue infrastructure on day one**
- Ship your product, not your plumbing

</td>
</tr>
</table>

### vs Other Frameworks

| | Harness | V0 / Lovable | ShipAny / ShipFast |
|---|---------|-------------|-------------------|
| **Output** | Production-grade, deployable app | Prototypes & UI | Code templates |
| **Monetization** | Full billing + attribution + affiliates | ❌ | Basic Stripe only |
| **Growth stack** | Ad tracking, email, referral, SEO | ❌ | ❌ |
| **Cost** | Free & open source | Subscription | One-time license |
| **Extensibility** | Modular — use only what you need | Limited | Fork & modify |

---

## 🚀 Quick Start

### Local Development

```bash
# Clone & install
git clone https://github.com/velobase/velobase-harness.git
cd velobase-harness
pnpm install

# Configure environment
cp .env.example .env

# Start database & seed
pnpm docker:db:up
pnpm db:push
pnpm db:seed

# Launch all services
pnpm dev:all
```

Open [http://localhost:3000](http://localhost:3000) — you're live.

### ☁️ One-Click Cloud Deploy

Deploy to **Velobase Cloud** and get a production environment in minutes:
- GitHub repo auto-created
- PostgreSQL, Redis, R2 storage provisioned
- Kubernetes cluster, domain, and SSL configured
- CI/CD pipeline ready

```bash
# Or deploy via CLI
npx velobase deploy
```

---

## 🏗️ Architecture

Harness runs as **three services** — together or separately:

```
┌─────────────────────────────────────────────┐
│                  Harness                     │
│                                             │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ │
│  │    Web    │ │    API    │ │  Worker   │ │
│  │ Next.js  │ │   Hono    │ │  BullMQ   │ │
│  │ :3000    │ │  :3002    │ │  :3001    │ │
│  └───────────┘ └───────────┘ └───────────┘ │
│         │            │            │         │
│  ┌──────┴────────────┴────────────┴──────┐ │
│  │        PostgreSQL  +  Redis           │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

Control deployment mode with `SERVICE_MODE`:
- `all` — monolith (default, great for dev)
- `web` / `api` / `worker` — microservices (production)
- `web,api` — any combination

### Tech Stack

- **Framework:** Next.js 15, React 19, TypeScript
- **API:** tRPC + Hono
- **Database:** Prisma ORM + PostgreSQL
- **Queue:** BullMQ + Redis
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS + shadcn/ui
- **Package Manager:** pnpm

### Project Structure

```
src/
├── app/          # Next.js pages & routing
├── api/          # Hono API endpoints
├── config/       # Module configuration (toggle features on/off)
├── modules/      # Business modules (billing, affiliate, email...)
├── server/       # Core services (auth, db, queue)
├── workers/      # Background job processors
├── components/   # UI components
└── analytics/    # Event tracking & attribution
```

---

## 📖 Docs

| | English | 中文 |
|---|---------|------|
| Getting Started | [docs/en/README.md](docs/en/README.md) | [docs/zh-CN/README.md](docs/zh-CN/README.md) |
| Framework Guide | [docs/en/framework-guide.md](docs/en/framework-guide.md) | [docs/zh-CN/framework-guide.md](docs/zh-CN/framework-guide.md) |
| Integration Guide | [docs/en/integration-guide.md](docs/en/integration-guide.md) | [docs/zh-CN/integration-guide.md](docs/zh-CN/integration-guide.md) |
| AI Checklist | [docs/en/ai-completion-checklist.md](docs/en/ai-completion-checklist.md) | [docs/zh-CN/ai-completion-checklist.md](docs/zh-CN/ai-completion-checklist.md) |
| Architecture Deep Dive | [docs/en/architecture/](docs/en/architecture/) | [docs/zh-CN/architecture/](docs/zh-CN/architecture/) |

---

## 🧑‍💻 Development

```bash
pnpm lint          # Lint
pnpm typecheck     # Type check
pnpm check         # Lint + type check
pnpm format:check  # Formatting
pnpm build         # Production build
```

---

## 🌍 Community

- [Discord](https://discord.gg/velobase) — Ask questions, share what you're building
- [X / Twitter](https://x.com/velobase) — Updates & launches
- [GitHub Discussions](https://github.com/velobase/velobase-harness/discussions) — Feature requests & ideas

---

## 🗺️ Roadmap

- [ ] Plugin marketplace for community modules
- [ ] One-click integrations (Resend, Loops, Customer.io)
- [ ] Dashboard templates for common SaaS metrics
- [ ] Multi-tenant support
- [ ] Mobile SDK

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=velobase/velobase-harness&type=Date)](https://star-history.com/#velobase/velobase-harness&Date)

---

## License

[MIT](LICENSE) — use it, fork it, ship it, make money with it.

---

<p align="center">
  <strong>Stop building billing. Start building your product.</strong><br/>
  <a href="https://github.com/velobase/velobase-harness">⭐ Star us on GitHub</a> · <a href="https://discord.gg/velobase">💬 Join Discord</a>
</p>
