# IU SPORTS HUB — Iqra University Sports Management System
**Course:** Agile Software Engineering | **Institution:** Iqra University, Islamabad  
**Version:** 1.0 (Production Release) | **Stack:** Next.js 14 (App Router) • TypeScript • Tailwind CSS • Supabase

---

## 1. Product Vision & Overview

For Iqra University students, teams, coaches, and the sports directorate who previously managed games and schedules through scattered WhatsApp groups, spreadsheets, and paper registration sheets, **IU Sports Hub** is a centralized, web-based sports management system. It lists all university sports, schedules matches without double-booking clashes, publishes real-time live scores and points table standings, and automatically notifies athletes and fans.

### Key Success Metrics
| Metric | Target | Achieved in v1.0 |
|---|---|---|
| Single Source of Truth | 100% of official campus sports | ✅ 8 Sports catalogued with full rulebooks |
| Zero Double-Bookings | 0 venue/team/referee collisions | ✅ DB constraint (`btree_gist`) + 6D conflict solver |
| Scheduling Acceleration | Fixture creation time cut by 80% | ✅ 1-click round-robin auto-scheduler |
| Standings Transparency | Results published within 5 minutes | ✅ Real-time automatic points calculation |

---

## 2. System Architecture & Tech Stack

```
iu-sports-hub/
├─ docs/                          # Agile specifications, SRS & sprint retrospectives
│  ├─ architecture.md             # Detailed 3-tier architecture document
│  └─ sprints/                    # Sprint reviews S0 to S6 with burndown tables
├─ supabase/
│  ├─ migrations/20261111_init.sql # SQL schema, enums, RLS policies, standings view
│  ├─ seed.sql                    # Initial seed data for demo (users, sports, venues, teams, matches)
│  └─ functions/send-reminders/   # Supabase Edge function for 24h & 1h cron match alerts
├─ src/
│  ├─ app/
│  │  ├─ (public)/                # Home (/), Sports (/sports), Schedule (/schedule), Live (/live), Tournaments (/tournaments), Teams (/teams), Venues (/venues)
│  │  ├─ (auth)/                  # Login (/login), Register (/register) with @iqra.edu.pk enforcement
│  │  ├─ dashboard/               # Role-based dashboards:
│  │  │  ├─ admin/                # Sports Directorate KPI dashboard, match scheduler, venue blocker, CSV exporter
│  │  │  ├─ coach/                # Team roster manager, jersey assignments, join request approvals
│  │  │  ├─ referee/              # Live referee scoring console, event recorder, match closure report
│  │  │  └─ player/               # Athlete profile, assigned matches, notifications inbox
│  │  └─ api/                     # REST API endpoints (/api/matches, /api/conflicts/check, /api/calendar, /api/reports, etc.)
│  ├─ components/                 # Navbar with 1-click Role Demo Switcher, Footer, UI components
│  ├─ lib/                        # Core algorithmic engines:
│  │  ├─ scheduler.ts             # 6-dimension conflict detector & greedy auto-scheduler
│  │  ├─ fixtures.ts              # Round-robin (circle method), Knockout, and Group+Knockout generators
│  │  ├─ standings.ts             # Points table calculator with multi-tier tiebreakers
│  │  ├─ ics.ts                   # RFC 5545 iCalendar (.ics) generator
│  │  ├─ store.ts                 # Real-time state store pre-seeded from seed.sql
│  │  └─ validators.ts            # Zod validation schemas
│  └─ types/                      # Strict TypeScript interfaces & Enums
└─ tests/
   ├─ runner.js                   # Automated test suite runner (17 test cases, 21 assertions)
   ├─ scheduler.test.ts           # Conflict detection & auto-scheduler unit tests
   ├─ fixtures.test.ts            # Fixture generation unit tests
   └─ standings.test.ts           # Points & tiebreaker unit tests
```

---

## 3. Core Algorithms & Scheduling Engine

### 3.1 Conflict Detection Engine (`src/lib/scheduler.ts`)
The scheduling engine validates every slot against 6 critical constraints:
1. **Venue Operating Hours:** Checks match against venue `open_time` and `close_time` (e.g., 08:00 - 22:00).
2. **Venue Double-Booking:** Flags any overlapping match at the same venue.
3. **Team Double-Booking:** Prevents either team from being scheduled at different venues simultaneously.
4. **Academic Blackout Hours:** Enforces university blackout windows (e.g., Mon-Fri 09:00 - 13:00 class hours).
5. **Venue Maintenance Blocks:** Prevents bookings during campus maintenance periods.
6. **Minimum Rest Recovery:** Enforces minimum rest hours between matches for participating teams.

### 3.2 Fixture Generator (`src/lib/fixtures.ts`)
- **Round-Robin:** Implements the polygon/circle method. For odd team counts, introduces a virtual `__BYE__` placeholder so every squad meets every opponent exactly once.
- **Single-Elimination Knockout:** Seeds teams into power-of-2 brackets with byes to top seeds.
- **Group + Knockout:** Balances teams into groups using snake-draft distribution, runs round-robin within each group, and advances group winners to playoffs.

### 3.3 Standings Calculator (`src/lib/standings.ts`)
Calculates Points (Win = 3, Draw = 1, Loss = 0) and applies the official tiebreaker hierarchy:
$$\text{Points} \longrightarrow \text{Goal Difference} \longrightarrow \text{Goals For} \longrightarrow \text{Head-to-Head} \longrightarrow \text{Alphabetical}$$

### 3.4 iCalendar (.ics) Feed (`src/lib/ics.ts` & `/api/calendar`)
Generates RFC 5545 compliant `.ics` calendar files enabling students and faculty to synchronize match schedules directly into **Google Calendar, Apple Calendar, and Microsoft Outlook**.

