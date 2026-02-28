# BotStudio — Living Task Tracker
> Updated: 2026-02-28 | Branch: master | Site: https://aggressorbulkit.online

---

## DONE — Phases 1–9

### Phase 1–4: Foundation
- [x] Astro project, GSAP animations, responsive layout
- [x] Knowledge Base (Content Collections, markdown articles)
- [x] Portfolio page (Telegram + WebPortfolio masonry grid)
- [x] Image optimization (PNG -> WebP, 89MB -> ~3MB)

### Phase 5–7: US Market & Infrastructure
- [x] US market content, English reviews, TechStack updated
- [x] Contact form (email API via nodemailer)
- [x] AI Chat widget (OpenRouter -> llama-3.1-8b-instruct:free)
- [x] GitHub Actions deploy (rsync -> VPS, PM2, nginx)
- [x] i18n EN/RU switcher (data-i18n system, localStorage)

### Phase 8: Design System
- [x] `src/styles/tokens.css` — full CSS design tokens
- [x] `src/styles/global.css` — refactored to use tokens
- [x] Layout.astro imports tokens first

### Phase 9: SEO / GEO Foundation
- [x] nginx.conf — domain `aggressorbulkit.online` + www redirect + SSL
- [x] Layout.astro — canonical, robots, author, OG image, Twitter Card
- [x] `src/components/SEO.astro` — JSON-LD: Person, WebSite, ProfessionalService, FAQPage (10 Q&A), BreadcrumbList, BlogPosting
- [x] `@astrojs/sitemap`, `public/robots.txt`, `public/og-image.png`
- [x] KB articles: `telegram-bot-vs-website-chatbot.md`, `geo-optimization-for-ai-chatbots.md`
- [x] 12 industry doorway pages (`src/content/services/`) with per-page JSON-LD schemas + FAQ

### Phase 9.5: SSL & Domain
- [x] Let's Encrypt SSL via certbot + nginx auto-config
- [x] HTTP -> HTTPS redirect, www -> non-www HTTPS redirect
- [x] `.github/nginx.conf` updated with full SSL blocks (survives deploys)

---

## DONE — Phase 10: Portfolio -> Narrative Case Studies

### 10A. AI-Generated Images
- [x] `scripts/generate-images.mjs` — Replicate FLUX.1 schnell API (~$0.05 total)
- [x] 18 dark-tinted WebP images (3 per case study) in `public/assets/cases/`
- [x] Post-processing: sharp resize 1200px + dark gradient overlay + WebP q85

### 10B. NLP-Enhanced Content
- [x] `plugins/rehype-mark.mjs` — custom rehype plugin for `==keyword==` -> `<mark>` highlighting
- [x] 6 case studies with 3-layer NLP pipeline (Copywriter -> NLP specialist -> Editor)
- [x] Aliaksei as central character, first-person narrative
- [x] `<mark>` styled with `color: var(--color-accent)` for subliminal NLP accent

### 10C. Components & Pages
- [x] `src/components/CaseStudyCard.astro` — featured/regular card variants
- [x] `src/pages/casestudies/[slug].astro` — full template (GSAP, JSON-LD Article+Review+Breadcrumb)
- [x] `src/pages/portfolio.astro` — redesigned from screenshots to case study grid
- [x] Header nav: added "Services", renamed "Case Studies"
- [x] i18n: EN/RU keys for all case study sections
- [x] Removed ~90MB old PNG screenshots

---

## DONE — Phase 10.5: SEO/GEO Fixes + Localization

### SEO/GEO Fixes (GitHub Issues #14-#17, #21)
- [x] #14: hreflang en/ru/x-default tags in Layout.astro
- [x] #15: AggregateRating in ProfessionalService, BlogPosting for knowledge articles
- [x] #16: Cross-linking: service pages <-> case studies via industry mapping
- [x] #17: Visible FAQ accordion on homepage (6 Q&A, EN/RU i18n)
- [x] #21: Semantic `<time>` elements, dateModified in Article schema

### Case Study Localization (EN = US market)
- [x] All 6 case studies: removed Telegram, replaced with US platforms
  - LuxeGlow: WhatsApp Business + Web Chat
  - FreshBite: Website Chatbot + SMS Notifications
  - HealthFirst: SMS Bot + Patient Portal
  - MetroFit: Mobile App + SMS
  - UrbanNest: Web Chat + SMS
  - TechEdge: already Slack-based, no change
- [x] index.astro meta + FAQ: "Telegram" -> "website, WhatsApp, SMS"
- [x] SEO.astro JSON-LD: all Telegram refs -> WhatsApp/SMS/web
- [x] api/chat.ts: system prompt updated to US platforms
- [x] RU i18n: keeps Telegram + added Битрикс24, AmoCRM

### Content Quality Review
- [x] Removed templated `==losing==` highlight from 4/6 case studies (AI-generation tell)
- [x] Reduced excessive NLP marks to max 8 per article
- [x] Fixed MetroFit missing App Store rating in body text
- [x] Polished marketing-speak phrases

### Profile Image Fix
- [x] Fixed EXIF rotation on me.jpg/me.webp (sharp .rotate())

