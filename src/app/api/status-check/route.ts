import { NextResponse } from 'next/server';
import { getCandidates } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (
      searchParams.get('query') || 
      searchParams.get('memberId') || 
      searchParams.get('email') || 
      searchParams.get('mobile') || 
      ''
    ).trim();

    if (!query) {
      return NextResponse.json({ error: 'Search parameter is required' }, { status: 400 });
    }

    const candidates = await getCandidates();
    const q = query.toLowerCase();

    // Match by exact memberId, username, email, phone, or partial name/role
    const candidate = candidates.find(c => 
      (c.memberId && c.memberId.toLowerCase() === q) ||
      (c.username && c.username.toLowerCase() === q.replace(/^@/, '')) ||
      c.email.toLowerCase() === q ||
      c.mobile.replace(/\D/g, '') === q.replace(/\D/g, '') ||
      c.fullName.toLowerCase().includes(q) ||
      c.role.toLowerCase() === q
    );

    if (!candidate) {
      return NextResponse.json({ success: false, error: 'No profile found matching these details.' });
    }

    // Return public candidate status details including verification badges and scores
    return NextResponse.json({
      success: true,
      id: candidate.id,
      role: candidate.role,
      fullName: candidate.fullName,
      status: candidate.status,
      memberId: candidate.memberId || null,
      highestQualification: candidate.highestQualification || null,
      preferredRoles: candidate.preferredRoles || [],
      registrationDate: candidate.registrationDate,
      city: candidate.city,
      state: candidate.state,
      photoPath: candidate.photoPath || null,
      email: candidate.email,
      mobile: candidate.mobile,
      linkedin: candidate.linkedin,
      github: candidate.github || null,
      portfolio: candidate.portfolio || null,
      skills: candidate.skills || [],
      college: candidate.college || null,
      graduationYear: candidate.graduationYear || null,
      
      // Dynamic profile variables
      username: candidate.username || '',
      communityScore: candidate.communityScore !== undefined ? candidate.communityScore : 20,
      level: candidate.level || 'Explorer',
      memberSince: candidate.memberSince || 'Jun 2026',
      roleDetails: candidate.roleDetails || {}
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
