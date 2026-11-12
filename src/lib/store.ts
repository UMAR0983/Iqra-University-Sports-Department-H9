'use client';

import {
  Profile,
  Sport,
  Venue,
  VenueBlock,
  Team,
  TeamMember,
  Tournament,
  TournamentTeam,
  Match,
  MatchEvent,
  Announcement,
  Notification,
  UserRole,
} from '@/types';
import { generateRoundRobin, generateKnockout, generateGroupKnockout } from './fixtures';
import { checkConflicts, autoScheduleFixtures } from './scheduler';
import { calculateStandings } from './standings';

// Initial Seed Data
const INITIAL_PROFILES: Profile[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'admin@iqra.edu.pk',
    full_name: 'Dr. Tariq Mahmood',
    student_id: 'ADMIN-001',
    department: 'Sports Directorate',
    role: 'super_admin',
    phone: '+92-300-1112233',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'ayesha.sports@iqra.edu.pk',
    full_name: 'Ayesha Khan',
    student_id: 'ADMIN-002',
    department: 'Sports Directorate',
    role: 'sports_admin',
    phone: '+92-300-2223344',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'coach.hamza@iqra.edu.pk',
    full_name: 'Hamza Ali',
    student_id: 'FAC-CS-101',
    department: 'Computer Science',
    role: 'coach',
    phone: '+92-300-3334455',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'referee.bilal@iqra.edu.pk',
    full_name: 'Bilal Ahmed',
    student_id: 'REF-001',
    department: 'Physical Education',
    role: 'referee',
    phone: '+92-300-4445566',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'player.zain@iqra.edu.pk',
    full_name: 'Zain Ul Abideen',
    student_id: 'IU-CS-2023-412',
    department: 'Computer Science',
    semester: 6,
    role: 'player',
    phone: '+92-300-5556677',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    email: 'sara.student@iqra.edu.pk',
    full_name: 'Sara Siddiqui',
    student_id: 'IU-BBA-2024-108',
    department: 'Management Sciences',
    semester: 4,
    role: 'spectator',
    phone: '+92-300-6667788',
  },
];

const INITIAL_SPORTS: Sport[] = [
  {
    id: 'a1111111-0000-0000-0000-000000000001',
    name: 'Cricket',
    slug: 'cricket',
    category: 'outdoor',
    gender: 'male',
    team_size: 11,
    rules: 'Standard T20 tape-ball/hard-ball rules, 20 overs per innings.',
    icon: '🏏',
    is_active: true,
  },
  {
    id: 'a1111111-0000-0000-0000-000000000002',
    name: 'Football',
    slug: 'football',
    category: 'outdoor',
    gender: 'male',
    team_size: 11,
    rules: 'FIFA standard 11-a-side, two halves of 45 minutes.',
    icon: '⚽',
    is_active: true,
  },
  {
    id: 'a1111111-0000-0000-0000-000000000003',
    name: 'Futsal',
    slug: 'futsal',
    category: 'indoor',
    gender: 'mixed',
    team_size: 5,
    rules: '5-a-side indoor rules, two 20-minute halves, running clock.',
    icon: '🥅',
    is_active: true,
  },
  {
    id: 'a1111111-0000-0000-0000-000000000004',
    name: 'Basketball',
    slug: 'basketball',
    category: 'indoor',
    gender: 'mixed',
    team_size: 5,
    rules: '4 quarters of 10 minutes, 24-second shot clock.',
    icon: '🏀',
    is_active: true,
  },
  {
    id: 'a1111111-0000-0000-0000-000000000005',
    name: 'Volleyball',
    slug: 'volleyball',
    category: 'indoor',
    gender: 'mixed',
    team_size: 6,
    rules: 'Best of 3 sets to 25 points, decider set to 15.',
    icon: '🏐',
    is_active: true,
  },
  {
    id: 'a1111111-0000-0000-0000-000000000006',
    name: 'Badminton',
    slug: 'badminton',
    category: 'indoor',
    gender: 'mixed',
    team_size: 2,
    rules: 'Best of 3 games of 21 points, BWF scoring system.',
    icon: '🏸',
    is_active: true,
  },
  {
    id: 'a1111111-0000-0000-0000-000000000007',
    name: 'Table Tennis',
    slug: 'table-tennis',
    category: 'indoor',
    gender: 'mixed',
    team_size: 2,
    rules: 'ITTF 11 points per game, best of 5 games.',
    icon: '🏓',
    is_active: true,
  },
  {
    id: 'a1111111-0000-0000-0000-000000000008',
    name: 'Chess',
    slug: 'chess',
    category: 'indoor',
    gender: 'mixed',
    team_size: 1,
    rules: 'FIDE rapid time control 15+10 increment.',
    icon: '♟️',
    is_active: true,
  },
];

