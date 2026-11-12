-- ============================================================
-- IU SPORTS HUB — Database Migration
-- Version: 1.0 (Initial Schema, RLS, Conflicts & Standings)
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists btree_gist;

-- 1. ENUMS
do $$ begin
  create type user_role as enum ('super_admin','sports_admin','coach','referee','player','spectator');
exception when duplicate_object then null; end $$;

do $$ begin
  create type sport_category as enum ('outdoor','indoor','esports','athletics');
exception when duplicate_object then null; end $$;

do $$ begin
  create type gender_cat as enum ('male','female','mixed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tournament_format as enum ('round_robin','knockout','group_knockout','league');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tournament_status as enum ('draft','registration_open','ongoing','completed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type match_status as enum ('scheduled','live','completed','postponed','cancelled','walkover');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reg_status as enum ('pending','approved','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notif_type as enum ('schedule_change','reminder','result','announcement','approval','system');
exception when duplicate_object then null; end $$;

-- 2. USERS / PROFILES
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text not null,
  student_id text unique,
  department text,
  semester int,
  phone text,
  avatar_url text,
  role user_role not null default 'spectator',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 3. SPORTS
create table if not exists sports (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  category sport_category not null default 'outdoor',
  gender gender_cat default 'mixed',
  team_size int not null default 1,
  rules text,
  icon text,
  banner_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 4. TEAMS
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid references sports(id) on delete cascade,
  name text not null,
  short_name text,
  logo_url text,
  primary_color text default '#0B3C8C',
  department text,
  coach_id uuid references profiles(id),
  captain_id uuid references profiles(id),
  is_active boolean default true,
  created_at timestamptz default now(),
  unique (sport_id, name)
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  player_id uuid references profiles(id) on delete cascade,
  jersey_no int,
  position text,
  status reg_status default 'pending',
  joined_at timestamptz default now(),
  unique (team_id, player_id),
  unique (team_id, jersey_no)
);

-- 5. VENUES
create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  location text,
  capacity int,
  supported_sport_ids uuid[] default '{}',
  open_time time default '08:00',
  close_time time default '20:00',
  is_active boolean default true
);

create table if not exists venue_blocks (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references venues(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  check (ends_at > starts_at)
);

-- 6. TOURNAMENTS
create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid references sports(id),
  name text not null,
  season text,
  format tournament_format not null,
  status tournament_status default 'draft',
  start_date date,
  end_date date,
  reg_open date,
  reg_close date,
  max_teams int default 16,
  points_win int default 3,
  points_draw int default 1,
  points_loss int default 0,
  description text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists tournament_teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references tournaments(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  group_name text,
  status reg_status default 'pending',
  seed int,
  unique (tournament_id, team_id)
);

-- 7. MATCHES (CORE)
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references tournaments(id) on delete cascade,
  sport_id uuid references sports(id),
  round text,
  match_no int,
  home_team_id uuid references teams(id),
  away_team_id uuid references teams(id),
  venue_id uuid references venues(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status match_status default 'scheduled',
  home_score numeric default 0,
  away_score numeric default 0,
  winner_team_id uuid references teams(id),
  result_summary text,
  man_of_match uuid references profiles(id),
  postponed_reason text,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  check (ends_at > starts_at),
  check (home_team_id <> away_team_id)
);

create index if not exists idx_matches_starts_at on matches (starts_at);
create index if not exists idx_matches_venue_time on matches (venue_id, starts_at, ends_at);

-- 7.1 Venue overlap constraint (PostgreSQL btree_gist)
do $$ begin
  alter table matches add constraint no_venue_overlap
    exclude using gist (
      venue_id with =,
      tstzrange(starts_at, ends_at) with &&
    ) where (status not in ('cancelled','postponed'));
exception when duplicate_object then null;
end $$;

-- 8. MATCH OFFICIALS & EVENTS
create table if not exists match_officials (
  match_id uuid references matches(id) on delete cascade,
  referee_id uuid references profiles(id),
  official_role text default 'referee',
  primary key (match_id, referee_id)
);

create table if not exists match_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  team_id uuid references teams(id),
  player_id uuid references profiles(id),
  event_type text not null,
  minute int,
  value numeric default 1,
  note text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- 9. ANNOUNCEMENTS, NOTIFICATIONS & SUBSCRIPTIONS
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  sport_id uuid references sports(id),
  is_pinned boolean default false,
  expires_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type notif_type not null,
  title text not null,
  body text,
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  user_id uuid references profiles(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  sport_id uuid references sports(id) on delete cascade,
  primary key (user_id, coalesce(team_id, '00000000-0000-0000-0000-000000000000'::uuid), coalesce(sport_id,'00000000-0000-0000-0000-000000000000'::uuid))
);

-- 10. AUDIT LOGS & SETTINGS
create table if not exists audit_logs (
  id bigserial primary key,
  actor_id uuid references profiles(id),
  action text,
  entity text,
  entity_id uuid,
  diff jsonb,
  created_at timestamptz default now()
);

create table if not exists settings (
  key text primary key,
  value jsonb
);

-- Default settings
insert into settings (key, value)
values
  ('blackout_hours', '[{"day":"Mon-Fri","from":"09:00","to":"13:00"}]'::jsonb),
  ('min_rest_hours', '24'::jsonb),
  ('allowed_domains', '["iqra.edu.pk"]'::jsonb)
on conflict (key) do nothing;

-- 11. CONFLICT DETECTION FUNCTION
create or replace function check_match_conflicts(
  p_venue uuid,
  p_home uuid,
  p_away uuid,
  p_start timestamptz,
  p_end timestamptz,
  p_exclude uuid default null
) returns table(conflict_type text, ref_id uuid, details text) language sql as $$
  -- Venue overlap
  select 'venue'::text, m.id, 'Venue is already booked for another match'::text
  from matches m
  where m.venue_id = p_venue
    and m.status not in ('cancelled','postponed')
    and tstzrange(m.starts_at, m.ends_at) && tstzrange(p_start, p_end)
    and (p_exclude is null or m.id <> p_exclude)

  union all

  -- Team overlap (home or away playing elsewhere)
  select 'team'::text, m.id, 'Team is already scheduled in another match at this time'::text
  from matches m
  where (m.home_team_id in (p_home, p_away) or m.away_team_id in (p_home, p_away))
    and m.status not in ('cancelled','postponed')
    and tstzrange(m.starts_at, m.ends_at) && tstzrange(p_start, p_end)
    and (p_exclude is null or m.id <> p_exclude)

  union all

  -- Venue maintenance/blackout block
  select 'venue_block'::text, b.id, coalesce(b.reason, 'Venue is closed for maintenance')::text
  from venue_blocks b
  where b.venue_id = p_venue
    and tstzrange(b.starts_at, b.ends_at) && tstzrange(p_start, p_end);
$$;

-- 12. STANDINGS VIEW
drop view if exists standings cascade;
create view standings as
select
  tt.tournament_id,
  tt.team_id,
  tt.group_name,
  count(m.id) filter (where m.status = 'completed') as played,
  count(m.id) filter (where m.status = 'completed' and m.winner_team_id = tt.team_id) as won,
  count(m.id) filter (where m.status = 'completed' and m.winner_team_id is null and (m.home_score = m.away_score)) as drawn,
  count(m.id) filter (where m.status = 'completed' and m.winner_team_id is not null and m.winner_team_id <> tt.team_id) as lost,
  coalesce(sum(case
    when m.status = 'completed' and m.home_team_id = tt.team_id then m.home_score
    when m.status = 'completed' and m.away_team_id = tt.team_id then m.away_score
    else 0 end), 0) as goals_for,
  coalesce(sum(case
    when m.status = 'completed' and m.home_team_id = tt.team_id then m.away_score
    when m.status = 'completed' and m.away_team_id = tt.team_id then m.home_score
    else 0 end), 0) as goals_against,
  (coalesce(sum(case
    when m.status = 'completed' and m.home_team_id = tt.team_id then m.home_score
    when m.status = 'completed' and m.away_team_id = tt.team_id then m.away_score
    else 0 end), 0) -
   coalesce(sum(case
    when m.status = 'completed' and m.home_team_id = tt.team_id then m.away_score
    when m.status = 'completed' and m.away_team_id = tt.team_id then m.home_score
    else 0 end), 0)) as goal_diff,
  (count(m.id) filter (where m.status = 'completed' and m.winner_team_id = tt.team_id) * coalesce(tour.points_win, 3) +
   count(m.id) filter (where m.status = 'completed' and m.winner_team_id is null and (m.home_score = m.away_score)) * coalesce(tour.points_draw, 1)) as points
from tournament_teams tt
join tournaments tour on tour.id = tt.tournament_id
left join matches m on m.tournament_id = tt.tournament_id
  and (m.home_team_id = tt.team_id or m.away_team_id = tt.team_id)
where tt.status = 'approved'
group by tt.tournament_id, tt.team_id, tt.group_name, tour.points_win, tour.points_draw;

-- 13. ROW LEVEL SECURITY (RLS)
alter table profiles enable row level security;
alter table sports enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;
alter table venues enable row level security;
alter table venue_blocks enable row level security;
alter table tournaments enable row level security;
alter table tournament_teams enable row level security;
alter table matches enable row level security;
alter table match_officials enable row level security;
alter table match_events enable row level security;
alter table announcements enable row level security;
alter table notifications enable row level security;
alter table subscriptions enable row level security;
alter table audit_logs enable row level security;
alter table settings enable row level security;

-- Helper function
create or replace function has_role(r user_role) returns boolean language sql security definer as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = r
  );
$$;

create or replace function is_admin_or_sports_officer() returns boolean language sql security definer as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role in ('super_admin', 'sports_admin')
  );
