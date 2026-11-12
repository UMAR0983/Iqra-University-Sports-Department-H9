'use client';

import React, { useState, useEffect } from 'react';
import { hubStore } from '@/lib/store';
import { Team, TeamMember, Profile } from '@/types';
import { Users, Shield, UserPlus, CheckCircle, Trophy, Shirt } from 'lucide-react';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [joinModalTeam, setJoinModalTeam] = useState<Team | null>(null);
  const [jerseyNo, setJerseyNo] = useState<number>(10);
  const [position, setPosition] = useState<string>('Midfielder');
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(hubStore.currentUser);

  useEffect(() => {
    const update = () => {
      setTeams(hubStore.getTeams());
      setCurrentUser({ ...hubStore.currentUser });
    };
    update();
    return hubStore.subscribe(update);
  }, []);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinModalTeam) return;

    hubStore.joinTeamRequest(
      joinModalTeam.id,
      currentUser.id,
      jerseyNo,
      position
    );

    setJoinSuccess(`Join request submitted to Coach for ${joinModalTeam.name}!`);
    setJoinModalTeam(null);
    setTimeout(() => setJoinSuccess(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b pb-5">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Department Sports Teams
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore official faculty & department squads representing Iqra University in competitive athletic seasons.
        </p>

        {joinSuccess && (
          <div className="mt-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold p-3 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{joinSuccess}</span>
          </div>
        )}
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0B3C8C] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-sm"
                  style={{ backgroundColor: team.primary_color }}
                >
                  {team.short_name || team.name.substring(0, 3)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {team.department}
                </span>
              </div>

              <h2 className="text-xl font-serif font-bold text-gray-900">
                {team.name}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Faculty: <strong>{team.department}</strong>
              </p>

              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Head Coach:</span>
                  <span className="font-semibold text-gray-800">
                    {team.coach?.full_name || 'Assigned by Dept.'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-semibold text-emerald-600">Active Roster</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={() => setJoinModalTeam(team)}
                className="w-full py-2 bg-[#0B3C8C] hover:bg-[#08265E] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>Join Team Roster</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Join Team Modal */}
      {joinModalTeam && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleJoinSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-900">
                  Join {joinModalTeam.name}
                </h3>
                <span className="text-xs text-gray-500">
                  Submit player application for Coach review
                </span>
              </div>
              <button
                type="button"
                onClick={() => setJoinModalTeam(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Applicant Student / Athlete
                </label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser.full_name} (${currentUser.student_id || 'Student'})`}
                  className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Preferred Jersey Number
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  required
                  value={jerseyNo}
                  onChange={(e) => setJerseyNo(Number(e.target.value))}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Preferred Playing Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
                >
                  <option value="Forward / Striker">Forward / Striker</option>
                  <option value="Midfielder / Playmaker">Midfielder / Playmaker</option>
                  <option value="Defender">Defender</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler / All-Rounder">Bowler / All-Rounder</option>
                  <option value="Point Guard">Point Guard</option>
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-gray-600">
                <p className="font-semibold text-[#0B3C8C]">Eligibility Criteria:</p>
                <p className="mt-0.5 text-[11px]">
                  Must be an actively enrolled student with university ID in good academic standing.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setJoinModalTeam(null)}
                className="w-1/2 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 bg-[#0B3C8C] hover:bg-[#08265E] text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
