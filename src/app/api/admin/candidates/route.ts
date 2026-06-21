import { NextResponse } from 'next/server';
import { getCandidates, getCandidateById, updateCandidate, logAdminAction, Candidate } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// Helper to generate the unique Member ID: TSSYYMMDDXXX
const generateMemberId = (candidate: Candidate, allCandidates: Candidate[]): string => {
  const regDate = new Date(candidate.registrationDate);
  const yy = regDate.getFullYear().toString().slice(-2);
  const mm = String(regDate.getMonth() + 1).padStart(2, '0');
  const dd = String(regDate.getDate()).padStart(2, '0');
  const datePrefix = `TSS${yy}${mm}${dd}`; // e.g. TSS260618

  // Find all verified candidates on that exact date prefix
  const dailyVerified = allCandidates.filter(
    (c) => c.memberId && c.memberId.startsWith(datePrefix)
  );

  let nextSequence = 1;
  if (dailyVerified.length > 0) {
    const sequences = dailyVerified.map((c) => {
      const seqStr = c.memberId!.slice(-3); // Get the last 3 digits
      const seqNum = parseInt(seqStr, 10);
      return isNaN(seqNum) ? 0 : seqNum;
    });
    nextSequence = Math.max(...sequences) + 1;
  }

  const xxx = String(nextSequence).padStart(3, '0');
  return `${datePrefix}${xxx}`;
};

// GET: List candidates with filter/search options
export async function GET(request: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status') || '';
    const college = searchParams.get('college') || '';
    const gradYear = searchParams.get('gradYear') || '';
    const experience = searchParams.get('experience') || '';
    const location = searchParams.get('location') || ''; // city or state
    const role = searchParams.get('role') || '';
    const skill = searchParams.get('skill') || '';

    const allCandidates = await getCandidates();
    let filtered = [...allCandidates];

    // Filter by Status
    if (status) {
      filtered = filtered.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by Search Query (Name, Email, Mobile, Member ID)
    if (query) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        c => c.fullName.toLowerCase().includes(q) ||
             c.email.toLowerCase().includes(q) ||
             c.mobile.includes(q) ||
             (c.memberId && c.memberId.toLowerCase().includes(q))
      );
    }

    // Filter by College
    if (college) {
      const c = college.toLowerCase().trim();
      filtered = filtered.filter(candidate => candidate.college && candidate.college.toLowerCase().includes(c));
    }

    // Filter by Graduation Year
    if (gradYear) {
      const year = parseInt(gradYear, 10);
      if (!isNaN(year)) {
        filtered = filtered.filter(c => c.graduationYear === year);
      }
    }

    // Filter by Experience Level
    if (experience) {
      filtered = filtered.filter(c => c.experienceLevel === experience);
    }

    // Filter by Location (City or State)
    if (location) {
      const loc = location.toLowerCase().trim();
      filtered = filtered.filter(c => c.city.toLowerCase().includes(loc) || c.state.toLowerCase().includes(loc));
    }

    // Filter by Role (matches preferredRoles or currentRole)
    if (role) {
      const r = role.toLowerCase().trim();
      filtered = filtered.filter(c => 
        c.preferredRoles.some(pr => pr.toLowerCase().includes(r)) || 
        c.currentRole.toLowerCase().includes(r)
      );
    }

    // Filter by Skill
    if (skill) {
      const s = skill.toLowerCase().trim();
      filtered = filtered.filter(c => c.skills.some(sk => sk.toLowerCase().includes(s)));
    }

    return NextResponse.json(filtered);

  } catch (error) {
    console.error('Failed to get candidates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update candidate status or admin notes
export async function PUT(request: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { candidateId, action, notes } = body;

    if (!candidateId || !action) {
      return NextResponse.json({ error: 'Candidate ID and Action are required' }, { status: 400 });
    }

    const candidate = await getCandidateById(candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const updates: Partial<Candidate> = {};

    if (action === 'review') {
      updates.status = 'Under Review';
      if (notes !== undefined) updates.notes = notes;
      
      await logAdminAction(
        admin.email,
        'CANDIDATE_UNDER_REVIEW',
        `Moved candidate ${candidate.fullName} (${candidate.email}) to Under Review.`
      );
    } 
    else if (action === 'approve') {
      // Generate Member ID if not already generated
      if (!candidate.memberId) {
        const allCandidates = await getCandidates();
        updates.memberId = generateMemberId(candidate, allCandidates);
        candidate.memberId = updates.memberId; // update local ref
      }
      updates.status = 'Verified';
      if (notes !== undefined) updates.notes = notes;

      await logAdminAction(
        admin.email,
        'CANDIDATE_APPROVED',
        `Approved candidate ${candidate.fullName} (${candidate.email}). Generated Member ID: ${candidate.memberId}`
      );
    } 
    else if (action === 'reject') {
      updates.status = 'Rejected';
      if (notes !== undefined) updates.notes = notes;

      await logAdminAction(
        admin.email,
        'CANDIDATE_REJECTED',
        `Rejected candidate ${candidate.fullName} (${candidate.email}). Notes: ${notes || 'None'}`
      );
    } 
    else if (action === 'update_notes') {
      updates.notes = notes;

      await logAdminAction(
        admin.email,
        'CANDIDATE_NOTES_UPDATE',
        `Updated notes for candidate ${candidate.fullName} (${candidate.email}).`
      );
    } 
    else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Save changes to Supabase
    await updateCandidate(candidateId, updates);
    const updatedCandidate = { ...candidate, ...updates };

    return NextResponse.json({
      success: true,
      message: `Candidate status updated successfully to ${updatedCandidate.status}`,
      candidate: updatedCandidate
    });

  } catch (error) {
    console.error('Failed to update candidate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
