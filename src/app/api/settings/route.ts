import { NextResponse } from 'next/server';
import { getSettings, updateSettings, logAdminAction } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (admin.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { communityMembers, recruiterNetwork, opportunitiesShared, eventsConducted } = body;

    // Validate settings values
    const comm = parseInt(communityMembers, 10);
    const rec = parseInt(recruiterNetwork, 10);
    const opp = parseInt(opportunitiesShared, 10);
    const ev = parseInt(eventsConducted, 10);

    if (isNaN(comm) || isNaN(rec) || isNaN(opp) || isNaN(ev)) {
      return NextResponse.json({ error: 'All statistics must be valid integers' }, { status: 400 });
    }

    const oldSettings = await getSettings();
    
    const newSettings = {
      communityMembers: comm,
      recruiterNetwork: rec,
      opportunitiesShared: opp,
      eventsConducted: ev
    };

    await updateSettings(newSettings);
    
    await logAdminAction(
      admin.email,
      'UPDATE_SETTINGS',
      `Updated metrics: Members (${oldSettings.communityMembers} -> ${comm}), Recruiters (${oldSettings.recruiterNetwork} -> ${rec}), Opps (${oldSettings.opportunitiesShared} -> ${opp}), Events (${oldSettings.eventsConducted} -> ${ev})`
    );

    return NextResponse.json({ message: 'Settings updated successfully', settings: newSettings });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