const INITIAL_VENUES: Venue[] = [
  {
    id: 'b1111111-0000-0000-0000-000000000001',
    name: 'Main Cricket Ground',
    location: 'Iqra Sector H-9 Main Complex',
    capacity: 1500,
    open_time: '08:00',
    close_time: '19:00',
    is_active: true,
  },
  {
    id: 'b1111111-0000-0000-0000-000000000002',
    name: 'Futsal Turf Court',
    location: 'Sports Pavilion, East Wing',
    capacity: 300,
    open_time: '08:00',
    close_time: '22:00',
    is_active: true,
  },
  {
    id: 'b1111111-0000-0000-0000-000000000003',
    name: 'Indoor Sports Hall (Court A)',
    location: 'Student Activity Center, Level 1',
    capacity: 500,
    open_time: '08:00',
    close_time: '21:00',
    is_active: true,
  },
  {
    id: 'b1111111-0000-0000-0000-000000000004',
    name: 'Basketball Arena',
    location: 'Outdoor Courts, North Wing',
    capacity: 400,
    open_time: '08:00',
    close_time: '20:00',
    is_active: true,
  },
];

const INITIAL_TEAMS: Team[] = [
  {
    id: 'c1111111-0000-0000-0000-000000000001',
    sport_id: 'a1111111-0000-0000-0000-000000000003',
    name: 'FCS Titans',
    short_name: 'TITANS',
    primary_color: '#0B3C8C',
    department: 'Computer Science',
    coach_id: '33333333-3333-3333-3333-333333333333',
    is_active: true,
  },
  {
    id: 'c1111111-0000-0000-0000-000000000002',
    sport_id: 'a1111111-0000-0000-0000-000000000003',
    name: 'Business Blazers',
    short_name: 'BLAZERS',
    primary_color: '#D92D20',
    department: 'Management Sciences',
    coach_id: '33333333-3333-3333-3333-333333333333',
    is_active: true,
  },
  {
    id: 'c1111111-0000-0000-0000-000000000003',
    sport_id: 'a1111111-0000-0000-0000-000000000003',
    name: 'Engineering Eagles',
    short_name: 'EAGLES',
    primary_color: '#12B76A',
    department: 'Engineering & Tech',
    is_active: true,
  },
  {
    id: 'c1111111-0000-0000-0000-000000000004',
    sport_id: 'a1111111-0000-0000-0000-000000000003',
    name: 'Media Mavericks',
    short_name: 'MAVERICKS',
    primary_color: '#F2B705',
    department: 'Media Studies',
    is_active: true,
  },
  {
    id: 'c1111111-0000-0000-0000-000000000005',
    sport_id: 'a1111111-0000-0000-0000-000000000003',
    name: 'AI Avengers',
    short_name: 'AVENGERS',
    primary_color: '#7A5AF8',
    department: 'Artificial Intelligence',
    is_active: true,
  },
  {
    id: 'c1111111-0000-0000-0000-000000000006',
    sport_id: 'a1111111-0000-0000-0000-000000000003',
    name: 'Law Lions',
    short_name: 'LIONS',
    primary_color: '#F04438',
    department: 'Faculty of Law',
    is_active: true,
  },
  {
    id: 'c1111111-0000-0000-0000-000000000007',
    sport_id: 'a1111111-0000-0000-0000-000000000003',
    name: 'Pharm Panthers',
    short_name: 'PANTHERS',
    primary_color: '#0BA5EC',
    department: 'Pharmacy',
    is_active: true,
  },
  {
    id: 'c1111111-0000-0000-0000-000000000008',
    sport_id: 'a1111111-0000-0000-0000-000000000003',
    name: 'Design Dragons',
    short_name: 'DRAGONS',
    primary_color: '#EE46BC',
    department: 'Fashion & Design',
    is_active: true,
  },
];

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'mem-1',
    team_id: 'c1111111-0000-0000-0000-000000000001',
    player_id: '55555555-5555-5555-5555-555555555555',
    jersey_no: 7,
    position: 'Striker / Forward',
    status: 'approved',
  },
];

