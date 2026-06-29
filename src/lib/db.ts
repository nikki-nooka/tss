import { createClient } from '@supabase/supabase-js';

// Define TS Interfaces (aligned with Phase 1 updates)
export interface Candidate {
  id: string;
  role: 'Student' | 'Founder' | 'Recruiter' | 'HR' | 'Mentor' | 'Investor' | 'Freelancer' | 'Creator' | 'Campus Ambassador' | 'Volunteer' | 'Startup' | 'Company' | string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Prefer Not To Say';
  dob: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  country: string;
  
  // Student specific fields (optional)
  highestQualification?: string;
  currentStatus?: string;
  college?: string;
  graduationYear?: number;
  currentRole?: string;
  preferredRoles?: string[];
  skills?: string[];
  experienceLevel?: string;
  resumePath?: string;
  resumeName?: string;
  
  // Photo upload
  photoPath?: string;
  photoName?: string;

  // Role details JSON object
  roleDetails?: Record<string, any>;

  linkedin: string;
  github?: string;
  portfolio?: string;
  instagram?: string;
  xTwitter?: string;
  status: 'Submitted' | 'Pending' | 'Under Review' | 'Needs Changes' | 'Resubmitted' | 'Verified' | 'Rejected' | 'Suspended' | 'Deleted';
  memberId?: string; // Format: TSS-000000
  notes?: string;
  registrationDate: string; // ISO String

  // Dynamic Verification System additions
  username?: string;
  communityScore?: number;
  level?: 'Explorer' | 'Builder' | 'Creator' | 'Leader' | 'Mentor' | string;
  memberSince?: string;
}

export interface ForwardLog {
  id: string;
  candidateId: string;
  recruiterName: string;
  recruiterEmail: string;
  sentDate: string; // ISO String
  feedback?: string;
  status: 'Sent' | 'Interested' | 'Rejected' | 'No Response';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string; // ISO String
}

export interface AdminActivityLog {
  id: string;
  adminUser: string;
  action: string;
  details: string;
  timestamp: string; // ISO String
}

export interface SystemSettings {
  communityMembers: number;
  recruiterNetwork: number;
  opportunitiesShared: number;
  eventsConducted: number;
}

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- DB Seeder (Self-contained) ---
const seedMockData = async () => {
  const initialCandidates: Candidate[] = [
    {
      id: 'cand-1',
      role: 'Student',
      fullName: 'Rahul Sharma',
      gender: 'Male',
      dob: '2001-08-15',
      mobile: '9876543210',
      email: 'rahul.sharma@example.com',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      highestQualification: 'Undergraduate',
      currentStatus: 'Pursuing',
      college: 'IIIT Hyderabad',
      graduationYear: 2026,
      currentRole: 'Student / Frontend Intern',
      preferredRoles: ['Software Engineer', 'UI UX Designer'],
      skills: ['React', 'TypeScript', 'HTML', 'CSS', 'JavaScript', 'Next.js'],
      experienceLevel: 'Fresher',
      linkedin: 'https://linkedin.com/in/rahul-sharma-demo',
      github: 'https://github.com/rahul-sharma-demo',
      resumePath: 'mock-resume.pdf',
      resumeName: 'Rahul_Sharma_Resume.pdf',
      status: 'Verified',
      memberId: 'TSS-ST-010626001',
      notes: 'Strong frontend development skills. Portfolio looks excellent.',
      registrationDate: '2026-06-01T10:30:00.000Z'
    },
    {
      id: 'cand-2',
      role: 'Working Professional',
      fullName: 'Priya Patel',
      gender: 'Female',
      dob: '1999-04-22',
      mobile: '8765432109',
      email: 'priya.patel@example.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      linkedin: 'https://linkedin.com/in/priya-patel-demo',
      portfolio: 'https://priyapatel-demo.dev',
      status: 'Pending',
      registrationDate: '2026-06-21T08:15:00.000Z',
      roleDetails: {
        company: 'DataTech Solutions',
        role: 'Junior Data Analyst',
        experience: '1-3 Years',
        skills: ['Python', 'SQL', 'Tableau', 'Excel']
      }
    },
    {
      id: 'cand-3',
      role: 'Student',
      fullName: 'Aravind Swamy',
      gender: 'Male',
      dob: '2000-11-05',
      mobile: '7654321098',
      email: 'aravind.swamy@example.com',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      highestQualification: 'Undergraduate',
      currentStatus: 'Graduated',
      college: 'VTU Bengaluru',
      graduationYear: 2024,
      currentRole: 'Unemployed Graduate',
      preferredRoles: ['Software Engineer', 'Operations'],
      skills: ['Java', 'C++', 'SQL', 'Git', 'Linux'],
      experienceLevel: 'Fresher',
      linkedin: 'https://linkedin.com/in/aravind-swamy-demo',
      github: 'https://github.com/aravindswamy-demo',
      resumePath: 'mock-resume.pdf',
      resumeName: 'Aravind_Resume.pdf',
      status: 'Under Review',
      notes: 'Academic details verified. Checking resume project links.',
      registrationDate: '2026-06-20T14:45:00.000Z'
    }
  ];

  const initialMessage = {
    id: 'msg-1',
    name: 'Anjali Gupta',
    email: 'anjali@startup.com',
    phone: '9000000001',
    message: 'Looking to hire software engineering interns from your network. How do we proceed?',
    submittedAt: '2026-06-20T12:00:00.000Z'
  };

  const initialLog = {
    id: 'log-1',
    adminUser: 'System',
    action: 'DB_INITIALIZATION',
    details: 'Supabase Database connected and seeded with default values.',
    timestamp: new Date().toISOString()
  };

  try {
    // Check if we can seed Candidates
    const { count } = await supabase.from('candidates').select('*', { count: 'exact', head: true });
    if (count === 0) {
      await supabase.from('candidates').insert(initialCandidates);
      await supabase.from('messages').insert([initialMessage]);
      await supabase.from('activity_logs').insert([initialLog]);
      console.log('Supabase: Seed data successfully injected.');
    }
  } catch (err) {
    console.error('Supabase seeding skipped or failed (check table creation):', err);
  }
};

