-- ============================================================
-- IU SPORTS HUB — Seed Data for Demo & Testing
-- ============================================================

-- 1. DEMO USERS (PROFILES)
-- Passwords for auth.users in demo: DemoPass123!
insert into profiles (id, email, full_name, student_id, department, semester, phone, role)
values
  ('11111111-1111-1111-1111-111111111111', 'admin@iqra.edu.pk', 'Dr. Tariq Mahmood (Director Sports)', 'ADMIN-001', 'Sports Directorate', null, '+92-300-1112233', 'super_admin'),
  ('22222222-2222-2222-2222-222222222222', 'ayesha.sports@iqra.edu.pk', 'Ayesha Khan (Sports Officer)', 'ADMIN-002', 'Sports Directorate', null, '+92-300-2223344', 'sports_admin'),
  ('33333333-3333-3333-3333-333333333333', 'coach.hamza@iqra.edu.pk', 'Hamza Ali (Coach)', 'FAC-CS-101', 'Computer Science', null, '+92-300-3334455', 'coach'),
  ('44444444-4444-4444-4444-444444444444', 'referee.bilal@iqra.edu.pk', 'Bilal Ahmed (Official Referee)', 'REF-001', 'Physical Education', null, '+92-300-4445566', 'referee'),
  ('55555555-5555-5555-5555-555555555555', 'player.zain@iqra.edu.pk', 'Zain Ul Abideen', 'IU-CS-2023-412', 'Computer Science', 6, '+92-300-5556677', 'player'),
  ('66666666-6666-6666-6666-666666666666', 'sara.student@iqra.edu.pk', 'Sara Siddiqui', 'IU-BBA-2024-108', 'Management Sciences', 4, '+92-300-6667788', 'spectator')
on conflict (id) do update set full_name = excluded.full_name, role = excluded.role;

-- 2. SPORTS CATALOGUE
insert into sports (id, name, slug, category, gender, team_size, rules, icon)
values
  ('a1111111-0000-0000-0000-000000000001', 'Cricket', 'cricket', 'outdoor', 'male', 11, 'Standard T20 tape-ball/hard-ball rules, 20 overs per innings, powerplay 1-6.', 'cricket'),
  ('a1111111-0000-0000-0000-000000000002', 'Football', 'football', 'outdoor', 'male', 11, 'FIFA standard 11-a-side, two halves of 45 minutes.', 'football'),
  ('a1111111-0000-0000-0000-000000000003', 'Futsal', 'futsal', 'indoor', 'mixed', 5, '5-a-side indoor rules, two 20-minute halves, running clock.', 'futsal'),
  ('a1111111-0000-0000-0000-000000000004', 'Basketball', 'basketball', 'indoor', 'mixed', 5, '4 quarters of 10 minutes, 24-second shot clock.', 'basketball'),
  ('a1111111-0000-0000-0000-000000000005', 'Volleyball', 'volleyball', 'indoor', 'mixed', 6, 'Best of 3 sets to 25 points, decider set to 15.', 'volleyball'),
  ('a1111111-0000-0000-0000-000000000006', 'Badminton', 'badminton', 'indoor', 'mixed', 2, 'Best of 3 games of 21 points, BWF scoring system.', 'badminton'),
  ('a1111111-0000-0000-0000-000000000007', 'Table Tennis', 'table-tennis', 'indoor', 'mixed', 2, 'ITTF 11 points per game, best of 5 games.', 'table-tennis'),
  ('a1111111-0000-0000-0000-000000000008', 'Chess', 'chess', 'indoor', 'mixed', 1, 'FIDE rapid time control 15+10 increment.', 'chess')
on conflict (id) do nothing;

