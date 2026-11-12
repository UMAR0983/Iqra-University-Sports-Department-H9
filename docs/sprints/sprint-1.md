# Sprint 1 Review & Retrospective: Auth, Sports & Venues

**Velocity Target:** 25 SP | **SP Delivered:** 25 SP

## 1. Sprint Goal
Implement user authentication with university email validation (`@iqra.edu.pk`), role-based access control, the full sports catalogue, and venue resources.

## 2. Committed Stories & Status
| Story ID | User Story | SP | Status | Acceptance Criteria / DoD |
|---|---|---|---|---|
| US-101 | Student registration with `@iqra.edu.pk` | 5 | DONE | Domain validation enforced; profile created |
| US-102 | User login/logout and session management | 3 | DONE | Valid credentials redirect to role dashboard; demo fast login available |
| US-103 | Super admin role assignment & audit logging | 3 | DONE | Dynamic role switching bar and state updates |
| US-104 | Profile viewing & editing | 2 | DONE | Player profiles show department, semester, student ID |
| US-201 | Add/edit/deactivate sports | 3 | DONE | Zod validation applied on sports catalogue schema |
| US-202 | Student browse sports grid | 3 | DONE | Categorized by indoor, outdoor, esports with search |
| US-203 | Sport detail page with rules & team size | 3 | DONE | Rulebook modal with squad limits and gender categories |
| US-401 | Campus venues management & hours | 3 | DONE | Main Cricket Ground, Futsal Court, Hall A, Basketball Arena |

## 3. Sprint Burndown Table
| Day | Remaining SP (Ideal) | Remaining SP (Actual) |
|---|---|---|
| Day 1 | 25 | 25 |
| Day 3 | 18 | 17 |
| Day 5 | 12 | 10 |
| Day 8 | 5 | 4 |
| Day 10 | 0 | 0 |

## 4. Sprint Review Notes
- Built `/sports` page with live search, category pills, and official rules viewer.
- Built `/venues` page showing capacity, operating hours (08:00 - 22:00), and campus facility details.
- Integrated demo role switcher in the navbar allowing one-click role preview.

## 5. Sprint Retrospective
- **What went well:** Domain validation logic and interactive sports rulebook modal received great feedback.
- **What didn't:** Need to make sure coaches have an easy way to view player applications for their specific team.
- **Actions for Next Sprint:** Deliver Sprint 2 stories (Teams, Rosters, and Tournaments).
