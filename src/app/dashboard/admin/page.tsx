'use client';

import React, { useState, useEffect } from 'react';
import { hubStore } from '@/lib/store';
import { Match, Sport, Venue, Team, Tournament } from '@/types';
import { checkConflicts } from '@/lib/scheduler';
import {
  ShieldCheck,
  PlusCircle,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Sparkles,
  Download,
  Megaphone,
  Wrench,
  Clock,
  MapPin,
  Trophy,
} from 'lucide-react';

export default function AdminDashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  // Manual Match Form State
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [venueId, setVenueId] = useState('');
  const [sportId, setSportId] = useState('');
  const [roundName, setRoundName] = useState('Round 2');
  const [startTime, setStartTime] = useState('2027-03-12T14:00');
  const [endTime, setEndTime] = useState('2027-03-12T15:30');

  // Conflict state
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-schedule state
  const [autoScheduleStatus, setAutoScheduleStatus] = useState<string | null>(null);

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');

  // Maintenance block state
  const [blockVenueId, setBlockVenueId] = useState('');
  const [blockReason, setBlockReason] = useState('Court surface relining');
  const [blockStart, setBlockStart] = useState('2027-03-14T08:00');
  const [blockEnd, setBlockEnd] = useState('2027-03-14T18:00');

  useEffect(() => {
    const update = () => {
      setMatches(hubStore.getMatches());
      const s = hubStore.getSports();
      setSports(s);
      const v = hubStore.getVenues();
      setVenues(v);
      const t = hubStore.getTeams();
      setTeams(t);
      const tours = hubStore.getTournaments();
      setTournaments(tours);

      if (t.length >= 2 && !homeTeam) {
        setHomeTeam(t[0].id);
        setAwayTeam(t[1].id);
      }
      if (v.length > 0 && !venueId) {
        setVenueId(v[0].id);
        setBlockVenueId(v[0].id);
      }
      if (s.length > 0 && !sportId) {
        setSportId(s[0].id);
      }
    };
    update();
    return hubStore.subscribe(update);
  }, [homeTeam, venueId, sportId]);

  // Live conflict pre-check
  useEffect(() => {
    if (!venueId || !homeTeam || !awayTeam || !startTime || !endTime) return;
    if (homeTeam === awayTeam) {
      setConflictWarning('Home team and away team must be distinct.');
      return;
    }

    const check = checkConflicts(
      {
        venue_id: venueId,
        home_team_id: homeTeam,
        away_team_id: awayTeam,
        starts_at: new Date(startTime).toISOString(),
        ends_at: new Date(endTime).toISOString(),
      },
      {
        existingMatches: matches,
        venues: venues,
        venueBlocks: hubStore.venueBlocks,
        minRestHours: 4,
      }
    );

    if (check.hasConflict) {
      setConflictWarning(check.conflicts.map((c) => c.message).join(' | '));
    } else {
      setConflictWarning(null);
    }
  }, [venueId, homeTeam, awayTeam, startTime, endTime, matches, venues]);

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      hubStore.createMatch({
        sport_id: sportId,
        tournament_id: tournaments[0]?.id,
        round: roundName,
        home_team_id: homeTeam,
        away_team_id: awayTeam,
        venue_id: venueId,
        starts_at: new Date(startTime).toISOString(),
        ends_at: new Date(endTime).toISOString(),
        status: 'scheduled',
      });
      setSuccessMessage('Match scheduled successfully with zero clashes verified!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setConflictWarning(err.message);
    }
  };

  const handleAutoSchedule = () => {
    try {
      const tour = tournaments[0];
      if (!tour) return;
      const res = hubStore.generateTournamentFixtures(tour.id, 'round_robin');
      setAutoScheduleStatus(
        `Auto-scheduler created & slotted ${res.scheduled.length} fixtures conflict-free across venues!`
      );
      setTimeout(() => setAutoScheduleStatus(null), 5000);
    } catch (err: any) {
      setAutoScheduleStatus(`Error: ${err.message}`);
    }
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle) return;
    hubStore.addAnnouncement(annTitle, annBody, true);
    setAnnTitle('');
    setAnnBody('');
    setSuccessMessage('Official sports announcement posted to public board!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAddVenueBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockVenueId) return;
    hubStore.blockVenue(
      blockVenueId,
      new Date(blockStart).toISOString(),
      new Date(blockEnd).toISOString(),
      blockReason
    );
    setSuccessMessage('Venue maintenance window blocked. The scheduler will reject matches during this period.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const rows = [
      ['Match ID', 'Round', 'Sport', 'Home Team', 'Away Team', 'Score', 'Venue', 'Starts At', 'Status'],
      ...matches.map((m) => [
        m.id,
        m.round,
        m.sport?.name || '',
        m.home_team?.name || '',
        m.away_team?.name || '',
        `${m.home_score} - ${m.away_score}`,
        m.venue?.name || '',
        m.starts_at,
        m.status,
      ]),
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'IU_Sports_Fixtures_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Directorate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#0B3C8C] text-white px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Admin Console
            </span>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Sports Directorate Dashboard
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Super Admin & Sports Officer management portal. Fixture scheduling, constraint verification, and reports.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 border"
        >
          <Download className="w-4 h-4 text-[#0B3C8C]" />
          <span>Export Fixtures CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-2xl font-bold text-[#0B3C8C]">{matches.length}</span>
          <p className="text-xs text-gray-500 font-semibold uppercase mt-1">
            Total Matches
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-2xl font-bold text-emerald-600">
            {matches.filter((m) => m.status === 'scheduled').length}
          </span>
          <p className="text-xs text-gray-500 font-semibold uppercase mt-1">
            Upcoming Fixtures
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-2xl font-bold text-amber-500">{teams.length}</span>
          <p className="text-xs text-gray-500 font-semibold uppercase mt-1">
            Active Dept. Teams
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-2xl font-bold text-[#12B76A]">0 Clashes</span>
          <p className="text-xs text-gray-500 font-semibold uppercase mt-1">
            Double-Bookings Prevented
          </p>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {autoScheduleStatus && (
        <div className="bg-blue-50 text-blue-900 border border-blue-200 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#F2B705] flex-shrink-0" />
          <span>{autoScheduleStatus}</span>
        </div>
      )}

      {/* Manual Match Scheduler with Real-Time Conflict Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900">
                Create Match & Detect Conflicts
              </h2>
              <p className="text-xs text-gray-500">
                Validates venue availability, team double-booking, and academic blackout windows.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Conflict Guard Active</span>
            </span>
          </div>

          <form onSubmit={handleCreateMatch} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Sport
                </label>
                <select
                  value={sportId}
                  onChange={(e) => setSportId(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
                >
                  {sports.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Round / Fixture Stage
                </label>
                <input
                  type="text"
                  required
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  placeholder="e.g. Round 2, Quarter Final"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Home Team
                </label>
                <select
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Away Team
                </label>
                <select
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Allocated Venue
              </label>
              <select
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
              >
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    📍 {v.name} ({v.open_time} - {v.close_time})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Starts At
                </label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Ends At
                </label>
                <input
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
                />
              </div>
            </div>

            {/* Conflict Warning Box */}
            {conflictWarning ? (
              <div className="bg-red-50 border-2 border-red-300 text-red-900 p-3.5 rounded-xl flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Scheduling Clash Detected:</p>
                  <p className="text-[11px] mt-0.5">{conflictWarning}</p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-2.5 rounded-xl flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Slot is clear: No venue overlap, team overlap, or blackout clashes.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!!conflictWarning}
              className={`w-full py-2.5 rounded-lg font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 ${
                conflictWarning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0B3C8C] hover:bg-[#08265E] text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Confirm & Schedule Match</span>
            </button>
          </form>
        </div>

        {/* Right Action Column */}
        <div className="space-y-6">
          {/* Auto-Scheduler Wizard */}
          <div className="bg-gradient-to-br from-blue-900 to-[#08265E] text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center space-x-2 text-[#F2B705]">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-serif font-bold text-base text-white">
                Auto-Scheduling Engine
              </h3>
            </div>
            <p className="text-xs text-blue-200 leading-relaxed">
              Generate full round-robin fixtures for IU Premier League 2027 and automatically assign optimal, conflict-free venue slots honoring rest times.
            </p>
            <button
              onClick={handleAutoSchedule}
              className="w-full py-2.5 bg-[#F2B705] hover:bg-yellow-400 text-[#08265E] font-bold rounded-lg text-xs transition-colors shadow-sm"
            >
              Run Auto-Scheduler
            </button>
          </div>

          {/* Venue Maintenance Blocker */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center space-x-2 text-gray-900">
              <Wrench className="w-4 h-4 text-[#0B3C8C]" />
              <h3 className="font-serif font-bold text-base">
                Venue Maintenance Block
              </h3>
            </div>
            <p className="text-gray-500 text-[11px]">
              Lock out a court/ground for repairs or campus ceremonies.
            </p>

            <form onSubmit={handleAddVenueBlock} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Venue</label>
                <select
                  value={blockVenueId}
                  onChange={(e) => setBlockVenueId(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  required
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg transition-colors"
              >
                Apply Maintenance Block
              </button>
            </form>
          </div>

          {/* Post Announcement */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center space-x-2 text-gray-900">
              <Megaphone className="w-4 h-4 text-[#F2B705]" />
              <h3 className="font-serif font-bold text-base">
                Publish Campus Notice
              </h3>
            </div>

            <form onSubmit={handlePostAnnouncement} className="space-y-3">
              <input
                type="text"
                placeholder="Notice headline..."
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <textarea
                placeholder="Detailed message..."
                rows={2}
                value={annBody}
                onChange={(e) => setAnnBody(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#0B3C8C] hover:bg-[#08265E] text-white font-bold rounded-lg transition-colors"
              >
                Publish Notice
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