const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'd1111111-0000-0000-0000-000000000001',
    sport_id: 'a1111111-0000-0000-0000-000000000003',
    name: 'IU Premier League 2027',
    season: 'Spring 2027',
    format: 'round_robin',
    status: 'ongoing',
    start_date: '2027-03-01',
    end_date: '2027-03-25',
    reg_open: '2027-02-01',
    reg_close: '2027-02-28',
    max_teams: 8,
    points_win: 3,
    points_draw: 1,
    points_loss: 0,
    description:
      'The flagship annual inter-department futsal tournament of Iqra University Islamabad campus.',
  },
];

const INITIAL_TOURNAMENT_TEAMS: TournamentTeam[] = [
  {
    id: 'tt-1',
    tournament_id: 'd1111111-0000-0000-0000-000000000001',
    team_id: 'c1111111-0000-0000-0000-000000000001',
    group_name: 'Group A',
    status: 'approved',
    seed: 1,
  },
  {
    id: 'tt-2',
    tournament_id: 'd1111111-0000-0000-0000-000000000001',
    team_id: 'c1111111-0000-0000-0000-000000000002',
    group_name: 'Group A',
    status: 'approved',
    seed: 2,
  },
  {
    id: 'tt-3',
    tournament_id: 'd1111111-0000-0000-0000-000000000001',
    team_id: 'c1111111-0000-0000-0000-000000000003',
    group_name: 'Group A',
    status: 'approved',
    seed: 3,
  },
  {
    id: 'tt-4',
    tournament_id: 'd1111111-0000-0000-0000-000000000001',
    team_id: 'c1111111-0000-0000-0000-000000000004',
    group_name: 'Group A',
    status: 'approved',
    seed: 4,
  },
];

const now = new Date();
const formatIso = (date: Date) => date.toISOString();

const INITIAL_MATCHES: Match[] = [
  {
    id: 'e1111111-0000-0000-0000-000000000001',
    tournament_id: 'd1111111-0000-0000-0000-000000000001',
    sport_id: 'a1111111-0000-0000-0000-000000000003',
    round: 'Round 1',
    match_no: 1,
    home_team_id: 'c1111111-0000-0000-0000-000000000001',
    away_team_id: 'c1111111-0000-0000-0000-000000000002',
    venue_id: 'b1111111-0000-0000-0000-000000000002',
    starts_at: formatIso(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
    ends_at: formatIso(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000)),
    status: 'completed',
    home_score: 4,
    away_score: 2,
    winner_team_id: 'c1111111-0000-0000-0000-000000000001',
    result_summary: 'FCS Titans won by 4 goals to 2 in an exhilarating opening fixture.',
  },
  {
    id: 'e1111111-0000-0000-0000-000000000002',
    tournament_id: 'd1111111-0000-0000-0000-000000000001',
    sport_id: 'a1111111-0000-0000-0000-000000000003',
    round: 'Round 1',
    match_no: 2,
    home_team_id: 'c1111111-0000-0000-0000-000000000003',
    away_team_id: 'c1111111-0000-0000-0000-000000000004',
    venue_id: 'b1111111-0000-0000-0000-000000000002',
    starts_at: formatIso(new Date(now.getTime() - 20 * 60 * 1000)),
    ends_at: formatIso(new Date(now.getTime() + 40 * 60 * 1000)),
    status: 'live',
    home_score: 2,
    away_score: 1,
    result_summary: 'High intensity clash currently in 2nd half.',
  },
  {
    id: 'e1111111-0000-0000-0000-000000000003',
    tournament_id: 'd1111111-0000-0000-0000-000000000001',
    sport_id: 'a1111111-0000-0000-0000-000000000003',
    round: 'Round 2',
    match_no: 3,
    home_team_id: 'c1111111-0000-0000-0000-000000000001',
    away_team_id: 'c1111111-0000-0000-0000-000000000003',
    venue_id: 'b1111111-0000-0000-0000-000000000002',
    starts_at: formatIso(new Date(now.getTime() + 26 * 60 * 60 * 1000)),
    ends_at: formatIso(new Date(now.getTime() + 27 * 60 * 60 * 1000)),
    status: 'scheduled',
    home_score: 0,
    away_score: 0,
  },
];