-- 3. VENUES
insert into venues (id, name, location, capacity, open_time, close_time, is_active)
values
  ('b1111111-0000-0000-0000-000000000001', 'Main Cricket Ground', 'Iqra Sector H-9 Main Complex', 1500, '08:00', '19:00', true),
  ('b1111111-0000-0000-0000-000000000002', 'Futsal Turf Court', 'Sports Pavilion, East Wing', 300, '08:00', '22:00', true),
  ('b1111111-0000-0000-0000-000000000003', 'Indoor Sports Hall (Court A)', 'Student Activity Center, Level 1', 500, '08:00', '21:00', true),
  ('b1111111-0000-0000-0000-000000000004', 'Basketball Arena', 'Outdoor Courts, North Wing', 400, '08:00', '20:00', true)
on conflict (id) do nothing;

-- 4. TEAMS
insert into teams (id, sport_id, name, short_name, primary_color, department, coach_id)
values
  ('c1111111-0000-0000-0000-000000000001', 'a1111111-0000-0000-0000-000000000003', 'FCS Titans', 'TITANS', '#0B3C8C', 'Computer Science', '33333333-3333-3333-3333-333333333333'),
  ('c1111111-0000-0000-0000-000000000002', 'a1111111-0000-0000-0000-000000000003', 'Business Blazers', 'BLAZERS', '#D92D20', 'Management Sciences', '33333333-3333-3333-3333-333333333333'),
  ('c1111111-0000-0000-0000-000000000003', 'a1111111-0000-0000-0000-000000000003', 'Engineering Eagles', 'EAGLES', '#12B76A', 'Engineering & Tech', null),
  ('c1111111-0000-0000-0000-000000000004', 'a1111111-0000-0000-0000-000000000003', 'Media Mavericks', 'MAVERICKS', '#F2B705', 'Media Studies', null),
  ('c1111111-0000-0000-0000-000000000005', 'a1111111-0000-0000-0000-000000000003', 'AI Avengers', 'AVENGERS', '#7A5AF8', 'Artificial Intelligence', null),
  ('c1111111-0000-0000-0000-000000000006', 'a1111111-0000-0000-0000-000000000003', 'Law Lions', 'LIONS', '#F04438', 'Faculty of Law', null),
  ('c1111111-0000-0000-0000-000000000007', 'a1111111-0000-0000-0000-000000000003', 'Pharm Panthers', 'PANTHERS', '#0BA5EC', 'Pharmacy', null),
  ('c1111111-0000-0000-0000-000000000008', 'a1111111-0000-0000-0000-000000000003', 'Design Dragons', 'DRAGONS', '#EE46BC', 'Fashion & Design', null)
on conflict (id) do nothing;

