import { createClient } from '@supabase/supabase-js';

// Define TS Interfaces (aligned with Phase 1 updates)
export interface Candidate {
  id: string;
  role: 'Student' | 'Founder' | 'Recruiter' | 'Mentor' | 'Investor' | 'Working Professional';
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
  status: 'Pending' | 'Under Review' | 'Verified' | 'Rejected';
  memberId?: string; // Format: TSS-XX-DDMMYYXXX
  notes?: string;
  registrationDate: string; // ISO String
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
  
  // Format preferredRoles and skills back to normal arrays (Supabase pulls JSONB natively as arrays, but double-check)
  return (data || []).map(c => ({
    ...c,
    preferredRoles: c.preferredRoles ? (Array.isArray(c.preferredRoles) ? c.preferredRoles : JSON.parse(c.preferredRoles || '[]')) : [],
    skills: c.skills ? (Array.isArray(c.skills) ? c.skills : JSON.parse(c.skills || '[]')) : [],
    roleDetails: c.roleDetails ? (typeof c.roleDetails === 'object' ? c.roleDetails : JSON.parse(c.roleDetails || '{}')) : {}
  })) as Candidate[];
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
  
  return {
    ...data,
    preferredRoles: data.preferredRoles ? (Array.isArray(data.preferredRoles) ? data.preferredRoles : JSON.parse(data.preferredRoles || '[]')) : [],
    skills: data.skills ? (Array.isArray(data.skills) ? data.skills : JSON.parse(data.skills || '[]')) : [],
    roleDetails: data.roleDetails ? (typeof data.roleDetails === 'object' ? data.roleDetails : JSON.parse(data.roleDetails || '{}')) : {}
  } as Candidate;
}

export async function insertCandidate(candidate: Candidate): Promise<void> {
  const { error } = await supabase
    .from('candidates')
    .insert([{
      ...candidate,
      preferredRoles: candidate.preferredRoles || [],
      skills: candidate.skills || [],
      roleDetails: candidate.roleDetails || {}
    }]);

  if (error) throw error;
}

export async function updateCandidate(id: string, updates: Partial<Candidate>): Promise<void> {
  const { error } = await supabase
    .from('candidates')
    .update(updates)
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
