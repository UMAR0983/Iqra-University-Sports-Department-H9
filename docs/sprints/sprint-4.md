# Sprint 4 Review & Retrospective: Auto-Schedule, Referees & Live Scoring

**Velocity Target:** 42 SP | **SP Delivered:** 42 SP

## 1. Sprint Goal
Implement greedy auto-scheduling solver, referee officiating console with live timeline events, real-time score propagation, and venue maintenance blocks.

## 2. Committed Stories & Status
| Story ID | User Story | SP | Status | Acceptance Criteria / DoD |
|---|---|---|---|---|
| US-603 | Auto-scheduler for tournament fixtures | 13 | DONE | Assigns earliest conflict-free slots across campus venues |
| US-402 | Block venue for maintenance | 3 | DONE | Maintenance blocks prevent scheduling; flags clashes |
| US-701 | Referee scoring console with timeline | 8 | DONE | Goal, Point, Run, Yellow/Red Card, Foul buttons + Undo |
| US-702 | Spectator live updates without page refresh | 5 | DONE | `/live` page synchronizes in real time with scoring events |
| US-703 | Referee match report & final closure | 3 | DONE | Man of the Match, summary comments, locks match result |

## 3. Sprint Burndown Table
| Day | Remaining SP (Ideal) | Remaining SP (Actual) |
|---|---|---|
| Day 1 | 42 | 42 |
| Day 3 | 31 | 29 |
| Day 5 | 20 | 18 |
| Day 7 | 10 | 7 |
| Day 10 | 0 | 0 |

## 4. Sprint Review Notes
- Built `/dashboard/referee` with live scoreboard, team action buttons, elapsed minute timer, and Undo functionality.
- Built `/live` match center featuring giant stadium scoreboard and real-time commentary timeline.
- Verified auto-scheduling engine in automated test suite with simulated fixtures.

## 5. Sprint Retrospective
- **What went well:** The live match console gives scorers an intuitive and fast interface during games.
- **What didn't:** Needed clear undo handling to prevent accidental double-clicks on score buttons.
- **Actions for Next Sprint:** Complete Standings points table, Notifications inbox, and Announcements.
