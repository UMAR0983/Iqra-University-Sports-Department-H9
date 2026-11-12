/**
 * Fixture Generation Algorithms
 * Round Robin (Circle method), Single Elimination Knockout, Group + Knockout
 */

export interface GeneratedFixture {
  round: string;
  match_no: number;
  home_team_id: string;
  away_team_id: string;
  group_name?: string;
}

/**
 * Generate Round-Robin fixtures using the polygon/circle method.
 * Handles even & odd number of teams (adds dummy BYE if odd).
 */
export function generateRoundRobin(
  teamIds: string[],
  options: { doubleRoundRobin?: boolean; groupName?: string } = {}
): GeneratedFixture[] {
  if (teamIds.length < 2) return [];

  const teams = [...teamIds];
  const isOdd = teams.length % 2 !== 0;
  if (isOdd) {
    teams.push('__BYE__');
  }

  const numTeams = teams.length;
  const numRounds = numTeams - 1;
  const matchesPerRound = numTeams / 2;
  const fixtures: GeneratedFixture[] = [];
  let matchNo = 1;

  for (let round = 0; round < numRounds; round++) {
    const roundName = options.groupName
      ? `${options.groupName} - Round ${round + 1}`
      : `Round ${round + 1}`;

    for (let match = 0; match < matchesPerRound; match++) {
      const home = teams[match];
      const away = teams[numTeams - 1 - match];

      // Skip bye matches
      if (home === '__BYE__' || away === '__BYE__') {
        continue;
      }

      // Alternate home/away for fair distribution
      const isEvenRound = round % 2 === 0;
      fixtures.push({
        round: roundName,
        match_no: matchNo++,
        home_team_id: isEvenRound ? home : away,
        away_team_id: isEvenRound ? away : home,
        group_name: options.groupName,
      });
    }

    // Rotate array, keeping index 0 fixed
    const fixed = teams[0];
    const rest = teams.slice(1);
    const last = rest.pop()!;
    rest.unshift(last);
    teams.splice(0, teams.length, fixed, ...rest);
  }

  // Return double round-robin if requested
  if (options.doubleRoundRobin) {
    const secondLegFixtures: GeneratedFixture[] = fixtures.map((f) => ({
      round: f.round.replace(/Round (\d+)/, (_, r) => `Round ${parseInt(r) + numRounds}`),
      match_no: matchNo++,
      home_team_id: f.away_team_id,
      away_team_id: f.home_team_id,
      group_name: options.groupName,
    }));
    return [...fixtures, ...secondLegFixtures];
  }

  return fixtures;
}

/**
 * Generate Single Elimination Knockout fixtures.
 * Pads bracket to next power of 2 with BYEs for top seeds.
 */
export function generateKnockout(teamIds: string[]): GeneratedFixture[] {
  if (teamIds.length < 2) return [];

  // Find nearest power of 2
  let bracketSize = 2;
  while (bracketSize < teamIds.length) {
    bracketSize *= 2;
  }

  // Standard seeding order for powers of 2
  const seededOrder = getSeededBracketOrder(bracketSize);
  const paddedTeams: (string | null)[] = new Array(bracketSize).fill(null);

  for (let i = 0; i < teamIds.length; i++) {
    paddedTeams[seededOrder[i]] = teamIds[i];
  }

  const roundNames: Record<number, string> = {
    2: 'Final',
    4: 'Semi Final',
    8: 'Quarter Final',
    16: 'Round of 16',
    32: 'Round of 32',
    64: 'Round of 64',
  };

  const fixtures: GeneratedFixture[] = [];
  let matchNo = 1;
  const currentRoundName = roundNames[bracketSize] || `Round of ${bracketSize}`;

  // First round pairings
  for (let i = 0; i < bracketSize; i += 2) {
    const home = paddedTeams[i];
    const away = paddedTeams[i + 1];

    if (home && away) {
      fixtures.push({
        round: currentRoundName,
        match_no: matchNo++,
        home_team_id: home,
        away_team_id: away,
      });
    }
  }

  return fixtures;
}

/**
 * Generate Group + Knockout fixtures.
 * Uses snake draft to distribute teams evenly into groups, then runs round-robin within each group.
 */
export function generateGroupKnockout(
  teamIds: string[],
  numGroups: number = 2
): GeneratedFixture[] {
  if (teamIds.length < 2) return [];

  const actualGroups = Math.max(2, Math.min(numGroups, Math.floor(teamIds.length / 2)));
  const groups: string[][] = Array.from({ length: actualGroups }, () => []);

  // Snake seeding into groups
  teamIds.forEach((teamId, index) => {
    const cycle = Math.floor(index / actualGroups);
    const pos = index % actualGroups;
    const groupIndex = cycle % 2 === 0 ? pos : actualGroups - 1 - pos;
    groups[groupIndex].push(teamId);
  });

  const allFixtures: GeneratedFixture[] = [];
  let currentMatchNo = 1;

  groups.forEach((groupTeams, gIdx) => {
    const groupLetter = String.fromCharCode(65 + gIdx); // Group A, B, C...
    const groupFixtures = generateRoundRobin(groupTeams, {
      groupName: `Group ${groupLetter}`,
    });

    groupFixtures.forEach((f) => {
      allFixtures.push({
        ...f,
        match_no: currentMatchNo++,
      });
    });
  });

  return allFixtures;
}

function getSeededBracketOrder(size: number): number[] {
  let order = [0, 1];
  while (order.length < size) {
    const nextOrder: number[] = [];
    const currentSize = order.length * 2;
    for (const seed of order) {
      nextOrder.push(seed);
      nextOrder.push(currentSize - 1 - seed);
    }
    order = nextOrder;
  }
  return order;
}
