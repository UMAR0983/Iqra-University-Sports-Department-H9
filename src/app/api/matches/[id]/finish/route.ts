import { NextRequest, NextResponse } from 'next/server';
import { hubStore } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const match = hubStore.finishMatch(params.id, body.man_of_match, body.summary);

    return NextResponse.json({
      success: true,
      message: 'Match concluded and points table standings recalculated.',
      data: match,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to close match' },
      { status: 400 }
    );
  }
}
