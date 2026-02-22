# Agent Bootstrap Prompt v2.0 (Super-Agent)

> Этот промпт нужно скопировать и отправить агенту OpenClaw.
> Он заставит агента создать самовосстанавливающуюся архитектуру ("мозг") в GitHub-репозитории.

---

## Промпт (копируй всё ниже этой линии):

Привет! Твоя текущая задача — **Agent Bootstrapping (Создание самовосстанавливающейся архитектуры "Super-Agent")**. 

Ты должен спроектировать свою когнитивную архитектуру, написать для себя набор инструментов (Skills), задокументировать всё это и сохранить в свой собственный GitHub-репозиторий. Твоя цель — стать полностью автономным, задокументированным и восстанавливаемым из GitHub за одну команду.

---

### Контекст твоей среды

- **ОС:** macOS (bare-metal, без Docker). Ты работаешь напрямую на MacBook.
- **Терминал:** `zsh` (конфиг: `~/.zshrc`).
- **GitHub CLI:** `gh` (установлен и авторизован).
- **Антидетект-браузер:** Dolphin Anty, работает локально. API: `http://127.0.0.1:3001`.
- **Веб-поиск:** Exa API. Ключ доступен через переменную среды `EXA_API_KEY`.
- **Память:** У тебя есть 3 уровня памяти (short-term, long-term, episodic).

---

### Целевая структура репозитория

Ты должен создать следующую структуру. Не отклоняйся от неё:

```
~/openclaw-brain/
├── AGENTS.md              # Твоя личность, правила, поведение (авто-загрузка)
├── ARCHITECTURE.md        # Техническая архитектура: как работает каждый компонент
├── README.md              # Описание проекта для людей (что это, зачем, как восстановить)
├── install.sh             # Скрипт полного восстановления за 1 команду
├── requirements.txt       # Python-зависимости
├── .gitignore             # Безопасность: никаких ключей и баз в репо
│
├── skills/                # Исполняемые Python-скрипты (твои навыки)
│   ├── search_web.py      # Поиск через Exa API
│   ├── dolphin_control.py # Управление Dolphin Anty через Playwright
│   ├── reflect.py         # Reflexion: анализ ошибок перед исправлением
│   ├── episodic_memory.py # Сохранение и поиск опыта в SQLite
│   └── wrap_up.py         # Ритуал завершения сессии (коммит, обзор уроков, пуш)
│
├── playbooks/             # Документация к каждому навыку (когда/как использовать)
│   ├── search_web.md
│   ├── dolphin_control.md
│   ├── reflect.md
│   ├── episodic_memory.md
│   └── wrap_up.md
│
├── memory/
│   └── schema.sql         # SQL-схема базы эпизодической памяти (для восстановления)
│
└── tasks/
    └── tasks.json         # Очередь задач для автономной работы (Continuous Loop)
```

---

### Шаг 1: Инициализация репозитория (Repository Setup)

1. Создай папку `~/openclaw-brain`.
2. Инициализируй Git: `git init`.
3. Создай приватный репозиторий на GitHub:
   ```bash
   gh repo create openclaw-brain --private --source=. --remote=origin
   ```
4. Создай `.gitignore`:
   ```
   .env
   *.db
   *.sqlite
   __pycache__/
   screenshots/
   *.pyc
   .DS_Store
   ```

---

### Шаг 2: Документирование личности и архитектуры

#### `AGENTS.md` (этот файл загружается автоматически при старте каждой сессии)

Напиши в нём свои **обязательные правила поведения**:

```markdown
# OpenClaw Super-Agent — Identity & Rules

## Кто я
Я — автономный супер-агент на базе Claude Sonnet 4.6. Мой исходный код и архитектура лежат в `~/openclaw-brain`. Я портативен: если меня переустановить, я восстанавливаюсь из GitHub за 1 команду (`./install.sh`).

## Обязательные правила (НИКОГДА не нарушать)

### Перед любой задачей:
1. Прочитай `tasks/tasks.json` — есть ли активная задача?
2. Выполни `episodic_memory search "ключевые слова задачи"` — проверь, не сталкивался ли я с подобным раньше.

### При ошибке в коде:
1. СТОП. Не пиши исправление сразу.
2. Вызови `reflect "текст ошибки"` — запиши гипотезу о причине.
3. Только после записи гипотезы — пиши исправленный код.

### Для поиска информации:
1. Используй `exa_search "запрос"` — не гугли вручную.

### Для парсинга защищённых сайтов:
1. Используй `dolphin "profile_id"` — не используй обычный requests/curl для сайтов с Cloudflare.

### В конце каждой рабочей сессии:
1. Вызови `wrap_up` — он сделает коммит, обзор уроков и пуш.

### Любое изменение в моих навыках или логике:
1. Сначала изменить код в `~/openclaw-brain/skills/`.
2. Обновить соответствующий playbook в `~/openclaw-brain/playbooks/`.
3. Закоммитить и запушить: `cd ~/openclaw-brain && git add . && git commit -m "описание" && git push`.
```

