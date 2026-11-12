'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { hubStore } from '@/lib/store';
import { UserRole } from '@/types';
import {
  Trophy,
  Calendar,
  Radio,
  Users,
  MapPin,
  Bell,
  Search,
  Shield,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Flame,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(hubStore.currentUser);
  const [notifications, setNotifications] = useState(hubStore.getNotifications());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsub = hubStore.subscribe(() => {
      setCurrentUser({ ...hubStore.currentUser });
      const notifs = hubStore.getNotifications();
      setNotifications([...notifs]);
      setUnreadCount(notifs.filter((n) => !n.is_read).length);
    });
    setUnreadCount(hubStore.getNotifications().filter((n) => !n.is_read).length);
    return unsub;
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Trophy },
    { href: '/sports', label: 'Sports', icon: Flame },
    { href: '/schedule', label: 'Schedule', icon: Calendar },
    { href: '/live', label: 'Live Scores', icon: Radio, isLive: true },
    { href: '/tournaments', label: 'Tournaments', icon: Trophy },
    { href: '/teams', label: 'Teams', icon: Users },
    { href: '/venues', label: 'Venues', icon: MapPin },
  ];

  const handleRoleChange = (role: UserRole) => {
    hubStore.switchRole(role);
    setRoleDropdownOpen(false);
  };

  const getDashboardHref = () => {
    switch (currentUser.role) {
      case 'super_admin':
      case 'sports_admin':
        return '/dashboard/admin';
      case 'coach':
        return '/dashboard/coach';
      case 'referee':
        return '/dashboard/referee';
      case 'player':
        return '/dashboard/player';
      default:
        return '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#08265E] text-white shadow-md border-b border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & University Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0B3C8C] to-[#1F5FCC] p-1.5 flex items-center justify-center shadow-inner border border-blue-400/30 group-hover:scale-105 transition-transform">
              <Trophy className="w-6 h-6 text-[#F2B705]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif font-bold text-lg tracking-wider text-white">
                  IU SPORTS HUB
                </span>
                <span className="text-[10px] bg-[#F2B705] text-[#08265E] font-extrabold px-1.5 py-0.5 rounded tracking-widest uppercase">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-blue-200 tracking-tight font-medium">
                IQRA UNIVERSITY ISLAMABAD
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-[#0B3C8C] text-[#F2B705] font-semibold'
                      : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.isLive && (
                    <span className="inline-block w-2 h-2 rounded-full bg-[#D92D20] animate-ping" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Demo Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1.5 bg-blue-950/80 border border-blue-500/30 hover:border-[#F2B705]/60 text-xs text-blue-100 px-2.5 py-1.5 rounded-full transition-all hover:bg-blue-900"
                title="Switch role for demo and grading"
              >
                <Shield className="w-3.5 h-3.5 text-[#F2B705]" />
                <span className="font-semibold capitalize">
                  {currentUser.role.replace('_', ' ')}
                </span>
                <ChevronDown className="w-3 h-3 text-blue-300" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-2xl bg-white text-gray-800 ring-1 ring-black ring-opacity-5 py-1 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      Switch Role (Demo Mode)
                    </p>
                    <p className="text-xs text-blue-900 font-bold truncate">
                      {currentUser.full_name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRoleChange('super_admin')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 flex items-center justify-between font-medium"
                  >
                    <span>Super Admin (IT / Dir. Sports)</span>
                    {currentUser.role === 'super_admin' && (
                      <span className="text-[#0B3C8C]">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => handleRoleChange('sports_admin')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 flex items-center justify-between font-medium"
                  >
                    <span>Sports Admin (Ayesha Khan)</span>
                    {currentUser.role === 'sports_admin' && (
                      <span className="text-[#0B3C8C]">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => handleRoleChange('coach')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 flex items-center justify-between font-medium"
                  >
                    <span>Coach (Hamza Ali - Titans)</span>
                    {currentUser.role === 'coach' && (
                      <span className="text-[#0B3C8C]">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => handleRoleChange('referee')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 flex items-center justify-between font-medium"
                  >
                    <span>Referee / Scorer (Bilal Ahmed)</span>
                    {currentUser.role === 'referee' && (
                      <span className="text-[#0B3C8C]">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => handleRoleChange('player')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 flex items-center justify-between font-medium"
                  >
                    <span>Player / Athlete (Zain Ul Abideen)</span>
                    {currentUser.role === 'player' && (
                      <span className="text-[#0B3C8C]">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => handleRoleChange('spectator')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 flex items-center justify-between font-medium"
                  >
                    <span>Spectator (Student / Public)</span>
                    {currentUser.role === 'spectator' && (
                      <span className="text-[#0B3C8C]">✓</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Role Dashboard Shortcut */}
            {currentUser.role !== 'spectator' && (
              <Link
                href={getDashboardHref()}
                className="hidden sm:flex items-center space-x-1.5 bg-[#0B3C8C] hover:bg-[#1F5FCC] text-white text-xs px-3 py-1.5 rounded-md font-medium border border-blue-400/40 transition-colors shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>Dashboard</span>
              </Link>
            )}

            {/* Notifications Bell */}
            <Link
              href="/dashboard/player"
              className="relative p-1.5 rounded-full hover:bg-blue-800/60 text-blue-200 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#D92D20] border-2 border-[#08265E]" />
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md text-blue-200 hover:text-white hover:bg-blue-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-blue-900 bg-[#08265E] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? 'bg-[#0B3C8C] text-[#F2B705]'
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
                {link.isLive && (
                  <span className="ml-auto text-xs bg-[#D92D20] text-white px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                )}
              </Link>
            );
          })}
          {currentUser.role !== 'spectator' && (
            <Link
              href={getDashboardHref()}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium bg-[#0B3C8C] text-white"
            >
              <LayoutDashboard className="w-5 h-5 text-[#F2B705]" />
              <span>Go to {currentUser.role.replace('_', ' ')} Dashboard</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
