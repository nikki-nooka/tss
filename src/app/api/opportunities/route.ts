import { NextResponse } from 'next/server';
import { getOpportunities, insertOpportunity, getCandidateById, Opportunity } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const postedBy = searchParams.get('postedBy') || '';
    const savedBy = searchParams.get('savedBy') || '';

    const all = await getOpportunities();

    if (id) {
      const opp = all.find(o => o.id === id);
      if (!opp) return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
      return NextResponse.json({ opportunity: opp });
    }

    let filtered = [...all];

    // Default: only return Approved opportunities to regular users unless they are querying their own posts
    if (!postedBy) {
      filtered = filtered.filter(o => o.status === 'Approved');
    } else {
      filtered = filtered.filter(o => o.postedBy === postedBy);
    }

    if (savedBy) {
      filtered = all.filter(o => o.status === 'Approved' && o.savedByUsers?.includes(savedBy));
    }

    return NextResponse.json({ opportunities: filtered });
  } catch (error) {
    console.error('Failed to retrieve opportunities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      type, title, description, organization, location, 
      remoteOption, skillsRequired, experienceRequired, salaryStipend, 
      deadline, applyLink, website, contactEmail, supportingLinks, postedBy 
    } = body;

    if (!type || !title || !description || !organization || !location || !salaryStipend || !deadline || !applyLink || !postedBy) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const candidate = await getCandidateById(postedBy);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate profile not found' }, { status: 404 });
    }

    // Only verified members can create opportunities
    if (candidate.status !== 'Verified') {
      return NextResponse.json({ error: 'Only verified candidates can post opportunities' }, { status: 403 });
    }

    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '').substring(2);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    
    let typeCode = 'OP';
    if (type === 'Job') typeCode = 'JB';
    else if (type === 'Internship') typeCode = 'IN';
    else if (type === 'Freelance Gig') typeCode = 'FL';
    else if (type === 'Startup Project') typeCode = 'SP';
    else if (type === 'Co-Founder Search') typeCode = 'CF';
    else if (type === 'Campus Ambassador') typeCode = 'CA';
    else if (type === 'Volunteer') typeCode = 'VO';
    else if (type === 'Hackathon') typeCode = 'HK';
    else if (type === 'Event') typeCode = 'EV';
    else if (type === 'Mentorship') typeCode = 'MN';
    else if (type === 'Funding') typeCode = 'FN';
    else if (type === 'Scholarship') typeCode = 'SC';

    const oppId = `TSS-${typeCode}-${dateStr}-${randomSuffix}`;

    const newOpp: Opportunity = {
      id: oppId,
      type,
      title,
      description,
      organization,
      location,
      remoteOption,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      experienceRequired: experienceRequired || '',
      salaryStipend,
      deadline,
      applyLink,
      website: website || '',
      contactEmail: contactEmail || '',
      supportingLinks: supportingLinks || '',
      postedBy,
      postedDate: new Date().toISOString(),
      views: 0,
      applicationsCount: 0,
      status: 'Pending Approval',
      savedByUsers: []
    };

    await insertOpportunity(newOpp);

    return NextResponse.json({ success: true, opportunity: newOpp });
  } catch (error) {
    console.error('Failed to create opportunity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
