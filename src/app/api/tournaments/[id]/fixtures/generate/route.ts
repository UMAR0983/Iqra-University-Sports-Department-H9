import { NextRequest, NextResponse } from 'next/server';
import { hubStore } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const format = body.format;
    const result = hubStore.generateTournamentFixtures(params.id, format);

    return NextResponse.json({
      success: true,
      message: 'Fixtures generated and conflict-free slots assigned.',
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate fixtures' },
      { status: 400 }
    );
  }
}
