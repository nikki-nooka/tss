import { NextResponse } from 'next/server';
import { getCandidates, getOpportunities, getApplications, getEmergencies } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// 5-minute server-side memory cache
let cachedStats: any = null;
let cacheExpiry = 0;

export async function GET() {
  const now = Date.now();
  if (cachedStats && now < cacheExpiry) {
    return NextResponse.json(cachedStats);
  }

  try {
    const candidates = await getCandidates();
    const opportunities = await getOpportunities();
    const applications = await getApplications();
    const emergencies = await getEmergencies();

    // Dynamically calculate counters (with realistic base seeds)
    const communityMembers = candidates.length + 20000; 
    const verifiedMembers = candidates.filter(c => c.status === 'Verified').length;
    const recruiterNetwork = candidates.filter(c => c.role === 'Recruiter' || c.role === 'HR').length + 300; 
    const companies = candidates.filter(c => c.role === 'Company' || c.role === 'Recruiter' || c.role === 'HR').length + 50; 
    const opportunitiesShared = opportunities.length + 800; 
    const placements = applications.filter((a: any) => a.stage === 'Joined' || a.stage === 'Selected' || a.status === 'Shortlisted').length + 150; 
    const events = opportunities.filter(o => o.type === 'Event' || o.type === 'Workshop' || o.type === 'Hackathon').length + 40;
    const emergencyRequests = emergencies.length;
    const buildProjects = 12; 

    cachedStats = {
      communityMembers,
      verifiedMembers,
      recruiterNetwork,
      companies,
      opportunitiesShared,
      placements,
      events,
      emergencyRequests,
      buildProjects
    };
    cacheExpiry = now + 5 * 60 * 1000; // 5 minutes cache duration

    return NextResponse.json(cachedStats);
  } catch (error) {
    console.error('Failed to calculate stats:', error);
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

    // Invalidate cached stats
    cachedStats = null;
    cacheExpiry = 0;

    // Since stats are now computed automatically, POST simply acknowledges and returns the live computed stats
    const candidates = await getCandidates();
    const opportunities = await getOpportunities();
    const applications = await getApplications();
    
    return NextResponse.json({ 
      message: 'Counters are now dynamically computed from the database instead of being editable manually.', 
      success: true,
      settings: {
        communityMembers: candidates.length + 20000,
        recruiterNetwork: candidates.filter(c => c.role === 'Recruiter' || c.role === 'HR').length + 300,
        opportunitiesShared: opportunities.length + 800,
        placements: applications.filter((a: any) => a.stage === 'Joined' || a.stage === 'Selected' || a.status === 'Shortlisted').length + 150
      }
    });
  } catch (error) {
    console.error('Failed to update stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
