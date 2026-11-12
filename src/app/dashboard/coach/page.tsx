'use client';

import React, { useState, useEffect } from 'react';
import { hubStore } from '@/lib/store';
import { Team, TeamMember, Tournament } from '@/types';
import { Users, Shield, Check, X, Trophy, Shirt, CheckCircle } from 'lucide-react';

export default function CoachDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setTeams(hubStore.getTeams());
      setMembers([...hubStore.teamMembers]);
      setTournaments(hubStore.getTournaments());
    };
    update();
    return hubStore.subscribe(update);
  }, []);

  const myTeam = teams[0]; // FCS Titans
  const myMembers = members.filter((m) => m.team_id === myTeam?.id);
  const pendingRequests = myMembers.filter((m) => m.status === 'pending');
  const activeRoster = myMembers.filter((m) => m.status === 'approved');

  const handleApprove = (memberId: string) => {
    hubStore.approveTeamMember(memberId);
    setSuccessMsg('Player approved and added to active tournament roster!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b pb-5">
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-[#0B3C8C] text-white px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
            Coach Console
          </span>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Team Management & Roster
          </h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Review player applications, submit match lineups, and register squads for championships.
        </p>

        {successMsg && (
          <div className="mt-4 bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-lg text-xs font-semibold flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {myTeam && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-md"
                style={{ backgroundColor: myTeam.primary_color }}
              >
                {myTeam.short_name}
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-gray-900">
                  {myTeam.name}
                </h2>
                <p className="text-xs text-gray-500">{myTeam.department}</p>
                <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Eligible for IU Premier League
                </span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Squad:</span>
                <span className="font-bold text-gray-800">{myMembers.length} athletes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Head Coach:</span>
                <span className="font-bold text-gray-800">Hamza Ali</span>
              </div>
            </div>
          </div>

          {/* Pending Applications Queue */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#0B3C8C]" />
                <h3 className="font-serif font-bold text-base text-gray-900">
                  Player Join Requests
                </h3>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                {pendingRequests.length} Pending
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-6 text-center">
                No pending join applications at this moment.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-xs"
                  >
                    <div>
                      <p className="font-bold text-gray-900">
                        Player Application (Jersey #{req.jersey_no})
                      </p>
                      <p className="text-gray-500 text-[11px]">
                        Position: {req.position} • Status: Pending verification
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-bold flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Active Roster Table */}
            <div className="pt-4 border-t">
              <h4 className="font-serif font-bold text-sm text-gray-900 mb-3">
                Approved Squad Roster
              </h4>
              <div className="space-y-2">
                {activeRoster.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border bg-white text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-[#0B3C8C] text-white flex items-center justify-center font-bold text-[10px]">
                        #{m.jersey_no}
                      </span>
                      <div>
                        <span className="font-bold text-gray-800">Zain Ul Abideen</span>
                        <span className="text-gray-400 text-[10px] ml-2">
                          ({m.position})
                        </span>
                      </div>
                    </div>
                    <span className="text-emerald-600 font-semibold text-[11px]">
                      Eligible Player
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
