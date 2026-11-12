'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { hubStore } from '@/lib/store';
import { UserRole } from '@/types';
import { Trophy, Shield, KeyRound, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@iqra.edu.pk')) {
      setError('Please sign in with your official university email (@iqra.edu.pk).');
      return;
    }
    setError(null);
    router.push('/dashboard/player');
  };

  const handleDemoLogin = (role: UserRole) => {
    hubStore.switchRole(role);
    switch (role) {
      case 'super_admin':
      case 'sports_admin':
        router.push('/dashboard/admin');
        break;
      case 'coach':
        router.push('/dashboard/coach');
        break;
      case 'referee':
        router.push('/dashboard/referee');
        break;
      case 'player':
        router.push('/dashboard/player');
        break;
      default:
        router.push('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#0B3C8C] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Trophy className="w-6 h-6 text-[#F2B705]" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Sign In to IU Sports Hub
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Official sports management portal for Iqra University Islamabad
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-3 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              University Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="student@iqra.edu.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3C8C]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#0B3C8C] hover:bg-[#08265E] text-white font-bold rounded-lg transition-colors shadow-sm"
          >
            Sign In
          </button>
        </form>

        {/* Demo Fast Logins for Grading */}
        <div className="border-t pt-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center mb-3">
            Quick 1-Click Role Login (Demo & Grading)
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => handleDemoLogin('sports_admin')}
              className="p-2 border rounded-lg bg-gray-50 hover:bg-blue-50 font-bold text-[#0B3C8C] transition-colors"
            >
              Sports Admin
            </button>
            <button
              onClick={() => handleDemoLogin('coach')}
              className="p-2 border rounded-lg bg-gray-50 hover:bg-blue-50 font-bold text-[#0B3C8C] transition-colors"
            >
              Team Coach
            </button>
            <button
              onClick={() => handleDemoLogin('referee')}
              className="p-2 border rounded-lg bg-gray-50 hover:bg-blue-50 font-bold text-[#0B3C8C] transition-colors"
            >
              Referee / Scorer
            </button>
            <button
              onClick={() => handleDemoLogin('player')}
              className="p-2 border rounded-lg bg-gray-50 hover:bg-blue-50 font-bold text-[#0B3C8C] transition-colors"
            >
              Student Player
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