$$;

-- RLS Policies: Public read on catalogue, matches, sports, venues, tournaments, teams
create policy "Public read sports" on sports for select using (true);
create policy "Admin manage sports" on sports for all using (is_admin_or_sports_officer());

create policy "Public read venues" on venues for select using (true);
create policy "Admin manage venues" on venues for all using (is_admin_or_sports_officer());

create policy "Public read teams" on teams for select using (true);
create policy "Admin/Coach manage teams" on teams for all using (
  is_admin_or_sports_officer() or coach_id = auth.uid()
);

create policy "Public read tournaments" on tournaments for select using (true);
create policy "Admin manage tournaments" on tournaments for all using (is_admin_or_sports_officer());

create policy "Public read tournament_teams" on tournament_teams for select using (true);
create policy "Admin/Coach manage tournament_teams" on tournament_teams for all using (
  is_admin_or_sports_officer() or exists (
    select 1 from teams where teams.id = tournament_teams.team_id and teams.coach_id = auth.uid()
  )
);

create policy "Public read matches" on matches for select using (true);
create policy "Admin manage matches" on matches for all using (is_admin_or_sports_officer());

create policy "Public read match_events" on match_events for select using (true);
create policy "Official/Admin insert match_events" on match_events for insert with check (
  is_admin_or_sports_officer() or exists (
    select 1 from match_officials mo where mo.match_id = match_events.match_id and mo.referee_id = auth.uid()
  )
);

create policy "Public read announcements" on announcements for select using (true);
create policy "Admin manage announcements" on announcements for all using (is_admin_or_sports_officer());

create policy "Users read own notifications" on notifications for select using (user_id = auth.uid());
create policy "Users update own notifications" on notifications for update using (user_id = auth.uid());

create policy "Super admin read audit_logs" on audit_logs for select using (has_role('super_admin'));
