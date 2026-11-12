'use client';

import React, { useState, useEffect } from 'react';
import { hubStore } from '@/lib/store';
import { Match, Notification, Profile } from '@/types';
import { User, Bell, Calendar, Trophy, Check, Shirt, MapPin } from 'lucide-react';

export default function PlayerDashboard() {
  const [currentUser, setCurrentUser] = useState<Profile>(hubStore.currentUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const update = () => {
      setCurrentUser({ ...hubStore.currentUser });
      setNotifications(hubStore.getNotifications());
      setMatches(hubStore.getMatches());
    };
    update();
    return hubStore.subscribe(update);
  }, []);

  const handleMarkRead = (id: string) => {
    hubStore.markNotificationRead(id);
  };

  const myMatches = matches.filter(
    (m) =>
      m.home_team?.name.includes('Titans') ||
      m.away_team?.name.includes('Titans')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b pb-5">
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-[#0B3C8C] text-white px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
            Student Athlete Portal
          </span>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Player Profile & Match Center
          </h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Review personal player statistics, team assignments, and match schedule notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#0B3C8C] text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-[#F2B705]">
              {currentUser.full_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900">
                {currentUser.full_name}
              </h2>
              <span className="text-xs text-gray-500 font-mono block">
                {currentUser.student_id || 'IU-CS-2023-412'}
              </span>
              <span className="inline-block mt-1 text-[10px] bg-blue-100 text-[#0B3C8C] font-bold px-2 py-0.5 rounded uppercase">
                {currentUser.department || 'Computer Science'}
              </span>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-400">Team:</span>
              <span className="font-bold text-gray-800">FCS Titans (Futsal)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Jersey Number:</span>
              <span className="font-bold text-[#0B3C8C]">#7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Position:</span>
              <span className="font-bold text-gray-800">Forward / Striker</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Semester:</span>
              <span className="font-bold text-gray-800">6th Semester</span>
            </div>
          </div>
        </div>

        {/* My Matches & Notifications (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications Inbox */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-[#0B3C8C]" />
                <h3 className="font-serif font-bold text-base text-gray-900">
                  Automated Match Notifications
                </h3>
              </div>
              <span className="text-xs bg-red-100 text-[#D92D20] font-bold px-2 py-0.5 rounded-full">
                {notifications.filter((n) => !n.is_read).length} Unread
              </span>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-4 text-center">
                No notifications right now.
              </p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                      notif.is_read
                        ? 'bg-gray-50 border-gray-200 text-gray-600'
                        : 'bg-blue-50/60 border-blue-200 text-gray-900 font-medium'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm">{notif.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{notif.body}</p>
                    </div>

                    {!notif.is_read && (
                      <button
                        onClick={() => handleMarkRead(notif.id)}
                        className="bg-white hover:bg-gray-100 border text-gray-700 px-2.5 py-1 rounded text-[11px] font-bold ml-4 transition-colors"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Assigned Matches */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b pb-3">
              <Calendar className="w-4 h-4 text-[#0B3C8C]" />
              <h3 className="font-serif font-bold text-base text-gray-900">
                My Squad Fixtures
              </h3>
            </div>

            <div className="space-y-3">
              {myMatches.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#0B3C8C]">{m.round}</span>
                    <p className="font-bold text-sm text-gray-900 mt-0.5">
                      {m.home_team?.name} vs {m.away_team?.name}
                    </p>
                    <p className="text-gray-500 mt-1 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{m.venue?.name}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded font-bold text-[10px] uppercase ${
                        m.status === 'completed'
                          ? 'bg-gray-200 text-gray-700'
                          : m.status === 'live'
                          ? 'bg-[#D92D20] text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {m.status}
                    </span>
                    <p className="text-gray-500 mt-1 text-[11px]">
                      {new Date(m.starts_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