const INITIAL_EVENTS: MatchEvent[] = [
  {
    id: 'ev-1',
    match_id: 'e1111111-0000-0000-0000-000000000002',
    team_id: 'c1111111-0000-0000-0000-000000000003',
    event_type: 'goal',
    minute: 12,
    value: 1,
    note: 'Spectacular left-footed strike outside penalty area',
  },
  {
    id: 'ev-2',
    match_id: 'e1111111-0000-0000-0000-000000000002',
    team_id: 'c1111111-0000-0000-0000-000000000004',
    event_type: 'goal',
    minute: 19,
    value: 1,
    note: 'Tapped in from close range after rebound',
  },
  {
    id: 'ev-3',
    match_id: 'e1111111-0000-0000-0000-000000000002',
    team_id: 'c1111111-0000-0000-0000-000000000003',
    event_type: 'goal',
    minute: 28,
    value: 1,
    note: 'Header from corner kick',
  },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Welcome to IU Sports Hub 2027!',
    body: 'The official sports management platform for Iqra University is now live. Check live scores, match fixtures, and tournament standings.',
    is_pinned: true,
  },
  {
    id: 'ann-2',
    title: 'IU Premier League 2027 Ongoing',
    body: 'Group stage matches are underway at the Futsal Turf Court. Come support your department!',
    is_pinned: true,
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: '55555555-5555-5555-5555-555555555555',
    type: 'reminder',
    title: 'Upcoming Match: FCS Titans vs Engineering Eagles',
    body: 'Your match is scheduled tomorrow at 14:00 at Futsal Turf Court.',
    is_read: false,
  },
];

// In-Memory Global State
class HubStore {
  profiles = [...INITIAL_PROFILES];
  sports = [...INITIAL_SPORTS];
  venues = [...INITIAL_VENUES];
  venueBlocks: VenueBlock[] = [];
  teams = [...INITIAL_TEAMS];
  teamMembers = [...INITIAL_MEMBERS];
  tournaments = [...INITIAL_TOURNAMENTS];
  tournamentTeams = [...INITIAL_TOURNAMENT_TEAMS];
  matches = [...INITIAL_MATCHES];
  matchEvents = [...INITIAL_EVENTS];
  announcements = [...INITIAL_ANNOUNCEMENTS];
  notifications = [...INITIAL_NOTIFICATIONS];
  currentUser: Profile = INITIAL_PROFILES[0]; // Default Super Admin
  listeners: (() => void)[] = [];

  constructor() {
    this.hydrateFromStorage();
  }

