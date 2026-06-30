import { NextResponse } from 'next/server';
import { getEmergencies, insertEmergency, getCandidateById, EmergencyRequest } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const city = searchParams.get('city') || '';

    const all = await getEmergencies();

    if (id) {
      const em = all.find(e => e.id === id);
      if (!em) return NextResponse.json({ error: 'Emergency request not found' }, { status: 404 });
      return NextResponse.json({ emergency: em });
    }

    let filtered = all.filter(e => e.status === 'Approved');

    if (city) {
      filtered = filtered.filter(e => e.city.toLowerCase() === city.toLowerCase());
    }

    return NextResponse.json({ emergencies: filtered });
  } catch (error) {
    console.error('Failed to retrieve emergencies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      type, patientName, hospitalName, bloodGroup, unitsRequired, 
      hospitalAddress, city, contactPerson, phoneNumber, requiredBefore, 
      medicalNotes, proofUrl, additionalInfo, postedBy 
    } = body;

    if (!type || !patientName || !hospitalName || !bloodGroup || !unitsRequired || !hospitalAddress || !city || !contactPerson || !phoneNumber || !requiredBefore || !postedBy) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const candidate = await getCandidateById(postedBy);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate profile not found' }, { status: 404 });
    }

    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '').substring(2);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const emId = `TSS-BL-${dateStr}-${randomSuffix}`;

    const newEmergency: EmergencyRequest = {
      id: emId,
      type,
      patientName,
      hospitalName,
      bloodGroup,
      unitsRequired: Number(unitsRequired),
      hospitalAddress,
      city,
      contactPerson,
      phoneNumber,
      requiredBefore,
      medicalNotes: medicalNotes || '',
      proofUrl: proofUrl || '',
      additionalInfo: additionalInfo || '',
      status: 'Pending Emergency Verification',
      postedBy,
      postedDate: new Date().toISOString(),
      potentialDonors: []
    };

    await insertEmergency(newEmergency);

    return NextResponse.json({ success: true, emergency: newEmergency });
  } catch (error) {
    console.error('Failed to create emergency request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
