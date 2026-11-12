'use client';

import React, { useState, useEffect } from 'react';
import { hubStore } from '@/lib/store';
import { Venue, Match } from '@/types';
import { MapPin, Clock, Users, ShieldCheck, Wrench, CheckCircle } from 'lucide-react';

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const update = () => {
      setVenues(hubStore.getVenues());
      setMatches(hubStore.getMatches());
    };
    update();
    return hubStore.subscribe(update);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b pb-5">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Campus Sports Venues & Resources
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          University grounds, indoor pavilions, and courts managed under zero-clash scheduling policies.
        </p>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {venues.map((venue) => {
          const venueMatches = matches.filter((m) => m.venue_id === venue.id);
          const activeGame = venueMatches.find((m) => m.status === 'live');

          return (
            <div
              key={venue.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-[#0B3C8C] border border-blue-200">
                    Campus Facility
                  </span>

                  {activeGame ? (
                    <span className="bg-[#D92D20] text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                      Live In Use
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                      Operational
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-serif font-bold text-gray-900">
                  {venue.name}
                </h2>

                <div className="mt-4 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#0B3C8C]" />
                    <span>{venue.location || 'Iqra University Islamabad'}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Operating Hours: <strong>{venue.open_time} - {venue.close_time}</strong> daily</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>Spectator Capacity: <strong>{venue.capacity?.toLocaleString() || '500+'} seats</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">
                  Allocated Fixtures: <strong>{venueMatches.length} games</strong>
                </span>
                <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>0 Double-Bookings</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
