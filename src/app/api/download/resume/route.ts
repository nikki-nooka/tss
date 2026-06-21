import { NextResponse } from 'next/server';
import { getCandidateById } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // 1. Authenticate Admin/HR session
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get('id');

    if (!candidateId) {
      return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 });
    }

    // 2. Fetch candidate record from Supabase
    const candidate = await getCandidateById(candidateId);
    
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    // 3. Handle Mock PDF or Real file
    // If it's the initial mock candidate, serve a mock PDF buffer dynamically
    if (candidate.resumePath === 'mock-resume.pdf') {
      const mockPdfContent = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << >> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 12 Tf\n72 712 Td\n(TSS Mock Candidate Resume Document) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000212 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n307\n%%EOF`;
      
      const response = new NextResponse(Buffer.from(mockPdfContent, 'utf-8'));
      response.headers.set('Content-Type', 'application/pdf');
      response.headers.set('Content-Disposition', `inline; filename="${candidate.resumeName}"`);
      return response;
    }

    // Decode the Base64 resume from database
    const fileBuffer = Buffer.from(candidate.resumePath, 'base64');

    // Stream back to client
    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Disposition', `inline; filename="${candidate.resumeName}"`);
    return response;

  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
