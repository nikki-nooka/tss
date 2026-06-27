import { NextResponse } from 'next/server';
import { updateCandidate } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ success: false, error: 'Candidate ID and updates are required.' }, { status: 400 });
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

    await updateCandidate(id, safeUpdates);

    return NextResponse.json({ success: true, message: 'Profile settings updated successfully.' });

  } catch (error) {
    console.error('Candidate profile update error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
