import { NextRequest, NextResponse } from 'next/server';
import { hubStore } from '@/lib/store';
import { eventSchema } from '@/lib/validators';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const event = hubStore.addMatchEvent(params.id, {
      team_id: body.team_id,
      player_id: body.player_id,
      event_type: body.event_type,
      minute: body.minute,
      value: body.value,
      note: body.note,
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to record event' },
      { status: 400 }
    );
  }
}
