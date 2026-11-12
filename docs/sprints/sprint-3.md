# Sprint 3 Review & Retrospective: Scheduling Engine & Calendar (CORE)

**Velocity Target:** 39 SP | **SP Delivered:** 39 SP

## 1. Sprint Goal
Develop the core conflict-detection engine, fixture generator algorithms, conflict-free match scheduling forms, calendar views, and RFC 5545 iCalendar (`.ics`) export.

## 2. Committed Stories & Status
| Story ID | User Story | SP | Status | Acceptance Criteria / DoD |
|---|---|---|---|---|
| US-504 | Auto-generate fixtures from tournament format | 8 | DONE | Round-robin circle method + BYE, Knockout bracket, Group+Knockout |
| US-601 | Admin manual match creation form | 5 | DONE | Interactive form with team, venue, time range, and round name |
| US-602 | Real-time conflict warnings | 8 | DONE | Venue clash, team clash, and academic blackout hour warnings |
| US-604 | Reschedule/postpone matches with reason | 5 | DONE | Updates status and auto-dispatches notifications |
| US-605 | Multi-view calendar (Day/Week/Month/List) | 8 | DONE | Filter by sport, team, venue, and status |
| US-606 | Export schedule to iCalendar (.ics) | 3 | DONE | `/api/calendar` serves RFC 5545 valid calendar attachment |
| US-607 | Referee assignment clash prevention | 2 | DONE | Prevent duplicate referee allocation |

## 3. Sprint Burndown Table
| Day | Remaining SP (Ideal) | Remaining SP (Actual) |
|---|---|---|
| Day 1 | 39 | 39 |
| Day 3 | 28 | 26 |
| Day 5 | 18 | 16 |
| Day 7 | 10 | 8 |
| Day 10 | 0 | 0 |

## 4. Sprint Review Notes
- Built `src/lib/fixtures.ts` supporting Round Robin, Knockout, and Group+Knockout.
- Built `src/lib/scheduler.ts` enforcing operating hours, blackout hours, venue collisions, and team collisions.
- Built `src/lib/ics.ts` producing valid `.ics` streams importable into Apple Calendar, Google Calendar, and Outlook.
- Automated test suite verified 100% pass on fixture pairs, bye handling, and conflict detection.

## 5. Sprint Retrospective
- **What went well:** Scheduling core unit tests achieved 100% pass rate.
- **What didn't:** Timezone offset parsing required UTC normalization for ISO timestamps.
- **Actions for Next Sprint:** Build auto-scheduling greedy solver, referee live scoring console, and real-time spectators view.
