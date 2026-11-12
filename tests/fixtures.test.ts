import { describe, it, expect } from 'vitest';
import {
  generateRoundRobin,
  generateKnockout,
  generateGroupKnockout,
} from '../src/lib/fixtures';

describe('Fixture Generator Engine', () => {
  it('generates correct round-robin matches for even number of teams (4 teams)', () => {
    const teams = ['T1', 'T2', 'T3', 'T4'];
    const fixtures = generateRoundRobin(teams);

    // 4 teams -> 3 rounds, 2 matches per round = 6 matches total
    expect(fixtures).toHaveLength(6);

    // Verify every pair plays exactly once
    const pairs = new Set<string>();
    fixtures.forEach((f) => {
      const pairKey = [f.home_team_id, f.away_team_id].sort().join('-');
      expect(pairs.has(pairKey)).toBe(false);
      pairs.add(pairKey);
    });
    expect(pairs.size).toBe(6);
  });

  it('generates correct round-robin matches for odd number of teams with BYE handling (5 teams)', () => {
    const teams = ['T1', 'T2', 'T3', 'T4', 'T5'];
    const fixtures = generateRoundRobin(teams);

    // 5 teams -> 5 rounds, 2 matches per round (1 team gets bye per round) = 10 matches total
    expect(fixtures).toHaveLength(10);

    const pairs = new Set<string>();
    fixtures.forEach((f) => {
      const pairKey = [f.home_team_id, f.away_team_id].sort().join('-');
      expect(pairs.has(pairKey)).toBe(false);
      pairs.add(pairKey);
    });
    expect(pairs.size).toBe(10);
  });

  it('generates single elimination knockout bracket for 8 teams', () => {
    const teams = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'];
    const fixtures = generateKnockout(teams);

    // 8 teams -> 4 quarter-finals
    expect(fixtures).toHaveLength(4);
    expect(fixtures[0].round).toBe('Quarter Final');
  });

  it('generates group + knockout fixtures with snake seeding', () => {
    const teams = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
    const fixtures = generateGroupKnockout(teams, 2);

    // 2 groups of 3 teams: each group has 3 matches -> 6 total matches
    expect(fixtures).toHaveLength(6);
    const groupAFixtures = fixtures.filter((f) => f.group_name === 'Group A');
    const groupBFixtures = fixtures.filter((f) => f.group_name === 'Group B');
    expect(groupAFixtures).toHaveLength(3);
    expect(groupBFixtures).toHaveLength(3);
  });
});
