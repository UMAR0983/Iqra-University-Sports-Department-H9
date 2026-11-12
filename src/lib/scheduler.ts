import { Match, Venue, VenueBlock, ConflictCheckResult } from '@/types';

export interface BlackoutHourRule {
  day: string; // 'Mon-Fri', 'Sat-Sun', 'Everyday'
  from: string; // '09:00'
  to: string; // '13:00'
}

export interface MatchConflictInput {
  venue_id: string;
  home_team_id: string;
  away_team_id: string;
  starts_at: string; // ISO string
  ends_at: string; // ISO string
  exclude_match_id?: string;
  referee_ids?: string[];
}

export interface SchedulerContext {
  existingMatches: Match[];
  venues: Venue[];
  venueBlocks?: VenueBlock[];
  blackoutRules?: BlackoutHourRule[];
  minRestHours?: number;
}

/**
 * Checks all scheduling constraints and returns conflicts.
 */
export function checkConflicts(
  input: MatchConflictInput,
  context: SchedulerContext
): ConflictCheckResult {
  const conflicts: ConflictCheckResult['conflicts'] = [];
  const reqStart = new Date(input.starts_at).getTime();
  const reqEnd = new Date(input.ends_at).getTime();

  if (isNaN(reqStart) || isNaN(reqEnd) || reqEnd <= reqStart) {
    return {
      hasConflict: true,
      conflicts: [
        {
          type: 'venue',
          message: 'Invalid match start or end time.',
        },
      ],
    };
  }

  // 1. Operating Hours Constraint
  const venue = context.venues.find((v) => v.id === input.venue_id);
  if (venue && venue.open_time && venue.close_time) {
    const startDate = new Date(input.starts_at);
    const endDate = new Date(input.ends_at);
    const [openH, openM] = venue.open_time.split(':').map(Number);
    const [closeH, closeM] = venue.close_time.split(':').map(Number);

    // Use UTC hours if ends with Z, otherwise local
    const isUTC = input.starts_at.endsWith('Z');
    const startH = isUTC ? startDate.getUTCHours() : startDate.getHours();
    const startM = isUTC ? startDate.getUTCMinutes() : startDate.getMinutes();
    const endH = isUTC ? endDate.getUTCHours() : endDate.getHours();
    const endM = isUTC ? endDate.getUTCMinutes() : endDate.getMinutes();

    const matchStartMins = startH * 60 + startM;
    const matchEndMins = endH * 60 + endM;
    const venueOpenMins = openH * 60 + openM;
    const venueCloseMins = closeH * 60 + closeM;

    if (matchStartMins < venueOpenMins || matchEndMins > venueCloseMins) {
      conflicts.push({
        type: 'venue',
        message: `Match time is outside venue operating hours (${venue.open_time} - ${venue.close_time}).`,
      });
    }
  }

  // 2. Academic Blackout Hours Constraint (e.g. 09:00 - 13:00 class hours Mon-Fri)
  const blackoutRules = context.blackoutRules || [
    { day: 'Mon-Fri', from: '09:00', to: '13:00' },
  ];
  const startDate = new Date(input.starts_at);
  const isUTC = input.starts_at.endsWith('Z');
  const dayOfWeek = isUTC ? startDate.getUTCDay() : startDate.getDay(); // 0 is Sunday, 1-5 is Mon-Fri
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  for (const rule of blackoutRules) {
    if (rule.day === 'Mon-Fri' && !isWeekday) continue;
    const [bStartH, bStartM] = rule.from.split(':').map(Number);
    const [bEndH, bEndM] = rule.to.split(':').map(Number);
    const bStartMins = bStartH * 60 + bStartM;
    const bEndMins = bEndH * 60 + bEndM;

    const startH = isUTC ? startDate.getUTCHours() : startDate.getHours();
    const startM = isUTC ? startDate.getUTCMinutes() : startDate.getMinutes();
    const mStartMins = startH * 60 + startM;

    const endDate = new Date(input.ends_at);
    const endH = isUTC ? endDate.getUTCHours() : endDate.getHours();
    const endM = isUTC ? endDate.getUTCMinutes() : endDate.getMinutes();
    const mEndMins = endH * 60 + endM;

    // Overlap check
    if (Math.max(mStartMins, bStartMins) < Math.min(mEndMins, bEndMins)) {
      conflicts.push({
        type: 'blackout',
        message: `Match clashes with university academic blackout hours (${rule.from} - ${rule.to} ${rule.day}).`,
      });
    }
  }

  // 3. Venue Maintenance Block Constraint
  if (context.venueBlocks) {
    for (const block of context.venueBlocks) {
      if (block.venue_id === input.venue_id) {
        const blockStart = new Date(block.starts_at).getTime();
        const blockEnd = new Date(block.ends_at).getTime();
        if (Math.max(reqStart, blockStart) < Math.min(reqEnd, blockEnd)) {
          conflicts.push({
            type: 'venue_block',
            ref_id: block.id,
            message: `Venue is closed for maintenance: ${block.reason || 'Scheduled block'}.`,
          });
        }
      }
    }
  }

  // 4. Overlap with Existing Matches
  for (const match of context.existingMatches) {
    if (input.exclude_match_id && match.id === input.exclude_match_id) {
      continue;
    }
    if (match.status === 'cancelled' || match.status === 'postponed') {
      continue;
    }

    const mStart = new Date(match.starts_at).getTime();
    const mEnd = new Date(match.ends_at).getTime();

    // Check time intersection
    const timeOverlap = Math.max(reqStart, mStart) < Math.min(reqEnd, mEnd);

    if (timeOverlap) {
      // 4a. Venue double-booking
      if (match.venue_id === input.venue_id) {
        conflicts.push({
          type: 'venue',
          ref_id: match.id,
          message: `Venue clash with Match #${match.match_no || ''} (${match.round || 'Active fixture'}).`,
        });
      }

      // 4b. Team double-booking
      const teamsInvolvedInExisting = [match.home_team_id, match.away_team_id];
      if (
        teamsInvolvedInExisting.includes(input.home_team_id) ||
        teamsInvolvedInExisting.includes(input.away_team_id)
      ) {
        conflicts.push({
          type: 'team',
          ref_id: match.id,
          message: `Team clash: One of the teams is already scheduled in Match #${match.match_no || ''} at this time.`,
        });
      }
    }

    // 5. Minimum Rest Time check (e.g. 24h between matches for a team)
    const minRestHours = context.minRestHours ?? 18;
    const minRestMs = minRestHours * 60 * 60 * 1000;
    const sameTeam =
      match.home_team_id === input.home_team_id ||
      match.away_team_id === input.home_team_id ||
      match.home_team_id === input.away_team_id ||
      match.away_team_id === input.away_team_id;

    if (sameTeam) {
      const restBefore = reqStart - mEnd;
      const restAfter = mStart - reqEnd;
      if (
        (restBefore > 0 && restBefore < minRestMs) ||
        (restAfter > 0 && restAfter < minRestMs)
      ) {
        conflicts.push({
          type: 'rest_time',
          ref_id: match.id,
          message: `Teams require at least ${minRestHours} hours rest between matches.`,
        });
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
}

/**
 * Auto-scheduler greedy engine
 * Finds the earliest conflict-free slot for each fixture across target venues and dates.
 */
export function autoScheduleFixtures(
  fixtures: {
    id?: string;
    round: string;
    match_no?: number;
    home_team_id: string;
    away_team_id: string;
    sport_id?: string;
    tournament_id?: string;
  }[],
  options: {
    startDate: Date;
    endDate: Date;
    slotDurationMinutes: number;
    venues: Venue[];
    existingMatches: Match[];
    venueBlocks?: VenueBlock[];
    blackoutRules?: BlackoutHourRule[];
    minRestHours?: number;
  }
): {
  scheduled: (Match & { simulated?: boolean })[];
  unscheduled: typeof fixtures;
} {
  const scheduled: (Match & { simulated?: boolean })[] = [];
  const unscheduled: typeof fixtures = [];
  const allMatches: Match[] = [...options.existingMatches];

  // Generate candidate time slots per day between start and end date
  const candidateSlots: { start: Date; end: Date; venue_id: string }[] = [];
  const curDay = new Date(options.startDate);

  while (curDay <= options.endDate) {
    for (const venue of options.venues) {
      const [openH, openM] = (venue.open_time || '08:00').split(':').map(Number);
      const [closeH, closeM] = (venue.close_time || '20:00').split(':').map(Number);

      const slotStart = new Date(curDay);
      slotStart.setHours(openH, openM, 0, 0);

      const dayEnd = new Date(curDay);
      dayEnd.setHours(closeH, closeM, 0, 0);

      while (
        slotStart.getTime() + options.slotDurationMinutes * 60 * 1000 <=
        dayEnd.getTime()
      ) {
        const slotEnd = new Date(
          slotStart.getTime() + options.slotDurationMinutes * 60 * 1000
        );

        candidateSlots.push({
          start: new Date(slotStart),
          end: slotEnd,
          venue_id: venue.id,
        });

        // Advance by slot duration + 15 min buffer between matches
        slotStart.setTime(slotEnd.getTime() + 15 * 60 * 1000);
      }
    }

    curDay.setDate(curDay.getDate() + 1);
  }

  // Iterate over fixtures and greedily assign the earliest valid slot
  for (const fixture of fixtures) {
    let assigned = false;

    for (let i = 0; i < candidateSlots.length; i++) {
      const slot = candidateSlots[i];
      const conflictCheck = checkConflicts(
        {
          venue_id: slot.venue_id,
          home_team_id: fixture.home_team_id,
          away_team_id: fixture.away_team_id,
          starts_at: slot.start.toISOString(),
          ends_at: slot.end.toISOString(),
        },
        {
          existingMatches: allMatches,
          venues: options.venues,
          venueBlocks: options.venueBlocks,
          blackoutRules: options.blackoutRules,
          minRestHours: options.minRestHours ?? 18,
        }
      );

      if (!conflictCheck.hasConflict) {
        const newMatch: Match = {
          id: fixture.id || `gen-${fixture.match_no || Math.random().toString(36).substring(7)}`,
          tournament_id: fixture.tournament_id,
          sport_id: fixture.sport_id,
          round: fixture.round,
          match_no: fixture.match_no,
          home_team_id: fixture.home_team_id,
          away_team_id: fixture.away_team_id,
          venue_id: slot.venue_id,
          starts_at: slot.start.toISOString(),
          ends_at: slot.end.toISOString(),
          status: 'scheduled',
          home_score: 0,
          away_score: 0,
        };

        scheduled.push(newMatch);
        allMatches.push(newMatch);
        assigned = true;
        // Remove slot so next match doesn't take same venue/time
        candidateSlots.splice(i, 1);
        break;
      }
    }

    if (!assigned) {
      unscheduled.push(fixture);
    }
  }

  return { scheduled, unscheduled };
}
