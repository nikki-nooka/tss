import { NextResponse } from 'next/server';
import { getCandidates } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberId, email } = body;

    if (!memberId || !email) {
      return NextResponse.json({ success: false, error: 'Member ID and Registered Email are required.' }, { status: 400 });
    }

    const candidates = await getCandidates();
    const candidate = candidates.find(
      (c) => (c.memberId?.trim().toUpperCase() === memberId.trim().toUpperCase() || c.id.trim() === memberId.trim()) &&
             c.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (!candidate) {
      return NextResponse.json({ success: false, error: 'Invalid Member ID / Reference ID or Registered Email.' }, { status: 401 });
    }

    // Return successfully authenticated candidate profile payload including status
    return NextResponse.json({
      success: true,
      candidate: {
        id: candidate.id,
        role: candidate.role,
        fullName: candidate.fullName,
        memberId: candidate.memberId || null,
        status: candidate.status,
        email: candidate.email,
        mobile: candidate.mobile,
        city: candidate.city,
        state: candidate.state,
        country: candidate.country,
        highestQualification: candidate.highestQualification || null,
        college: candidate.college || null,
        graduationYear: candidate.graduationYear || null,
        skills: candidate.skills || [],
        linkedin: candidate.linkedin,
        github: candidate.github || null,
        portfolio: candidate.portfolio || null,
        photoPath: candidate.photoPath || null,
        registrationDate: candidate.registrationDate
      }
    });

  } catch (error) {
    console.error('Candidate login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
