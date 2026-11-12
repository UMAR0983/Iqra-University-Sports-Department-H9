'use client';

import React, { useState, useEffect } from 'react';
import { hubStore } from '@/lib/store';
import { Tournament, StandingsRow, Match, Team } from '@/types';
import {
  Trophy,
  Award,
  Calendar,
  Users,
  Shield,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTab, setActiveTab] = useState<'standings' | 'fixtures' | 'bracket'>('standings');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    const update = () => {
      setTournaments(hubStore.getTournaments());
      setStandings(hubStore.getStandings());
      setMatches(hubStore.getMatches());
      setTeams(hubStore.getTeams());
    };
    update();
    return hubStore.subscribe(update);
  }, []);

  const activeTour = tournaments[0];
  const tourMatches = matches.filter((m) => m.tournament_id === activeTour?.id);

  const handleRegisterTeam = () => {
    setRegisterSuccess(true);
    setTimeout(() => setRegisterSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Tournament Hero Banner */}
      {activeTour && (
        <div className="bg-gradient-to-r from-[#08265E] via-[#0B3C8C] to-[#08265E] text-white rounded-2xl p-6 sm:p-8 shadow-xl border-t-4 border-[#F2B705] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center space-x-2 text-xs text-[#F2B705] font-bold uppercase tracking-wider mb-2">
                <Trophy className="w-4 h-4" />
                <span>Flagship Inter-Department Championship</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
                {activeTour.name}
              </h1>
              <p className="text-sm text-blue-200 mt-2 max-w-xl">
                {activeTour.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-blue-100 font-medium">
                <span>Season: <strong>{activeTour.season}</strong></span>
                <span>•</span>
                <span className="capitalize">Format: <strong>{activeTour.format.replace('_', ' ')}</strong></span>
                <span>•</span>
                <span>Max Teams: <strong>{activeTour.max_teams} Departments</strong></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRegisterTeam}
                className="bg-[#F2B705] hover:bg-yellow-400 text-[#08265E] px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Register Department Team</span>
              </button>
            </div>
          </div>

          {registerSuccess && (
            <div className="mt-4 bg-emerald-500/90 text-white text-xs font-semibold p-3 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Team registration submitted successfully! Awaiting Sports Admin approval.</span>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('standings')}
            className={`py-3 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'standings'
                ? 'border-[#0B3C8C] text-[#0B3C8C]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Points Table / Standings</span>
          </button>
          <button
            onClick={() => setActiveTab('fixtures')}
            className={`py-3 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'fixtures'
                ? 'border-[#0B3C8C] text-[#0B3C8C]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Tournament Fixtures ({tourMatches.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bracket')}
            className={`py-3 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'bracket'
                ? 'border-[#0B3C8C] text-[#0B3C8C]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Playoff Bracket</span>
          </button>
        </nav>
      </div>

      {/* Standings View */}
      {activeTab === 'standings' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900">
                Official Group Standings
              </h2>
              <p className="text-xs text-gray-500">
                Sorted by Points → Goal Difference → Goals For → Head-to-Head
              </p>
            </div>
            <span className="text-xs font-semibold bg-blue-50 text-[#0B3C8C] px-3 py-1 rounded-full border border-blue-200">
              Win = 3 pts | Draw = 1 pt | Loss = 0 pts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-[11px] border-y">
                <tr>
                  <th className="py-3 px-3">Pos</th>
                  <th className="py-3 px-4">Department / Team</th>
                  <th className="py-3 px-2 text-center">P</th>
                  <th className="py-3 px-2 text-center">W</th>
                  <th className="py-3 px-2 text-center">D</th>
                  <th className="py-3 px-2 text-center">L</th>
                  <th className="py-3 px-2 text-center">GF</th>
                  <th className="py-3 px-2 text-center">GA</th>
                  <th className="py-3 px-2 text-center">GD</th>
                  <th className="py-3 px-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {standings.map((team, idx) => (
                  <tr
                    key={team.team_id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      idx === 0
                        ? 'bg-amber-50/40 font-semibold'
                        : idx < 2
                        ? 'bg-blue-50/20'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-gray-500">
                      {idx === 0 ? '🏆 1' : idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0B3C8C]" />
                        <span className="font-bold text-gray-900 text-sm">
                          {team.team_name}
                        </span>
                        <span className="text-gray-400 text-[10px]">
                          ({team.department})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center text-gray-700">{team.played}</td>
                    <td className="py-3 px-2 text-center text-gray-700">{team.won}</td>
                    <td className="py-3 px-2 text-center text-gray-700">{team.drawn}</td>
                    <td className="py-3 px-2 text-center text-gray-700">{team.lost}</td>
                    <td className="py-3 px-2 text-center text-gray-600">{team.goals_for}</td>
                    <td className="py-3 px-2 text-center text-gray-600">{team.goals_against}</td>
                    <td className="py-3 px-2 text-center font-bold text-gray-800">
                      {team.goal_diff > 0 ? `+${team.goal_diff}` : team.goal_diff}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-sm text-[#0B3C8C]">
                      {team.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-gray-500 flex items-center space-x-2 pt-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span>Top 2 teams advance to the Championship Finals.</span>
          </div>
        </div>
      )}

      {/* Fixtures View */}
      {activeTab === 'fixtures' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tourMatches.map((m) => (
            <div
              key={m.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-[#0B3C8C]">{m.round}</span>
                <p className="font-bold text-sm text-gray-900 mt-1">
                  {m.home_team?.name} vs {m.away_team?.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(m.starts_at).toLocaleDateString()} at {m.venue?.name}
                </p>
              </div>

              <div className="text-right">
                {m.status === 'completed' ? (
                  <span className="font-bold text-sm bg-gray-100 px-2.5 py-1 rounded">
                    {m.home_score} - {m.away_score}
                  </span>
                ) : (
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    {m.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Playoff Bracket View */}
      {activeTab === 'bracket' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h3 className="font-serif font-bold text-base text-gray-900 mb-6">
            Playoff Knockout Tree
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-2xl mx-auto">
            {/* Semi-finals */}
            <div className="space-y-6">
              <div className="bg-gray-50 border p-3.5 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-[#0B3C8C] uppercase tracking-wider block">
                  Semi Final 1
                </span>
                <div className="flex justify-between text-xs font-bold">
                  <span>FCS Titans (Seed 1)</span>
                  <span className="text-emerald-600">4</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Business Blazers</span>
                  <span>2</span>
                </div>
              </div>

              <div className="bg-gray-50 border p-3.5 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-[#0B3C8C] uppercase tracking-wider block">
                  Semi Final 2
                </span>
                <div className="flex justify-between text-xs font-bold">
                  <span>Engineering Eagles</span>
                  <span className="text-emerald-600">3</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Media Mavericks</span>
                  <span>1</span>
                </div>
              </div>
            </div>

            {/* Grand Final */}
            <div className="bg-amber-50/60 border-2 border-[#F2B705] p-5 rounded-2xl shadow-md text-center space-y-3">
              <div className="inline-flex items-center space-x-1.5 text-xs font-black text-[#08265E] uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-[#F2B705]" />
                <span>Grand Championship Final</span>
              </div>
              <p className="font-serif font-bold text-base text-gray-900">
                FCS Titans vs Engineering Eagles
              </p>
              <span className="text-xs text-gray-500 block">
                Main Pavilion • Sat 25 March 16:00
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
