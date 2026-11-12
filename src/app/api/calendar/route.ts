import { NextRequest, NextResponse } from 'next/server';
import { hubStore } from '@/lib/store';
import { generateICS } from '@/lib/ics';

export async function GET(request: NextRequest) {
  const matches = hubStore.getMatches();
  const icsData = generateICS(matches, 'Iqra University Sports Hub Schedule');

  return new NextResponse(icsData, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="iu-sports-schedule.ics"',
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
    },
  });
}
