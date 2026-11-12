# Sprint 5 Review & Retrospective: Standings, Notifications & Announcements

**Velocity Target:** 32 SP | **SP Delivered:** 32 SP

## 1. Sprint Goal
Implement real-time points table standings computation with multi-tier tiebreakers, in-app notifications inbox, match reminder cron job, and campus announcements board.

## 2. Committed Stories & Status
| Story ID | User Story | SP | Status | Acceptance Criteria / DoD |
|---|---|---|---|---|
| US-801 | Points table per tournament with tiebreakers | 5 | DONE | Points (W=3, D=1, L=0), GD, GF, and head-to-head ranking |
| US-802 | Leaderboards & top performers | 5 | DONE | Aggregated goals and match MVP records |
| US-803 | Head-to-head match history | 3 | DONE | Direct clash comparison incorporated into sorting rules |
| US-901 | In-app notification center | 5 | DONE | Navbar bell badge, unread count, and mark-as-read in `/dashboard/player` |
| US-902 | 24h & 1h automated reminder cron | 5 | DONE | Supabase Edge function authored in `supabase/functions/send-reminders` |
| US-903 | Sports admin announcement board | 3 | DONE | Sticky announcements on home and notice ticker |
| US-904 | Subscriptions & follow teams | 3 | DONE | Automated alerts dispatched on match schedule changes |

## 3. Sprint Burndown Table
| Day | Remaining SP (Ideal) | Remaining SP (Actual) |
|---|---|---|
| Day 1 | 32 | 32 |
| Day 3 | 24 | 22 |
| Day 5 | 15 | 13 |
| Day 8 | 6 | 4 |
| Day 10 | 0 | 0 |

## 4. Sprint Review Notes
- Built `src/lib/standings.ts` and automated test verification for 3-point win, 1-point draw, and goal difference calculations.
- Integrated announcements board into homepage hero section and sports admin dashboard.
- Configured notification badge counter in navbar with reactive store subscription.

## 5. Sprint Retrospective
- **What went well:** Points table updates dynamically whenever a match is finished by referee console.
- **What didn't:** Edge function requires Supabase service role key for cron execution in production environments.
- **Actions for Next Sprint:** Final sprint (Admin KPIs, CSV/PDF reports, PWA manifest, hardening, and final demo packaging).