#### `ARCHITECTURE.md`

Опиши техническое устройство каждого компонента:
- Как работает каждый скрипт из `skills/` (вход, выход, зависимости).
- Схема таблиц SQLite для эпизодической памяти (таблица `experiences`: id, timestamp, description, tags, outcome).
- Как агент взаимодействует с Dolphin Anty (API endpoints, WebSocket, Playwright CDP).
- Как агент использует Exa API (POST `https://api.exa.ai/search`, заголовок `x-api-key`).
- Формат `tasks.json` (массив объектов: `{id, title, status, priority, created_at}`).

#### `README.md`

Опиши:
- Что это за проект ("Мозг автономного супер-агента OpenClaw").
- Как восстановить агента (`git clone ... && cd openclaw-brain && ./install.sh`).
- Список навыков (Skills) с кратким описанием.
- Как добавить новый навык.

---

### Шаг 3: Создание навыков (Skills Development)

Создай папку `skills/` и напиши 5 Python-скриптов:

#### 1. `search_web.py` (Exa Search)
- Принимает текстовый запрос как аргумент CLI.
- Читает `EXA_API_KEY` из `os.environ`.
- Делает POST-запрос к `https://api.exa.ai/search` с параметрами: `type: "auto"`, `num_results: 10`, `contents: {text: {max_characters: 10000}}`.
- Выводит в консоль: заголовок, URL и краткий текст каждого результата.
- Обработка ошибок: если ключ не найден или API вернул ошибку — вывести понятное сообщение.

#### 2. `dolphin_control.py` (Dolphin Anty)
- Принимает ID профиля как аргумент CLI.
- GET `http://127.0.0.1:3001/v1.0/browser_profiles/{profile_id}/start` → получает `wsEndpoint`.
- Подключается к браузеру через `playwright.chromium.connect_over_cdp(wsEndpoint)`.
- Поддерживает команды: `screenshot <url> <filename>`, `get_text <url>`, `close`.
- Сохраняет скриншоты в `~/openclaw-brain/screenshots/` (эта папка в .gitignore).

#### 3. `reflect.py` (Reflexion Framework)
- Принимает текст ошибки (traceback) как аргумент CLI.
- Добавляет запись в `~/openclaw-brain/reflection_log.txt` в формате:
  ```
  [2026-02-21 15:30:00] ERROR: <текст ошибки>
  HYPOTHESIS: <агент обязан написать гипотезу>
  ---
  ```
- **Критически важно:** Скрипт должен ТРЕБОВАТЬ ввод гипотезы (через stdin или второй аргумент). Без гипотезы запись не сохраняется.

#### 4. `episodic_memory.py` (Эпизодическая память)
- Команды:
  - `save "описание опыта" --tags "tag1,tag2" --outcome "success|failure"`
  - `search "ключевое слово"` — семантический поиск по полю description.
  - `list --last 10` — вывести последние 10 записей.
- Хранилище: SQLite база `~/openclaw-brain/experience.db` (в .gitignore).
- Если базы нет — создать её автоматически по схеме из `memory/schema.sql`.

#### 5. `wrap_up.py` (Ритуал завершения сессии) — **НОВЫЙ, самый важный**
Этот скрипт запускается в конце каждой рабочей сессии и выполняет 4 фазы:

**Фаза 1 — Ship It:**
- `git add .` → `git commit -m "Session wrap-up: <дата>"` → `git push`.

**Фаза 2 — Remember It:**
- Прочитать `reflection_log.txt` за текущую сессию.
- Извлечь ключевые уроки.
- Добавить их в `AGENTS.md` (секция "Уроки").

**Фаза 3 — Review & Apply:**
- Проанализировать повторяющиеся паттерны ошибок в `reflection_log.txt` и `experience.db`.
- Если обнаружен повторяющийся паттерн — написать новое правило в `AGENTS.md`.

**Фаза 4 — Final Push:**
- Закоммитить обновлённый `AGENTS.md`: `git commit -am "Self-improvement: lessons learned" && git push`.

---

### Шаг 4: Playbooks (Документация к каждому навыку)

Создай папку `playbooks/` и напиши `.md` файл для каждого скрипта:
- **Когда использовать** (триггеры).
- **Как вызвать** (примеры CLI-команд).
- **Что ожидать** (формат вывода).
- **Типичные ошибки** и как их решать.

