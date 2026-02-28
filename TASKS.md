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
- [x] nginx.conf — domain `aggressorbulkit.online` + www redirect
- [x] Layout.astro — canonical, robots, author, OG image, Twitter Card
- [x] `src/components/SEO.astro` — JSON-LD: Person, WebSite, ProfessionalService, FAQPage (10 Q&A), BreadcrumbList, Article
- [x] `@astrojs/sitemap`, `public/robots.txt`, `public/og-image.png`
- [x] KB articles: `telegram-bot-vs-website-chatbot.md`, `geo-optimization-for-ai-chatbots.md`
- [x] 12 industry doorway pages (`src/content/services/`) with per-page JSON-LD schemas + FAQ

### Phase 9.5: SSL & Domain
- [x] Let's Encrypt SSL via certbot + nginx auto-config
- [x] HTTP -> HTTPS redirect (certbot managed)
- [x] www -> non-www HTTPS redirect

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

## SEO/GEO Audit (2026-02-28)

### SEO Score: ~85% — Strong

| Element | Status | Coverage |
|---|---|---|
| Meta Tags (OG, Twitter) | Done | 90% |
| JSON-LD Schemas (7 types) | Done | 95% |
| Sitemap + robots.txt | Done | 100% |
| Canonical URLs (dynamic) | Done | 100% |
| Alt Tags on images | Done | 85% |
| Heading Hierarchy (H1-H3) | Done | 85% |
| Internal Linking | Done | 75% |
| SSL/HTTPS | Done | 100% |
| Image Optimization (WebP) | Done | 80% |

### GEO Score: ~74% — Good Foundation

| Signal | Status | Coverage |
|---|---|---|
| FAQPage Schema (10+ Q&A) | Done | 90% |
| Statistics & Data Points | Done | 85% |
| Direct Answer Content | Done | 85% |
| Breadcrumbs (visual+JSON-LD) | Done | 85% |
| Expertise Signals (author bio) | Done | 80% |
| Conversational Language | Done | 70% |
| Content Freshness (pubDate) | Done | 65% |
| Entity Authority & Cross-links | Partial | 65% |
| Definition Content ("What is") | Partial | 60% |
| "People Also Ask" Sections | Missing | 35% |

### SEO/GEO — Critical Gaps to Fix
- [ ] **hreflang tags** — missing entirely; i18n is JS-only, invisible to crawlers
- [ ] **"Last Updated" timestamps** — only pubDate, no freshness signals
- [ ] **AggregateRating schema** — no star ratings for testimonials
- [ ] **HowTo schema** — knowledge articles need it for step-by-step content
- [ ] **Internal cross-linking** — case studies <-> services <-> knowledge articles
- [ ] **"People Also Ask" sections** — expandable Q&A on main pages
- [ ] **Image srcset/picture** — responsive image variants not implemented
- [ ] **<time> elements** — dates not in semantic HTML
- [ ] **BlogPosting schema** — knowledge base articles use Article, not BlogPosting
- [ ] **TL;DR summaries** — long articles lack quick answer at top

---

## NEXT — Phase 11: Lead Generator Machine

### 11A. Inbound Funnel Upgrade
- [ ] **Chat -> CRM pipeline**: ChatWidget -> Google Sheets/Notion + Telegram notification
- [ ] **Lead scoring**: qualify leads by budget/urgency/niche
- [ ] **Automated follow-up**: 24h no-reply -> auto email
- [ ] **Calendly embed**: in chatbot, offer call slot

### 11B. Chatbot Upgrade
- [ ] Make chatbot smarter (system prompt, context, lead qualification flow)
- [ ] i18n for chatbot greeting (language switch doesn't change greeting)

### 11C. Traffic Amplification
- [ ] **Backlink campaign** — 20 directory submissions (G2, Capterra, Clutch, etc.)
- [ ] **Reddit strategy** — r/entrepreneur, r/smallbusiness, r/chatbots
- [ ] **GEO monitoring** — weekly check ChatGPT/Perplexity mentions
- [ ] **Analytics**: Plausible or GA4

---

## Phase 12: AI Agent System (Future)

- [ ] Claude Agent SDK for autonomous agents
- [ ] **Content Agent**: auto-generate FAQ articles -> publish to KB
- [ ] **Outreach Agent**: find prospects on LinkedIn/Reddit -> personalized DMs
- [ ] **GEO Monitor Agent**: daily Perplexity/ChatGPT citation checks
- [ ] **Lead Qualifier Agent**: qualification dialog -> hot leads to Telegram

---

## Technical Debt

- [ ] Knowledge Base: add search/filter by tags
- [ ] Portfolio.astro: add real Telegram bot case studies (screenshots + descriptions)
- [ ] Trailing slash consistency (canonical URL normalization)
- [ ] Font optimization (preload critical fonts, font-display:swap explicit)

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
