import { NextRequest, NextResponse } from 'next/server';
import { hubStore } from '@/lib/store';
import { matchSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sportId = searchParams.get('sport') || undefined;
  const status = searchParams.get('status') || undefined;
  const teamId = searchParams.get('team') || undefined;
  const venueId = searchParams.get('venue') || undefined;

  const matches = hubStore.getMatches({ sportId, status, teamId, venueId });
  return NextResponse.json({ success: true, data: matches });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = matchSchema.parse(body);

    const match = hubStore.createMatch(validated as any);
    return NextResponse.json({ success: true, data: match }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Scheduling conflict or validation error' },
      { status: 400 }
    );
  }
}
