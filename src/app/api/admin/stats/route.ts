import { NextResponse } from 'next/server';
import { getCandidates, getMessages, getActivityLogs } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const candidates = await getCandidates();
    const messages = await getMessages();
    const logs = await getActivityLogs();

    // Totals by status
    const totalRegistrations = candidates.length;
    const pendingReviews = candidates.filter(c => c.status === 'Pending').length;
    const underReview = candidates.filter(c => c.status === 'Under Review').length;
    const verifiedMembers = candidates.filter(c => c.status === 'Verified').length;
    const rejectedProfiles = candidates.filter(c => c.status === 'Rejected').length;

    // Daily & Monthly counters
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const THIRTY_DAYS = 30 * ONE_DAY;

    const dailyRegistrations = candidates.filter(c => {
      const regTime = new Date(c.registrationDate).getTime();
      return (now - regTime) <= ONE_DAY;
    }).length;

    const monthlyRegistrations = candidates.filter(c => {
      const regTime = new Date(c.registrationDate).getTime();
      return (now - regTime) <= THIRTY_DAYS;
    }).length;

    // Calculate Role Distributions
    const registrationsByRole: Record<string, number> = {
      'Student': 0,
      'Founder': 0,
      'Recruiter': 0,
      'Mentor': 0,
      'Investor': 0,
      'Working Professional': 0
    };
    const verifiedByRole: Record<string, number> = {
      'Student': 0,
      'Founder': 0,
      'Recruiter': 0,
      'Mentor': 0,
      'Investor': 0,
      'Working Professional': 0
    };

    candidates.forEach(c => {
      const r = c.role || 'Student';
      if (r in registrationsByRole) {
        registrationsByRole[r]++;
      }
      if (c.status === 'Verified') {
        if (r in verifiedByRole) {
          verifiedByRole[r]++;
        }
      }
    });

    // Group registrations by date for a basic chart (e.g. last 7 days)
    const registrationsByDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * ONE_DAY);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      registrationsByDay[dateStr] = 0;
    }

    candidates.forEach(c => {
      const regDate = new Date(c.registrationDate);
      const dateStr = regDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dateStr in registrationsByDay) {
        registrationsByDay[dateStr]++;
      }
    });

    const chartData = Object.entries(registrationsByDay).map(([date, count]) => ({
      date,
      count
    }));

    return NextResponse.json({
      totalRegistrations,
      pendingReviews: pendingReviews + underReview,
      actualPending: pendingReviews,
      actualUnderReview: underReview,
      verifiedMembers,
      rejectedProfiles,
      dailyRegistrations,
      monthlyRegistrations,
      registrationsByRole,
      verifiedByRole,
      chartData,
      totalMessages: messages.length,
      totalLogs: logs.length
    });

  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
