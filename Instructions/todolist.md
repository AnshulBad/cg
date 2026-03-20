# 📝 Compliance Quest — Pending Todo List

> Generated from `pending.md` on 2026-03-06  
> Priority: 🔴 High | 🟡 Medium | 🟢 Low

---

## 1. 🔴 Front Page Poster & Background Music
- [ ] Design a visually striking poster/splash image for the login screen
- [ ] Add a looping ambient background music track (Web Audio API or MP3)
- [ ] Provide a mute/unmute toggle accessible from the HUD

**Notes:** Current login page has a particle canvas background. A custom poster image or illustration would elevate first impressions. Background music should be subtle and non-intrusive — consider a lo-fi office ambience loop.

---

## 2. 🟡 Incorporating More Difficulty & Logic
- [ ] Add adaptive difficulty scaling based on player accuracy
- [ ] Introduce timer pressure that decreases with higher levels
- [ ] Add multi-step scenarios (chain of 2–3 decisions)
- [ ] Create domain-specific scenario pools for POSH and Business Continuity (currently only Cyber has scenarios)
- [ ] Consider AI-generated dynamic scenarios via the `ai_engine` backend module

**Notes:** Backend `ai_engine.py` stub already exists. The `MAX_LEVEL` is set to 3 and `SCENARIOS_PER_LEVEL` to 10. More scenario content is the biggest gap.

---

## 3. 🔴 Admin Portal — Scenario Upload via Excel/Text
- [ ] Build an admin login page (separate route or modal)
- [ ] Create a file upload UI accepting `.xlsx`, `.csv`, or `.txt` files
- [ ] Parse uploaded file rows into scenario objects (`id`, `title`, `story`, `question`, `options[]`, `correct_index`, `level`, `domain`)
- [ ] Backend endpoint `/api/upload-content` already exists — connect frontend to it
- [ ] Add validation and preview before committing scenarios
- [ ] Store uploaded scenarios persistently (currently in-memory only — needs DB or file-based storage)

**Notes:** This is a critical feature for making the game maintainable by non-technical compliance teams.

---

## 4. 🟡 Reporting — Player Stats Dashboard
- [ ] Create a reporting/analytics page showing:
  - Player name, domain, score, accuracy, date played
  - Weak topics per player
  - Leaderboard ranking
- [ ] Backend endpoint `/api/leaderboard` already exists — build frontend UI
- [ ] Add `/api/stats/{username}` endpoint for individual player history
- [ ] Consider exporting reports as CSV/PDF
- [ ] Persist stats to a database (currently in-memory `_user_stats` dict)

**Notes:** All answer submissions already call `/api/submit-answer`. The data pipeline exists; visualization is the missing piece.

---

## 5. 🟢 Stories — Animated Scene Showing What Actually Happened
- [ ] After each scenario answer, show a short "What Actually Happened" story cutscene
- [ ] Use a different visual scene or illustration panel for each story outcome
- [ ] Include consequences of both right and wrong choices
- [ ] Consider generating story illustrations using AI image generation
- [ ] Add a "Story Archive" section where players can revisit past scenarios and outcomes

**Notes:** This is an enhancement that adds narrative depth. Could start with simple text-based "aftermath" panels before investing in full animated scenes.

---

## 🗓️ Suggested Implementation Order

| Phase | Items | Effort |
|-------|-------|--------|
| **Phase 1** | Admin Portal (#3) + Reporting (#4) | ~3–4 days |
| **Phase 2** | Front Page Poster & Music (#1) | ~1 day |
| **Phase 3** | More Difficulty & Logic (#2) | ~2–3 days |
| **Phase 4** | Story Cutscenes (#5) | ~3–5 days |

---

> ✅ = Done | ⏳ = In Progress | ❌ = Not Started
