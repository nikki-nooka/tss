import { NextResponse } from 'next/server';
import { getCandidates, insertCandidate, Candidate } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // 1. Extract Role & Common Fields
    const role = (formData.get('role') as string || 'Student').trim() as Candidate['role'];
    const fullName = (formData.get('fullName') as string || '').trim();
    const gender = (formData.get('gender') as Candidate['gender'] || 'Prefer Not To Say');
    const dob = (formData.get('dob') as string || '').trim();
    const mobile = (formData.get('mobile') as string || '').trim();
    const email = (formData.get('email') as string || '').trim().toLowerCase();
    const city = (formData.get('city') as string || '').trim();
    const state = (formData.get('state') as string || '').trim();
    const country = (formData.get('country') as string || 'India').trim();
    const linkedin = (formData.get('linkedin') as string || '').trim();
    const github = (formData.get('github') as string || '').trim();
    const portfolio = (formData.get('portfolio') as string || '').trim();
    const instagram = (formData.get('instagram') as string || '').trim();
    const xTwitter = (formData.get('xTwitter') as string || '').trim();
    const declaration = formData.get('declaration') === 'true';

    // --- Server-side Validations ---
    
    // Check role validity
    const validRoles = ['Student', 'Founder', 'Recruiter', 'Mentor', 'Investor', 'Working Professional'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid membership role selected' }, { status: 400 });
    }

    // Name validation
    const nameRegex = /^[A-Za-z\s]+$/;
    if (fullName.length < 3 || fullName.length > 60 || !nameRegex.test(fullName)) {
      return NextResponse.json({ error: 'Name must be 3-60 characters and contain only letters and spaces' }, { status: 400 });
    }

    // Contact fields checks
    if (!mobile || !email) {
      return NextResponse.json({ error: 'Email and Mobile number are required' }, { status: 400 });
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json({ error: 'Mobile number must be exactly 10 digits' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Location
    if (!city || !state) {
      return NextResponse.json({ error: 'City and State are required' }, { status: 400 });
    }

    // LinkedIn URL validation (mandatory for all)
    if (!linkedin || !linkedin.toLowerCase().includes('linkedin.com/')) {
      return NextResponse.json({ error: 'A valid LinkedIn URL is required' }, { status: 400 });
    }

    // Optional URLs validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (github && !github.toLowerCase().includes('github.com/')) {
      return NextResponse.json({ error: 'Please enter a valid GitHub profile URL' }, { status: 400 });
    }
    if (portfolio && !urlPattern.test(portfolio)) {
      return NextResponse.json({ error: 'Please enter a valid Portfolio URL' }, { status: 400 });
    }

    // Declaration Check
    if (!declaration) {
      return NextResponse.json({ error: 'You must check the declaration to register' }, { status: 400 });
    }

    // Duplicate email or phone check
    const candidates = await getCandidates();
    const isEmailDuplicate = candidates.some(c => c.email.toLowerCase() === email.toLowerCase() && c.status !== 'Rejected');
    const isPhoneDuplicate = candidates.some(c => c.mobile === mobile && c.status !== 'Rejected');
    if (isEmailDuplicate) {
      return NextResponse.json({ error: 'This email address is already registered.' }, { status: 400 });
    }
    if (isPhoneDuplicate) {
      return NextResponse.json({ error: 'This mobile number is already registered.' }, { status: 400 });
    }

    // 2. Parse Role-Specific Fields
    let roleDetails: Record<string, any> = {};
    let highestQualification: string | undefined;
    let currentStatus: string | undefined;
    let college: string | undefined;
    let graduationYear: number | undefined;
    let currentRole: string | undefined;
    let preferredRoles: string[] | undefined;
    let skills: string[] | undefined;
    let experienceLevel: string | undefined;

    if (role === 'Student') {
      highestQualification = (formData.get('highestQualification') as string || 'Undergraduate').trim();
      currentStatus = (formData.get('currentStatus') as string || 'Pursuing').trim();
      college = (formData.get('college') as string || '').trim();
      const gradYearStr = formData.get('graduationYear') as string;
      graduationYear = parseInt(gradYearStr || '0', 10);
      const degree = (formData.get('degree') as string || '').trim();
      const specialization = (formData.get('specialization') as string || '').trim();
      const preferredDomain = (formData.get('preferredDomain') as string || '').trim();
      const internshipInterested = formData.get('internshipInterested') === 'true' || formData.get('internshipInterested') === 'Yes' ? 'Yes' : 'No';
      const jobInterested = formData.get('jobInterested') === 'true' || formData.get('jobInterested') === 'Yes' ? 'Yes' : 'No';
      const startupInterested = formData.get('startupInterested') === 'true' || formData.get('startupInterested') === 'Yes' ? 'Yes' : 'No';
      const buildxInterested = formData.get('buildxInterested') === 'true' || formData.get('buildxInterested') === 'Yes' ? 'Yes' : 'No';

      // Parse preferredRoles
      try {
        preferredRoles = JSON.parse(formData.get('preferredRoles') as string || '[]');
      } catch {
        preferredRoles = formData.getAll('preferredRoles') as string[];
      }
      
      // Parse skills
      try {
        skills = JSON.parse(formData.get('skills') as string || '[]');
      } catch {
        const skillsRaw = formData.get('skills') as string || '';
        skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);
      }

      // Validations
      if (!college || !degree || !specialization) {
        return NextResponse.json({ error: 'College Name, Degree, and Specialization are required for students' }, { status: 400 });
      }
      if (isNaN(graduationYear) || graduationYear < 2000 || graduationYear > 2045) {
        return NextResponse.json({ error: 'Graduation Year must be between 2000 and 2045' }, { status: 400 });
      }
      if (!skills || skills.length === 0) {
        return NextResponse.json({ error: 'Please add at least one skill' }, { status: 400 });
      }

      currentRole = 'Student';
      experienceLevel = 'Fresher';

      roleDetails = {
        degree,
        specialization,
        preferredDomain,
        internshipInterested,
        jobInterested,
        startupInterested,
        buildxInterested
      };
    } 
    else if (role === 'Founder') {
      const startupName = (formData.get('startupName') as string || '').trim();
      const startupStage = (formData.get('startupStage') as string || '').trim();
      const industry = (formData.get('industry') as string || '').trim();
      const website = (formData.get('website') as string || '').trim();
      const startupDescription = (formData.get('startupDescription') as string || '').trim();
      const teamSize = (formData.get('teamSize') as string || '').trim();

      if (!startupName || !startupStage || !industry || !startupDescription || !teamSize) {
        return NextResponse.json({ error: 'Startup Name, Stage, Industry, Description, and Team Size are required' }, { status: 400 });
      }
      if (website && !urlPattern.test(website)) {
        return NextResponse.json({ error: 'Please enter a valid website URL' }, { status: 400 });
      }

      currentRole = `Founder @ ${startupName}`;
      roleDetails = {
        startupName,
        startupStage,
        industry,
        website,
        startupDescription,
        teamSize
      };
    } 
    else if (role === 'Recruiter') {
      const companyName = (formData.get('companyName') as string || '').trim();
      const designation = (formData.get('designation') as string || '').trim();
      const hiringDomains = (formData.get('hiringDomains') as string || '').trim();
      const companyWebsite = (formData.get('companyWebsite') as string || '').trim();

      if (!companyName || !designation || !hiringDomains) {
        return NextResponse.json({ error: 'Company Name, Designation, and Hiring Domains are required' }, { status: 400 });
      }
      if (companyWebsite && !urlPattern.test(companyWebsite)) {
        return NextResponse.json({ error: 'Please enter a valid company website URL' }, { status: 400 });
      }

      currentRole = `${designation} @ ${companyName}`;
      roleDetails = {
        companyName,
        designation,
        hiringDomains,
        companyWebsite
      };
    } 
    else if (role === 'Mentor') {
      const currentCompany = (formData.get('currentCompany') as string || '').trim();
      const mentorRole = (formData.get('mentorRole') as string || '').trim();
      const experience = (formData.get('experience') as string || '').trim();
      const expertiseAreas = (formData.get('expertiseAreas') as string || '').trim();

      if (!currentCompany || !mentorRole || !experience || !expertiseAreas) {
        return NextResponse.json({ error: 'Company, Role, Experience, and Expertise Areas are required' }, { status: 400 });
      }

      currentRole = `${mentorRole} @ ${currentCompany}`;
      experienceLevel = experience;
      roleDetails = {
        currentCompany,
        mentorRole,
        experience,
        expertiseAreas
      };
    } 
    else if (role === 'Investor') {
      const fundName = (formData.get('fundName') as string || '').trim();
      const investmentFocus = (formData.get('investmentFocus') as string || '').trim();
      const website = (formData.get('website') as string || '').trim();

      if (!fundName || !investmentFocus) {
        return NextResponse.json({ error: 'Fund Name and Investment Focus are required' }, { status: 400 });
      }
      if (website && !urlPattern.test(website)) {
        return NextResponse.json({ error: 'Please enter a valid website URL' }, { status: 400 });
      }

      currentRole = `Investor @ ${fundName}`;
      roleDetails = {
        fundName,
        investmentFocus,
        website
      };
    } 
    else if (role === 'Working Professional') {
      const company = (formData.get('company') as string || '').trim();
      const professionalRole = (formData.get('professionalRole') as string || '').trim();
      const professionalExperience = (formData.get('professionalExperience') as string || '').trim();
      
      // Parse professionalSkills
      let professionalSkills: string[] = [];
      try {
        professionalSkills = JSON.parse(formData.get('skills') as string || '[]');
      } catch {
        const skillsRaw = formData.get('skills') as string || '';
        professionalSkills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);
      }

      if (!company || !professionalRole || !professionalExperience || professionalSkills.length === 0) {
        return NextResponse.json({ error: 'Company, Designation, Experience, and Skills are required' }, { status: 400 });
      }

      currentRole = `${professionalRole} @ ${company}`;
      experienceLevel = professionalExperience;
      skills = professionalSkills;
      roleDetails = {
        company,
        professionalRole,
        professionalExperience
      };
    }

    // 3. Process Photo Upload (Required for all profiles)
    const photoFile = formData.get('photo') as File | null;
    if (!photoFile) {
      return NextResponse.json({ error: 'Profile Photo upload is required' }, { status: 400 });
    }
    const photoName = photoFile.name;
    const photoNameLower = photoName.toLowerCase();
    const isValidPhotoExt = ['.jpg', '.jpeg', '.png'].some(ext => photoNameLower.endsWith(ext));
    if (!isValidPhotoExt) {
      return NextResponse.json({ error: 'Invalid photo format. Only JPG, JPEG, and PNG are allowed.' }, { status: 400 });
    }
    if (photoFile.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Photo size exceeds 2MB limit.' }, { status: 400 });
    }
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const base64Photo = photoBuffer.toString('base64');

    // 4. Process Resume Link (Only for Students, optional/absent for others)
    let resumeLink = '';
    let resumeName = '';
    if (role === 'Student') {
      resumeLink = (formData.get('resumeLink') as string) || '';
      if (!resumeLink.trim()) {
        return NextResponse.json({ error: 'Resume link is required for student profiles.' }, { status: 400 });
      }
      const lowerLink = resumeLink.trim().toLowerCase();
      if (!lowerLink.startsWith('http://') && !lowerLink.startsWith('https://')) {
        return NextResponse.json({ error: 'Invalid resume link format. Must be a valid URL starting with http:// or https://' }, { status: 400 });
      }
      // Derive a nice default label name
      resumeName = 'Google Drive Link';
      if (lowerLink.includes('dropbox.com')) {
        resumeName = 'Dropbox Link';
      } else if (lowerLink.includes('notion.so') || lowerLink.includes('notion.site')) {
        resumeName = 'Notion Resume Link';
      } else if (lowerLink.includes('drive.google.com')) {
        resumeName = 'Google Drive Link';
      } else {
        resumeName = 'Public Resume Link';
      }
    }

    // 5. Create Candidate Record
    const newCandidate: Candidate = {
      id: `cand-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      role,
      fullName,
      gender,
      dob,
      mobile,
      email,
      city,
      state,
      country,
      
      // Conditionally populated fields
      highestQualification: highestQualification || undefined,
      currentStatus: currentStatus || undefined,
      college: college || undefined,
      graduationYear: graduationYear || undefined,
      currentRole: currentRole || 'N/A',
      preferredRoles: preferredRoles || [],
      skills: skills || [],
      experienceLevel: experienceLevel || 'Fresher',
      
      // Upload files
      resumePath: resumeLink || undefined,
      resumeName: resumeName || undefined,
      photoPath: base64Photo,
      photoName: photoName,

      // Details block
      roleDetails,

      linkedin,
      github: github || undefined,
      portfolio: portfolio || undefined,
      instagram: instagram || undefined,
      xTwitter: xTwitter || undefined,
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
        role: newCandidate.role,
        status: newCandidate.status
      }
    });

  } catch (error) {
    console.error('Failed to register candidate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