// Execute Seeder Check
if (supabaseUrl && supabaseAnonKey) {
  seedMockData();
}

// --- Supabase CRUD Database Helpers ---

// 1. Candidates Queries
export async function getCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('registrationDate', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(c => {
    const roleDetails = c.roleDetails ? (typeof c.roleDetails === 'object' ? c.roleDetails : JSON.parse(c.roleDetails || '{}')) : {};
    return {
      ...c,
      preferredRoles: c.preferredRoles ? (Array.isArray(c.preferredRoles) ? c.preferredRoles : JSON.parse(c.preferredRoles || '[]')) : [],
      skills: c.skills ? (Array.isArray(c.skills) ? c.skills : JSON.parse(c.skills || '[]')) : [],
      roleDetails,
      username: roleDetails.username || '',
      communityScore: roleDetails.communityScore !== undefined ? roleDetails.communityScore : 20,
      level: roleDetails.level || 'Explorer',
      memberSince: roleDetails.memberSince || new Date(c.registrationDate || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
  }) as Candidate[];
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found code
    throw error;
  }
  
  const roleDetails = data.roleDetails ? (typeof data.roleDetails === 'object' ? data.roleDetails : JSON.parse(data.roleDetails || '{}')) : {};
  return {
    ...data,
    preferredRoles: data.preferredRoles ? (Array.isArray(data.preferredRoles) ? data.preferredRoles : JSON.parse(data.preferredRoles || '[]')) : [],
    skills: data.skills ? (Array.isArray(data.skills) ? data.skills : JSON.parse(data.skills || '[]')) : [],
    roleDetails,
    username: roleDetails.username || '',
    communityScore: roleDetails.communityScore !== undefined ? roleDetails.communityScore : 20,
    level: roleDetails.level || 'Explorer',
    memberSince: roleDetails.memberSince || new Date(data.registrationDate || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } as Candidate;
}

export async function insertCandidate(candidate: Candidate): Promise<void> {
  const roleDetails = candidate.roleDetails || {};
  roleDetails.username = candidate.username || '';
  roleDetails.communityScore = candidate.communityScore !== undefined ? candidate.communityScore : 20;
  roleDetails.level = candidate.level || 'Explorer';
  roleDetails.memberSince = candidate.memberSince || new Date(candidate.registrationDate || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  const dbCandidate = {
    ...candidate,
    preferredRoles: candidate.preferredRoles || [],
    skills: candidate.skills || [],
    roleDetails: roleDetails
  };
  delete (dbCandidate as any).username;
  delete (dbCandidate as any).communityScore;
  delete (dbCandidate as any).level;
  delete (dbCandidate as any).memberSince;

  const { error } = await supabase
    .from('candidates')
    .insert([dbCandidate]);

  if (error) throw error;
}

export async function updateCandidate(id: string, updates: Partial<Candidate>): Promise<void> {
  const current = await getCandidateById(id);
  if (!current) throw new Error('Candidate not found');

  const roleDetails = { ...current.roleDetails, ...updates.roleDetails };
  if (updates.username !== undefined) roleDetails.username = updates.username;
  
  if (updates.communityScore !== undefined) {
    roleDetails.communityScore = updates.communityScore;
    if (updates.communityScore < 50) {
      roleDetails.level = 'Explorer';
    } else if (updates.communityScore < 150) {
      roleDetails.level = 'Builder';
    } else if (updates.communityScore < 300) {
      roleDetails.level = 'Creator';
    } else if (updates.communityScore < 500) {
      roleDetails.level = 'Leader';
    } else {
      roleDetails.level = 'Mentor';
    }
    updates.level = roleDetails.level;
  } else if (updates.level !== undefined) {
    roleDetails.level = updates.level;
  }

  if (updates.memberSince !== undefined) roleDetails.memberSince = updates.memberSince;

  const dbUpdates = {
    ...updates,
    roleDetails
  };
  
  delete (dbUpdates as any).username;
  delete (dbUpdates as any).communityScore;
  delete (dbUpdates as any).level;
  delete (dbUpdates as any).memberSince;

  const { error } = await supabase
    .from('candidates')
    .update(dbUpdates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCandidate(id: string): Promise<void> {
  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// 2. Settings Queries
export async function getSettings(): Promise<SystemSettings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 'homepage_stats')
    .single();

  if (error) {
    // If not found, return default settings
    return {
      communityMembers: 500,
      recruiterNetwork: 100,
      opportunitiesShared: 30,
      eventsConducted: 20
    };
  }
  return data as SystemSettings;
}

export async function updateSettings(settings: SystemSettings): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .upsert([{ id: 'homepage_stats', ...settings }]);

  if (error) throw error;
}

// 3. Contact Messages Queries
export async function getMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('submittedAt', { ascending: false });

  if (error) throw error;
  return data as ContactMessage[];
}

export async function insertMessage(msg: ContactMessage): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .insert([msg]);

  if (error) throw error;
}

// 4. Activity Logs Queries
export async function getActivityLogs(): Promise<AdminActivityLog[]> {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data as AdminActivityLog[];
}

export async function logAdminAction(adminUser: string, action: string, details: string): Promise<void> {
  const newLog: AdminActivityLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    adminUser,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  const { error } = await supabase
    .from('activity_logs')
    .insert([newLog]);

  if (error) {
    console.error('Failed to log admin action to Supabase:', error);
  }
}

// 5. Recruiter Forwarding Queries
export async function getForwards(candidateId?: string): Promise<ForwardLog[]> {
  let query = supabase.from('forwards').select('*');
  
  if (candidateId) {
    query = query.eq('candidateId', candidateId);
  }

  const { data, error } = await query.order('sentDate', { ascending: false });
  if (error) throw error;
  return data as ForwardLog[];
}

export async function insertForward(log: ForwardLog): Promise<void> {
  const { error } = await supabase
    .from('forwards')
    .insert([log]);

  if (error) throw error;
}

export async function updateForward(id: string, updates: Partial<ForwardLog>): Promise<void> {
  const { error } = await supabase
    .from('forwards')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}

// 6. Job Board Support & Helpers
import fs from 'fs';
import path from 'path';

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  location: string;
  description: string;
  requirements: string[];
  salaryRange?: string;
  postedAt: string; // ISO string
  status: 'Active' | 'Closed';
  applyLink?: string; // Mobile number or apply URL link
  recruiterEmail?: string; // Recruiter email contact
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  appliedAt: string; // ISO string
  status: 'Applied' | 'Reviewing' | 'Shortlisted' | 'Rejected';
  coverLetter?: string;
  
  // Custom joined details for admin dashboard lists
  candidateName?: string;
  candidateEmail?: string;
  candidateResumePath?: string;
  candidateRole?: string;
  candidateLinkedin?: string;
  jobTitle?: string;
  companyName?: string;
}

