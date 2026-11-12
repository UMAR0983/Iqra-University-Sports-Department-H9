'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { hubStore } from '@/lib/store';
import { Match, MatchEvent } from '@/types';
import {
  Radio,
  MapPin,
  Clock,
  Trophy,
  Activity,
  Flame,
  ArrowRight,
  Shield,
  Edit3,
} from 'lucide-react';

export default function LiveMatchCenter() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [currentUser, setCurrentUser] = useState(hubStore.currentUser);

  useEffect(() => {
    const update = () => {
      setMatches(hubStore.getMatches());
      setEvents([...hubStore.matchEvents]);
      setCurrentUser({ ...hubStore.currentUser });
    };
    update();
    return hubStore.subscribe(update);
  }, []);

  const liveMatches = matches.filter((m) => m.status === 'live');
  const activeMatch = liveMatches[0] || matches.find((m) => m.status === 'completed') || matches[0];
  const activeEvents = events
    .filter((e) => e.match_id === activeMatch?.id)
    .sort((a, b) => (b.minute || 0) - (a.minute || 0));

  const isOfficial =
    currentUser.role === 'referee' ||
    currentUser.role === 'sports_admin' ||
    currentUser.role === 'super_admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-3.5 w-3.5 rounded-full bg-[#D92D20] animate-ping" />
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Live Match Center
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Real-time score updates, live timeline commentary, and match event tracking.
          </p>
        </div>

        {isOfficial && activeMatch && (
          <Link
            href={`/dashboard/referee?matchId=${activeMatch.id}`}
            className="bg-[#0B3C8C] hover:bg-[#08265E] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 shadow-sm"
          >
            <Edit3 className="w-4 h-4 text-[#F2B705]" />
            <span>Open Referee Scorer Console</span>
          </Link>
        )}
      </div>

      {!activeMatch ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
          <Radio className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-800">No active matches today</h2>
          <p className="text-xs text-gray-500 mt-1">
            Check the upcoming schedule for fixtures starting later this week.
          </p>
          <Link
            href="/schedule"
            className="mt-4 inline-block bg-[#0B3C8C] text-white px-4 py-2 rounded-lg text-xs font-bold"
          >
            View Full Schedule
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Giant Scoreboard (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-[#08265E] via-[#0B3C8C] to-[#08265E] rounded-2xl text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden border-2 border-blue-400/30">
              {/* Background watermark */}
              <div className="absolute right-0 bottom-0 opacity-10 text-9xl font-serif font-black pointer-events-none pr-4">
                IU
              </div>

              {/* Tournament tag */}
              <div className="flex items-center justify-between text-xs text-blue-200 mb-6">
                <span className="font-semibold uppercase tracking-wider bg-blue-900/80 px-3 py-1 rounded-full border border-blue-400/30">
                  {activeMatch.tournament?.name || 'IU Premier League'} • {activeMatch.round}
                </span>

                {activeMatch.status === 'live' ? (
                  <span className="bg-[#D92D20] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>LIVE IN PLAY</span>
                  </span>
                ) : (
                  <span className="bg-gray-700/80 text-gray-200 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                    {activeMatch.status}
                  </span>
                )}
              </div>

              {/* Big Teams & Scoreboard */}
              <div className="grid grid-cols-3 items-center text-center my-6">
                {/* Home Team */}
                <div className="space-y-2">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto flex items-center justify-center font-serif text-xl sm:text-2xl font-black shadow-lg border-2 border-white/40"
                    style={{ backgroundColor: activeMatch.home_team?.primary_color || '#0B3C8C' }}
                  >
                    {activeMatch.home_team?.short_name || 'HOME'}
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-xl text-white">
                    {activeMatch.home_team?.name}
                  </h3>
                  <p className="text-xs text-blue-200 truncate">
                    {activeMatch.home_team?.department}
                  </p>
                </div>

                {/* Score */}
                <div className="space-y-2">
                  <div className="text-5xl sm:text-7xl font-mono font-black text-[#F2B705] tracking-tight drop-shadow-md">
                    {activeMatch.home_score} : {activeMatch.away_score}
                  </div>
                  <div className="inline-flex items-center space-x-1.5 bg-black/30 rounded-full px-3 py-1 text-xs text-blue-200 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#F2B705]" />
                    <span>Running Clock</span>
                  </div>
                </div>

                {/* Away Team */}
                <div className="space-y-2">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto flex items-center justify-center font-serif text-xl sm:text-2xl font-black shadow-lg border-2 border-white/40"
                    style={{ backgroundColor: activeMatch.away_team?.primary_color || '#D92D20' }}
                  >
                    {activeMatch.away_team?.short_name || 'AWAY'}
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-xl text-white">
                    {activeMatch.away_team?.name}
                  </h3>
                  <p className="text-xs text-blue-200 truncate">
                    {activeMatch.away_team?.department}
                  </p>
                </div>
              </div>

              {/* Venue details */}
              <div className="border-t border-blue-400/20 pt-4 mt-6 flex flex-wrap items-center justify-between text-xs text-blue-200">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#F2B705]" />
                  <span>{activeMatch.venue?.name}</span>
                </div>
                <span>Sport: <strong>{activeMatch.sport?.name}</strong></span>
              </div>
            </div>

            {/* Match Summary / Info */}
            {activeMatch.result_summary && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900">
                <span className="font-bold text-[#0B3C8C] uppercase tracking-wider block mb-1">
                  Official Match Note
                </span>
                {activeMatch.result_summary}
              </div>
            )}
          </div>

          {/* Right Col: Real-time Timeline Feed */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#0B3C8C]" />
                  <h3 className="font-serif font-bold text-base text-gray-900">
                    Live Event Timeline
                  </h3>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  {activeEvents.length} Events
                </span>
              </div>

              {activeEvents.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs italic">
                  No match events recorded yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {activeEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs"
                    >
                      <span className="bg-[#0B3C8C] text-white font-mono font-bold text-[10px] px-1.5 py-0.5 rounded mt-0.5">
                        {ev.minute}&apos;
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold uppercase tracking-wider text-[#08265E]">
                            {ev.event_type}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600 font-semibold">
                            +{ev.value}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-0.5 font-medium">
                          {ev.note || `Point awarded to team`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom help banner */}
            <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-500">
              Updates stream automatically in real-time. Matches are logged into university archives.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
