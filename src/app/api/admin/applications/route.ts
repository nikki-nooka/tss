import { NextResponse } from 'next/server';
import { getApplications, updateApplicationStatus, logAdminAction } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// GET: Retrieve all applications
export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apps = await getApplications();
    return NextResponse.json(apps);
  } catch (error) {
    console.error('Failed to retrieve applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update application status (Applied, Reviewing, Shortlisted, Rejected)
export async function PUT(request: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return NextResponse.json({ error: 'Application ID and Status are required' }, { status: 400 });
    }

    const allowedStatuses = ['Applied', 'Reviewing', 'Shortlisted', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    await updateApplicationStatus(applicationId, status);

    await logAdminAction(
      admin.email,
      'UPDATE_APPLICATION_STATUS',
      `Updated application ${applicationId} to status ${status}`
    );

    return NextResponse.json({ success: true, message: `Application status updated to ${status}` });
  } catch (error) {
    console.error('Failed to update application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
