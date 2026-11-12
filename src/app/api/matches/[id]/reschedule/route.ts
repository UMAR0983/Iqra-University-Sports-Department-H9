import { NextRequest, NextResponse } from 'next/server';
import { hubStore } from '@/lib/store';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { starts_at, ends_at, venue_id, reason } = body;

    const match = hubStore.rescheduleMatch(
      params.id,
      starts_at,
      ends_at,
      venue_id,
      reason
    );

    return NextResponse.json({
      success: true,
      message: 'Match rescheduled successfully. Stakeholders notified.',
      data: match,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Reschedule conflict detected' },
      { status: 400 }
    );
  }
}
