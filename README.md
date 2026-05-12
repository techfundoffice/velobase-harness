<p align="center">
  <img src="public/logo.svg" alt="Velobase Harness" width="80" />
</p>

<h1 align="center">Velobase Harness</h1>

<p align="center">
  <strong>The open-source AI SaaS framework that helps you build AND make money.</strong>
</p>

<p align="center">
  Extracted from a product doing 8-figure ARR.<br/>
  The secret was never a better product — it was the growth &amp; monetization infrastructure behind it.<br/>
  We just open-sourced all of it.
</p>

<p align="center">
  <a href="https://github.com/velobase/velobase-harness/stargazers"><img src="https://img.shields.io/github/stars/velobase/velobase-harness?style=for-the-badge&logo=github&color=yellow" alt="Stars" /></a>&nbsp;
  <a href="https://github.com/velobase/velobase-harness/network/members"><img src="https://img.shields.io/github/forks/velobase/velobase-harness?style=for-the-badge&logo=github&color=lightgray" alt="Forks" /></a>&nbsp;
  <a href="https://github.com/velobase/velobase-harness/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="License" /></a>&nbsp;
  <a href="https://discord.gg/velobase"><img src="https://img.shields.io/badge/Discord-Join-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" /></a>
</p>

<p align="center">
  <a href="#-the-problem">Problem</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-under-the-hood">Features</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-quick-start">Quick Start</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#%EF%B8%8F-architecture">Architecture</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-deploy-to-cloud">Deploy</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-docs">Docs</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-community">Community</a>
</p>

<br/>

<!-- TODO: Replace with demo GIF or screenshot -->
<!-- <p align="center">
  <img src="public/demo.gif" alt="Harness Demo" width="720" />
</p> -->

---

<br/>

## 🎯 The Problem

**In the vibe-coding era, everyone can build. But almost none of them make a dollar from it.**

We went from the same problem to 8-figure ARR. The secret was not a better product — it was the growth and monetization infrastructure behind it.

We checked every boilerplate on the market. They help you build. **We help you build AND make money.**

<br/>

---

<br/>

## 🔥 Under the Hood

<table>
<tr>
<td>

### 📡 Ad Attribution
Server-side tracking that tells you which ads **actually convert** — Google Ads offline conversion upload, X pixel, PropellerAds

</td>
<td>

### 🤝 Affiliate Engine
Financial-grade double-entry ledger, refund clawback, USDT cashout — your users become your salesforce

</td>
</tr>
<tr>
<td>

### 💳 Usage-Based Billing
Full credits lifecycle, subscriptions, multi-currency, metering dashboard — charges from day one

</td>
<td>

### 📧 Email Outreach
A/B testing, scheduled campaigns, dual-provider failover — brings people back automatically

</td>
</tr>
<tr>
<td>

### 🛡️ Auth & Anti-Abuse
NextAuth with rate limiting, bot detection, and security hardened for production

</td>
<td>

### 🤖 Multi-LLM AI Chat
Reusable chat, model config, tool calling, and business-tool extension points

</td>
</tr>
<tr>
<td>

### ⚙️ 11 Background Workers
BullMQ processors for payment reconciliation, order compensation, touch delivery, subscription credits, ad uploads, and more

</td>
<td>

### 📊 Admin Dashboard
User management, financial overview, system health, promo codes — out of the box

</td>
</tr>
</table>

> **Built on T3 Stack** — Next.js 15 · React 19 · TypeScript · tRPC · Prisma · NextAuth · Tailwind CSS · pnpm

<br/>

---

<br/>

## ⚡ Why Harness?

<table>
<tr>
<th align="center" width="50%">😰 Without Harness</th>
<th align="center" width="50%">🚀 With Harness</th>
</tr>
<tr>
<td>

```
Week 1-2   Auth & billing setup
Week 3-4   Payment integration
Week 5-6   Email system
Week 7-8   Attribution & analytics
Week 9-10  Admin dashboard
Week 11-12 Affiliate system
────────────────────────────────
⏱ 3 months before first dollar
```

</td>
<td>

```bash
git clone velobase/velobase-harness
pnpm install
cp .env.example .env
pnpm dev:all
────────────────────────────────
⚡ Revenue infrastructure on day 1
```

</td>
</tr>
</table>

### How we compare

| | **Harness** | V0 / Lovable | ShipAny / ShipFast |
|:---|:---:|:---:|:---:|
| **What you get** | Production app with revenue stack | UI prototypes | Code templates |
| **Billing + Payments** | Stripe + Crypto, credits, subscriptions | — | Basic Stripe |
| **Ad Attribution** | Google Ads, X, PropellerAds | — | — |
| **Affiliate System** | Double-entry ledger, USDT cashout | — | — |
| **Email Campaigns** | A/B test, dual-provider failover | — | — |
| **Background Workers** | 11 BullMQ job processors | — | — |
| **Price** | **Free & open source** | Subscription | One-time license |

<br/>

---

<br/>

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone https://github.com/velobase/velobase-harness.git
cd velobase-harness
pnpm install

# 2. Configure
cp .env.example .env

# 3. Database
pnpm docker:db:up
pnpm db:push
pnpm db:seed

