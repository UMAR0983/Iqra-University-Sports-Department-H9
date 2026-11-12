import { NextRequest, NextResponse } from 'next/server';
import { hubStore } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = hubStore.generateTournamentFixtures(params.id);
    return NextResponse.json({
      success: true,
      message: 'Automated greedy constraint solver scheduled all available fixtures.',
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Auto-scheduling failed' },
      { status: 400 }
    );
  }
}
