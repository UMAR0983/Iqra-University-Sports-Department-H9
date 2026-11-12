export type UserRole = 'super_admin' | 'sports_admin' | 'coach' | 'referee' | 'player' | 'spectator';
export type SportCategory = 'outdoor' | 'indoor' | 'esports' | 'athletics';
export type GenderCat = 'male' | 'female' | 'mixed';
export type TournamentFormat = 'round_robin' | 'knockout' | 'group_knockout' | 'league';
export type TournamentStatus = 'draft' | 'registration_open' | 'ongoing' | 'completed' | 'cancelled';
export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled' | 'walkover';
export type RegStatus = 'pending' | 'approved' | 'rejected';
export type NotifType = 'schedule_change' | 'reminder' | 'result' | 'announcement' | 'approval' | 'system';

export interface Profile {
  id: string;
  email?: string;
  full_name: string;
  student_id?: string;
  department?: string;
  semester?: number;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  is_active?: boolean;
  created_at?: string;
}

export interface Sport {
  id: string;
  name: string;
  slug: string;
  category: SportCategory;
  gender: GenderCat;
  team_size: number;
  rules?: string;
  icon?: string;
  banner_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Venue {
  id: string;
  name: string;
  location?: string;
  capacity?: number;
  supported_sport_ids?: string[];
  open_time?: string;
  close_time?: string;
  is_active: boolean;
}

export interface VenueBlock {
  id: string;
  venue_id: string;
  starts_at: string;
  ends_at: string;
  reason?: string;
}

export interface Team {
  id: string;
  sport_id: string;
  name: string;
  short_name?: string;
  logo_url?: string;
  primary_color: string;
  department?: string;
  coach_id?: string;
  captain_id?: string;
  is_active: boolean;
  created_at?: string;
  coach?: Profile;
  captain?: Profile;
  sport?: Sport;
}

export interface TeamMember {
  id: string;
  team_id: string;
  player_id: string;
  jersey_no?: number;
  position?: string;
  status: RegStatus;
  joined_at?: string;
  player?: Profile;
}

export interface Tournament {
  id: string;
  sport_id: string;
  name: string;
  season?: string;
  format: TournamentFormat;
  status: TournamentStatus;
  start_date?: string;
  end_date?: string;
  reg_open?: string;
  reg_close?: string;
  max_teams: number;
  points_win: number;
  points_draw: number;
  points_loss: number;
  description?: string;
  created_by?: string;
  created_at?: string;
  sport?: Sport;
}

export interface TournamentTeam {
  id: string;
  tournament_id: string;
  team_id: string;
  group_name?: string;
  status: RegStatus;
  seed?: number;
  team?: Team;
}

export interface Match {
  id: string;
  tournament_id?: string;
  sport_id?: string;
  round?: string;
  match_no?: number;
  home_team_id: string;
  away_team_id: string;
  venue_id: string;
  starts_at: string;
  ends_at: string;
  status: MatchStatus;
  home_score: number;
  away_score: number;
  winner_team_id?: string | null;
  result_summary?: string | null;
  man_of_match?: string | null;
  postponed_reason?: string | null;
  created_by?: string;
  created_at?: string;
  home_team?: Team;
  away_team?: Team;
  venue?: Venue;
  sport?: Sport;
  tournament?: Tournament;
}

export interface MatchEvent {
  id: string;
  match_id: string;
  team_id?: string;
  player_id?: string;
  event_type: 'goal' | 'wicket' | 'run' | 'yellow_card' | 'red_card' | 'point' | 'foul';
  minute?: number;
  value: number;
  note?: string;
  created_by?: string;
  created_at?: string;
  player?: Profile;
  team?: Team;
}

export interface Announcement {
  id: string;
  title: string;
  body?: string;
  sport_id?: string;
  is_pinned: boolean;
  expires_at?: string;
  created_by?: string;
  created_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotifType;
  title: string;
  body?: string;
  link?: string;
  is_read: boolean;
  created_at?: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflicts: {
    type: 'venue' | 'team' | 'referee' | 'venue_block' | 'blackout' | 'rest_time';
    message: string;
    ref_id?: string;
    details?: string;
  }[];
}

export interface StandingsRow {
  team_id: string;
  team_name: string;
  team_logo?: string;
  department?: string;
  group_name?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
}
