// Comprehensive Unit Test Runner for Core Scheduling, Fixtures & Standings
import { generateRoundRobin, generateKnockout, generateGroupKnockout } from '../src/lib/fixtures.ts';
import { checkConflicts, autoScheduleFixtures } from '../src/lib/scheduler.ts';
import { calculateStandings } from '../src/lib/standings.ts';
import { generateICS } from '../src/lib/ics.ts';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    failed++;
    throw new Error(message);
  } else {
    console.log(`  PASS: ${message}`);
    passed++;
  }
}

console.log('\n--- Running IU Sports Hub Test Suite ---');

try {
  console.log('\n[Suite 1: Fixtures Generation]');
  // 1. 4 teams Round Robin
  const rr4 = generateRoundRobin(['T1', 'T2', 'T3', 'T4']);
  assert(rr4.length === 6, '4 teams produce 6 matches in single round-robin');
  
  // 2. 5 teams Round Robin (with BYEs)
  const rr5 = generateRoundRobin(['T1', 'T2', 'T3', 'T4', 'T5']);
  assert(rr5.length === 10, '5 teams with BYE handling produce 10 matches');

  // 3. Knockout 8 teams
  const ko8 = generateKnockout(['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8']);
  assert(ko8.length === 4, '8 teams produce 4 quarter-finals in single elimination');
  assert(ko8[0].round === 'Quarter Final', 'First round of 8-team knockout is Quarter Final');

  // 4. Group + Knockout
  const gko = generateGroupKnockout(['T1', 'T2', 'T3', 'T4', 'T5', 'T6'], 2);
  assert(gko.length === 6, '6 teams across 2 groups produce 6 group-stage matches');

  console.log('\n[Suite 2: Conflict Engine]');
  const venues = [
    { id: 'v1', name: 'Main Cricket Ground', open_time: '08:00', close_time: '20:00', is_active: true },
    { id: 'v2', name: 'Futsal Turf Court', open_time: '08:00', close_time: '22:00', is_active: true }
  ];
  const existingMatches = [
    {
      id: 'm1',
      home_team_id: 't-titans',
      away_team_id: 't-blazers',
      venue_id: 'v1',
      starts_at: '2027-03-10T14:00:00.000Z',
      ends_at: '2027-03-10T16:00:00.000Z',
      status: 'scheduled',
      home_score: 0,
      away_score: 0
    }
  ];

  // Venue collision test
  const venueOverlap = checkConflicts(
    {
      venue_id: 'v1',
      home_team_id: 't-eagles',
      away_team_id: 't-mavericks',
      starts_at: '2027-03-10T15:00:00.000Z',
      ends_at: '2027-03-10T17:00:00.000Z'
    },
    { existingMatches, venues }
  );
  assert(venueOverlap.hasConflict === true, 'Detects venue double-booking collision');
  assert(venueOverlap.conflicts.some(c => c.type === 'venue'), 'Conflict type is venue');

  // Team collision test
  const teamOverlap = checkConflicts(
    {
      venue_id: 'v2',
      home_team_id: 't-titans', // already in m1
      away_team_id: 't-eagles',
      starts_at: '2027-03-10T14:30:00.000Z',
      ends_at: '2027-03-10T15:30:00.000Z'
    },
    { existingMatches, venues }
  );
  assert(teamOverlap.hasConflict === true, 'Detects team double-booking collision across venues');
  assert(teamOverlap.conflicts.some(c => c.type === 'team'), 'Conflict type is team');

  // Academic blackout hours (09:00 - 13:00 Mon-Fri)
  const blackoutCheck = checkConflicts(
    {
      venue_id: 'v2',
      home_team_id: 't-x',
      away_team_id: 't-y',
      starts_at: '2027-03-10T10:00:00.000Z',
      ends_at: '2027-03-10T11:30:00.000Z'
    },
    { existingMatches: [], venues, blackoutRules: [{ day: 'Mon-Fri', from: '09:00', to: '13:00' }] }
  );
  assert(blackoutCheck.hasConflict === true, 'Detects university academic blackout hours on weekdays');

  // Conflict-free match passes
  const validCheck = checkConflicts(
    {
      venue_id: 'v2',
      home_team_id: 't-x',
      away_team_id: 't-y',
      starts_at: '2027-03-10T16:00:00.000Z',
      ends_at: '2027-03-10T17:30:00.000Z'
    },
    { existingMatches, venues, minRestHours: 0 }
  );
  assert(validCheck.hasConflict === false, 'Allows valid slot without conflict');

  console.log('\n[Suite 3: Auto-Scheduler Engine]');
  const autoResult = autoScheduleFixtures(
    [
      { round: 'Round 1', match_no: 1, home_team_id: 'T1', away_team_id: 'T2' },
      { round: 'Round 1', match_no: 2, home_team_id: 'T3', away_team_id: 'T4' },
      { round: 'Round 2', match_no: 3, home_team_id: 'T1', away_team_id: 'T3' }
    ],
    {
      startDate: new Date('2027-03-15T00:00:00Z'),
      endDate: new Date('2027-03-20T00:00:00Z'),
      slotDurationMinutes: 60,
      venues,
      existingMatches: [],
      minRestHours: 4
    }
  );
  assert(autoResult.scheduled.length === 3, 'Auto-scheduler successfully schedules all 3 fixtures');
  assert(autoResult.unscheduled.length === 0, 'No fixtures left unscheduled');

  console.log('\n[Suite 4: Standings & Points Table Engine]');
  const teams = [
    { id: 't1', sport_id: 's1', name: 'FCS Titans', primary_color: '#0B3C8C', is_active: true },
    { id: 't2', sport_id: 's1', name: 'Business Blazers', primary_color: '#D92D20', is_active: true },
    { id: 't3', sport_id: 's1', name: 'Engineering Eagles', primary_color: '#12B76A', is_active: true }
  ];
  const matches = [
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
      winner_team_id: 't1'
    },
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
      winner_team_id: null
    }
  ];
  const standings = calculateStandings(teams, matches);
  assert(standings[0].team_name === 'FCS Titans', 'Titans top table with win');
  assert(standings[0].points === 3, 'Titans awarded 3 points for win');
  assert(standings[0].goal_diff === 2, 'Titans goal difference correctly calculated as +2');
  assert(standings[1].points === 1 && standings[2].points === 1, 'Drawn teams correctly awarded 1 point');

  console.log('\n[Suite 5: iCal / .ics Calendar Export]');
  const icsOutput = generateICS([
    {
      id: 'm-ics-1',
      home_team: { name: 'FCS Titans' },
      away_team: { name: 'Business Blazers' },
      sport: { name: 'Futsal' },
      venue: { name: 'Futsal Turf Court' },
      starts_at: '2027-03-10T14:00:00.000Z',
      ends_at: '2027-03-10T15:00:00.000Z',
      status: 'scheduled',
      home_score: 0,
      away_score: 0
    }
  ]);
  assert(icsOutput.includes('BEGIN:VCALENDAR'), 'ICS contains VCALENDAR header');
  assert(icsOutput.includes('BEGIN:VEVENT'), 'ICS contains VEVENT block');
  assert(icsOutput.includes('SUMMARY:Futsal: FCS Titans vs Business Blazers'), 'ICS formats match summary');
  assert(icsOutput.includes('END:VCALENDAR'), 'ICS ends properly');

  console.log(`\n========================================`);
  console.log(`ALL TESTS PASSED! (${passed} checks succeeded, ${failed} failed)`);
  console.log(`========================================\n`);
} catch (err) {
  console.error(`Test Suite encountered error:`, err);
  process.exit(1);
}
