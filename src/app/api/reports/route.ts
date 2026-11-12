export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { hubStore } from '@/lib/store';

export async function GET(request: NextRequest) {
  const matches = hubStore.getMatches();
  const standings = hubStore.getStandings();
  const venues = hubStore.getVenues();

  return NextResponse.json({
    generated_at: new Date().toISOString(),
    university: 'Iqra University, Islamabad',
    season: 'Spring 2027',
    summary: {
      total_matches: matches.length,
      completed: matches.filter((m) => m.status === 'completed').length,
      upcoming: matches.filter((m) => m.status === 'scheduled').length,
      live: matches.filter((m) => m.status === 'live').length,
      scheduling_clashes: 0,
    },
    standings,
    matches,
    venues,
  });
}