---

## 4. Agile Scrum Process (Sprints S0 – S6)

The project followed the Scrum framework across 6 releases:

| Sprint | Goal | SP Target | Delivered | Status |
|---|---|---|---|---|
| [**Sprint 0**](docs/sprints/sprint-0.md) | Project Skeleton, CI Pipeline, Supabase Migrations, IU Design Tokens | 3 SP | 3 SP | ✅ Completed |
| [**Sprint 1**](docs/sprints/sprint-1.md) | Auth (`@iqra.edu.pk`), RBAC, Sports Catalogue, Campus Venues | 25 SP | 25 SP | ✅ Completed |
| [**Sprint 2**](docs/sprints/sprint-2.md) | Faculty Teams, Rosters, Join Requests, Tournament Creation | 30 SP | 30 SP | ✅ Completed |
| [**Sprint 3**](docs/sprints/sprint-3.md) | **Scheduling Core**: Conflict Engine, Fixture Generation, Calendar, iCal | 39 SP | 39 SP | ✅ Completed |
| [**Sprint 4**](docs/sprints/sprint-4.md) | Greedy Auto-Scheduler, Referee Live Scoring Console, Live Spectator Center | 42 SP | 42 SP | ✅ Completed |
| [**Sprint 5**](docs/sprints/sprint-5.md) | Points Table Standings, Notifications Inbox, Notice Board, Reminder Cron | 32 SP | 32 SP | ✅ Completed |
| [**Sprint 6**](docs/sprints/sprint-6.md) | Admin KPIs, CSV/PDF Reports, PWA Manifest, Hardening, Release v1.0 | 31 SP | 31 SP | ✅ Completed |

*Full burndown charts and retrospective notes (What went well / What didn't / Action items) are archived in `/docs/sprints/`.*

---

## 5. Demo Accounts & Walkthrough Script

### Demo Users (Pre-seeded in `seed.sql`)
| Role | Email | Name & Department | Demo Password |
|---|---|---|---|
| **Super Admin** | `admin@iqra.edu.pk` | Dr. Tariq Mahmood (Director Sports) | `DemoPass123!` |
| **Sports Admin** | `ayesha.sports@iqra.edu.pk` | Ayesha Khan (Sports Officer) | `DemoPass123!` |
| **Coach** | `coach.hamza@iqra.edu.pk` | Hamza Ali (FCS Titans Coach) | `DemoPass123!` |
| **Referee / Scorer** | `referee.bilal@iqra.edu.pk` | Bilal Ahmed (Official Referee) | `DemoPass123!` |
| **Player / Athlete** | `player.zain@iqra.edu.pk` | Zain Ul Abideen (CS, Jersey #7) | `DemoPass123!` |
| **Spectator** | `sara.student@iqra.edu.pk` | Sara Siddiqui (BBA Student) | `DemoPass123!` |

> 💡 **Instructor / Evaluator Convenience:**  
> Use the **Role Pill Switcher** in the top navigation bar to switch between any role instantly with one click, without needing to re-login!

### 5-Minute Evaluation Walkthrough Script
1. **Public Spectator Portal (`/`):**
   - View the Iqra University themed hero banner, today's live match ticker, and 2027 KPIs.
   - Click **Export iCal (.ics)** to download the calendar feed.
2. **Sports Catalogue (`/sports`):**
   - Filter by Indoor/Outdoor. Search for "Futsal". Click **Official Rules & Details** to view squad requirements.
3. **Match Schedule & Calendar (`/schedule`):**
   - Toggle between **List View** and **Weekly View**.
   - Notice the green **Zero-Conflict Verified** badge.
4. **Sports Admin Console (`/dashboard/admin`):**
   - Switch role to **Sports Admin**.
   - Attempt to schedule a match that overlaps with an existing game $\rightarrow$ notice the real-time **Scheduling Clash Detected** red warning blocking submission.
   - Select an available slot $\rightarrow$ notice the green **Conflict Guard** confirmation.
   - Click **Run Auto-Scheduler** to generate conflict-free fixtures automatically.
   - Click **Export Fixtures CSV** to download the official match report.
5. **Referee Live Scoring Console (`/dashboard/referee`):**
   - Switch role to **Referee**.
   - Click **⚽ Goal (+1)** for Home or Away team.
   - Click **🟨 Yellow Card** or **🟥 Red Card**.
   - Open `/live` in another tab to see real-time updates reflected immediately!
   - Click **End Match & Submit Final Report** $\rightarrow$ enter Player of the Match and lock results.
6. **Tournament Standings (`/tournaments`):**
   - View the updated points table with recalculated Points, Goal Difference, and ranks.
7. **Coach & Player Portals:**
   - Coach (`/dashboard/coach`): Review squad roster and approve player applications.
   - Player (`/dashboard/player`): View upcoming match notification and jersey number assignment.

---

## 6. How to Run & Test Locally

### 1. Prerequisites
- Node.js `v20.x` or higher
- npm or pnpm

### 2. Run Automated Tests
Execute the unit test suite verifying conflict detection, fixture generation, standings calculation, and iCalendar export:
```bash
npm test
```
*Output: All 17 automated tests passing (21 assertions).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 7. Iqra University Brand Identity Tokens

- **Navy Primary:** `#0B3C8C`
- **Dark Navy Background:** `#08265E`
- **University Gold Accent:** `#F2B705` (Trophies, Highlights, Badges)
- **Live Crimson Alert:** `#D92D20`
- **Success Emerald:** `#12B76A`
- **Typography:** Serif headings (*Playfair Display*) paired with academic body font (*Inter*).
