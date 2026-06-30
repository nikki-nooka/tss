import { NextResponse } from 'next/server';
import { getOpportunities, updateOpportunity, deleteOpportunity, logAdminAction } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const opps = await getOpportunities();
    return NextResponse.json(opps);
  } catch (error) {
    console.error('Failed to retrieve opportunities for admin:', error);
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
    const { oppId, action, rejectionReason } = body;

    if (!oppId) {
      return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
    }

    if (action === 'approve') {
      await updateOpportunity(oppId, { status: 'Approved', rejectionReason: '' });
      await logAdminAction(admin.email, 'APPROVE_OPPORTUNITY', `Approved opportunity ${oppId}`);
      return NextResponse.json({ success: true });
    } else if (action === 'reject') {
      await updateOpportunity(oppId, { status: 'Rejected', rejectionReason: rejectionReason || 'Rejection reason not provided.' });
      await logAdminAction(admin.email, 'REJECT_OPPORTUNITY', `Rejected opportunity ${oppId} due to: ${rejectionReason}`);
      return NextResponse.json({ success: true });
    } else if (action === 'feature') {
      const all = await getOpportunities();
      const current = all.find(o => o.id === oppId);
      const isFeatured = current ? !current.isFeatured : true;
      await updateOpportunity(oppId, { isFeatured });
      await logAdminAction(admin.email, 'FEATURE_OPPORTUNITY', `${isFeatured ? 'Featured' : 'Unfeatured'} opportunity ${oppId}`);
      return NextResponse.json({ success: true });
    } else if (action === 'delete') {
      await deleteOpportunity(oppId);
      await logAdminAction(admin.email, 'DELETE_OPPORTUNITY', `Deleted opportunity ${oppId}`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error) {
    console.error('Failed to moderate opportunity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