# 4. Launch
pnpm dev:all
```

**That's it.** Open [localhost:3000](http://localhost:3000) — billing, attribution, affiliates, email, admin — all running.

<br/>

---

<br/>

## 🏗️ Architecture

Three services — run together for dev, split for production:

```
                    ┌──────────────────────────────────────────┐
                    │            Velobase Harness              │
                    │                                          │
                    │  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
                    │  │   Web    │ │   API    │ │  Worker  │ │
                    │  │ Next.js  │ │  Hono    │ │  BullMQ  │ │
                    │  │  :3000   │ │  :3002   │ │  :3001   │ │
                    │  └────┬─────┘ └────┬─────┘ └────┬─────┘ │
                    │       │            │            │        │
                    │  ┌────┴────────────┴────────────┴─────┐  │
                    │  │       PostgreSQL  ·  Redis          │  │
                    │  └────────────────────────────────────┘  │
                    └──────────────────────────────────────────┘
```

> **`SERVICE_MODE`** controls what runs: `all` (default) · `web` · `api` · `worker` · or any combo like `web,api`

### Pluggable Modules

Toggle via environment variables — use only what you need:

`Google Ads` · `PostHog` · `Lark` · `Telegram` · `NowPayments` · `Affiliate` · `Touch` · `AI Chat`

### Project Structure

```
src/
├── app/          # Next.js pages & routing
├── api/          # Hono API endpoints
├── config/       # Module toggles
├── modules/      # Business logic (billing, affiliate, email…)
├── server/       # Core services (auth, db, queue)
├── workers/      # 11 background job processors
├── components/   # UI components
└── analytics/    # Event tracking & attribution
```

<br/>

---

<br/>

## ☁️ Deploy to Cloud

Deploy to **Velobase Cloud** for a production environment in minutes:

- ✅ GitHub repo auto-created
- ✅ PostgreSQL, Redis, R2 storage provisioned
- ✅ Kubernetes cluster + domain + SSL
- ✅ CI/CD pipeline ready

```bash
npx velobase deploy
```

Or self-host with the included `Dockerfile`, `docker-compose.yml`, and Kubernetes manifests.

<br/>

---

<br/>

## 📖 Docs

| | English | 中文 |
|:---|:---|:---|
| **Getting Started** | [docs/en/README.md](docs/en/README.md) | [docs/zh-CN/README.md](docs/zh-CN/README.md) |
| **Framework Guide** | [docs/en/framework-guide.md](docs/en/framework-guide.md) | [docs/zh-CN/framework-guide.md](docs/zh-CN/framework-guide.md) |
| **Integration Guide** | [docs/en/integration-guide.md](docs/en/integration-guide.md) | [docs/zh-CN/integration-guide.md](docs/zh-CN/integration-guide.md) |
| **AI Checklist** | [docs/en/ai-completion-checklist.md](docs/en/ai-completion-checklist.md) | [docs/zh-CN/ai-completion-checklist.md](docs/zh-CN/ai-completion-checklist.md) |
| **Architecture** | [docs/en/architecture/](docs/en/architecture/) | [docs/zh-CN/architecture/](docs/zh-CN/architecture/) |
| **Agent Rules** | [AGENTS.md](AGENTS.md) | — |

<br/>

---

<br/>

## 🧑‍💻 Development

```bash
pnpm lint          # Lint
pnpm typecheck     # Type check
pnpm check         # Lint + type check
pnpm format:check  # Formatting
pnpm build         # Production build
```

<br/>

---

<br/>

## 🌍 Community

<p align="center">
  <a href="https://discord.gg/velobase"><img src="https://img.shields.io/badge/Discord-Join%20the%20community-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" /></a>&nbsp;&nbsp;
  <a href="https://x.com/velobase"><img src="https://img.shields.io/badge/X-Follow%20us-000000?style=for-the-badge&logo=x&logoColor=white" alt="X" /></a>&nbsp;&nbsp;
  <a href="https://github.com/velobase/velobase-harness/discussions"><img src="https://img.shields.io/badge/GitHub-Discussions-181717?style=for-the-badge&logo=github&logoColor=white" alt="Discussions" /></a>
</p>

<br/>

---

<br/>

## 🗺️ Roadmap

- [ ] Plugin marketplace for community modules
- [ ] One-click integrations (Resend, Loops, Customer.io)
- [ ] Dashboard templates for common SaaS metrics
- [ ] Multi-tenant support
- [ ] Mobile SDK

<br/>

---

<br/>

## ⭐ Star History

<p align="center">
  <a href="https://star-history.com/#velobase/velobase-harness&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=velobase/velobase-harness&type=Date&theme=dark" />
      <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=velobase/velobase-harness&type=Date" />
      <img alt="Star History" src="https://api.star-history.com/svg?repos=velobase/velobase-harness&type=Date" width="600" />
    </picture>
  </a>
</p>

<br/>

---

<br/>

## License

[MIT](LICENSE) — use it, fork it, ship it, make money with it.

<br/>

<p align="center">
  <strong>Stop building billing. Start building your product.</strong><br/><br/>
  <a href="https://github.com/velobase/velobase-harness">⭐ Star Harness on GitHub</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://discord.gg/velobase">💬 Join Discord</a>
</p>
