import React from 'react';
import Link from 'next/link';
import { Trophy, Mail, Phone, MapPin, ExternalLink, Calendar, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#08265E] text-blue-100 border-t border-blue-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-[#0B3C8C] flex items-center justify-center border border-blue-400/40">
                <Trophy className="w-5 h-5 text-[#F2B705]" />
              </div>
              <span className="font-serif font-bold text-lg text-white">IU SPORTS HUB</span>
            </div>
            <p className="text-xs text-blue-200 leading-relaxed">
              Official Sports Management Platform of Iqra University Islamabad. Managing inter-department tournaments, fixtures, zero-conflict venue bookings, live scoring, and athletic excellence.
            </p>
            <div className="text-[11px] text-[#F2B705] font-semibold flex items-center space-x-1">
              <span>Course: Agile Software Engineering</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Explore Portal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/schedule" className="hover:text-[#F2B705] transition-colors">
                  Match Schedule & iCal
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-[#F2B705] transition-colors">
                  Live Match Center
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="hover:text-[#F2B705] transition-colors">
                  Tournaments & Standings
                </Link>
              </li>
              <li>
                <Link href="/sports" className="hover:text-[#F2B705] transition-colors">
                  Sports Catalogue & Rules
                </Link>
              </li>
              <li>
                <Link href="/teams" className="hover:text-[#F2B705] transition-colors">
                  Department Teams & Rosters
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-[#F2B705] transition-colors">
                  Campus Venues & Availability
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Role Portals */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Role Dashboards
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard/admin" className="hover:text-[#F2B705] transition-colors">
                  Sports Directorate / Admin
                </Link>
              </li>
              <li>
                <Link href="/dashboard/coach" className="hover:text-[#F2B705] transition-colors">
                  Coach & Roster Manager
                </Link>
              </li>
              <li>
                <Link href="/dashboard/referee" className="hover:text-[#F2B705] transition-colors">
                  Referee / Scorer Console
                </Link>
              </li>
              <li>
                <Link href="/dashboard/player" className="hover:text-[#F2B705] transition-colors">
                  Student Athlete Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Sports Directorate
            </h3>
            <ul className="space-y-2 text-xs text-blue-200">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#F2B705] flex-shrink-0 mt-0.5" />
                <span>Sector H-9/1, Iqra University Islamabad Campus</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#F2B705] flex-shrink-0" />
                <span>+92 51 111-264-264</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#F2B705] flex-shrink-0" />
                <span>sports@iqra.edu.pk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-blue-900/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300">
          <p>© {new Date().getFullYear()} Iqra University Islamabad. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Built with precision for Agile Software Engineering</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
