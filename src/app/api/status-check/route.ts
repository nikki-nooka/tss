import { NextResponse } from 'next/server';
import { getCandidates } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || '';
    const mobile = searchParams.get('mobile') || '';
    const memberId = searchParams.get('memberId') || '';

    if (!email && !mobile && !memberId) {
      return NextResponse.json({ error: 'Search parameter (email, mobile, or member ID) is required' }, { status: 400 });
    }

    const candidates = await getCandidates();
    let candidate = null;

    if (email) {
      const e = email.trim().toLowerCase();
      candidate = candidates.find((c) => c.email.toLowerCase() === e);
    } else if (mobile) {
      const m = mobile.replace(/\D/g, '');
      candidate = candidates.find((c) => c.mobile.replace(/\D/g, '') === m);
    } else if (memberId) {
      const id = memberId.trim().toUpperCase();
      candidate = candidates.find((c) => c.memberId === id);
    }

    if (!candidate) {
      return NextResponse.json({ success: false, error: 'No profile found matching these details.' });
    }

    // Return public candidate status details
    return NextResponse.json({
      success: true,
      id: candidate.id,
      fullName: candidate.fullName,
      status: candidate.status,
      memberId: candidate.memberId || null,
      highestQualification: candidate.highestQualification,
      preferredRoles: candidate.preferredRoles,
      registrationDate: candidate.registrationDate,
      city: candidate.city,
      state: candidate.state
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
