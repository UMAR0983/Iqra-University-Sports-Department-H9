import { describe, it, expect } from 'vitest';
import { checkConflicts, autoScheduleFixtures } from '../src/lib/scheduler';
import { Match, Venue } from '../src/types';

describe('Match Scheduling Engine & Conflict Detection', () => {
  const venues: Venue[] = [
    {
      id: 'v1',
      name: 'Main Cricket Ground',
      open_time: '08:00',
      close_time: '20:00',
      is_active: true,
    },
    {
      id: 'v2',
      name: 'Futsal Turf Court',
      open_time: '08:00',
      close_time: '22:00',
      is_active: true,
    },
  ];

  const existingMatches: Match[] = [
    {
      id: 'm1',
      home_team_id: 'team-a',
      away_team_id: 'team-b',
      venue_id: 'v1',
      starts_at: '2027-03-10T14:00:00.000Z',
      ends_at: '2027-03-10T16:00:00.000Z',
      status: 'scheduled',
      home_score: 0,
      away_score: 0,
    },
  ];

  it('rejects venue overlap when another match is scheduled at same venue & time', () => {
    const result = checkConflicts(
      {
        venue_id: 'v1',
        home_team_id: 'team-c',
        away_team_id: 'team-d',
        starts_at: '2027-03-10T15:00:00.000Z', // overlaps 14:00 - 16:00
        ends_at: '2027-03-10T17:00:00.000Z',
      },
      { existingMatches, venues }
    );

    expect(result.hasConflict).toBe(true);
    expect(result.conflicts.some((c) => c.type === 'venue')).toBe(true);
  });

  it('rejects team overlap when a team is already playing at that time in another venue', () => {
    const result = checkConflicts(
      {
        venue_id: 'v2', // different venue
        home_team_id: 'team-a', // team-a is playing in m1 at v1
        away_team_id: 'team-c',
        starts_at: '2027-03-10T14:30:00.000Z',
        ends_at: '2027-03-10T15:30:00.000Z',
      },
      { existingMatches, venues }
    );

    expect(result.hasConflict).toBe(true);
    expect(result.conflicts.some((c) => c.type === 'team')).toBe(true);
  });

  it('flags academic blackout hour conflicts on weekdays (09:00 - 13:00)', () => {
    // 2027-03-10 is a Wednesday
    const result = checkConflicts(
      {
        venue_id: 'v2',
        home_team_id: 'team-x',
        away_team_id: 'team-y',
        starts_at: '2027-03-10T10:00:00.000Z',
        ends_at: '2027-03-10T11:30:00.000Z',
      },
      {
        existingMatches: [],
        venues,
        blackoutRules: [{ day: 'Mon-Fri', from: '09:00', to: '13:00' }],
      }
    );

    expect(result.hasConflict).toBe(true);
    expect(result.conflicts.some((c) => c.type === 'blackout')).toBe(true);
  });

  it('allows scheduling when no conflict exists', () => {
    const result = checkConflicts(
      {
        venue_id: 'v2',
        home_team_id: 'team-c',
        away_team_id: 'team-d',
        starts_at: '2027-03-10T16:30:00.000Z',
        ends_at: '2027-03-10T18:00:00.000Z',
      },
      { existingMatches, venues, minRestHours: 0 }
    );

    expect(result.hasConflict).toBe(false);
    expect(result.conflicts).toHaveLength(0);
  });

  it('auto-schedules fixtures into conflict-free slots', () => {
    const fixtures = [
      { round: 'Round 1', match_no: 1, home_team_id: 'T1', away_team_id: 'T2' },
      { round: 'Round 1', match_no: 2, home_team_id: 'T3', away_team_id: 'T4' },
      { round: 'Round 2', match_no: 3, home_team_id: 'T1', away_team_id: 'T3' },
    ];

    const { scheduled, unscheduled } = autoScheduleFixtures(fixtures, {
      startDate: new Date('2027-03-15T00:00:00Z'),
      endDate: new Date('2027-03-20T00:00:00Z'),
      slotDurationMinutes: 60,
      venues,
      existingMatches: [],
      minRestHours: 4,
    });

    expect(scheduled.length).toBe(3);
    expect(unscheduled.length).toBe(0);
  });
});