---

## SEO/GEO Audit (2026-02-28)

### SEO Score: ~88% — Strong

| Element | Status | Coverage |
|---|---|---|
| Meta Tags (OG, Twitter) | Done | 90% |
| JSON-LD Schemas (8 types) | Done | 95% |
| Sitemap + robots.txt | Done | 100% |
| Canonical URLs (dynamic) | Done | 100% |
| hreflang (en/ru/x-default) | Done | 100% |
| Alt Tags on images | Done | 85% |
| Heading Hierarchy (H1-H3) | Done | 85% |
| Internal Linking + Cross-links | Done | 85% |
| SSL/HTTPS | Done | 100% |
| Image Optimization (WebP) | Done | 80% |
| Semantic `<time>` elements | Done | 90% |

### GEO Score: ~80% — Good

| Signal | Status | Coverage |
|---|---|---|
| FAQPage Schema (10+ Q&A) | Done | 95% |
| Visible FAQ accordion | Done | 90% |
| Statistics & Data Points | Done | 85% |
| Direct Answer Content | Done | 85% |
| Breadcrumbs (visual+JSON-LD) | Done | 85% |
| Expertise Signals (author bio) | Done | 80% |
| AggregateRating | Done | 90% |
| BlogPosting schema | Done | 90% |
| Content Freshness (dateModified) | Done | 85% |
| Entity Authority & Cross-links | Done | 80% |
| "People Also Ask" Sections | Partial | 50% |

---

## OPEN — GitHub Issues

| # | Title | Priority | Status |
|---|-------|----------|--------|
| #18 | Chatbot upgrade: smarter qualification + Telegram leads | High | Open |
| #19 | Analytics: Plausible or GA4 | Medium | Open |
| #20 | Image optimization: srcset/picture responsive | Medium | Open |
| #22 | CRM pipeline: leads -> Google Sheets + notifications | High | Open |

---

## NEXT — Phase 11: Lead Generator Machine

### 11A. Chatbot Upgrade (#18) — HIGH PRIORITY
- [ ] Research best lead qualification tactics (psychology, conversion patterns)
- [ ] Redesign system prompt with qualification flow
- [ ] Lead notifications -> owner's Telegram
- [ ] i18n for chatbot greeting
- [ ] Context-aware responses based on page visitor came from

### 11B. CRM Pipeline (#22)
- [ ] Chat -> Google Sheets/Notion + Telegram notification
- [ ] Lead scoring by budget/urgency/niche
- [ ] Automated follow-up: 24h no-reply -> auto email
- [ ] Calendly embed in chatbot

### 11C. Analytics (#19)
- [ ] Plausible or GA4 setup
- [ ] Event tracking: chat opens, form submits, CTA clicks

### 11D. Traffic Amplification
- [ ] Backlink campaign — 20 directory submissions (G2, Capterra, Clutch)
- [ ] Reddit strategy — r/entrepreneur, r/smallbusiness, r/chatbots
- [ ] GEO monitoring — weekly ChatGPT/Perplexity citation checks

---

## Phase 12: AI Agent System (Future)

- [ ] Claude Agent SDK for autonomous agents
- [ ] Content Agent: auto-generate FAQ articles -> publish to KB
- [ ] Outreach Agent: find prospects on LinkedIn/Reddit -> personalized DMs
- [ ] GEO Monitor Agent: daily Perplexity/ChatGPT citation checks
- [ ] Lead Qualifier Agent: qualification dialog -> hot leads to Telegram

---

## Technical Debt

- [ ] Knowledge Base: add search/filter by tags
- [ ] Image srcset/picture responsive variants (#20)
- [ ] Trailing slash consistency (canonical URL normalization)
- [ ] Font optimization (preload critical fonts, font-display:swap explicit)
- [ ] HowTo schema for knowledge base step-by-step articles
- [ ] TL;DR summaries for long articles

---

## Localization Rules

**EN (US market):**
- Platforms: WhatsApp Business, SMS, Web Chat, Slack, Intercom
- CRMs: HubSpot, Salesforce, Google Sheets, Zapier, Calendly
- NO Telegram mentions (Americans associate it with darknet)

**RU (Russian market):**
- Platforms: Telegram (primary), WhatsApp
- CRMs: Битрикс24, AmoCRM, Google Таблицы, Zapier
- Telegram is the default messaging platform

---

## Working Agreement

**Rules:**
- This file = single source of truth for project state
- Before each session: read this file -> understand context
- After each session: update statuses + add new tasks
- Deploy: `git push git@github.com:offflinerpsy/antifreelance.git master`

**Stack:**
- Framework: Astro 5.17.3 (static output + Node adapter)
- Styles: tokens.css + global.css (CSS custom properties)
- Animations: GSAP 3.12.2 (CDN)
- AI Chat: OpenRouter (llama-3.1-8b-instruct:free)
- Deploy: GitHub Actions -> VPS (89.23.96.192 / aggressorbulkit.online)
- VPS: Timeweb (Ubuntu, nginx, certbot SSL, SSH via id_ed25519)
- Images: Replicate FLUX.1 schnell (AI generation) + sharp (post-processing)
