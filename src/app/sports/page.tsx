'use client';

import React, { useState, useEffect } from 'react';
import { hubStore } from '@/lib/store';
import { Sport, SportCategory } from '@/types';
import { Trophy, Users, Search, Filter, Shield, BookOpen, CheckCircle } from 'lucide-react';

export default function SportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | SportCategory>('all');
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);

  useEffect(() => {
    const update = () => setSports(hubStore.getSports());
    update();
    return hubStore.subscribe(update);
  }, []);

  const filteredSports = sports.filter((sport) => {
    const matchesSearch =
      sport.name.toLowerCase().includes(search.toLowerCase()) ||
      sport.rules?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || sport.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Sports Catalogue
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Official university sports catalogue with rulebooks, team requirements, and equipment specifications.
            </p>
          </div>

          <span className="text-xs font-semibold bg-blue-50 text-[#0B3C8C] border border-blue-200 px-3 py-1.5 rounded-full self-start sm:self-auto">
            {sports.length} Approved Sports
          </span>
        </div>

        {/* Filters & Search */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search sport or rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'indoor', 'outdoor', 'esports', 'athletics'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-[#0B3C8C] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Sports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredSports.map((sport) => (
          <div
            key={sport.id}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0B3C8C] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl p-2 bg-blue-50 rounded-xl">
                  {sport.icon || '🏅'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {sport.category}
                </span>
              </div>

              <h2 className="text-xl font-serif font-bold text-gray-900">
                {sport.name}
              </h2>

              <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>Team Size: <strong>{sport.team_size} players</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  <span className="capitalize">Gender: <strong>{sport.gender}</strong></span>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500 line-clamp-3 leading-relaxed">
                {sport.rules || 'Standard university athletic regulations apply.'}
              </p>
            </div>

            <button
              onClick={() => setSelectedSport(sport)}
              className="mt-6 w-full py-2 bg-blue-50 hover:bg-[#0B3C8C] text-[#0B3C8C] hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official Rules & Details</span>
            </button>
          </div>
        ))}
      </div>

      {/* Rules Detail Modal */}
      {selectedSport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedSport.icon || '🏅'}</span>
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900">
                    {selectedSport.name} Rulebook
                  </h3>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {selectedSport.category} • Team of {selectedSport.team_size}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSport(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs">
                <p className="font-semibold text-[#0B3C8C]">Eligible Teams:</p>
                <p className="mt-0.5 text-gray-600">
                  Open to all 8 academic departments (FCS, BBA, EE, Media, AI, Law, Pharmacy, Design).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1">
                  Official Match Regulations:
                </h4>
                <p className="text-xs leading-relaxed text-gray-600 bg-gray-50 p-3 rounded-lg border">
                  {selectedSport.rules}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="border p-2.5 rounded-lg">
                  <span className="text-gray-400 block text-[10px] uppercase">Roster Squad</span>
                  <span className="font-bold text-gray-800">{selectedSport.team_size} on-court + 5 subs</span>
                </div>
                <div className="border p-2.5 rounded-lg">
                  <span className="text-gray-400 block text-[10px] uppercase">Gender Category</span>
                  <span className="font-bold text-gray-800 capitalize">{selectedSport.gender}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedSport(null)}
              className="w-full py-2.5 bg-[#0B3C8C] text-white rounded-lg text-xs font-bold hover:bg-[#08265E] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
