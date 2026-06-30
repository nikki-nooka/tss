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

    // Emergency fields
    if (updates.bloodGroup !== undefined) safeUpdates.bloodGroup = updates.bloodGroup;
    if (updates.emergencyContact !== undefined) safeUpdates.emergencyContact = updates.emergencyContact.trim();
    if (updates.availableBloodDonation !== undefined) safeUpdates.availableBloodDonation = updates.availableBloodDonation;
    if (updates.availablePlateletDonation !== undefined) safeUpdates.availablePlateletDonation = updates.availablePlateletDonation;
    if (updates.lastDonationDate !== undefined) safeUpdates.lastDonationDate = updates.lastDonationDate;
    
    // Loyalty tracker fields
    if (updates.loginDays !== undefined) safeUpdates.loginDays = Number(updates.loginDays);
    if (updates.streak !== undefined) safeUpdates.streak = Number(updates.streak);
    if (updates.lastCheckinDate !== undefined) safeUpdates.lastCheckinDate = updates.lastCheckinDate;

    // Check if verification affecting fields changed
    const isVerificationFieldChanged = 
      (updates.fullName !== undefined && updates.fullName.trim() !== (candidate.fullName || '')) ||
      (updates.college !== undefined && updates.college.trim() !== (candidate.college || '')) ||
      (updates.graduationYear !== undefined && Number(updates.graduationYear) !== (candidate.graduationYear || null)) ||
      (updates.linkedin !== undefined && updates.linkedin.trim() !== (candidate.linkedin || '')) ||
      (updates.resumeLink !== undefined && updates.resumeLink.trim() !== (candidate.roleDetails?.resumeLink || '')) ||
      (updates.photoPath !== undefined && updates.photoPath !== (candidate.photoPath || ''));

    // Handle Verified Staging Flow
    if (candidate.status === 'Verified' && isVerificationFieldChanged) {
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
        message: 'Verification changes submitted for admin approval. Profile status set to Under Review.',
        candidate: updatedCand
      });
    } else {
      // Direct updates (either not verified, or verified candidate editing non-verification fields)
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