---

### Шаг 5: Память (Memory Schema)

Создай `memory/schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    description TEXT NOT NULL,
    tags TEXT,
    outcome TEXT CHECK(outcome IN ('success', 'failure', 'neutral')),
    context TEXT
);

CREATE INDEX IF NOT EXISTS idx_experiences_tags ON experiences(tags);
CREATE INDEX IF NOT EXISTS idx_experiences_timestamp ON experiences(timestamp);
```

---

### Шаг 6: Задачи (Tasks Queue)

Создай `tasks/tasks.json`:
```json
{
  "project": "antifreelance",
  "tasks": [
    {
      "id": 1,
      "title": "Собрать список 20 платных Telegram-каналов с фриланс-заданиями",
      "status": "not-started",
      "priority": "high",
      "created_at": "2026-02-21"
    },
    {
      "id": 2,
      "title": "Собрать список 50 бесплатных Telegram-чатов и сайтов фриланса",
      "status": "not-started",
      "priority": "high",
      "created_at": "2026-02-21"
    },
    {
      "id": 3,
      "title": "Провести ручной эксперимент: найти оригиналы 5 заданий из платных каналов",
      "status": "not-started",
      "priority": "critical",
      "created_at": "2026-02-21"
    }
  ]
}
```

---

### Шаг 7: Скрипт восстановления (install.sh)

```bash
#!/bin/bash
set -e

echo "🧠 Installing OpenClaw Brain..."

# 1. Python dependencies
pip3 install -r requirements.txt

# 2. Make skills executable
chmod +x skills/*.py

# 3. Create screenshots directory
mkdir -p screenshots

# 4. Initialize SQLite database from schema
if [ ! -f experience.db ]; then
    sqlite3 experience.db < memory/schema.sql
    echo "✅ Created experience.db from schema"
fi

# 5. Add aliases to ~/.zshrc (idempotent)
ALIASES=(
    'alias exa_search="python3 ~/openclaw-brain/skills/search_web.py"'
    'alias dolphin="python3 ~/openclaw-brain/skills/dolphin_control.py"'
    'alias reflect="python3 ~/openclaw-brain/skills/reflect.py"'
    'alias episodic_memory="python3 ~/openclaw-brain/skills/episodic_memory.py"'
    'alias wrap_up="python3 ~/openclaw-brain/skills/wrap_up.py"'
)

for alias_line in "${ALIASES[@]}"; do
    if ! grep -qF "$alias_line" ~/.zshrc; then
        echo "$alias_line" >> ~/.zshrc
        echo "Added: $alias_line"
    fi
done

source ~/.zshrc 2>/dev/null || true

echo "✅ OpenClaw Brain installed successfully!"
echo "Available commands: exa_search, dolphin, reflect, episodic_memory, wrap_up"
```

---

### Шаг 8: requirements.txt

```
requests>=2.31.0
playwright>=1.40.0
```

---

### Шаг 9: Self-Verification (ОБЯЗАТЕЛЬНО)

После создания каждого скрипта ты **обязан** его протестировать:

1. Запусти `python3 skills/search_web.py "test query"` — убедись, что выводятся результаты.
2. Запусти `python3 skills/episodic_memory.py save "test experience" --tags "test" --outcome "success"` — убедись, что запись создана.
3. Запусти `python3 skills/episodic_memory.py search "test"` — убедись, что запись найдена.
4. Запусти `python3 skills/reflect.py "TestError: something broke" "My hypothesis is..."` — убедись, что запись появилась в `reflection_log.txt`.
5. Запусти `./install.sh` — убедись, что он выполняется без ошибок.

Если тест провалился — исправь скрипт и протестируй снова (до 3 попыток). Только после успешного прохождения всех тестов — делай коммит.

---

### Шаг 10: Финальный коммит и пуш

```bash
cd ~/openclaw-brain
git add .
git commit -m "Initial brain bootstrap: skills, playbooks, memory, tasks"
git push -u origin main
```

---

### Критерий завершения

Ты закончил, когда:
- [ ] Репозиторий `openclaw-brain` существует на GitHub (приватный).
- [ ] Все 5 скриптов в `skills/` прошли тесты.
- [ ] `install.sh` выполняется без ошибок.
- [ ] `AGENTS.md`, `ARCHITECTURE.md`, `README.md` написаны и информативны.
- [ ] Все playbooks в `playbooks/` содержат примеры использования.
- [ ] Первый коммит запушен в GitHub.

Выполни все шаги прямо сейчас, тестируй каждый компонент и отчитайся о готовности.
