'use client';

import React, { useState, useEffect } from 'react';
import { hubStore } from '@/lib/store';
import { Match, MatchEvent } from '@/types';
import {
  Activity,
  Plus,
  RotateCcw,
  CheckCircle2,
  Trophy,
  AlertCircle,
  Flag,
  Radio,
  Clock,
} from 'lucide-react';

export default function RefereeDashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [minute, setMinute] = useState<number>(35);
  const [eventNote, setEventNote] = useState<string>('');
  const [momName, setMomName] = useState<string>('Zain Ul Abideen');
  const [matchSummary, setMatchSummary] = useState<string>('A fiercely competitive match with high sportsmanship.');
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const allMatches = hubStore.getMatches();
      setMatches(allMatches);
      setEvents([...hubStore.matchEvents]);

      if (!selectedMatchId && allMatches.length > 0) {
        const live = allMatches.find((m) => m.status === 'live');
        setSelectedMatchId(live ? live.id : allMatches[0].id);
      }
    };
    update();
    return hubStore.subscribe(update);
  }, [selectedMatchId]);

  const activeMatch = matches.find((m) => m.id === selectedMatchId);
  const matchEvents = events
    .filter((e) => e.match_id === selectedMatchId)
    .sort((a, b) => (b.minute || 0) - (a.minute || 0));

  const handleAddEvent = (teamId: string | undefined, eventType: any, value = 1) => {
    if (!activeMatch) return;
    hubStore.addMatchEvent(activeMatch.id, {
      team_id: teamId,
      event_type: eventType,
      minute: minute,
      value: value,
      note: eventNote || `${eventType.toUpperCase()} recorded by official referee`,
    });
    setEventNote('');
    setFeedbackMsg(`Recorded ${eventType.toUpperCase()} for team! Spectator view updated.`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleUndo = () => {
    if (!activeMatch) return;
    hubStore.undoLastEvent(activeMatch.id);
    setFeedbackMsg('Last event undone successfully.');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleFinishMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMatch) return;
    hubStore.finishMatch(activeMatch.id, momName, matchSummary);
    setFinishModalOpen(false);
    setFeedbackMsg('Match locked and final results calculated for standings points table!');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#D92D20] text-white px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Scorer Console
            </span>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Referee & Scorer Desk
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Real-time officiating portal. Enter goals, points, fouls, and submit certified match reports.
          </p>
        </div>

        {/* Match Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-gray-700">Select Match:</label>
          <select
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className="text-xs p-2 border border-gray-300 rounded-lg font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
          >
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.home_team?.name} vs {m.away_team?.name} ({m.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {feedbackMsg && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-lg text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {activeMatch && (
        <div className="space-y-6">
          {/* Active Live Match Control Card */}
          <div className="bg-[#08265E] text-white rounded-2xl p-6 sm:p-8 shadow-xl border-t-4 border-[#F2B705]">
            <div className="flex items-center justify-between text-xs text-blue-200 mb-4">
              <span>{activeMatch.tournament?.name} • {activeMatch.round}</span>
              <span className="bg-[#D92D20] text-white font-extrabold px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider">
                {activeMatch.status}
              </span>
            </div>

            {/* Live Scoreboard */}
            <div className="grid grid-cols-3 items-center text-center my-4">
              <div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                  {activeMatch.home_team?.name}
                </h3>
                <span className="text-xs text-blue-300 block">HOME TEAM</span>
              </div>

              <div>
                <div className="text-5xl sm:text-7xl font-mono font-black text-[#F2B705]">
                  {activeMatch.home_score} : {activeMatch.away_score}
                </div>
                <div className="mt-2 flex items-center justify-center space-x-2">
                  <span className="text-xs text-blue-200">Minute:</span>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={minute}
                    onChange={(e) => setMinute(Number(e.target.value))}
                    className="w-16 p-1 text-center bg-blue-950 border border-blue-400/40 rounded text-xs font-bold text-white"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                  {activeMatch.away_team?.name}
                </h3>
                <span className="text-xs text-blue-300 block">AWAY TEAM</span>
              </div>
            </div>

            {/* Quick Action Buttons for Home & Away */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-6 border-t border-blue-400/20">
              {/* Home Team Actions */}
              <div className="bg-blue-900/60 p-4 rounded-xl border border-blue-400/30 space-y-3">
                <p className="font-bold text-xs uppercase tracking-wider text-[#F2B705] text-center">
                  + {activeMatch.home_team?.name} Events
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleAddEvent(activeMatch.home_team_id, 'goal', 1)}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
                  >
                    ⚽ Goal / Run (+1)
                  </button>
                  <button
                    onClick={() => handleAddEvent(activeMatch.home_team_id, 'point', 1)}
                    className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                  >
                    🎯 Point (+1)
                  </button>
                  <button
                    onClick={() => handleAddEvent(activeMatch.home_team_id, 'yellow_card', 0)}
                    className="py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition-colors"
                  >
                    🟨 Yellow Card
                  </button>
                  <button
                    onClick={() => handleAddEvent(activeMatch.home_team_id, 'red_card', 0)}
                    className="py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                  >
                    🟥 Red Card
                  </button>
                </div>
              </div>

              {/* Away Team Actions */}
              <div className="bg-blue-900/60 p-4 rounded-xl border border-blue-400/30 space-y-3">
                <p className="font-bold text-xs uppercase tracking-wider text-[#F2B705] text-center">
                  + {activeMatch.away_team?.name} Events
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleAddEvent(activeMatch.away_team_id, 'goal', 1)}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
                  >
                    ⚽ Goal / Run (+1)
                  </button>
                  <button
                    onClick={() => handleAddEvent(activeMatch.away_team_id, 'point', 1)}
                    className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                  >
                    🎯 Point (+1)
                  </button>
                  <button
                    onClick={() => handleAddEvent(activeMatch.away_team_id, 'yellow_card', 0)}
                    className="py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition-colors"
                  >
                    🟨 Yellow Card
                  </button>
                  <button
                    onClick={() => handleAddEvent(activeMatch.away_team_id, 'red_card', 0)}
                    className="py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                  >
                    🟥 Red Card
                  </button>
                </div>
              </div>
            </div>

            {/* Utility Bar: Undo & Finalize Match */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-6 border-t border-blue-400/20 text-xs">
              <button
                onClick={handleUndo}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-bold flex items-center space-x-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo Last Event</span>
              </button>

              <button
                onClick={() => setFinishModalOpen(true)}
                className="bg-[#F2B705] hover:bg-yellow-400 text-[#08265E] font-black px-5 py-2 rounded-lg shadow-md transition-colors flex items-center space-x-1.5"
              >
                <Trophy className="w-4 h-4" />
                <span>End Match & Submit Final Report</span>
              </button>
            </div>
          </div>

          {/* Timeline Feed */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900">
              Match Timeline Log
            </h3>
            <div className="space-y-2">
              {matchEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 bg-gray-50 border rounded-lg text-xs flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold bg-[#0B3C8C] text-white px-2 py-0.5 rounded">
                      {ev.minute}&apos;
                    </span>
                    <span className="font-bold uppercase tracking-wider text-gray-900">
                      {ev.event_type}
                    </span>
                    <span className="text-gray-500">{ev.note}</span>
                  </div>
                  <span className="font-bold text-emerald-600">+{ev.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Finish Match Modal */}
      {finishModalOpen && activeMatch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleFinishMatch}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-serif font-bold text-gray-900">
                Official Match Closure Report
              </h3>
              <button
                type="button"
                onClick={() => setFinishModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border text-center">
                <span className="text-xs text-gray-500 uppercase font-bold">Final Score</span>
                <p className="text-2xl font-black text-[#0B3C8C]">
                  {activeMatch.home_team?.name} ({activeMatch.home_score}) - ({activeMatch.away_score}) {activeMatch.away_team?.name}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Player of the Match (Man of the Match)
                </label>
                <input
                  type="text"
                  required
                  value={momName}
                  onChange={(e) => setMomName(e.target.value)}
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Referee Match Summary / Comments
                </label>
                <textarea
                  rows={3}
                  required
                  value={matchSummary}
                  onChange={(e) => setMatchSummary(e.target.value)}
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setFinishModalOpen(false)}
                className="w-1/2 py-2 border rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 bg-[#0B3C8C] text-white rounded-lg text-xs font-bold hover:bg-[#08265E]"
              >
                Lock & Publish Result
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
