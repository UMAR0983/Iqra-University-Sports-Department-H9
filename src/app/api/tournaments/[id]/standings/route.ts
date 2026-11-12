import { NextRequest, NextResponse } from 'next/server';
import { hubStore } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const standings = hubStore.getStandings(params.id);
  return NextResponse.json({ success: true, data: standings });
}
