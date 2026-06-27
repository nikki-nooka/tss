import { NextResponse } from 'next/server';
import { getJobs, getCandidateById, insertApplication, getApplications, JobApplication } from '@/lib/db';

// GET: Retrieve active jobs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id') || '';
    const candidateId = searchParams.get('candidateId') || '';

    if (jobId) {
      const allJobs = await getJobs();
      const job = allJobs.find(j => j.id === jobId);
      if (!job) {
        return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
      }
      return NextResponse.json({ job });
    }

    const allJobs = await getJobs();
    const activeJobs = allJobs.filter(j => j.status === 'Active');

    // If candidateId is provided, we also return their applied status for each job
    if (candidateId) {
      const allApps = await getApplications();
      const candidateApps = allApps.filter(app => app.candidateId === candidateId);
      const appliedJobIds = new Map(candidateApps.map(app => [app.jobId, app.status]));
      
      const jobsWithAppliedStatus = activeJobs.map(job => ({
        ...job,
        appliedStatus: appliedJobIds.get(job.id) || null
      }));
      
      return NextResponse.json({ jobs: jobsWithAppliedStatus, applications: candidateApps });
    }

    return NextResponse.json({ jobs: activeJobs, applications: [] });
  } catch (error) {
    console.error('Failed to retrieve active jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Apply to a job posting
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobId, candidateId, coverLetter } = body;

    if (!jobId || !candidateId) {
      return NextResponse.json({ error: 'Job ID and Candidate ID are required' }, { status: 400 });
    }

    // Verify candidate exists
    const candidate = await getCandidateById(candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate profile not found' }, { status: 404 });
    }

    // Double-check candidate status is Verified (only verified members can apply!)
    if (candidate.status !== 'Verified') {
      return NextResponse.json({ error: 'Only Verified candidates can apply to jobs' }, { status: 403 });
    }

    // Check if candidate already applied to this job
    const allApps = await getApplications();
    const alreadyApplied = allApps.some(app => app.candidateId === candidateId && app.jobId === jobId);
    if (alreadyApplied) {
      return NextResponse.json({ error: 'You have already applied to this job posting' }, { status: 400 });
    }

    const newApp: JobApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      jobId,
      candidateId,
      coverLetter: coverLetter || '',
      appliedAt: new Date().toISOString(),
      status: 'Applied'
    };

    await insertApplication(newApp);

    return NextResponse.json({ success: true, application: newApp });
  } catch (error) {
    console.error('Failed to submit application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
