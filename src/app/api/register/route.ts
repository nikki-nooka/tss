import { NextResponse } from 'next/server';
import { getCandidates, insertCandidate, Candidate } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract text fields
    const fullName = (formData.get('fullName') as string || '').trim();
    const gender = formData.get('gender') as 'Male' | 'Female' | 'Prefer Not To Say';
    const dob = formData.get('dob') as string;
    const mobile = (formData.get('mobile') as string || '').trim();
    const email = (formData.get('email') as string || '').trim().toLowerCase();
    const city = (formData.get('city') as string || '').trim();
    const state = (formData.get('state') as string || '').trim();
    const country = (formData.get('country') as string || 'India').trim();
    
    const highestQualification = formData.get('highestQualification') as string;
    const currentStatus = formData.get('currentStatus') as 'Pursuing' | 'Graduated' | 'Working Professional' | 'Founder' | 'Freelancer' | 'Recruiter';
    const college = (formData.get('college') as string || '').trim();
    const graduationYear = parseInt(formData.get('graduationYear') as string || '0', 10);
    
    const currentRole = (formData.get('currentRole') as string || '').trim();
    
    // Parse preferredRoles
    let preferredRoles: string[] = [];
    try {
      preferredRoles = JSON.parse(formData.get('preferredRoles') as string || '[]');
    } catch {
      preferredRoles = formData.getAll('preferredRoles') as string[];
    }
    
    // Parse skills
    let skills: string[] = [];
    try {
      skills = JSON.parse(formData.get('skills') as string || '[]');
    } catch {
      const skillsRaw = formData.get('skills') as string || '';
      skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    const experienceLevel = formData.get('experienceLevel') as 'Fresher' | '0-1 Years' | '1-3 Years' | '3-5 Years' | '5+ Years';
    
    const linkedin = (formData.get('linkedin') as string || '').trim();
    const github = (formData.get('github') as string || '').trim();
    const portfolio = (formData.get('portfolio') as string || '').trim();
    const instagram = (formData.get('instagram') as string || '').trim();
    const xTwitter = (formData.get('xTwitter') as string || '').trim();
    
    const declaration = formData.get('declaration') === 'true';
    const resume = formData.get('resume') as File | null;

    // --- Server-side Validations ---
    
    // 1. Name validation
    const nameRegex = /^[A-Za-z\s]+$/;
    if (fullName.length < 3 || fullName.length > 60 || !nameRegex.test(fullName)) {
      return NextResponse.json({ error: 'Name must be 3-60 characters and contain only letters and spaces' }, { status: 400 });
    }

    // 2. Gender validation
    if (!['Male', 'Female', 'Prefer Not To Say'].includes(gender)) {
      return NextResponse.json({ error: 'Invalid gender value' }, { status: 400 });
    }

    // 3. DOB / Age Validation
    if (!dob) {
      return NextResponse.json({ error: 'Date of birth is required' }, { status: 400 });
    }
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    if (age < 16 || age > 60 || isNaN(age)) {
      return NextResponse.json({ error: 'Age must be between 16 and 60 years old' }, { status: 400 });
    }

    // 4. Mobile Number Validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json({ error: 'Mobile number must be exactly 10 digits' }, { status: 400 });
    }

    // 5. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // 6. City & State
    if (!city || !state) {
      return NextResponse.json({ error: 'City and State are required' }, { status: 400 });
    }

    // 7. Highest Qualification & Current Status
    if (!highestQualification || !currentStatus) {
      return NextResponse.json({ error: 'Qualification and Current Status are required' }, { status: 400 });
    }

    // 8. College
    if (currentStatus === 'Pursuing' && !college) {
      return NextResponse.json({ error: 'College / University is required for students' }, { status: 400 });
    }

    // 9. Graduation Year
    if (graduationYear < 2000 || graduationYear > 2045 || isNaN(graduationYear)) {
      return NextResponse.json({ error: 'Graduation Year must be between 2000 and 2045' }, { status: 400 });
    }

    // 10. Preferred Roles & Skills
    if (preferredRoles.length === 0) {
      return NextResponse.json({ error: 'Select at least one preferred role' }, { status: 400 });
    }
    if (skills.length === 0) {
      return NextResponse.json({ error: 'Please add at least one skill' }, { status: 400 });
    }
    if (skills.length > 20) {
      return NextResponse.json({ error: 'Maximum of 20 skills allowed' }, { status: 400 });
    }

    // 11. Experience Level
    if (!['Fresher', '0-1 Years', '1-3 Years', '3-5 Years', '5+ Years'].includes(experienceLevel)) {
      return NextResponse.json({ error: 'Invalid experience level' }, { status: 400 });
    }

    // 12. LinkedIn
    if (!linkedin || !linkedin.toLowerCase().includes('linkedin.com/')) {
      return NextResponse.json({ error: 'A valid LinkedIn URL is required' }, { status: 400 });
    }

    // Optional URLs validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (github && !urlPattern.test(github)) {
      return NextResponse.json({ error: 'Please enter a valid GitHub URL' }, { status: 400 });
    }
    if (portfolio && !urlPattern.test(portfolio)) {
      return NextResponse.json({ error: 'Please enter a valid Portfolio URL' }, { status: 400 });
    }

    // 13. Declaration
    if (!declaration) {
      return NextResponse.json({ error: 'You must check the declaration to register' }, { status: 400 });
    }

    // Check duplicate email or phone in Supabase DB
    const candidates = await getCandidates();
    const isEmailDuplicate = candidates.some(c => c.email.toLowerCase() === email.toLowerCase() && c.status !== 'Rejected');
    const isPhoneDuplicate = candidates.some(c => c.mobile === mobile && c.status !== 'Rejected');
    
    if (isEmailDuplicate) {
      return NextResponse.json({ error: 'Email address is already registered.' }, { status: 400 });
    }
    if (isPhoneDuplicate) {
      return NextResponse.json({ error: 'Mobile number is already registered.' }, { status: 400 });
    }

    // 14. Resume Upload File Validation
    if (!resume) {
      return NextResponse.json({ error: 'Resume upload is required' }, { status: 400 });
    }

    // Reject DOC, DOCX, ZIP, RAR
    const nameLower = resume.name.toLowerCase();
    const isForbiddenExt = ['.doc', '.docx', '.zip', '.rar'].some(ext => nameLower.endsWith(ext));
    const isPdf = nameLower.endsWith('.pdf') && resume.type === 'application/pdf';

    if (isForbiddenExt || !isPdf) {
      return NextResponse.json({ error: 'Invalid file format. Only PDF files are allowed.' }, { status: 400 });
    }

    // Max Size: 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (resume.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    // Convert PDF file buffer to Base64 to store in database (completely serverless persistent storage)
    const buffer = Buffer.from(await resume.arrayBuffer());
    const base64Resume = buffer.toString('base64');

    // Create candidate record
    const newCandidate: Candidate = {
      id: `cand-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      fullName,
      gender,
      dob,
      mobile,
      email,
      city,
      state,
      country,
      highestQualification,
      currentStatus,
      college: currentStatus === 'Pursuing' ? college : undefined,
      graduationYear,
      currentRole,
      preferredRoles,
      skills,
      experienceLevel,
      linkedin,
      github: github || undefined,
      portfolio: portfolio || undefined,
      instagram: instagram || undefined,
      xTwitter: xTwitter || undefined,
      resumePath: base64Resume, // Store base64 string directly
      resumeName: resume.name,
      status: 'Pending',
      registrationDate: new Date().toISOString()
    };

    await insertCandidate(newCandidate);

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully! Your application is under review.',
      candidate: {
        fullName: newCandidate.fullName,
        email: newCandidate.email,
        mobile: newCandidate.mobile,
        status: newCandidate.status
      }
    });

  } catch (error) {
    console.error('Failed to register candidate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