const LOCAL_DB_PATH = path.join(process.cwd(), 'db_fallback.json');

interface FallbackStore {
  jobs: Job[];
  applications: JobApplication[];
}

function readLocalDb(): FallbackStore {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const content = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading fallback DB:', e);
  }
  
  // Seed initial mock jobs if file doesn't exist
  const initialJobs: Job[] = [
    {
      id: 'job-1',
      title: 'Software Engineering Intern',
      companyName: 'TechSpot Solutions',
      type: 'Internship',
      location: 'Hyderabad (Hybrid)',
      salaryRange: '₹25,000/month',
      description: 'Looking for active student developers to build high-scale web platforms using Next.js, TypeScript, and Supabase. You will work directly with our core engineering team.',
      requirements: ['React / Next.js experience', 'TypeScript knowledge', 'Basic database design', 'Good communication skills'],
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active'
    },
    {
      id: 'job-2',
      title: 'Associate Product Manager',
      companyName: 'FounderX Lab',
      type: 'Full-time',
      location: 'Bengaluru',
      salaryRange: '₹8 - 12 LPA',
      description: 'Own product lifecycle, draft PRDs, coordinate sprints with engineering, and work directly with founders to scale our B2B SaaS platform.',
      requirements: ['Strong analytical capabilities', 'Familiarity with Figma / UI UX principles', 'Ability to communicate with technical teams'],
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active'
    },
    {
      id: 'job-3',
      title: 'HR & Talent Coordinator',
      companyName: 'BuildX Partners',
      type: 'Contract',
      location: 'Remote',
      salaryRange: '₹30,000/month',
      description: 'Source and screen verified candidates from the TSS network for corporate partner roles. Set up interview schedules and track feedback loop metrics.',
      requirements: ['Basic screening / recruiting knowledge', 'High empathy and excellent communication', 'Active WhatsApp and Gmail usage'],
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active'
    }
  ];
  const initialData = { jobs: initialJobs, applications: [] };
  writeLocalDb(initialData);
  return initialData;
}

