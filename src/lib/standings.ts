import { Match, Team, StandingsRow, Tournament } from '@/types';

export function calculateStandings(
  teams: Team[],
  matches: Match[],
  tournament?: Tournament
): StandingsRow[] {
  const pointsWin = tournament?.points_win ?? 3;
  const pointsDraw = tournament?.points_draw ?? 1;
  const pointsLoss = tournament?.points_loss ?? 0;

  const tableMap = new Map<string, StandingsRow>();

  // Initialize every team in the tournament
  teams.forEach((t) => {
    tableMap.set(t.id, {
      team_id: t.id,
      team_name: t.name,
      team_logo: t.logo_url,
      department: t.department,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goals_for: 0,
      goals_against: 0,
      goal_diff: 0,
      points: 0,
    });
  });

  // Process completed matches
  matches.forEach((m) => {
    if (m.status !== 'completed') return;

    const homeRow = tableMap.get(m.home_team_id);
    const awayRow = tableMap.get(m.away_team_id);

    if (!homeRow || !awayRow) return;

    homeRow.played += 1;
    awayRow.played += 1;

    homeRow.goals_for += m.home_score;
    homeRow.goals_against += m.away_score;
    awayRow.goals_for += m.away_score;
    awayRow.goals_against += m.home_score;

    if (m.home_score > m.away_score) {
      homeRow.won += 1;
      homeRow.points += pointsWin;
      awayRow.lost += 1;
      awayRow.points += pointsLoss;
    } else if (m.home_score < m.away_score) {
      awayRow.won += 1;
      awayRow.points += pointsWin;
      homeRow.lost += 1;
      homeRow.points += pointsLoss;
    } else {
      homeRow.drawn += 1;
      awayRow.drawn += 1;
      homeRow.points += pointsDraw;
      awayRow.points += pointsDraw;
    }
  });

  // Calculate goal differences and convert to array
  const rows = Array.from(tableMap.values()).map((row) => ({
    ...row,
    goal_diff: row.goals_for - row.goals_against,
  }));

  // Sort by Points (desc) -> Goal Difference (desc) -> Goals For (desc) -> Head to Head -> Name
  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goal_diff !== a.goal_diff) return b.goal_diff - a.goal_diff;
    if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for;

    // Head to head check
    const h2h = matches.find(
      (m) =>
        m.status === 'completed' &&
        ((m.home_team_id === a.team_id && m.away_team_id === b.team_id) ||
          (m.home_team_id === b.team_id && m.away_team_id === a.team_id))
    );
    if (h2h) {
      if (h2h.winner_team_id === a.team_id) return -1;
      if (h2h.winner_team_id === b.team_id) return 1;
    }

    return a.team_name.localeCompare(b.team_name);
  });

  return rows;
}
