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
    if (updates.fullName !== undefined) safeUpdates.fullName = updates.fullName ? String(updates.fullName).trim() : '';
    if (updates.mobile !== undefined) safeUpdates.mobile = updates.mobile ? String(updates.mobile).trim() : '';
    if (updates.city !== undefined) safeUpdates.city = updates.city ? String(updates.city).trim() : '';
    if (updates.state !== undefined) safeUpdates.state = updates.state ? String(updates.state).trim() : '';
    if (updates.college !== undefined) safeUpdates.college = updates.college ? String(updates.college).trim() : '';
    if (updates.graduationYear !== undefined) {
      const yr = Number(updates.graduationYear);
      safeUpdates.graduationYear = isNaN(yr) ? null : yr;
    }
    if (updates.skills !== undefined) {
      if (Array.isArray(updates.skills)) {
        safeUpdates.skills = updates.skills;
      } else {
        safeUpdates.skills = updates.skills ? String(updates.skills).split(',').map((s: string) => s.trim()).filter(Boolean) : [];
      }
    }
    if (updates.linkedin !== undefined) safeUpdates.linkedin = updates.linkedin ? String(updates.linkedin).trim() : '';
    if (updates.github !== undefined) safeUpdates.github = updates.github ? String(updates.github).trim() : '';
    if (updates.portfolio !== undefined) safeUpdates.portfolio = updates.portfolio ? String(updates.portfolio).trim() : '';
    if (updates.resumeLink !== undefined) safeUpdates.resumeLink = updates.resumeLink ? String(updates.resumeLink).trim() : '';
    if (updates.photoPath !== undefined) safeUpdates.photoPath = updates.photoPath;

    // Reputation, bio and additional profile details
    if (updates.bio !== undefined) safeUpdates.bio = updates.bio ? String(updates.bio).trim() : '';
    if (updates.coverImage !== undefined) safeUpdates.coverImage = updates.coverImage;
    if (updates.achievements !== undefined) safeUpdates.achievements = updates.achievements;
    if (updates.certificates !== undefined) safeUpdates.certificates = updates.certificates;
    if (updates.experience !== undefined) safeUpdates.experience = updates.experience;
    if (updates.education !== undefined) safeUpdates.education = updates.education;

    // Blood / Platelet Donation details (saved live so matchings are real-time)
    if (updates.bloodGroup !== undefined) safeUpdates.bloodGroup = updates.bloodGroup;
    if (updates.willingToDonate !== undefined) safeUpdates.willingToDonate = updates.willingToDonate;
    if (updates.availableForEmergency !== undefined) safeUpdates.availableForEmergency = updates.availableForEmergency;
    if (updates.lastDonationDate !== undefined) safeUpdates.lastDonationDate = updates.lastDonationDate;
    if (updates.emergencyContact !== undefined) safeUpdates.emergencyContact = updates.emergencyContact ? String(updates.emergencyContact).trim() : '';

    // Checkin streaker attributes
    if (updates.loginDays !== undefined) safeUpdates.loginDays = Number(updates.loginDays);
    if (updates.streak !== undefined) safeUpdates.streak = Number(updates.streak);
    if (updates.lastCheckinDate !== undefined) safeUpdates.lastCheckinDate = updates.lastCheckinDate;
    if (updates.communityScore !== undefined) safeUpdates.communityScore = Number(updates.communityScore);

    // Profile Edits approval vetting process
    if (candidate.status === 'Verified') {
      const roleDetails = candidate.roleDetails || {};
      
      const liveUpdates: any = {};
      const draftUpdates: any = {};

      const draftKeys = [
        'fullName', 'mobile', 'city', 'state', 'college', 'graduationYear', 'skills', 
        'linkedin', 'github', 'portfolio', 'resumeLink', 'photoPath', 
        'bio', 'coverImage', 'achievements', 'certificates', 'experience', 'education'
      ];

      Object.keys(safeUpdates).forEach(key => {
        if (draftKeys.includes(key)) {
          draftUpdates[key] = safeUpdates[key];
        } else {
          liveUpdates[key] = safeUpdates[key];
        }
      });

      if (Object.keys(draftUpdates).length > 0) {
        roleDetails.draftProfileDetails = {
          ...(roleDetails.draftProfileDetails || {}),
          ...draftUpdates
        };

        const auditLogs = roleDetails.auditLogs || [];
        auditLogs.push({
          date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          event: 'Profile Edited - Changes Awaiting Admin Approval',
          admin: 'system'
        });
        roleDetails.auditLogs = auditLogs;
        
        liveUpdates.status = 'Under Review';
      }

      liveUpdates.roleDetails = roleDetails;
      await updateCandidate(id, liveUpdates);

      const updatedCand = await getCandidateById(id);
      return NextResponse.json({
        success: true,
        message: Object.keys(draftUpdates).length > 0 
          ? 'Profile edits submitted for admin review. Your previously verified settings remain active.' 
          : 'Settings updated successfully.',
        candidate: updatedCand
      });
    } else {
      // Directly apply updates for unverified members
      const roleDetails = candidate.roleDetails || {};
      const auditLogs = roleDetails.auditLogs || [];
      auditLogs.push({
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        event: 'Profile Settings Updated',
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
