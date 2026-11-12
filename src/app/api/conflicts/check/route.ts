import { NextRequest, NextResponse } from 'next/server';
import { checkConflicts } from '@/lib/scheduler';
import { hubStore } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { venue_id, home_team_id, away_team_id, starts_at, ends_at, exclude_match_id } = body;

    const result = checkConflicts(
      {
        venue_id,
        home_team_id,
        away_team_id,
        starts_at,
        ends_at,
        exclude_match_id,
      },
      {
        existingMatches: hubStore.matches,
        venues: hubStore.venues,
        venueBlocks: hubStore.venueBlocks,
      }
    );

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Validation error' },
      { status: 400 }
    );
  }
}
