import { describe, it, expect } from 'vitest';
import { calculateStandings } from '../src/lib/standings';
import { Match, Team, Tournament } from '../src/types';

describe('Standings and Points Calculation Engine', () => {
  const teams: Team[] = [
    { id: 't1', sport_id: 's1', name: 'FCS Titans', primary_color: '#0B3C8C', is_active: true },
    { id: 't2', sport_id: 's1', name: 'Business Blazers', primary_color: '#D92D20', is_active: true },
    { id: 't3', sport_id: 's1', name: 'Engineering Eagles', primary_color: '#12B76A', is_active: true },
  ];

  const tournament: Tournament = {
    id: 'tour-1',
    sport_id: 's1',
    name: 'IU Premier League',
    format: 'round_robin',
    status: 'ongoing',
    max_teams: 8,
    points_win: 3,
    points_draw: 1,
    points_loss: 0,
  };

  it('calculates points, goal difference and ranks teams correctly', () => {
    const matches: Match[] = [
      // Titans 3 - 1 Blazers (Titans win +3 pts, +2 GD)
      {
        id: 'm1',
        home_team_id: 't1',
        away_team_id: 't2',
        venue_id: 'v1',
        starts_at: '2027-03-01T10:00:00Z',
        ends_at: '2027-03-01T11:00:00Z',
        status: 'completed',
        home_score: 3,
        away_score: 1,
        winner_team_id: 't1',
      },
      // Eagles 2 - 2 Blazers (Draw, 1 pt each)
      {
        id: 'm2',
        home_team_id: 't3',
        away_team_id: 't2',
        venue_id: 'v1',
        starts_at: '2027-03-02T10:00:00Z',
        ends_at: '2027-03-02T11:00:00Z',
        status: 'completed',
        home_score: 2,
        away_score: 2,
        winner_team_id: null,
      },
    ];

    const standings = calculateStandings(teams, matches, tournament);

    expect(standings).toHaveLength(3);

    // Rank 1: Titans (3 points, GD +2)
    expect(standings[0].team_name).toBe('FCS Titans');
    expect(standings[0].points).toBe(3);
    expect(standings[0].played).toBe(1);
    expect(standings[0].won).toBe(1);
    expect(standings[0].goal_diff).toBe(2);

    // Rank 2: Eagles (1 point, GD 0, 2 GF)
    expect(standings[1].team_name).toBe('Engineering Eagles');
    expect(standings[1].points).toBe(1);
    expect(standings[1].drawn).toBe(1);

    // Rank 3: Blazers (1 point, GD -2, played 2, lost 1, drawn 1)
    expect(standings[2].team_name).toBe('Business Blazers');
    expect(standings[2].points).toBe(1);
    expect(standings[2].played).toBe(2);
    expect(standings[2].lost).toBe(1);
    expect(standings[2].goal_diff).toBe(-2);
  });
});