  private hydrateFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('iu_sports_hub_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.matches) this.matches = parsed.matches;
          if (parsed.matchEvents) this.matchEvents = parsed.matchEvents;
          if (parsed.currentUser) this.currentUser = parsed.currentUser;
          if (parsed.teams) this.teams = parsed.teams;
          if (parsed.tournaments) this.tournaments = parsed.tournaments;
          if (parsed.announcements) this.announcements = parsed.announcements;
        }
      } catch (e) {
        console.warn('Storage sync error', e);
      }
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'iu_sports_hub_state',
          JSON.stringify({
            matches: this.matches,
            matchEvents: this.matchEvents,
            currentUser: this.currentUser,
            teams: this.teams,
            tournaments: this.tournaments,
            announcements: this.announcements,
          })
        );
      } catch (e) {
        console.warn('Storage persist error', e);
      }
    }
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  // User & Roles
  setCurrentUser(profile: Profile) {
    this.currentUser = profile;
    this.persist();
  }

  switchRole(role: UserRole) {
    const user = this.profiles.find((p) => p.role === role) || {
      id: `usr-${role}`,
      email: `${role}@iqra.edu.pk`,
      full_name: `Demo ${role.toUpperCase()}`,
      role: role,
    };
    this.setCurrentUser(user);
  }

  // Sports
  getSports() {
    return this.sports;
  }

  addSport(sportData: Omit<Sport, 'id' | 'is_active'>) {
    const newSport: Sport = {
      ...sportData,
      id: `sport-${Date.now()}`,
      is_active: true,
    };
    this.sports.push(newSport);
    this.persist();
    return newSport;
  }

  // Venues
  getVenues() {
    return this.venues;
  }

  addVenue(venueData: Omit<Venue, 'id' | 'is_active'>) {
    const newVenue: Venue = {
      ...venueData,
      id: `venue-${Date.now()}`,
      is_active: true,
    };
    this.venues.push(newVenue);
    this.persist();
    return newVenue;
  }

  blockVenue(venueId: string, startsAt: string, endsAt: string, reason: string) {
    const block: VenueBlock = {
      id: `blk-${Date.now()}`,
      venue_id: venueId,
      starts_at: startsAt,
      ends_at: endsAt,
      reason,
    };
    this.venueBlocks.push(block);
    this.persist();
    return block;
  }

  // Teams & Roster
  getTeams() {
    return this.teams.map((t) => ({
      ...t,
      coach: this.profiles.find((p) => p.id === t.coach_id),
      sport: this.sports.find((s) => s.id === t.sport_id),
    }));
  }

  addTeam(teamData: Omit<Team, 'id' | 'is_active'>) {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
      is_active: true,
    };
    this.teams.push(newTeam);
    this.persist();
    return newTeam;
  }

  joinTeamRequest(teamId: string, playerId: string, jerseyNo: number, position: string) {
    const member: TeamMember = {
      id: `tm-${Date.now()}`,
      team_id: teamId,
      player_id: playerId,
      jersey_no: jerseyNo,
      position,
      status: 'pending',
    };
    this.teamMembers.push(member);
    this.persist();
    return member;
  }

  approveTeamMember(memberId: string) {
    const member = this.teamMembers.find((m) => m.id === memberId);
    if (member) {
      member.status = 'approved';
      this.persist();
    }
  }

  // Matches & Scheduling
  getMatches(filter?: { sportId?: string; status?: string; teamId?: string; venueId?: string }) {
    let result = this.matches.map((m) => ({
      ...m,
      home_team: this.teams.find((t) => t.id === m.home_team_id),
      away_team: this.teams.find((t) => t.id === m.away_team_id),
      venue: this.venues.find((v) => v.id === m.venue_id),
      sport: this.sports.find((s) => s.id === m.sport_id),
      tournament: this.tournaments.find((t) => t.id === m.tournament_id),
    }));

    if (filter?.sportId) result = result.filter((m) => m.sport_id === filter.sportId);
    if (filter?.status) result = result.filter((m) => m.status === filter.status);
    if (filter?.venueId) result = result.filter((m) => m.venue_id === filter.venueId);
    if (filter?.teamId) {
      result = result.filter(
        (m) => m.home_team_id === filter.teamId || m.away_team_id === filter.teamId
      );
    }

    return result.sort(
      (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
    );
  }

  createMatch(matchData: Omit<Match, 'id' | 'home_score' | 'away_score'>) {
    // Validate conflicts
    const conflictResult = checkConflicts(
      {
        venue_id: matchData.venue_id,
        home_team_id: matchData.home_team_id,
        away_team_id: matchData.away_team_id,
        starts_at: matchData.starts_at,
        ends_at: matchData.ends_at,
      },
      {
        existingMatches: this.matches,
        venues: this.venues,
        venueBlocks: this.venueBlocks,
      }
    );

    if (conflictResult.hasConflict) {
      throw new Error(conflictResult.conflicts.map((c) => c.message).join(' | '));
    }

    const newMatch: Match = {
      ...matchData,
      id: `match-${Date.now()}`,
      home_score: 0,
      away_score: 0,
      status: matchData.status || 'scheduled',
    };
    this.matches.push(newMatch);

    // Create notifications for team members
    this.notifications.push({
      id: `notif-${Date.now()}`,
      user_id: this.currentUser.id,
      type: 'schedule_change',
      title: `Match Scheduled: ${matchData.round}`,
      body: `Match scheduled at venue ${this.venues.find((v) => v.id === matchData.venue_id)?.name}`,
      is_read: false,
    });

    this.persist();
    return newMatch;
  }

  rescheduleMatch(matchId: string, startsAt: string, endsAt: string, venueId?: string, reason?: string) {
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) throw new Error('Match not found');

    const targetVenueId = venueId || match.venue_id;

    // Check conflicts excluding this match
    const conflictResult = checkConflicts(
      {
        venue_id: targetVenueId,
        home_team_id: match.home_team_id,
        away_team_id: match.away_team_id,
        starts_at: startsAt,
        ends_at: endsAt,
        exclude_match_id: matchId,
      },
      {
        existingMatches: this.matches,
        venues: this.venues,
        venueBlocks: this.venueBlocks,
      }
    );

    if (conflictResult.hasConflict) {
      throw new Error(conflictResult.conflicts.map((c) => c.message).join(' | '));
    }

    match.starts_at = startsAt;
    match.ends_at = endsAt;
    match.venue_id = targetVenueId;
    match.postponed_reason = reason;

    this.notifications.push({
      id: `notif-${Date.now()}`,
      user_id: this.currentUser.id,
      type: 'schedule_change',
      title: `Match Rescheduled (${match.round})`,
      body: `Reason: ${reason || 'Administrative adjustment'}`,
      is_read: false,
    });

    this.persist();
    return match;
  }

  // Live Scoring
  addMatchEvent(
    matchId: string,
    eventData: {
      team_id?: string;
      player_id?: string;
      event_type: 'goal' | 'wicket' | 'run' | 'yellow_card' | 'red_card' | 'point' | 'foul';
      minute?: number;
      value?: number;
      note?: string;
    }
  ) {
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) throw new Error('Match not found');

    const newEvent: MatchEvent = {
      id: `event-${Date.now()}`,
      match_id: matchId,
      team_id: eventData.team_id,
      player_id: eventData.player_id,
      event_type: eventData.event_type,
      minute: eventData.minute ?? Math.floor(Math.random() * 45) + 1,
      value: eventData.value ?? 1,
      note: eventData.note,
      created_by: this.currentUser.id,
    };

    this.matchEvents.push(newEvent);

    // Update match score if goal/point/run
    if (['goal', 'point', 'run'].includes(eventData.event_type)) {
      if (eventData.team_id === match.home_team_id) {
        match.home_score += newEvent.value;
      } else if (eventData.team_id === match.away_team_id) {
        match.away_score += newEvent.value;
      }
      match.status = 'live';
    }

    this.persist();
    return newEvent;
  }

  undoLastEvent(matchId: string) {
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) return;

    const eventsForMatch = this.matchEvents.filter((e) => e.match_id === matchId);
    if (eventsForMatch.length === 0) return;

    const lastEvent = eventsForMatch[eventsForMatch.length - 1];
    if (['goal', 'point', 'run'].includes(lastEvent.event_type)) {
      if (lastEvent.team_id === match.home_team_id) {
        match.home_score = Math.max(0, match.home_score - lastEvent.value);
      } else if (lastEvent.team_id === match.away_team_id) {
        match.away_score = Math.max(0, match.away_score - lastEvent.value);
      }
    }

    this.matchEvents = this.matchEvents.filter((e) => e.id !== lastEvent.id);
    this.persist();
  }

  finishMatch(matchId: string, manOfMatch?: string, summary?: string) {
    const match = this.matches.find((m) => m.id === matchId);
    if (!match) throw new Error('Match not found');

    match.status = 'completed';
    match.man_of_match = manOfMatch;
    match.result_summary =
      summary ||
      `Match ended. Score: ${match.home_score} - ${match.away_score}`;

    if (match.home_score > match.away_score) {
      match.winner_team_id = match.home_team_id;
    } else if (match.away_score > match.home_score) {
      match.winner_team_id = match.away_team_id;
    } else {
      match.winner_team_id = null;
    }

    this.persist();
    return match;
  }

  // Tournaments & Standings
  getTournaments() {
    return this.tournaments.map((t) => ({
      ...t,
      sport: this.sports.find((s) => s.id === t.sport_id),
    }));
  }

  createTournament(data: Omit<Tournament, 'id'>) {
    const newTournament: Tournament = {
      ...data,
      id: `tour-${Date.now()}`,
    };
    this.tournaments.push(newTournament);
    this.persist();
    return newTournament;
  }

  generateTournamentFixtures(tournamentId: string, format?: string) {
    const tour = this.tournaments.find((t) => t.id === tournamentId);
    if (!tour) throw new Error('Tournament not found');

    const registeredTeams = this.tournamentTeams
      .filter((tt) => tt.tournament_id === tournamentId && tt.status === 'approved')
      .map((tt) => tt.team_id);

    const teamIds =
      registeredTeams.length >= 2
        ? registeredTeams
        : this.teams.slice(0, 4).map((t) => t.id);

    let fixtures: ReturnType<typeof generateRoundRobin> = [];
    const fmt = format || tour.format;

    if (fmt === 'round_robin' || fmt === 'league') {
      fixtures = generateRoundRobin(teamIds);
    } else if (fmt === 'knockout') {
      fixtures = generateKnockout(teamIds);
    } else {
      fixtures = generateGroupKnockout(teamIds, 2);
    }

    // Auto-schedule these fixtures into upcoming days
    const autoResult = autoScheduleFixtures(fixtures, {
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      slotDurationMinutes: 60,
      venues: this.venues,
      existingMatches: this.matches,
      minRestHours: 12,
    });

    autoResult.scheduled.forEach((m) => {
      this.matches.push({
        ...m,
        tournament_id: tournamentId,
        sport_id: tour.sport_id,
      });
    });

    this.persist();
    return autoResult;
  }

  getStandings(tournamentId?: string) {
    const tour = tournamentId
      ? this.tournaments.find((t) => t.id === tournamentId)
      : this.tournaments[0];
    const teamsInTour = this.teams.filter((t) =>
      this.tournamentTeams.some(
        (tt) => tt.tournament_id === tour?.id && tt.team_id === t.id
      )
    );
    const matchesInTour = this.matches.filter((m) => m.tournament_id === tour?.id);

    return calculateStandings(
      teamsInTour.length > 0 ? teamsInTour : this.teams.slice(0, 4),
      matchesInTour,
      tour
    );
  }

  // Announcements & Notifications
  getAnnouncements() {
    return this.announcements;
  }

  addAnnouncement(title: string, body: string, isPinned = false) {
    const ann: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      body,
      is_pinned: isPinned,
    };
    this.announcements.unshift(ann);
    this.persist();
    return ann;
  }

  getNotifications() {
    return this.notifications;
  }

  markNotificationRead(id: string) {
    const n = this.notifications.find((notif) => notif.id === id);
    if (n) {
      n.is_read = true;
      this.persist();
    }
  }
}

export const hubStore = new HubStore();
