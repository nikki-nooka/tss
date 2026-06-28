import { NextResponse } from 'next/server';
import { getCandidates } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ success: false, error: 'Username is required.' }, { status: 400 });
    }

    // Clean username (e.g. remove leading @ if entered)
    const cleanUsername = username.trim().replace(/^@/, '').toLowerCase();

    if (cleanUsername.length < 3) {
      return NextResponse.json({ success: false, error: 'Username must be at least 3 characters.' }, { status: 400 });
    }

    const allCandidates = await getCandidates();
    const isTaken = allCandidates.some(
      (c) => c.username && c.username.trim().replace(/^@/, '').toLowerCase() === cleanUsername
    );

    if (isTaken) {
      // Generate clean alternatives
      const alternatives = [
        `${cleanUsername}1`,
        `${cleanUsername}26`,
        `${cleanUsername}_dev`,
        `${cleanUsername}.tss`
      ];
      return NextResponse.json({ success: true, available: false, alternatives });
    }

    return NextResponse.json({ success: true, available: true });
  } catch (error: any) {
    console.error('Check username error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
