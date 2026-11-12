import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email().refine((val) => val.endsWith('@iqra.edu.pk'), {
    message: 'Only official university email addresses (@iqra.edu.pk) are permitted.',
  }),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  full_name: z.string().min(2, 'Full name is required.'),
  student_id: z.string().min(3, 'Valid Student ID / Employee ID required.'),
  department: z.string().min(2, 'Department is required.'),
  semester: z.number().min(1).max(12).optional(),
  phone: z.string().optional(),
  role: z.enum(['coach', 'referee', 'player', 'spectator']).default('spectator'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required.'),
});

export const matchSchema = z.object({
  tournament_id: z.string().uuid().optional(),
  sport_id: z.string().uuid().optional(),
  round: z.string().default('Round 1'),
  match_no: z.number().int().positive().optional(),
  home_team_id: z.string().uuid('Home team is required'),
  away_team_id: z.string().uuid('Away team is required'),
  venue_id: z.string().uuid('Venue is required'),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  status: z.enum(['scheduled', 'live', 'completed', 'postponed', 'cancelled', 'walkover']).default('scheduled'),
}).refine((data) => data.home_team_id !== data.away_team_id, {
  message: 'Home team and away team must be distinct',
  path: ['away_team_id'],
}).refine((data) => new Date(data.ends_at) > new Date(data.starts_at), {
  message: 'Match end time must be after start time',
  path: ['ends_at'],
});

export const rescheduleSchema = z.object({
  venue_id: z.string().uuid().optional(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  reason: z.string().min(3, 'A reason for rescheduling or postponement is required.'),
});

export const tournamentSchema = z.object({
  sport_id: z.string().uuid(),
  name: z.string().min(3, 'Tournament name is required'),
  season: z.string().default('Spring 2027'),
  format: z.enum(['round_robin', 'knockout', 'group_knockout', 'league']),
  max_teams: z.number().int().min(2).max(64).default(16),
  points_win: z.number().int().default(3),
  points_draw: z.number().int().default(1),
  points_loss: z.number().int().default(0),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  reg_open: z.string().optional(),
  reg_close: z.string().optional(),
  description: z.string().optional(),
});

export const eventSchema = z.object({
  match_id: z.string().uuid(),
  team_id: z.string().uuid().optional(),
  player_id: z.string().uuid().optional(),
  event_type: z.enum(['goal', 'wicket', 'run', 'yellow_card', 'red_card', 'point', 'foul']),
  minute: z.number().int().min(0).max(180).optional(),
  value: z.number().default(1),
  note: z.string().optional(),
});

export const sportSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.enum(['outdoor', 'indoor', 'esports', 'athletics']),
  gender: z.enum(['male', 'female', 'mixed']).default('mixed'),
  team_size: z.number().int().min(1),
  rules: z.string().optional(),
  icon: z.string().optional(),
});

export const venueSchema = z.object({
  name: z.string().min(2),
  location: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  open_time: z.string().default('08:00'),
  close_time: z.string().default('20:00'),
  supported_sport_ids: z.array(z.string().uuid()).default([]),
});
