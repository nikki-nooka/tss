import { NextResponse } from 'next/server';
import { getJobs, insertJob, updateJob, logAdminAction, Job } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// GET: Retrieve all jobs
export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobs = await getJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Failed to retrieve jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new job posting
export async function POST(request: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, companyName, type, location, salaryRange, description, requirements, applyLink } = body;

    if (!title || !companyName || !type || !location || !description) {
      return NextResponse.json({ error: 'Missing required job parameters' }, { status: 400 });
    }

    const newJob: Job = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      companyName,
      type,
      location,
      salaryRange: salaryRange || '',
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements ? [requirements] : []),
      postedAt: new Date().toISOString(),
      status: 'Active',
      applyLink: applyLink || ''
    };

    await insertJob(newJob);

    await logAdminAction(
      admin.email,
      'CREATE_JOB',
      `Posted new job: ${title} at ${companyName} (${type}, ${location})`
    );

    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    console.error('Failed to create job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update job status (Active / Closed) or updates
export async function PUT(request: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, action, status } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    if (action === 'toggle_status') {
      if (status !== 'Active' && status !== 'Closed') {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      }
      await updateJob(jobId, { status });
      await logAdminAction(
        admin.email,
        'UPDATE_JOB_STATUS',
        `Toggled job ${jobId} status to ${status}`
      );
      return NextResponse.json({ success: true, message: `Status updated to ${status}` });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
