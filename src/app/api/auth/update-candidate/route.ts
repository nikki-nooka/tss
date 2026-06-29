import { NextResponse } from 'next/server';
import { getCandidateById, updateCandidate } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ success: false, error: 'Candidate ID and updates are required.' }, { status: 400 });
    }

    const candidate = await getCandidateById(id);
    if (!candidate) {
      return NextResponse.json({ success: false, error: 'Candidate profile not found.' }, { status: 404 });
    }

    // Capture safe update fields
    const safeUpdates: any = {};
    if (updates.fullName !== undefined) safeUpdates.fullName = updates.fullName.trim();
    if (updates.mobile !== undefined) safeUpdates.mobile = updates.mobile.trim();
    if (updates.city !== undefined) safeUpdates.city = updates.city.trim();
    if (updates.state !== undefined) safeUpdates.state = updates.state.trim();
    if (updates.college !== undefined) safeUpdates.college = updates.college.trim();
    if (updates.graduationYear !== undefined) {
      const yr = Number(updates.graduationYear);
      safeUpdates.graduationYear = isNaN(yr) ? null : yr;
    }
    if (updates.skills !== undefined) {
      if (Array.isArray(updates.skills)) {
        safeUpdates.skills = updates.skills;
      } else {
        safeUpdates.skills = updates.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }
    if (updates.linkedin !== undefined) safeUpdates.linkedin = updates.linkedin.trim();
    if (updates.github !== undefined) safeUpdates.github = updates.github.trim();
    if (updates.portfolio !== undefined) safeUpdates.portfolio = updates.portfolio.trim();
    if (updates.resumeLink !== undefined) safeUpdates.resumeLink = updates.resumeLink.trim();
    if (updates.photoPath !== undefined) safeUpdates.photoPath = updates.photoPath;

    // Handle Verified Staging Flow
    if (candidate.status === 'Verified') {
      const roleDetails = candidate.roleDetails || {};
      
      // Stage changes inside roleDetails.draftUpdate
      roleDetails.draftUpdate = {
        ...roleDetails.draftUpdate,
        ...safeUpdates
      };

      // Append verification history audit log
      const auditLogs = roleDetails.auditLogs || [];
      auditLogs.push({
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        event: 'Profile Edited - Moved to Review',
        admin: 'system'
      });
      roleDetails.auditLogs = auditLogs;

      // Automatically change status to Under Review
      await updateCandidate(id, {
        status: 'Under Review',
        roleDetails
      });

      const updatedCand = await getCandidateById(id);
      return NextResponse.json({ 
        success: true, 
        message: 'Changes submitted for admin approval. Profile status set to Under Review.',
        candidate: updatedCand
      });
    } else {
      // Direct updates for non-verified profiles
      const roleDetails = candidate.roleDetails || {};
      const auditLogs = roleDetails.auditLogs || [];
      auditLogs.push({
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        event: 'Profile Updated',
        admin: 'system'
      });
      roleDetails.auditLogs = auditLogs;
      safeUpdates.roleDetails = roleDetails;

      await updateCandidate(id, safeUpdates);
      
      const updatedCand = await getCandidateById(id);
      return NextResponse.json({ 
        success: true, 
        message: 'Profile settings updated successfully.',
        candidate: updatedCand
      });
    }

  } catch (error) {
    console.error('Candidate profile update error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
