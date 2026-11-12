# Sprint 0 Review & Retrospective: Foundation & Setup

**Dates:** Sprint Week 0 | **Velocity Target:** 3 SP | **SP Delivered:** 3 SP

## 1. Sprint Goal
Initialize the repository, design system tokens, Next.js 14 App Router project skeleton, database schema migrations, and CI pipeline.

## 2. Committed Stories & Status
| Story ID | User Story | SP | Status | DoD Notes |
|---|---|---|---|---|
| US-1101 | CI pipeline (lint, test, build) & Project Scaffolding | 3 | DONE | GitHub Actions CI configured, Next.js + Tailwind configured with IU theme tokens |

## 3. Sprint Burndown Table
| Day | Remaining SP (Ideal) | Remaining SP (Actual) |
|---|---|---|
| Day 1 | 3 | 3 |
| Day 2 | 2 | 2 |
| Day 3 | 0 | 0 |

## 4. Sprint Review Notes
- Initialized Next.js 14 App Router project with TypeScript strict mode.
- Configured Iqra University design system tokens (Navy `#08265E`, Primary `#0B3C8C`, Gold `#F2B705`, Red `#D92D20`, Green `#12B76A`).
- Authored initial PostgreSQL migrations in `/supabase/migrations/20261111_init.sql` with enums, exclusion constraints (`btree_gist`), and standings view.
- Added seed dataset in `/supabase/seed.sql` for 8 sports, 4 venues, 8 teams, and the flagship IU Premier League 2027.

## 5. Sprint Retrospective
- **What went well:** Project scaffolding and PostgreSQL schema matching university requirements completed smoothly.
- **What didn't:** Initial package synchronization needed adjustment for Windows sandbox environment.
- **Actions for Next Sprint:** Jump straight into Sprint 1 (Auth, Sports Catalogue, and Venues Management).