-- 4.1 Team Members (Roster)
insert into team_members (team_id, player_id, jersey_no, position, status)
values
  ('c1111111-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 7, 'Forward / Striker', 'approved')
on conflict (team_id, player_id) do nothing;

-- 5. TOURNAMENT: IU Premier League 2027
insert into tournaments (
  id, sport_id, name, season, format, status, start_date, end_date, reg_open, reg_close, max_teams, points_win, points_draw, points_loss, description, created_by
) values (
  'd1111111-0000-0000-0000-000000000001',
  'a1111111-0000-0000-0000-000000000003', -- Futsal
  'IU Premier League 2027',
  'Spring 2027',
  'round_robin',
  'ongoing',
  '2027-03-01',
  '2027-03-25',
  '2027-02-01',
  '2027-02-28',
  8,
  3, 1, 0,
  'The flagship annual inter-department futsal tournament of Iqra University Islamabad campus.',
  '22222222-2222-2222-2222-222222222222'
) on conflict (id) do nothing;

-- Register teams to tournament
insert into tournament_teams (tournament_id, team_id, group_name, status, seed)
values
  ('d1111111-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000001', 'Group A', 'approved', 1),
  ('d1111111-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000002', 'Group A', 'approved', 2),
  ('d1111111-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000003', 'Group A', 'approved', 3),
  ('d1111111-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000004', 'Group A', 'approved', 4)
on conflict (tournament_id, team_id) do nothing;

-- 6. MATCHES: Completed, Live & Upcoming
insert into matches (
  id, tournament_id, sport_id, round, match_no, home_team_id, away_team_id, venue_id, starts_at, ends_at, status, home_score, away_score, winner_team_id, result_summary, created_by
) values
  -- Completed Match 1: Titans 4 - 2 Blazers
  (
    'e1111111-0000-0000-0000-000000000001',
    'd1111111-0000-0000-0000-000000000001',
    'a1111111-0000-0000-0000-000000000003',
    'Round 1',
    1,
    'c1111111-0000-0000-0000-000000000001', -- FCS Titans
    'c1111111-0000-0000-0000-000000000002', -- Business Blazers
    'b1111111-0000-0000-0000-000000000002', -- Futsal Turf
    now() - interval '2 days',
    now() - interval '2 days' + interval '1 hour',
    'completed',
    4, 2,
    'c1111111-0000-0000-0000-000000000001',
    'FCS Titans won by 4 goals to 2 in an exhilarating opening fixture.',
    '22222222-2222-2222-2222-222222222222'
  ),
  -- LIVE Match: Engineering Eagles vs Media Mavericks
  (
    'e1111111-0000-0000-0000-000000000002',
    'd1111111-0000-0000-0000-000000000001',
    'a1111111-0000-0000-0000-000000000003',
    'Round 1',
    2,
    'c1111111-0000-0000-0000-000000000003', -- Eagles
    'c1111111-0000-0000-0000-000000000004', -- Mavericks
    'b1111111-0000-0000-0000-000000000002', -- Futsal Turf
    now() - interval '15 minutes',
    now() + interval '45 minutes',
    'live',
    2, 1,
    null,
    'High intensity clash currently in 2nd half.',
    '22222222-2222-2222-2222-222222222222'
  ),
  -- Upcoming Match: Titans vs Eagles
  (
    'e1111111-0000-0000-0000-000000000003',
    'd1111111-0000-0000-0000-000000000001',
    'a1111111-0000-0000-0000-000000000003',
    'Round 2',
    3,
    'c1111111-0000-0000-0000-000000000001', -- Titans
    'c1111111-0000-0000-0000-000000000003', -- Eagles
    'b1111111-0000-0000-0000-000000000002',
    now() + interval '1 day' + interval '2 hours',
    now() + interval '1 day' + interval '3 hours',
    'scheduled',
    0, 0,
    null,
    null,
    '22222222-2222-2222-2222-222222222222'
  )
on conflict (id) do nothing;

-- 7. MATCH EVENTS (for the live match)
insert into match_events (match_id, team_id, player_id, event_type, minute, value, note, created_by)
values
  ('e1111111-0000-0000-0000-000000000002', 'c1111111-0000-0000-0000-000000000003', null, 'goal', 12, 1, 'Spectacular left-footed strike outside penalty area', '44444444-4444-4444-4444-444444444444'),
  ('e1111111-0000-0000-0000-000000000002', 'c1111111-0000-0000-0000-000000000004', null, 'goal', 19, 1, 'Tapped in from close range after rebound', '44444444-4444-4444-4444-444444444444'),
  ('e1111111-0000-0000-0000-000000000002', 'c1111111-0000-0000-0000-000000000003', null, 'goal', 28, 1, 'Header from corner kick', '44444444-4444-4444-4444-444444444444');

-- 8. ANNOUNCEMENTS
insert into announcements (title, body, is_pinned, created_by)
values
  ('Welcome to IU Sports Hub 2027!', 'The official sports management platform for Iqra University is now live. Check live scores, match fixtures, and tournament standings.', true, '11111111-1111-1111-1111-111111111111'),
  ('IU Premier League 2027 Ongoing', 'Group stage matches are underway at the Futsal Turf Court. Come support your department!', true, '22222222-2222-2222-2222-222222222222');
