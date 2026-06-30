import { NextResponse } from 'next/server';
import { getEmergencies, updateEmergency, deleteEmergency, logAdminAction } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ems = await getEmergencies();
    return NextResponse.json(ems);
  } catch (error) {
    console.error('Failed to retrieve emergencies for admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { emId, action, rejectionReason } = body;

    if (!emId) {
      return NextResponse.json({ error: 'Emergency ID is required' }, { status: 400 });
    }

    if (action === 'approve') {
      await updateEmergency(emId, { status: 'Approved', rejectionReason: '' });
      await logAdminAction(admin.email, 'APPROVE_EMERGENCY', `Approved emergency request ${emId}`);
      return NextResponse.json({ success: true });
    } else if (action === 'reject') {
      await updateEmergency(emId, { status: 'Rejected', rejectionReason: rejectionReason || 'Verification failed.' });
      await logAdminAction(admin.email, 'REJECT_EMERGENCY', `Rejected emergency request ${emId} due to: ${rejectionReason}`);
      return NextResponse.json({ success: true });
    } else if (action === 'feature') {
      const all = await getEmergencies();
      const current = all.find(e => e.id === emId);
      const isFeatured = current ? !current.isFeatured : true;
      await updateEmergency(emId, { isFeatured });
      await logAdminAction(admin.email, 'FEATURE_EMERGENCY', `${isFeatured ? 'Featured' : 'Unfeatured'} emergency request ${emId}`);
      return NextResponse.json({ success: true });
    } else if (action === 'delete') {
      await deleteEmergency(emId);
      await logAdminAction(admin.email, 'DELETE_EMERGENCY', `Deleted emergency request ${emId}`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error) {
    console.error('Failed to moderate emergency request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
