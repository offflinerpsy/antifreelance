# BotStudio — Living Task Tracker
> Updated: 2026-02-27 | Branch: master | Site: https://aggressorbulkit.online

---

## ✅ DONE — Phases 1–9

### Phase 1–4: Foundation
- [x] Astro project, GSAP animations, responsive layout
- [x] Knowledge Base (Content Collections, markdown articles)
- [x] Portfolio page (Telegram + WebPortfolio masonry grid)
- [x] Image optimization (PNG → WebP, 89MB → ~3MB)

### Phase 5–7: US Market & Infrastructure
- [x] US market content, English reviews, TechStack updated
- [x] Contact form (email API via nodemailer)
- [x] AI Chat widget (OpenRouter → llama-3.1-8b-instruct:free)
- [x] GitHub Actions deploy (rsync → VPS, PM2, nginx)
- [x] i18n EN/RU switcher (data-i18n system, localStorage)

### Phase 8: Design System
- [x] `src/styles/tokens.css` — full CSS design tokens (colors, type scale, spacing, radius, shadows, z-index, animation)
- [x] `src/styles/global.css` — refactored to use tokens
- [x] Layout.astro imports tokens first

### Phase 9: SEO / GEO
- [x] nginx.conf — domain `aggressorbulkit.online` + www redirect
- [x] Layout.astro — canonical, robots, author, OG image, Twitter Card
- [x] `src/components/SEO.astro` — JSON-LD: Person, WebSite, ProfessionalService, FAQPage (10 Q&A), BreadcrumbList, Article
- [x] `@astrojs/sitemap` installed, `astro.config.mjs` updated with `site` URL
- [x] `public/robots.txt` created
- [x] `public/og-image.png` generated (1200×630, dark theme)
- [x] KB articles: `telegram-bot-vs-website-chatbot.md`, `geo-optimization-for-ai-chatbots.md`

---

## 🔜 NEXT — Phase 10: Lead Generator Machine

### Vision
Превратить сайт в **автоматический лид-генератор**: трафик из AI-поиска (GEO) + органика (SEO) → квалификация через чат-бот → автоматическая отправка в CRM/Telegram.

### 10A. Research — Best Lead Gen GitHub Repos
Найти и изучить лучшие открытые инструменты:
- [ ] Поиск: `github.com search "lead generation bot" "telegram" stars:>500`
- [ ] Поиск: `github.com search "AI sales agent" "openai" stars:>1000`
- [ ] Поиск: готовые GEO/SEO automation agents (Claude Code agents, LangChain)
- [ ] Изучить: n8n.io workflows для lead gen
- [ ] Изучить: make.com (Integromat) templates

### 10B. Automated Outbound Lead Gen
- [ ] **Cold email automation** — найти готовый open-source стек (instantly.ai альтернативы)
- [ ] **LinkedIn automation** — PhantomBuster / Waalaxy интеграция
- [ ] **Content repurposing agent** — автопост KB статей в Twitter/LinkedIn/Reddit
- [ ] **SEO content agent** — auto-generate new KB articles targeting long-tail queries

### 10C. Inbound Funnel Upgrade
- [ ] **Chat → CRM pipeline**: ChatWidget → save lead to Google Sheets/Notion + Telegram notification
- [ ] **Lead scoring bot**: квалифицировать лидов по: бюджет / срочность / ниша
- [ ] **Automated follow-up**: если лид не ответил через 24ч — автоматическое письмо
- [ ] **Calendly embed**: прямо в чат-боте предлагать слот для звонка

### 10D. Traffic Amplification
- [ ] **Product Hunt launch** — подготовить страницу, описание, медиа-кит
- [ ] **Reddit strategy** — r/entrepreneur, r/smallbusiness, r/chatbots ответы с ссылками
- [ ] **GEO monitoring** — еженедельно проверять упоминания в ChatGPT/Perplexity
- [ ] **Backlink campaign** — 20 directory submissions (G2, Capterra, Clutch, etc.)

---

## 🧠 Phase 11: AI Agent System (Future)

- [ ] Исследовать Claude Agent SDK для build собственных агентов
- [ ] **Content Agent**: генерирует FAQ-статьи → публикует в KB автоматически
- [ ] **Outreach Agent**: находит потенциальных клиентов в LinkedIn/Reddit → пишет персональные сообщения
- [ ] **GEO Monitor Agent**: ежедневно проверяет Perplexity/ChatGPT → репортит упоминания
- [ ] **Lead Qualifier Agent**: ведёт квалификационный диалог → передаёт горячих лидов

---

## 🔧 Technical Debt

- [ ] ChatWidget: i18n для greeting (переключение языка не меняет приветствие без перезагрузки)
- [ ] Portfolio.astro: добавить реальные Telegram-бот кейсы (скрины + описание)
- [ ] Knowledge Base: добавить search/filter по тегам
- [ ] Analytics: подключить Plausible или GA4

---

## 📋 Working Agreement

**Правила работы с этим файлом:**
- Этот файл — единственный источник правды о состоянии проекта
- Перед каждой сессией: прочитать этот файл → понять контекст
- После каждой сессии: обновить статусы + добавить новые задачи
- Для сложных задач: запускать лучших subagents (Plan → Explore → Bash)
- Использовать Context7 для актуальной документации библиотек
- Deploy: всегда через `git push git@github.com:offflinerpsy/antifreelance.git master`

**Стек:**
- Framework: Astro 5.17.3 (static output + Node adapter)
- Styles: tokens.css + global.css (CSS custom properties)
- Animations: GSAP 3.12.2 (CDN)
- AI Chat: OpenRouter (llama-3.1-8b-instruct:free)
- Deploy: GitHub Actions → VPS (89.23.96.192 / aggressorbulkit.online)
- VPS: Timeweb (SSH via id_ed25519, push via SSH remote URL)
