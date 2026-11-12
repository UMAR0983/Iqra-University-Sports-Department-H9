'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { hubStore } from '@/lib/store';
import { Match, Sport, Announcement } from '@/types';
import {
  Trophy,
  Calendar,
  Radio,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
  Flame,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Megaphone,
  Download,
} from 'lucide-react';

export default function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<string>('all');

  useEffect(() => {
    const update = () => {
      setMatches(hubStore.getMatches());
      setSports(hubStore.getSports());
      setAnnouncements(hubStore.getAnnouncements());
    };
    update();
    return hubStore.subscribe(update);
  }, []);

  const liveMatches = matches.filter((m) => m.status === 'live');
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled');
  const completedMatches = matches.filter((m) => m.status === 'completed');

  const filteredUpcoming =
    selectedSportId === 'all'
      ? upcomingMatches
      : upcomingMatches.filter((m) => m.sport_id === selectedSportId);

  const standings = hubStore.getStandings();

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#08265E] via-[#0B3C8C] to-[#08265E] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b-4 border-[#F2B705]">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F2B705_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left Content */}
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-blue-900/60 border border-blue-400/30 rounded-full px-3 py-1 mb-4 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-[#12B76A]" />
                <span className="text-xs font-semibold text-blue-100 tracking-wide uppercase">
                  Iqra University Sports Directorate
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight">
                IU SPORTS HUB
              </h1>
              <p className="mt-3 text-xl sm:text-2xl font-serif italic text-[#F2B705]">
                Play. Compete. Represent Iqra.
              </p>
              <p className="mt-4 text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-xl">
                The centralized university sports platform. Browse all campus sports, access live scores, real-time standings, zero-clash fixture schedules, and department team rosters.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/schedule"
                  className="bg-[#F2B705] hover:bg-yellow-400 text-[#08265E] font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-md flex items-center space-x-2 hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>View Match Schedule</span>
                </Link>
                <Link
                  href="/live"
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center space-x-2"
                >
                  <Radio className="w-4 h-4 text-[#D92D20] animate-pulse" />
                  <span>Live Match Center</span>
                </Link>
                <Link
                  href="/api/calendar"
                  target="_blank"
                  className="bg-[#0B3C8C]/80 hover:bg-[#0B3C8C] border border-blue-400/40 text-blue-100 hover:text-white font-medium px-4 py-2.5 rounded-lg text-xs transition-all flex items-center space-x-1.5"
                  title="Export .ics calendar to Google Calendar / Apple Calendar / Outlook"
                >
                  <Download className="w-4 h-4 text-[#F2B705]" />
                  <span>Export iCal (.ics)</span>
                </Link>
              </div>
            </div>

            {/* Right KPI Card Banner */}
            <div className="w-full lg:w-96 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F2B705] mb-4 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Spring 2027 Season KPIs</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#08265E]/60 rounded-xl p-3 border border-blue-400/20">
                  <span className="text-2xl font-bold text-white">8</span>
                  <p className="text-[11px] text-blue-200 uppercase font-medium mt-0.5">
                    Official Sports
                  </p>
                </div>
                <div className="bg-[#08265E]/60 rounded-xl p-3 border border-blue-400/20">
                  <span className="text-2xl font-bold text-white">8</span>
                  <p className="text-[11px] text-blue-200 uppercase font-medium mt-0.5">
                    Dept. Teams
                  </p>
                </div>
                <div className="bg-[#08265E]/60 rounded-xl p-3 border border-blue-400/20">
                  <span className="text-2xl font-bold text-[#F2B705]">{matches.length}</span>
                  <p className="text-[11px] text-blue-200 uppercase font-medium mt-0.5">
                    Fixtures Total
                  </p>
                </div>
                <div className="bg-[#08265E]/60 rounded-xl p-3 border border-blue-400/20">
                  <span className="text-2xl font-bold text-[#12B76A]">0</span>
                  <p className="text-[11px] text-blue-200 uppercase font-medium mt-0.5">
                    Venue Clashes
                  </p>
                </div>
              </div>

              {/* Announcements mini ticker */}
              {announcements.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-1.5 text-xs text-[#F2B705] font-semibold mb-1">
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Latest Notice</span>
                  </div>
                  <p className="text-xs text-blue-100 line-clamp-2">
                    {announcements[0].title}: {announcements[0].body}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* LIVE MATCH SECTION (If any active) */}
        {liveMatches.length > 0 && (
          <section className="bg-white rounded-2xl p-6 shadow-md border-2 border-[#D92D20]/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center space-x-2">
                <span className="flex h-3 w-3 rounded-full bg-[#D92D20] animate-ping" />
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-2">
                  <span>LIVE MATCH IN PROGRESS</span>
                </h2>
              </div>
              <Link
                href="/live"
                className="text-xs font-semibold text-[#0B3C8C] hover:text-[#08265E] flex items-center space-x-1"
              >
                <span>Live Center</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gradient-to-r from-blue-50/70 to-slate-50 rounded-xl p-5 border border-blue-100 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="font-semibold text-[#0B3C8C]">
                      {match.tournament?.name || 'IU Championship'} • {match.round}
                    </span>
                    <span className="bg-[#D92D20] text-white font-extrabold px-2 py-0.5 rounded text-[10px] tracking-widest uppercase animate-pulse">
                      LIVE
                    </span>
                  </div>

                  <div className="flex items-center justify-between my-4">
                    {/* Home Team */}
                    <div className="text-center w-5/12">
                      <div
                        className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-bold text-sm shadow-sm mb-1"
                        style={{ backgroundColor: match.home_team?.primary_color || '#0B3C8C' }}
                      >
                        {match.home_team?.short_name || 'HOME'}
                      </div>
                      <p className="font-bold text-sm text-gray-900 truncate">
                        {match.home_team?.name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {match.home_team?.department}
                      </p>
                    </div>

                    {/* Live Score */}
                    <div className="text-center w-2/12">
                      <div className="text-3xl font-extrabold text-[#08265E] tracking-tight">
                        {match.home_score} : {match.away_score}
                      </div>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
                        Active
                      </p>
                    </div>

                    {/* Away Team */}
                    <div className="text-center w-5/12">
                      <div
                        className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-bold text-sm shadow-sm mb-1"
                        style={{ backgroundColor: match.away_team?.primary_color || '#D92D20' }}
                      >
                        {match.away_team?.short_name || 'AWAY'}
                      </div>
                      <p className="font-bold text-sm text-gray-900 truncate">
                        {match.away_team?.name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {match.away_team?.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{match.venue?.name}</span>
                    </div>
                    <Link
                      href="/live"
                      className="text-xs bg-[#0B3C8C] hover:bg-[#08265E] text-white px-3 py-1 rounded font-medium transition-colors"
                    >
                      Follow Live Timeline →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* UPCOMING FIXTURES & STANDINGS SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Upcoming Matches */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-serif font-bold text-gray-900">
                  Upcoming Match Schedule
                </h2>
                <p className="text-xs text-gray-500">
                  Official conflict-free university sports schedule
                </p>
              </div>

              {/* Sport Filter */}
              <div className="flex items-center space-x-2">
                <select
                  value={selectedSportId}
                  onChange={(e) => setSelectedSportId(e.target.value)}
                  className="text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
                >
                  <option value="all">All Sports</option>
                  {sports.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
                <Link
                  href="/schedule"
                  className="text-xs text-[#0B3C8C] font-semibold hover:underline flex items-center space-x-1"
                >
                  <span>Full Calendar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {filteredUpcoming.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">No scheduled fixtures found</p>
                <p className="text-xs text-gray-500 mt-1">Check back later or view past results.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUpcoming.slice(0, 4).map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Date & Time pill */}
                      <div className="bg-blue-50 rounded-lg p-2.5 text-center min-w-[70px] border border-blue-100">
                        <span className="block text-xs font-bold text-[#0B3C8C]">
                          {new Date(match.starts_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                          })}
                        </span>
                        <span className="block text-sm font-extrabold text-gray-900">
                          {new Date(match.starts_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="block text-[10px] text-gray-500 mt-0.5">
                          {new Date(match.starts_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Teams & Round */}
                      <div>
                        <div className="flex items-center space-x-1.5 text-xs text-gray-500 mb-1">
                          <span className="font-semibold text-[#0B3C8C]">
                            {match.sport?.name || 'Sport'}
                          </span>
                          <span>•</span>
                          <span>{match.round}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-bold text-gray-900">
                          <span>{match.home_team?.name}</span>
                          <span className="text-xs text-gray-400 font-normal">vs</span>
                          <span>{match.away_team?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{match.venue?.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                        Scheduled
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Col: Tournament Standings Preview */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-gray-900">
                  IU Premier League Standings
                </h3>
                <p className="text-[11px] text-gray-500">Group stage points table</p>
              </div>
              <Link
                href="/tournaments"
                className="text-xs font-semibold text-[#0B3C8C] hover:underline flex items-center space-x-1"
              >
                <span>Full Table</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">Team</th>
                    <th className="py-2 px-1 text-center">P</th>
                    <th className="py-2 px-1 text-center">W</th>
                    <th className="py-2 px-1 text-center">GD</th>
                    <th className="py-2 px-2 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {standings.slice(0, 5).map((row, idx) => (
                    <tr
                      key={row.team_id}
                      className={idx === 0 ? 'bg-amber-50/60 font-semibold' : ''}
                    >
                      <td className="py-2.5 px-2 text-gray-500">{idx + 1}</td>
                      <td className="py-2.5 px-2">
                        <span className="font-medium text-gray-900">{row.team_name}</span>
                        <span className="block text-[10px] text-gray-400">{row.department}</span>
                      </td>
                      <td className="py-2.5 px-1 text-center text-gray-600">{row.played}</td>
                      <td className="py-2.5 px-1 text-center text-gray-600">{row.won}</td>
                      <td className="py-2.5 px-1 text-center text-gray-600">
                        {row.goal_diff > 0 ? `+${row.goal_diff}` : row.goal_diff}
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-[#0B3C8C]">
                        {row.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
              <span>Points: Win = 3, Draw = 1, Loss = 0</span>
              <span className="text-[#0B3C8C] font-semibold">Live Table</span>
            </div>
          </div>
        </div>

        {/* SPORTS CATALOGUE PREVIEW */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900">
                Official University Sports
              </h2>
              <p className="text-xs text-gray-500">
                8 approved competitive sports across indoor & outdoor categories
              </p>
            </div>
            <Link
              href="/sports"
              className="text-xs font-semibold text-[#0B3C8C] hover:underline flex items-center space-x-1"
            >
              <span>Explore All Sports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sports.map((sport) => (
              <Link
                key={sport.id}
                href={`/sports`}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#0B3C8C] hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {sport.icon || '🏅'}
                </div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#0B3C8C] transition-colors">
                  {sport.name}
                </h3>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide mt-0.5">
                  {sport.category} • Team of {sport.team_size}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
