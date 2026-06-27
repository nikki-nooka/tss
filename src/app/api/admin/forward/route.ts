import { NextResponse } from 'next/server';
import { getForwards, getCandidateById, insertForward, updateForward, logAdminAction, ForwardLog } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get('candidateId') || undefined;

    const logs = await getForwards(candidateId);
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch forwarding logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { candidateId, recruiterName, recruiterEmail, notes } = body;

    if (!candidateId || !recruiterName || !recruiterEmail) {
      return NextResponse.json({ error: 'Candidate ID, Recruiter Name, and Email are required' }, { status: 400 });
    }

    const candidate = await getCandidateById(candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const forwardRecord: ForwardLog = {
      id: `fwd-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      candidateId,
      recruiterName: recruiterName.trim(),
      recruiterEmail: recruiterEmail.trim().toLowerCase(),
      sentDate: new Date().toISOString(),
      status: 'Sent',
      feedback: notes ? `Notes forwarded: ${notes}` : undefined
    };

    await insertForward(forwardRecord);

    await logAdminAction(
      admin.email,
      'FORWARD_CANDIDATE',
      `Forwarded candidate ${candidate.fullName} (ID: ${candidate.memberId || 'N/A'}) to Recruiter: ${recruiterName} (${recruiterEmail})`
    );

    // Mock Email Output to System logs
    console.log(`
======================================================
[MOCK EMAIL GATEWAY - CANDIDATE FORWARDED]
To: ${recruiterEmail}
Subject: TSS Verified Talent Referral - ${candidate.fullName} (${candidate.memberId || 'Pending ID'})
Body:
Dear ${recruiterName},

TSS Admin has forwarded a candidate profile that matches your organization's criteria.

Candidate Details:
- Name: ${candidate.fullName}
- Member ID: ${candidate.memberId || 'Pending Verification'}
- Highest Qualification: ${candidate.highestQualification || 'N/A'}
- Experience: ${candidate.experienceLevel || 'N/A'}
- Preferred Roles: ${(candidate.preferredRoles || []).join(', ')}
- Skills: ${(candidate.skills || []).join(', ')}
- LinkedIn: ${candidate.linkedin}

Resume Link/File: ${candidate.resumeName || 'N/A'} (Link: https://thestudentspot.vercel.app/api/download/resume?id=${candidate.id})
Notes: ${notes || 'No extra notes.'}

Best regards,
The Student Spot (TSS) Team
======================================================
    `);

    return NextResponse.json({
      success: true,
      message: `Profile successfully forwarded to ${recruiterName} (${recruiterEmail}).`,
      log: forwardRecord
    });

  } catch (error) {
    console.error('Failed to forward candidate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Track/Update Recruiter Feedback
export async function PUT(request: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { logId, status, feedback } = body;

    if (!logId || !status) {
      return NextResponse.json({ error: 'Log ID and Status are required' }, { status: 400 });
    }

    const forwardsList = await getForwards();
    const currentLog = forwardsList.find((f) => f.id === logId);
    if (!currentLog) {
      return NextResponse.json({ error: 'Forwarding log not found' }, { status: 404 });
    }

    const updates: Partial<ForwardLog> = { status };
    if (feedback !== undefined) {
      updates.feedback = feedback;
    }

    await updateForward(logId, updates);
    const updatedLog = { ...currentLog, ...updates };

    const cand = await getCandidateById(currentLog.candidateId);

    await logAdminAction(
      admin.email,
      'FORWARD_FEEDBACK_UPDATE',
      `Updated feedback for forwarded candidate ${cand ? cand.fullName : 'Unknown'} to recruiter ${currentLog.recruiterName}. Status: ${status}`
    );

    return NextResponse.json({
      success: true,
      message: 'Feedback updated successfully',
      log: updatedLog
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
  }
}
