'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { hubStore } from '@/lib/store';
import { Match, Sport, Venue, Team } from '@/types';
import {
  Calendar as CalendarIcon,
  Filter,
  Download,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
} from 'lucide-react';

export default function SchedulePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  // Filter states
  const [sportFilter, setSportFilter] = useState('all');
  const [venueFilter, setVenueFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const update = () => {
      setMatches(hubStore.getMatches());
      setSports(hubStore.getSports());
      setVenues(hubStore.getVenues());
      setTeams(hubStore.getTeams());
    };
    update();
    return hubStore.subscribe(update);
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (sportFilter !== 'all' && m.sport_id !== sportFilter) return false;
    if (venueFilter !== 'all' && m.venue_id !== venueFilter) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Match Schedule & Calendar
            </h1>
            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Conflict Verified</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Official timetable for all inter-department tournament games and athletic fixtures.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <Link
            href="/api/calendar"
            target="_blank"
            className="bg-[#0B3C8C] hover:bg-[#08265E] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-2"
            title="Download .ics file to sync with Google Calendar or Outlook"
          >
            <Download className="w-4 h-4 text-[#F2B705]" />
            <span>Export iCal (.ics)</span>
          </Link>

          {/* View Mode Toggle */}
          <div className="bg-gray-100 p-1 rounded-lg flex items-center space-x-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center space-x-1 transition-colors ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-[#0B3C8C]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List View</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center space-x-1 transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white shadow-sm text-[#0B3C8C]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Weekly View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500">
          <Filter className="w-4 h-4 text-[#0B3C8C]" />
          <span>Filters:</span>
        </div>

        {/* Sport */}
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="text-xs bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
        >
          <option value="all">All Sports ({sports.length})</option>
          {sports.map((s) => (
            <option key={s.id} value={s.id}>
              {s.icon} {s.name}
            </option>
          ))}
        </select>

        {/* Venue */}
        <select
          value={venueFilter}
          onChange={(e) => setVenueFilter(e.target.value)}
          className="text-xs bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
        >
          <option value="all">All Venues ({venues.length})</option>
          {venues.map((v) => (
            <option key={v.id} value={v.id}>
              📍 {v.name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
        >
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled Only</option>
          <option value="live">Live Now</option>
          <option value="completed">Completed / Past</option>
        </select>

        <span className="text-xs text-gray-400 ml-auto">
          Showing <strong>{filteredMatches.length}</strong> fixtures
        </span>
      </div>

      {/* Main Schedule Content */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredMatches.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-gray-800">
                No matches match the selected criteria
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Try adjusting your sport, venue, or status filters above.
              </p>
            </div>
          ) : (
            filteredMatches.map((match) => {
              const startDate = new Date(match.starts_at);
              const isLive = match.status === 'live';
              const isDone = match.status === 'completed';

              return (
                <div
                  key={match.id}
                  className={`bg-white rounded-xl p-5 border transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    isLive
                      ? 'border-[#D92D20] ring-1 ring-[#D92D20]/30 bg-red-50/20'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {/* Left: Date / Time + Tournament details */}
                  <div className="flex items-center space-x-4 min-w-[240px]">
                    <div
                      className={`p-3 rounded-xl text-center min-w-[80px] border ${
                        isLive
                          ? 'bg-red-50 border-red-200 text-[#D92D20]'
                          : 'bg-blue-50/80 border-blue-100 text-[#0B3C8C]'
                      }`}
                    >
                      <span className="block text-[11px] font-bold uppercase">
                        {startDate.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="block text-lg font-extrabold text-gray-900 leading-tight">
                        {startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="block text-[11px] text-gray-500 mt-0.5">
                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-1.5 text-xs text-gray-500 mb-0.5">
                        <span className="font-semibold text-[#0B3C8C]">
                          {match.sport?.name || 'Sport'}
                        </span>
                        <span>•</span>
                        <span>{match.tournament?.name || 'Tournament'}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        {match.round} {match.match_no ? `• Match #${match.match_no}` : ''}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{match.venue?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Teams & Score */}
                  <div className="flex-1 flex items-center justify-center space-x-6 px-4">
                    {/* Home Team */}
                    <div className="text-right flex-1">
                      <p className="font-bold text-sm sm:text-base text-gray-900">
                        {match.home_team?.name}
                      </p>
                      <span className="text-[11px] text-gray-400">
                        {match.home_team?.department}
                      </span>
                    </div>

                    {/* Score / VS Badge */}
                    <div className="text-center min-w-[90px]">
                      {isDone ? (
                        <div className="bg-gray-100 px-3 py-1.5 rounded-lg border font-extrabold text-base text-[#08265E]">
                          {match.home_score} : {match.away_score}
                          <span className="block text-[9px] text-gray-500 uppercase tracking-wider font-semibold">
                            Final
                          </span>
                        </div>
                      ) : isLive ? (
                        <div className="bg-[#D92D20] text-white px-3 py-1.5 rounded-lg shadow-sm font-extrabold text-base animate-pulse">
                          {match.home_score} : {match.away_score}
                          <span className="block text-[9px] uppercase tracking-wider">
                            LIVE
                          </span>
                        </div>
                      ) : (
                        <div className="bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider">
                          VS
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="text-left flex-1">
                      <p className="font-bold text-sm sm:text-base text-gray-900">
                        {match.away_team?.name}
                      </p>
                      <span className="text-[11px] text-gray-400">
                        {match.away_team?.department}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-end space-x-2 min-w-[130px]">
                    {isLive ? (
                      <Link
                        href="/live"
                        className="bg-[#D92D20] hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <span>Follow Live</span>
                        <span>→</span>
                      </Link>
                    ) : (
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${
                          isDone
                            ? 'bg-gray-100 text-gray-700 border-gray-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {isDone ? 'Finished' : 'Confirmed'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Calendar / Weekly View */
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-serif font-bold text-lg text-gray-900">
              Campus Venues Weekly Allocation
            </h3>
            <span className="text-xs text-gray-500">
              Slots allocated between 08:00 and 22:00
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {venues.map((venue) => {
              const venueMatches = filteredMatches.filter((m) => m.venue_id === venue.id);
              return (
                <div key={venue.id} className="border rounded-xl p-4 bg-gray-50/60 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-bold text-xs text-gray-900 truncate">
                      {venue.name}
                    </h4>
                    <span className="text-[10px] bg-blue-100 text-[#0B3C8C] px-2 py-0.5 rounded font-bold">
                      {venueMatches.length} games
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Hours: {venue.open_time} - {venue.close_time}
                  </p>

                  <div className="space-y-2">
                    {venueMatches.length === 0 ? (
                      <p className="text-xs text-gray-400 italic py-2">No scheduled matches</p>
                    ) : (
                      venueMatches.map((m) => (
                        <div
                          key={m.id}
                          className="bg-white p-2.5 rounded-lg border text-xs space-y-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between text-[10px] text-gray-500">
                            <span>
                              {new Date(m.starts_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span className="font-bold text-[#0B3C8C]">{m.round}</span>
                          </div>
                          <p className="font-semibold text-gray-800 line-clamp-1">
                            {m.home_team?.name} vs {m.away_team?.name}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