function writeLocalDb(data: FallbackStore) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing fallback DB:', e);
  }
}

export async function getJobs(): Promise<Job[]> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('postedAt', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(j => ({
      ...j,
      requirements: Array.isArray(j.requirements) ? j.requirements : JSON.parse(j.requirements || '[]')
    })) as Job[];
  } catch (err) {
    console.warn('Supabase getJobs failed, using local storage:', err);
    const local = readLocalDb();
    return local.jobs.sort((a,b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  }
}

export async function insertJob(job: Job): Promise<void> {
  try {
    const { error } = await supabase
      .from('jobs')
      .insert([{
        ...job,
        requirements: job.requirements || []
      }]);
    if (error) throw error;
  } catch (err) {
    console.warn('Supabase insertJob failed, using local storage:', err);
    const local = readLocalDb();
    local.jobs.push(job);
    writeLocalDb(local);
  }
}

export async function updateJob(id: string, updates: Partial<Job>): Promise<void> {
  try {
    const { error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.warn('Supabase updateJob failed, using local storage:', err);
    const local = readLocalDb();
    const idx = local.jobs.findIndex(j => j.id === id);
    if (idx !== -1) {
      local.jobs[idx] = { ...local.jobs[idx], ...updates };
      writeLocalDb(local);
    }
  }
}

export async function getApplications(): Promise<JobApplication[]> {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('appliedAt', { ascending: false });
    if (error) throw error;
    
    const apps = (data || []) as JobApplication[];
    const candidates = await getCandidates();
    const candidatesMap = new Map(candidates.map(c => [c.id, c]));
    
    const jobs = await getJobs();
    const jobsMap = new Map(jobs.map(j => [j.id, j]));
    
    return apps.map(app => {
      const cand = candidatesMap.get(app.candidateId);
      const job = jobsMap.get(app.jobId);
      return {
        ...app,
        candidateName: cand?.fullName || 'Unknown Candidate',
        candidateEmail: cand?.email || 'N/A',
        candidateResumePath: cand?.resumePath || '',
        candidateRole: cand?.role || 'N/A',
        candidateLinkedin: cand?.linkedin || '',
        jobTitle: job?.title || 'Unknown Job',
        companyName: job?.companyName || 'Unknown Company'
      };
    });
  } catch (err) {
    console.warn('Supabase getApplications failed, using local storage:', err);
    const local = readLocalDb();
    const candidates = await getCandidates();
    const candidatesMap = new Map(candidates.map(c => [c.id, c]));
    const jobsMap = new Map(local.jobs.map(j => [j.id, j]));
    
    return local.applications.map(app => {
      const cand = candidatesMap.get(app.candidateId);
      const job = jobsMap.get(app.jobId);
      return {
        ...app,
        candidateName: cand?.fullName || 'Unknown Candidate',
        candidateEmail: cand?.email || 'N/A',
        candidateResumePath: cand?.resumePath || '',
        candidateRole: cand?.role || 'N/A',
        candidateLinkedin: cand?.linkedin || '',
        jobTitle: job?.title || 'Unknown Job',
        companyName: job?.companyName || 'Unknown Company'
      };
    }).sort((a,b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  }
}

export async function insertApplication(app: JobApplication): Promise<void> {
  try {
    const { error } = await supabase
      .from('job_applications')
      .insert([app]);
    if (error) throw error;
  } catch (err) {
    console.warn('Supabase insertApplication failed, using local storage:', err);
    const local = readLocalDb();
    local.applications.push(app);
    writeLocalDb(local);
  }
}

export async function updateApplicationStatus(id: string, status: 'Applied' | 'Reviewing' | 'Shortlisted' | 'Rejected'): Promise<void> {
  try {
    const { error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.warn('Supabase updateApplicationStatus failed, using local storage:', err);
    const local = readLocalDb();
    const idx = local.applications.findIndex(a => a.id === id);
    if (idx !== -1) {
      local.applications[idx].status = status;
      writeLocalDb(local);
    }
  }
}
