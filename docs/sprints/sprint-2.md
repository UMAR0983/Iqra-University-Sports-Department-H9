# Sprint 2 Review & Retrospective: Teams, Players & Tournaments

**Velocity Target:** 30 SP | **SP Delivered:** 30 SP

## 1. Sprint Goal
Build department teams management, roster squads with jersey numbers, student join request workflow, and tournament creation with format specifications.

## 2. Committed Stories & Status
| Story ID | User Story | SP | Status | Acceptance Criteria / DoD |
|---|---|---|---|---|
| US-301 | Team creation with department, colors & coach | 3 | DONE | 8 faculty teams created (Titans, Blazers, Eagles, Mavericks, etc.) |
| US-302 | Student athlete request to join team | 5 | DONE | Join request modal with jersey number and position selection |
| US-303 | Coach roster management & approval queue | 3 | DONE | `/dashboard/coach` lists pending applications with 1-click approval |
| US-304 | Team detail pages with department badges | 5 | DONE | `/teams` grid with colors, logos, and coach assignments |
| US-501 | Create tournament with format & points rules | 5 | DONE | Round-robin, knockout, group+knockout formats configured |
| US-502 | Team registration into open tournament | 3 | DONE | Team registration modal with confirmation feedback |
| US-503 | Admin approval queue for tournament teams | 3 | DONE | Approved teams automatically populate standings table |

## 3. Sprint Burndown Table
| Day | Remaining SP (Ideal) | Remaining SP (Actual) |
|---|---|---|
| Day 1 | 30 | 30 |
| Day 3 | 22 | 20 |
| Day 6 | 14 | 12 |
| Day 8 | 6 | 4 |
| Day 10 | 0 | 0 |

## 4. Sprint Review Notes
- Delivered `/teams` and `/dashboard/coach` with real-time approval of player requests.
- Seeded 8 university faculty squads with distinctive primary brand colors.
- Seeded "IU Premier League 2027" tournament with ongoing status.

## 5. Sprint Retrospective
- **What went well:** Clean separation of concerns between Coach and Student roles.
- **What didn't:** Complex conflict validation is needed for scheduling which is the focus of Sprint 3.
- **Actions for Next Sprint:** Dedicate full velocity to the core conflict engine and calendar scheduler.
