'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { 
  Users, 
  Building2, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Search, 
  Download, 
  ExternalLink,
  FileText, 
  Eye, 
  Settings, 
  MessageSquare, 
  ListTodo, 
  LogOut, 
  User, 
  Globe, 
  Send, 
  Plus, 
  ChevronRight, 
  Trash2,
  RefreshCw,
  TrendingUp,
  FileSpreadsheet,
  X,
  Share2
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { Candidate, ForwardLog, ContactMessage, AdminActivityLog } from '@/lib/db';

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

type TabType = 'overview' | 'candidates' | 'settings' | 'messages' | 'logs' | 'jobs';

export default function AdminDashboard() {
  const toast = useToast();
  const router = useRouter();
  
  // Authentication & Navigation
  const [adminUser, setAdminUser] = useState<{ email: string; role: 'Admin' | 'HR' } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('candidates');
  const [isLoading, setIsLoading] = useState(true);

  // Data Collections
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>([]);
  const [metrics, setMetrics] = useState<any>({
    totalRegistrations: 0,
    pendingReviews: 0,
    verifiedMembers: 0,
    rejectedProfiles: 0,
    dailyRegistrations: 0,
    monthlyRegistrations: 0,
    chartData: []
  });

  // Landing Page Counters Settings
  const [landingStats, setLandingStats] = useState({
    communityMembers: 12000,
    recruiterNetwork: 300,
    opportunitiesShared: 800,
    eventsConducted: 40
  });

  // Table Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [gradYearFilter, setGradYearFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Selected Candidate for Detail Modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [candidateFwdLogs, setCandidateFwdLogs] = useState<ForwardLog[]>([]);

  // Checklist & Rejection States
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRejectionReasons, setSelectedRejectionReasons] = useState<string[]>([]);

  const calculateProfileCompleteness = (cand: Candidate) => {
    let score = 0;
    // Personal Details (Name, Email, Phone, Location) = 20%
    if (cand.fullName && cand.email && cand.mobile && cand.city && cand.state) {
      score += 20;
    } else if (cand.fullName) {
      score += 10;
    }
    
    // Education details = 20%
    const roleDetails = cand.roleDetails || {};
    if (cand.college && cand.graduationYear && (roleDetails.degree || cand.highestQualification) && (roleDetails.specialization || roleDetails.branch)) {
      score += 20;
    } else if (cand.college) {
      score += 10;
    }

    // Skills = 15%
    if (cand.skills && cand.skills.length > 0) score += 15;

    // Resume = 15%
    if (cand.resumePath || roleDetails.resumeLink) score += 15;

    // Portfolio links = 15%
    if (cand.linkedin) score += 15;

    // Profile photo = 15%
    if (cand.photoPath) score += 15;

    return score;
  };

  const renderChecklistItem = (key: string, label: string) => {
    const isChecked = !!checklistState[key];
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', margin: '0.25rem 0', cursor: 'pointer', color: 'var(--text-main)' }}>
        <input 
          type="checkbox" 
          checked={isChecked}
          onChange={(e) => handleChecklistChange(key, e.target.checked)} 
        />
        <span>{label}</span>
      </label>
    );
  };

  // Jobs Board Admin States
  const [adminJobs, setAdminJobs] = useState<any[]>([]);
  const [adminApps, setAdminApps] = useState<any[]>([]);
  const [loadingAdminJobs, setLoadingAdminJobs] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobType, setNewJobType] = useState<'Full-time' | 'Part-time' | 'Internship' | 'Contract'>('Full-time');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobApplyLink, setNewJobApplyLink] = useState('');
  const [newJobRecruiterEmail, setNewJobRecruiterEmail] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobReqs, setNewJobReqs] = useState('');
  const [isPostingJob, setIsPostingJob] = useState(false);

  // JD Text Parser States
  const [jdText, setJdText] = useState('');
  const [showParser, setShowParser] = useState(false);

  // Recruiter Forwarding Form
  const [showFwdForm, setShowFwdForm] = useState(false);
  const [fwdRecruiterName, setFwdRecruiterName] = useState('');
  const [fwdRecruiterEmail, setFwdRecruiterEmail] = useState('');
  const [fwdNotes, setFwdNotes] = useState('');
  const [isFwdSubmitting, setIsFwdSubmitting] = useState(false);

  // Check login session & load data
  useEffect(() => {
    const initDashboard = async () => {
      try {
        // Authenticate admin by requesting stats (which checks session cooke)
        const statsRes = await fetch('/api/admin/stats');
        if (!statsRes.ok) {
          router.push('/admin');
          return;
        }

        // Quick session profile check
        // Set fallback info since stats verified we are authenticated
        setAdminUser({ email: 'contact.thestudentspot@gmail.com', role: 'Admin' });

        // Load data in parallel
        await Promise.all([
          loadStats(),
          loadCandidates(),
          loadSettings(),
          loadMessages(),
          loadLogs()
        ]);
        
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        router.push('/admin');
      }
    };

    initDashboard();
  }, [router]);

  // --- API Fetch Helpers ---
  const loadStats = async () => {
    const res = await fetch('/api/admin/stats');
    if (res.ok) {
      const data = await res.json();
      setMetrics(data);
    }
  };

  const loadCandidates = async (params = '') => {
    const res = await fetch(`/api/admin/candidates${params}`);
    if (res.ok) {
      const data = await res.json();
      setCandidates(data);
    }
  };

  const loadSettings = async () => {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      setLandingStats(data);
    }
  };

  const loadMessages = async () => {
    const res = await fetch('/api/contact');
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  };

  const loadLogs = async () => {
    const res = await fetch('/api/admin/logs');
    if (res.ok) {
      const data = await res.json();
      setActivityLogs(data);
    }
  };

  // Trigger search with parameters
  const handleApplyFilters = () => {
    let params = '?';
    if (searchQuery) params += `query=${encodeURIComponent(searchQuery)}&`;
    if (statusFilter) params += `status=${encodeURIComponent(statusFilter)}&`;
    if (experienceFilter) params += `experience=${encodeURIComponent(experienceFilter)}&`;
    if (gradYearFilter) params += `gradYear=${encodeURIComponent(gradYearFilter)}&`;
    if (collegeFilter) params += `college=${encodeURIComponent(collegeFilter)}&`;
    if (roleFilter) params += `role=${encodeURIComponent(roleFilter)}&`;
    
    loadCandidates(params);
  };

  // Reset filter selections
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setExperienceFilter('');
    setGradYearFilter('');
    setCollegeFilter('');
    setRoleFilter('');
    loadCandidates();
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        toast.success('Logged out successfully');
        router.push('/admin');
      }
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  // Update Landing page statistics counters
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(landingStats)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Landing page statistics updated!');
        loadLogs();
      } else {
        toast.error(data.error || 'Failed to update settings');
      }
    } catch (err) {
      toast.error('Connection error.');
    }
  };

  const fetchAdminJobsData = async () => {
    setLoadingAdminJobs(true);
    try {
      const jobsRes = await fetch('/api/admin/jobs');
      const jobsData = await jobsRes.json();
      if (Array.isArray(jobsData)) {
        setAdminJobs(jobsData);
      }

      const appsRes = await fetch('/api/admin/applications');
      const appsData = await appsRes.json();
      if (Array.isArray(appsData)) {
        setAdminApps(appsData);
      }
    } catch (err) {
      console.error('Failed to load admin jobs:', err);
      toast.error('Failed to retrieve jobs / applications.');
    } finally {
      setLoadingAdminJobs(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobCompany || !newJobDesc || !newJobApplyLink) {
      toast.error('Please fill all mandatory fields.');
      return;
    }

    setIsPostingJob(true);
    try {
      const requirementsArray = newJobReqs ? newJobReqs.split(',').map(r => r.trim()).filter(Boolean) : [];
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newJobTitle,
          companyName: newJobCompany,
          type: newJobType || 'Full-time',
          location: newJobLocation || 'Remote',
          salaryRange: newJobSalary,
          description: newJobDesc,
          requirements: requirementsArray,
          applyLink: newJobApplyLink,
          recruiterEmail: newJobRecruiterEmail
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Job posted successfully!');
        setNewJobTitle('');
        setNewJobCompany('');
        setNewJobType('Full-time');
        setNewJobLocation('');
        setNewJobSalary('');
        setNewJobApplyLink('');
        setNewJobRecruiterEmail('');
        setNewJobDesc('');
        setNewJobReqs('');
        fetchAdminJobsData();
        loadLogs();
      } else {
        toast.error(data.error || 'Failed to post job.');
      }
    } catch (err) {
      console.error('Error posting job:', err);
      toast.error('Network connection error.');
    } finally {
      setIsPostingJob(false);
    }
  };

  const handleToggleJobStatus = async (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, action: 'toggle_status', status: nextStatus })
      });
      if (res.ok) {
        toast.success(`Job marked as ${nextStatus}!`);
        fetchAdminJobsData();
        loadLogs();
      } else {
        toast.error('Failed to change status.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error.');
    }
  };

  const handleUpdateAppStatus = async (applicationId: string, status: 'Applied' | 'Reviewing' | 'Shortlisted' | 'Rejected') => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status })
      });
      if (res.ok) {
        toast.success(`Application updated to ${status}!`);
        fetchAdminJobsData();
        loadLogs();
      } else {
        toast.error('Failed to update application.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error.');
    }
  };

  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchAdminJobsData();
    }
  }, [activeTab]);

  const parseJobText = (text: string) => {
    const cleanText = text.trim();
    const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);
    const lowerText = cleanText.toLowerCase();
    
    let title = '';
    let company = '';
    let type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' = 'Full-time';
    let location = '';
    let salary = '';
    let requirements: string[] = [];
    let description = cleanText;

    // 1. Title & Company Regex matches
    const atMatch = cleanText.match(/(?:hiring|looking for|we are hiring|vacancy for|opening for)\s+([^.\n]+?)\s+at\s+([^.\n\-,]+)/i);
    if (atMatch) {
      title = atMatch[1].trim();
      company = atMatch[2].trim();
    } else {
      for (const line of lines) {
        const compMatch = line.match(/^(?:company|organization|firm|employer):\s*(.+)/i);
        if (compMatch) company = compMatch[1].trim();
        
        const titleMatch = line.match(/^(?:job title|title|role|position|designation):\s*(.+)/i);
        if (titleMatch) title = titleMatch[1].trim();
      }
    }

    if (!company) {
      for (let i = 0; i < Math.min(lines.length, 3); i++) {
        const line = lines[i];
        const hiringMatch = line.match(/^([A-Z][A-Za-z0-9\s]+)\s+(?:is hiring|is looking for|announces|hiring for)/i);
        if (hiringMatch) {
          company = hiringMatch[1].trim();
          break;
        }
      }
    }

    if (!title && lines[0]) {
      title = lines[0]
        .replace(/^(hiring|looking for|we are hiring|role|position|job description|jd|vacancy):\s*/i, '')
        .trim();
    }

    if (title.length > 80) title = title.substring(0, 80) + '...';
    if (company.length > 50) company = company.substring(0, 50);

    // 2. Type Detector
    if (lowerText.includes('internship') || lowerText.includes('intern ') || lowerText.includes('stipend')) {
      type = 'Internship';
    } else if (lowerText.includes('contract') || lowerText.includes('freelance') || lowerText.includes('consultant')) {
      type = 'Contract';
    } else if (lowerText.includes('part-time') || lowerText.includes('part time')) {
      type = 'Part-time';
    } else {
      type = 'Full-time';
    }

    // 3. Location Detector
    const locPatterns = [
      /^(?:location|workplace|office|city|state|job location):\s*(.+)/i,
      /based\s+in\s+([^.\n]+)/i
    ];
    for (const pat of locPatterns) {
      const match = cleanText.match(pat);
      if (match) {
        location = match[1].trim();
        break;
      }
    }

    if (!location) {
      const locKeywords = [
        { word: 'remote', display: 'Remote' },
        { word: 'work from home', display: 'Remote' },
        { word: 'wfh', display: 'Remote' },
        { word: 'hyderabad', display: 'Hyderabad' },
        { word: 'bengaluru', display: 'Bengaluru' },
        { word: 'bangalore', display: 'Bengaluru' },
        { word: 'mumbai', display: 'Mumbai' },
        { word: 'pune', display: 'Pune' },
        { word: 'delhi', display: 'Delhi NCR' },
        { word: 'noida', display: 'Noida' },
        { word: 'gurugram', display: 'Gurugram' },
        { word: 'gurgaon', display: 'Gurugram' },
        { word: 'chennai', display: 'Chennai' },
        { word: 'karimnagar', display: 'Karimnagar' }
      ];
      for (const item of locKeywords) {
        if (lowerText.includes(item.word)) {
          location = item.display;
          if (lowerText.includes('hybrid')) location += ' (Hybrid)';
          break;
        }
      }
      if (!location) location = 'Remote';
    }

    // 4. Salary Detector
    const salPatterns = [
      /^(?:salary|stipend|ctc|package|compensation|pay|remuneration):\s*(.+)/i,
      /(?:offering|stipend of|salary of|ctc of)\s+([^.\n]+)/i
    ];
    for (const pat of salPatterns) {
      const match = cleanText.match(pat);
      if (match) {
        salary = match[1].trim();
        break;
      }
    }

    if (!salary) {
      const ctcMatch = cleanText.match(/(\d+[-–]\d+\s*(?:lpa|k|inr|usd|per month|stipend))/i) ||
                       cleanText.match(/(?:₹|\$)\s*\d+[\d,]*\s*(?:to\s*(?:₹|\$)?\s*\d+[\d,]*|\/\s*month|per month|lpa)?/i);
      if (ctcMatch) {
        salary = ctcMatch[0].trim();
      } else {
        salary = 'Competitive / Unspecified';
      }
    }

    // 5. Requirements extraction
    const bulletLines = lines.filter(l => l.startsWith('-') || l.startsWith('•') || l.startsWith('*') || l.match(/^\d+\./));
    for (const line of bulletLines) {
      const cleaned = line.replace(/^[-•*\d.]\s*/, '').trim();
      if (cleaned.length > 2 && cleaned.length < 80 && requirements.length < 6) {
        requirements.push(cleaned);
      }
    }

    if (requirements.length < 3) {
      const techGlossary = [
        'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Django', 
        'FastAPI', 'PostgreSQL', 'SQL', 'MongoDB', 'Supabase', 'Docker', 'AWS', 'Tailwind CSS',
        'Figma', 'UI/UX', 'REST APIs', 'Git', 'GitHub', 'Java', 'Spring Boot', 'C++', 'Go', 'Rust'
      ];
      for (const tech of techGlossary) {
        const regex = new RegExp(`\\b${tech.replace('.', '\\.')}\\b`, 'i');
        if (regex.test(cleanText) && !requirements.includes(tech) && requirements.length < 6) {
          requirements.push(tech);
        }
      }
    }

    description = lines
      .filter(l => !l.toLowerCase().includes('apply here') && !l.toLowerCase().includes('click link'))
      .join('\n');

    let applyLink = '';
    const linkMatch = cleanText.match(/(?:apply link|link|apply url|website|form link|apply|url):\s*(https?:\/\/[^\s]+)/i);
    if (linkMatch) {
      applyLink = linkMatch[1].trim();
    } else {
      const phoneMatch = cleanText.match(/(?:phone|mobile|whatsapp|contact|call|number):\s*([+0-9\s\-]{8,15})/i);
      if (phoneMatch) {
        applyLink = phoneMatch[1].trim();
      } else {
        const urlMatch = cleanText.match(/https?:\/\/[^\s]+/i);
        if (urlMatch) {
          applyLink = urlMatch[0].trim();
        } else {
          const numMatch = cleanText.match(/\b[789]\d{9}\b/);
          if (numMatch) {
            applyLink = numMatch[0].trim();
          }
        }
      }
    }

    let recruiterEmail = '';
    const emailMatch = cleanText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
      recruiterEmail = emailMatch[0].trim();
    }

    return { title, company, type, location, salary, requirements, description, applyLink, recruiterEmail };
  };

  const handleParseJD = () => {
    if (!jdText.trim()) {
      toast.warning('Please paste some J.D. text first.');
      return;
    }
    const parsed = parseJobText(jdText);
    if (parsed.title) setNewJobTitle(parsed.title);
    if (parsed.company) setNewJobCompany(parsed.company);
    if (parsed.type) setNewJobType(parsed.type);
    if (parsed.location) setNewJobLocation(parsed.location);
    if (parsed.salary) setNewJobSalary(parsed.salary);
    if (parsed.applyLink) setNewJobApplyLink(parsed.applyLink);
    if (parsed.recruiterEmail) setNewJobRecruiterEmail(parsed.recruiterEmail);
    if (parsed.requirements.length > 0) setNewJobReqs(parsed.requirements.join(', '));
    if (parsed.description) setNewJobDesc(parsed.description);
    toast.success('Crazy accurate mapping completed! Form fields updated.');
  };

  // --- Candidate Assessment Actions ---

  const handleOpenCandidate = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setAdminNotes(candidate.notes || '');
    setChecklistState(candidate.roleDetails?.checklist || {});
    setSelectedRejectionReasons([]);
    setShowRejectModal(false);
    setShowFwdForm(false);
    
    // Fetch forwarding history for this specific candidate
    try {
      const res = await fetch(`/api/admin/forward?candidateId=${candidate.id}`);
      if (res.ok) {
        const data = await res.json();
        setCandidateFwdLogs(data);
      }
    } catch {
      setCandidateFwdLogs([]);
    }
  };

  const handleUpdateStatus = async (
    action: 'approve' | 'reject' | 'review' | 'request_changes' | 'suspend' | 'delete' | 'allow_early_reapply',
    customReasons?: string[]
  ) => {
    if (!selectedCandidate) return;

    if (action === 'delete') {
      const confirmDelete = window.confirm(
        "Permanently deleting this profile will remove:\n- Personal Information\n- Verification Status\n- Resume Link\n- TSS ID\n- Digital ID Card\n\nThis action cannot be undone. Are you sure?"
      );
      if (!confirmDelete) return;
    }

    try {
      const res = await fetch('/api/admin/candidates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: selectedCandidate.id,
          action,
          notes: adminNotes,
          reasons: customReasons || selectedRejectionReasons,
          checklist: checklistState
        })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        if (action === 'delete') {
          toast.success('Candidate profile deleted permanently.');
          setSelectedCandidate(null);
        } else {
          toast.success(`Candidate status updated successfully.`);
          setSelectedCandidate(data.candidate);
        }
        setShowRejectModal(false);
        loadCandidates();
        loadStats();
        loadLogs();
      } else {
        toast.error(data.error || 'Vetting update failed.');
      }
    } catch (err) {
      toast.error('Server connection error.');
    }
  };

  const handleSaveNotesOnly = async () => {
    if (!selectedCandidate) return;
    try {
      const res = await fetch('/api/admin/candidates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: selectedCandidate.id,
          action: 'update_notes',
          notes: adminNotes
        })
      });
      if (res.ok) {
        toast.success('Admin notes saved successfully.');
        loadCandidates();
        loadLogs();
      }
    } catch {
      toast.error('Failed to save notes.');
    }
  };

  const handleChecklistChange = async (key: string, val: boolean) => {
    if (!selectedCandidate) return;
    const newChecklist = { ...checklistState, [key]: val };
    setChecklistState(newChecklist);
    
    try {
      const res = await fetch('/api/admin/candidates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: selectedCandidate.id,
          action: 'update_checklist',
          checklist: newChecklist
        })
      });
      if (res.ok) {
        const updatedCand = {
          ...selectedCandidate,
          roleDetails: {
            ...selectedCandidate.roleDetails,
            checklist: newChecklist
          }
        };
        setSelectedCandidate(updatedCand);
        setCandidates(prev => prev.map(c => c.id === selectedCandidate.id ? updatedCand : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Recruiter profile referral forwarder
  const handleForwardToRecruiter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    if (!fwdRecruiterName.trim() || !fwdRecruiterEmail.trim()) {
      toast.error('Recruiter name and email are required');
      return;
    }

    setIsFwdSubmitting(true);
    try {
      const res = await fetch('/api/admin/forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: selectedCandidate.id,
          recruiterName: fwdRecruiterName,
          recruiterEmail: fwdRecruiterEmail,
          notes: fwdNotes
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Profile forwarded to ${fwdRecruiterName}`);
        
        // Update local forwarding log list
        setCandidateFwdLogs(prev => [data.log, ...prev]);
        setFwdRecruiterName('');
        setFwdRecruiterEmail('');
        setFwdNotes('');
        setShowFwdForm(false);
        
        loadLogs();
      } else {
        toast.error(data.error || 'Forwarding referral failed');
      }
    } catch (err) {
      toast.error('Connection failed');
    } finally {
      setIsFwdSubmitting(false);
    }
  };

  // Helper to fetch Organization / College and Status / Title for all roles
  const getCandidateOrgDetails = (c: Candidate) => {
    switch (c.role) {
      case 'Student':
      case 'Campus Ambassador':
      case 'Volunteer':
        return {
          org: c.college || 'N/A',
          sub: c.currentStatus || c.role
        };
      case 'Founder':
      case 'Startup':
        return {
          org: c.roleDetails?.startupName || 'N/A',
          sub: `${c.role} (Stage: ${c.roleDetails?.startupStage || 'N/A'})`
        };
      case 'Recruiter':
      case 'HR':
      case 'Company':
        return {
          org: c.roleDetails?.companyName || 'N/A',
          sub: c.roleDetails?.designation || c.role
        };
      case 'Mentor':
        return {
          org: c.roleDetails?.currentCompany || 'N/A',
          sub: c.roleDetails?.mentorRole || 'Mentor'
        };
      case 'Investor':
        return {
          org: c.roleDetails?.fundName || 'N/A',
          sub: `Investor (${c.roleDetails?.investmentFocus || 'N/A'})`
        };
      case 'Working Professional':
      case 'Freelancer':
      case 'Creator':
        return {
          org: c.roleDetails?.company || 'N/A',
          sub: c.roleDetails?.professionalRole || c.role
        };
      default:
        return {
          org: 'N/A',
          sub: c.role || ''
        };
    }
  };

  // --- Export Data to CSV ---

  const handleExportCSV = () => {
    if (candidates.length === 0) {
      toast.warning('No candidate data available to export');
      return;
    }

    // Define CSV headers
    const headers = [
      'Member ID', 'Username', 'Full Name', 'Role', 'Email', 'Phone', 'Gender', 'DOB', 
      'City', 'State', 'Organization / College', 'Designation / Status', 
      'Vetting Status', 'Community Score', 'Level', 'Registration Date', 'LinkedIn', 'Github', 'Role Details'
    ];

    // Map candidate rows
    const rows = candidates.map(c => {
      const orgDetails = getCandidateOrgDetails(c);
      return [
        c.memberId || 'Pending',
        c.username ? `@${c.username}` : '',
        c.fullName,
        c.role || 'Student',
        c.email,
        c.mobile,
        c.gender,
        c.dob,
        c.city,
        c.state,
        orgDetails.org,
        orgDetails.sub,
        c.status,
        c.communityScore || 20,
        c.level || 'Explorer',
        c.registrationDate,
        c.linkedin,
        c.github || '',
        JSON.stringify(c.roleDetails || {})
      ];
    });

    // Construct CSV file string
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');
    
    // Trigger download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TSS_Talent_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Candidate spreadsheet downloaded successfully');
  };

  const getStatusBadge = (status: Candidate['status'] | string) => {
    let bg = '#0071e3'; // Blue
    let fg = '#ffffff';
    let label = status || 'Submitted';

    if (status === 'Submitted' || status === 'Pending') {
      bg = '#0071e3'; 
      label = 'Submitted';
    } else if (status === 'Under Review') {
      bg = '#f97316'; // Orange
    } else if (status === 'Needs Changes') {
      bg = '#eab308'; // Yellow
      fg = '#1d1d1f';
    } else if (status === 'Resubmitted') {
      bg = '#2563eb'; // Royal Blue
      label = 'Resubmitted';
    } else if (status === 'Verified') {
      bg = '#10b981'; // Green
    } else if (status === 'Rejected') {
      bg = '#ef4444'; // Red
    } else if (status === 'Suspended') {
      bg = '#6b7280'; // Gray
    } else if (status === 'Deleted') {
      bg = '#000000'; // Black
    }

    return (
      <span 
        style={{ 
          backgroundColor: bg, 
          color: fg, 
          padding: '0.25rem 0.6rem', 
          borderRadius: '4px',
          fontWeight: 700,
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          display: 'inline-block'
        }}
      >
        {label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.loadingDashboard}>
        <RefreshCw className={styles.pulseSpinner} size={40} />
        <h2>Verifying Administrator Session...</h2>
        <p>Checking database status parameters.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      
      {/* Top Banner Control */}
      <section className={styles.topControl}>
        <div className={`${styles.controlContainer} container`}>
          <div className={styles.userInfo}>
            <h2>TSS Administration</h2>
            <p>Session user: <span className={styles.adminEmail}>{adminUser?.email}</span> | role: <strong className={styles.adminRole}>{adminUser?.role}</strong></p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </section>

      {/* Tab Menu Header */}
      <section className={styles.tabSection}>
        <div className="container">
          <div className={styles.tabsWrapper}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'candidates' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('candidates')}
            >
              <Users size={18} /> Candidate Board
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <TrendingUp size={18} /> Overview Metrics
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} /> Site Controls
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'messages' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare size={18} /> Contact Inbox ({messages.length})
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'logs' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <ListTodo size={18} /> Audit Logs
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'jobs' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              <Briefcase size={18} /> Jobs Board
            </button>
          </div>
        </div>
      </section>

      {/* Main Panel Content */}
      <section className={styles.panelContent}>
        <div className="container">
          
          {/* TAB 1: Candidates Table */}
          {activeTab === 'candidates' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Candidate Review Ledger</h3>
                  <p>Vetting queue and verification records for TSS registration pipelines.</p>
                </div>
                <div className={styles.headerActions}>
                  <button onClick={handleExportCSV} className="btn btn-light btn-sm">
                    <FileSpreadsheet size={16} /> Export CSV Spreadsheet
                  </button>
                </div>
              </div>

              {/* Filters Pane */}
              <div className={styles.filtersPane}>
                <div className={styles.filtersGrid}>
                  <div className="form-group">
                    <label className="form-label">Keyword Search</label>
                    <input 
                      type="text" 
                      placeholder="Name, Email, ID..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vetting Status</label>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-select">
                      <option value="">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Verified">Verified</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience</label>
                    <select value={experienceFilter} onChange={e => setExperienceFilter(e.target.value)} className="form-select">
                      <option value="">All levels</option>
                      <option value="Fresher">Fresher</option>
                      <option value="0-1 Years">0-1 Years</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">College Keyword</label>
                    <input 
                      type="text" 
                      placeholder="e.g. IIIT" 
                      value={collegeFilter}
                      onChange={e => setCollegeFilter(e.target.value)}
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Candidate Role</label>
                    <select 
                      value={roleFilter} 
                      onChange={e => setRoleFilter(e.target.value)} 
                      className="form-select"
                    >
                      <option value="">All Roles</option>
                      <option value="Student">Student</option>
                      <option value="Founder">Founder</option>
                      <option value="Recruiter">Recruiter</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Investor">Investor</option>
                      <option value="Working Professional">Working Professional</option>
                    </select>
                  </div>
                </div>
                <div className={styles.filterActions}>
                  <button onClick={handleApplyFilters} className="btn btn-secondary btn-sm">Apply Vetting Filters</button>
                  <button onClick={handleResetFilters} className="btn btn-outline btn-sm">Reset</button>
                </div>
              </div>

              {/* Table Ledger */}
              <div className={styles.tableCard}>
                <div className={styles.tableResponsive}>
                  <table className={`${styles.cTable} ${styles.candidatesTab}`}>
                    <thead>
                      <tr>
                        <th>TSS ID</th>
                        <th>Candidate Name</th>
                        <th>Role</th>
                        <th>Contact Email</th>
                        <th>Phone</th>
                        <th>Organization / Status</th>
                        <th>Vetting Status</th>
                        <th>Reg. Date</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.length === 0 ? (
                        <tr>
                          <td colSpan={9} className={styles.noDataRow}>
                            No candidate profiles found matching current filters.
                          </td>
                        </tr>
                      ) : (
                        candidates.map((c) => {
                          const orgDetails = getCandidateOrgDetails(c);
                          return (
                            <tr key={c.id}>
                              <td className={styles.idCol}>{c.memberId || <span style={{color:'var(--text-muted)'}}>Pending</span>}</td>
                              <td>
                                <div className={styles.nameLabel}>{c.fullName}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                                  <small className={styles.expTag}>{c.experienceLevel || 'N/A'}</small>
                                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>
                                    {calculateProfileCompleteness(c)}% complete
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className={styles.adminRole} style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                                  {c.role || 'Student'}
                                </span>
                              </td>
                              <td>{c.email}</td>
                              <td>{c.mobile}</td>
                              <td>
                                <div className={styles.collegeName}>{orgDetails.org}</div>
                                <small className={styles.statusDesc}>{orgDetails.sub}</small>
                              </td>
                              <td>{getStatusBadge(c.status)}</td>
                              <td>{new Date(c.registrationDate).toLocaleDateString()}</td>
                              <td style={{ textAlign: 'right' }}>
                                <button 
                                  onClick={() => handleOpenCandidate(c)} 
                                  className="btn btn-light btn-sm"
                                  style={{ display: 'inline-flex', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                >
                                  <Eye size={14} /> Assess Profile
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Overview Stats Metrics */}
          {activeTab === 'overview' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Vetting Dashboard Overview</h3>
                  <p>Performance metrics, queue processing rates, and registration timelines.</p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className={styles.metricsGrid}>
                <div className={styles.mCard}>
                  <div className={styles.mHeader}>
                    <Users size={24} className={styles.mIconBlue} />
                    <span>Total Registrations</span>
                  </div>
                  <div className={styles.mValue}>{metrics.totalRegistrations}</div>
                  <small className={styles.mSubText}>All submissions in database</small>
                </div>

                <div className={styles.mCard}>
                  <div className={styles.mHeader}>
                    <Clock size={24} className={styles.mIconAmber} />
                    <span>Pending Action</span>
                  </div>
                  <div className={styles.mValue}>{metrics.pendingReviews}</div>
                  <small className={styles.mSubText}>Pending + Under Review queues</small>
                </div>

                <div className={styles.mCard}>
                  <div className={styles.mHeader}>
                    <CheckCircle2 size={24} className={styles.mIconGreen} />
                    <span>Verified Network</span>
                  </div>
                  <div className={styles.mValue}>{metrics.verifiedMembers}</div>
                  <small className={styles.mSubText}>IDs successfully generated</small>
                </div>

                <div className={styles.mCard}>
                  <div className={styles.mHeader}>
                    <AlertOctagon size={24} className={styles.mIconRed} />
                    <span>Rejected Profiles</span>
                  </div>
                  <div className={styles.mValue}>{metrics.rejectedProfiles}</div>
                  <small className={styles.mSubText}>Accounts non-compliant</small>
                </div>
              </div>

              {/* Role Distribution Metrics */}
              <div className={`${styles.statsCard} premium-card`} style={{ marginBottom: '2rem' }}>
                <h3>Registration Breakdown by Role</h3>
                <div className={styles.roleBreakdownGrid}>
                  {Object.entries(metrics.registrationsByRole || {}).map(([roleName, count]) => {
                    const verifiedCount = metrics.verifiedByRole?.[roleName] || 0;
                    return (
                      <div key={roleName} className={styles.roleBreakdownCard}>
                        <span className={styles.roleBreakdownLabel}>{roleName}</span>
                        <strong className={styles.roleBreakdownValue}>{count as number} Registered</strong>
                        <span className={styles.roleBreakdownSub}>{verifiedCount} Verified</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time Metrics row */}
              <div className={styles.overviewRows}>
                <div className={`${styles.statsCard} premium-card`}>
                  <h3>Processing Volumes</h3>
                  <div className={styles.volumeGrid}>
                    <div className={styles.volItem}>
                      <span className={styles.volLabel}>Submissions (Past 24h)</span>
                      <strong className={styles.volNum}>{metrics.dailyRegistrations}</strong>
                    </div>
                    <div className={styles.volItem}>
                      <span className={styles.volLabel}>Submissions (Past 30 Days)</span>
                      <strong className={styles.volNum}>{metrics.monthlyRegistrations}</strong>
                    </div>
                  </div>
                </div>

                {/* Custom CSS Chart for Registrations timeline */}
                <div className={`${styles.statsCard} premium-card`}>
                  <h3>Registration Timeline (Last 7 Days)</h3>
                  <div className={styles.chartContainer}>
                    {metrics.chartData && metrics.chartData.length > 0 ? (
                      <div className={styles.barChart}>
                        {metrics.chartData.map((d: any, idx: number) => {
                          const maxCount = Math.max(...metrics.chartData.map((cd: any) => cd.count), 1);
                          const heightPct = (d.count / maxCount) * 100;
                          return (
                            <div key={idx} className={styles.chartCol}>
                              <div className={styles.barWrapper}>
                                <div 
                                  className={styles.bar} 
                                  style={{ height: `${Math.max(heightPct, 6)}%` }}
                                >
                                  {d.count > 0 && <span className={styles.barValue}>{d.count}</span>}
                                </div>
                              </div>
                              <span className={styles.chartLabel}>{d.date}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className={styles.noChartData}>Timeline data will populate as candidates register.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Site Controls Settings */}
          {activeTab === 'settings' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Landing Page Counters</h3>
                  <p>Modify the statistics shown on the public TSS homepage. Updates log automatically in audit logs.</p>
                </div>
              </div>

              <div className={`${styles.settingsCard} premium-card`}>
                <form onSubmit={handleUpdateSettings} className={styles.settingsForm}>
                  <div className={styles.settingsRow}>
                    <div className="form-group">
                      <label className="form-label">Community Members Counter</label>
                      <input 
                        type="number" 
                        value={landingStats.communityMembers}
                        onChange={e => setLandingStats({ ...landingStats, communityMembers: parseInt(e.target.value) || 0 })}
                        className="form-input" 
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Recruiter Network Counter</label>
                      <input 
                        type="number" 
                        value={landingStats.recruiterNetwork}
                        onChange={e => setLandingStats({ ...landingStats, recruiterNetwork: parseInt(e.target.value) || 0 })}
                        className="form-input" 
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.settingsRow}>
                    <div className="form-group">
                      <label className="form-label">Opportunities Shared Counter</label>
                      <input 
                        type="number" 
                        value={landingStats.opportunitiesShared}
                        onChange={e => setLandingStats({ ...landingStats, opportunitiesShared: parseInt(e.target.value) || 0 })}
                        className="form-input" 
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Events Conducted Counter</label>
                      <input 
                        type="number" 
                        value={landingStats.eventsConducted}
                        onChange={e => setLandingStats({ ...landingStats, eventsConducted: parseInt(e.target.value) || 0 })}
                        className="form-input" 
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-secondary">
                    Save homepage counters
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: Contact Messages Inbox */}
          {activeTab === 'messages' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Contact Support Inbox</h3>
                  <p>Inbound queries and partnership requests sent via the Contact page.</p>
                </div>
              </div>

              <div className={styles.messagesList}>
                {messages.length === 0 ? (
                  <div className={styles.emptyInbox}>
                    <MessageSquare size={36} className={styles.emptyInboxIcon} />
                    <p>No messages in the admin inbox.</p>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`${styles.messageCard} premium-card`}>
                      <div className={styles.msgHeader}>
                        <div>
                          <h4>{m.name}</h4>
                          <span className={styles.msgDetails}>
                            Email: {m.email} | Phone: {m.phone}
                          </span>
                        </div>
                        <span className={styles.msgDate}>
                          {new Date(m.submittedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className={styles.msgContent}>{m.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Audit Activity Logs */}
          {activeTab === 'logs' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>System Activity Vetting Logs</h3>
                  <p>Audit trail of all administrative approvals, modifications, rejections, and forwarded candidate actions.</p>
                </div>
              </div>

              <div className={styles.logsContainer}>
                <div className={styles.tableCard}>
                  <div className={styles.tableResponsive}>
                    <table className={`${styles.cTable} ${styles.logsTab}`}>
                      <thead>
                        <tr>
                          <th>Date / Time</th>
                          <th>Administrator</th>
                          <th>Event Action</th>
                          <th>Audit Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityLogs.length === 0 ? (
                          <tr>
                            <td colSpan={4} className={styles.noDataRow}>No activity records registered yet.</td>
                          </tr>
                        ) : (
                          activityLogs.map((log) => (
                            <tr key={log.id}>
                              <td style={{ whiteSpace: 'nowrap' }}>{new Date(log.timestamp).toLocaleString()}</td>
                              <td><strong>{log.adminUser}</strong></td>
                              <td>
                                <span className={`${styles.actionBadge} ${styles[log.action] || ''}`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className={styles.logDetailText}>{log.details}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Jobs Board Management */}
          {activeTab === 'jobs' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Jobs Board Management</h3>
                  <p>Create new openings, view candidate applications, and update candidate hiring stages.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem', alignItems: 'flex-start' }}>
                
                {/* Column 1: Post Job Form */}
                <div className="premium-card" style={{ padding: '2.25rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Post New Opening</h4>
                  
                  {/* J.D. Auto-Parser Expander box */}
                  <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-card-2)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <button 
                      type="button" 
                      onClick={() => setShowParser(!showParser)}
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '0.25rem', padding: '0.4rem' }}
                    >
                      {showParser ? 'Close J.D. Parser' : '⚡ Auto-Parse J.D. Text'}
                    </button>
                    
                    {showParser && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <textarea
                          placeholder="Paste raw Job Description (J.D.) or hiring message text here..."
                          value={jdText}
                          onChange={(e) => setJdText(e.target.value)}
                          className="form-input"
                          rows={6}
                          style={{ resize: 'none', fontSize: '0.8rem', width: '100%', marginBottom: '0.75rem', backgroundColor: 'var(--bg-card)', padding: '0.5rem', fontFamily: 'inherit' }}
                        />
                        <button
                          type="button"
                          onClick={handleParseJD}
                          className="btn btn-primary"
                          style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(110deg, var(--accent), var(--accent-light))', color: '#050810', padding: '0.4rem' }}
                        >
                          Extract & Auto-Fill Fields
                        </button>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Role Title *</label>
                      <input 
                        type="text" 
                        value={newJobTitle}
                        onChange={e => setNewJobTitle(e.target.value)}
                        className="form-input" 
                        placeholder="e.g. Software Engineer"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Company Name *</label>
                      <input 
                        type="text" 
                        value={newJobCompany}
                        onChange={e => setNewJobCompany(e.target.value)}
                        className="form-input" 
                        placeholder="e.g. Harman"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>CTC / Compensation (Optional)</label>
                      <input 
                        type="text" 
                        value={newJobSalary}
                        onChange={e => setNewJobSalary(e.target.value)}
                        className="form-input" 
                        placeholder="e.g. ₹25,000/month or 12 LPA"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Recruiter Mobile Number OR Apply URL Link *</label>
                      <input 
                        type="text" 
                        value={newJobApplyLink}
                        onChange={e => setNewJobApplyLink(e.target.value)}
                        className="form-input" 
                        placeholder="e.g. +919876543210 or https://careers.company.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Recruiter Email Address (Optional)</label>
                      <input 
                        type="email" 
                        value={newJobRecruiterEmail}
                        onChange={e => setNewJobRecruiterEmail(e.target.value)}
                        className="form-input" 
                        placeholder="e.g. recruiter@company.com"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Opportunity Description / Notes *</label>
                      <textarea 
                        value={newJobDesc}
                        onChange={e => setNewJobDesc(e.target.value)}
                        className="form-input" 
                        placeholder="Detailed role details, instructions, or descriptions..."
                        rows={6}
                        style={{ resize: 'none' }}
                        required
                      />
                    </div>
                    <button type="submit" disabled={isPostingJob} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                      {isPostingJob ? 'Posting Job...' : 'Publish Job Opening'}
                    </button>
                  </form>

                  {/* Live Card Preview */}
                  <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'Space Mono', color: 'var(--primary)', fontWeight: 700, display: 'block', textTransform: 'uppercase', marginBottom: '1rem' }}>
                      👁️ Live Opportunity Card Preview
                    </span>
                    <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <span style={{ fontSize: '9px', fontFamily: 'Space Mono', padding: '0.15rem 0.4rem', backgroundColor: 'rgba(245,143,29,0.1)', color: 'var(--primary)', borderRadius: '3px', fontWeight: 700, textTransform: 'uppercase' }}>
                            Full-time
                          </span>
                          <h5 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.4rem 0 0.15rem 0', color: 'var(--text-main)', lineHeight: 1.25 }}>
                            {newJobTitle || 'Associate Engineer'}
                          </h5>
                          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                            {newJobCompany || 'Harman'}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <span>📍 Remote</span>
                        {newJobSalary && <span>💰 {newJobSalary}</span>}
                      </div>
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'pre-line', maxHeight: '180px', overflowY: 'auto', lineHeight: 1.5 }}>
                        {newJobDesc || 'Description, instructions, and notes details will render here in real time...'}
                      </div>
                      {(newJobApplyLink || newJobRecruiterEmail) && (
                        <div style={{ marginTop: '1.25rem', padding: '0.75rem', border: '1px dashed var(--primary)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-main)', backgroundColor: 'rgba(245, 143, 29, 0.02)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {newJobApplyLink && <div>🔒 Recruiter Contact: <strong>{newJobApplyLink}</strong></div>}
                          {newJobRecruiterEmail && <div>📧 Recruiter Email: <strong>{newJobRecruiterEmail}</strong></div>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 2: Manage Jobs & Applications */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Part A: Posted Jobs */}
                  <div className={styles.tableCard}>
                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem', padding: '1.25rem 1.5rem 0.5rem', color: 'var(--text-primary)', margin: 0 }}>Active Openings</h4>
                    <div className={styles.tableResponsive}>
                      <table className={styles.cTable}>
                        <thead>
                          <tr>
                            <th>Title / Company</th>
                            <th>Type / Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loadingAdminJobs ? (
                            <tr><td colSpan={4} className={styles.noDataRow}>Loading jobs...</td></tr>
                          ) : adminJobs.length === 0 ? (
                            <tr><td colSpan={4} className={styles.noDataRow}>No jobs posted yet.</td></tr>
                          ) : (
                            adminJobs.map((job) => (
                              <tr key={job.id}>
                                <td>
                                  <strong>{job.title}</strong>
                                  <div style={{ fontSize: '11px', color: 'var(--accent)' }}>{job.companyName}</div>
                                </td>
                                <td>
                                  <div>{job.type}</div>
                                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{job.location}</div>
                                </td>
                                <td>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '0.15rem 0.4rem',
                                    borderRadius: '4px',
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    backgroundColor: job.status === 'Active' ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)',
                                    color: job.status === 'Active' ? 'var(--green-light)' : '#ef4444'
                                  }}>
                                    {job.status}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                      onClick={() => handleToggleJobStatus(job.id, job.status)}
                                      className="btn btn-outline btn-xs"
                                      style={{ fontSize: '10px', padding: '0.2rem 0.5rem' }}
                                    >
                                      {job.status === 'Active' ? 'Close Job' : 'Re-open'}
                                    </button>
                                    <button 
                                      onClick={() => {
                                        if (typeof window !== 'undefined') {
                                          const shareUrl = `${window.location.origin}/opportunities/${job.id}`;
                                          navigator.clipboard.writeText(shareUrl);
                                          toast.success('Opportunity share link copied!');
                                        }
                                      }}
                                      className="btn btn-outline btn-xs"
                                      style={{ fontSize: '10px', padding: '0.2rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                    >
                                      <Share2 size={10} /> Copy Link
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Part B: Candidate Applications */}
                  <div className={styles.tableCard}>
                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem', padding: '1.25rem 1.5rem 0.5rem', color: 'var(--text-primary)', margin: 0 }}>Candidate Applications</h4>
                    <div className={styles.tableResponsive}>
                      <table className={styles.cTable}>
                        <thead>
                          <tr>
                            <th>Candidate</th>
                            <th>Applied Position</th>
                            <th>Cover Note</th>
                            <th>Status Pipeline</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loadingAdminJobs ? (
                            <tr><td colSpan={4} className={styles.noDataRow}>Loading applications...</td></tr>
                          ) : adminApps.length === 0 ? (
                            <tr><td colSpan={4} className={styles.noDataRow}>No candidate applications received yet.</td></tr>
                          ) : (
                            adminApps.map((app) => (
                              <tr key={app.id}>
                                <td>
                                  <strong>{app.candidateName}</strong>
                                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{app.candidateEmail}</div>
                                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    {app.candidateResumePath && (
                                      <a 
                                        href={`/api/download/resume?candidateId=${app.candidateId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: '10px', color: 'var(--primary-pale)', textDecoration: 'underline' }}
                                      >
                                        Resume PDF
                                      </a>
                                    )}
                                    <a 
                                      href={app.candidateLinkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ fontSize: '10px', color: 'var(--accent)', textDecoration: 'underline' }}
                                    >
                                      LinkedIn
                                    </a>
                                  </div>
                                </td>
                                <td>
                                  <strong>{app.jobTitle}</strong>
                                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{app.companyName}</div>
                                </td>
                                <td>
                                  <div style={{ fontSize: '11px', maxWidth: '160px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={app.coverLetter || 'No cover letter'}>
                                    {app.coverLetter || 'N/A'}
                                  </div>
                                </td>
                                <td>
                                  <select
                                    value={app.status}
                                    onChange={(e) => handleUpdateAppStatus(app.id, e.target.value as any)}
                                    style={{
                                      backgroundColor: 'var(--bg-card-2)',
                                      color: 'var(--text-primary)',
                                      border: '1px solid var(--border-color)',
                                      borderRadius: '4px',
                                      padding: '0.25rem 0.5rem',
                                      fontSize: '11px'
                                    }}
                                  >
                                    <option value="Applied">Applied</option>
                                    <option value="Reviewing">Reviewing</option>
                                    <option value="Shortlisted">Shortlisted</option>
                                    <option value="Rejected">Rejected</option>
                                  </select>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      </section>

      {/* --- SELECTED CANDIDATE DETAIL MODAL --- */}
      {selectedCandidate && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCandidate(null)}>
          <div className={styles.modalBody} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderFlex}>
                {selectedCandidate.photoPath ? (
                  <img 
                    src={selectedCandidate.photoPath} 
                    alt={selectedCandidate.fullName} 
                    className={styles.modalProfilePhoto} 
                  />
                ) : (
                  <div className={styles.modalProfilePhotoPlaceholder}>
                    <User size={32} />
                  </div>
                )}
                <div>
                  <h2>{selectedCandidate.fullName}</h2>
                  <span className={styles.modalRoleTag}>
                    {selectedCandidate.role || 'Student'}
                  </span>
                  <p style={{ marginTop: '0.25rem' }}>Status Vetting queue ID: {selectedCandidate.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className={styles.closeModalBtn}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Grid */}
            <div className={styles.modalGrid}>
              
              {/* Left Column: Core Info */}
              <div className={styles.modalLeftCol}>
                <div className={styles.detailSection}>
                  <h3>Personal Parameters</h3>
                  <div className={styles.detailGrid}>
                    <div><span>Contact Email:</span> {selectedCandidate.email}</div>
                    <div><span>Mobile Number:</span> {selectedCandidate.mobile}</div>
                    <div><span>Gender:</span> {selectedCandidate.gender}</div>
                    <div><span>Date of Birth:</span> {selectedCandidate.dob}</div>
                    <div><span>Current Location:</span> {selectedCandidate.city}, {selectedCandidate.state}, {selectedCandidate.country}</div>
                  </div>
                </div>

                {/* Dynamic Role-Based Parameters */}
                {['Student', 'Campus Ambassador', 'Volunteer'].includes(selectedCandidate.role) && (
                  <>
                    <div className={styles.detailSection}>
                      <h3>Education Parameters</h3>
                      <div className={styles.detailGrid}>
                        <div><span>Qualification:</span> {selectedCandidate.highestQualification}</div>
                        <div><span>Status:</span> {selectedCandidate.currentStatus}</div>
                        <div><span>Graduation Year:</span> {selectedCandidate.graduationYear}</div>
                        {selectedCandidate.college && <div><span>College / Univ:</span> {selectedCandidate.college}</div>}
                        <div><span>Degree:</span> {selectedCandidate.roleDetails?.degree || 'N/A'}</div>
                        <div><span>Specialization:</span> {selectedCandidate.roleDetails?.specialization || 'N/A'}</div>
                      </div>
                    </div>

                    <div className={styles.detailSection}>
                      <h3>Professional & Interest Parameters</h3>
                      <div className={styles.detailGrid}>
                        <div><span>Current Role:</span> {selectedCandidate.currentRole}</div>
                        <div><span>Experience:</span> {selectedCandidate.experienceLevel}</div>
                        <div><span>Preferred Domain:</span> {selectedCandidate.roleDetails?.preferredDomain || 'N/A'}</div>
                        <div><span>Internships Interested:</span> {selectedCandidate.roleDetails?.internshipInterested || 'No'}</div>
                        <div><span>Jobs Interested:</span> {selectedCandidate.roleDetails?.jobInterested || 'No'}</div>
                        <div><span>Startups Interested:</span> {selectedCandidate.roleDetails?.startupInterested || 'No'}</div>
                        <div><span>BuildX Sandbox:</span> {selectedCandidate.roleDetails?.buildxInterested || 'No'}</div>
                        <div><span>Roles Interested:</span> {selectedCandidate.preferredRoles?.join(', ') || 'None'}</div>
                      </div>
                      {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                        <div className={styles.skillsTagWrapper} style={{ marginTop: '0.75rem' }}>
                          <span>Skills ({selectedCandidate.skills.length}):</span>
                          <div className={styles.skillsTags}>
                            {selectedCandidate.skills.map(sk => <span key={sk} className={styles.modalSkillTag}>{sk}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {['Founder', 'Startup'].includes(selectedCandidate.role) && (
                  <div className={styles.detailSection}>
                    <h3>Startup Parameters</h3>
                    <div className={styles.detailGrid}>
                      <div><span>Startup Name:</span> {selectedCandidate.roleDetails?.startupName || 'N/A'}</div>
                      <div><span>Startup Stage:</span> {selectedCandidate.roleDetails?.startupStage || 'N/A'}</div>
                      <div><span>Industry Sector:</span> {selectedCandidate.roleDetails?.industry || 'N/A'}</div>
                      <div><span>Team Size:</span> {selectedCandidate.roleDetails?.teamSize || 'N/A'}</div>
                      {selectedCandidate.roleDetails?.website && (
                        <div>
                          <span>Startup Website:</span>{' '}
                          <a href={selectedCandidate.roleDetails.website} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                            {selectedCandidate.roleDetails.website}
                          </a>
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                      <h4 className={styles.modalRoleLabel}>Startup Pitch / Description:</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                        {selectedCandidate.roleDetails?.startupDescription || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                )}

                {['Recruiter', 'HR', 'Company'].includes(selectedCandidate.role) && (
                  <div className={styles.detailSection}>
                    <h3>Corporate Recruitment Parameters</h3>
                    <div className={styles.detailGrid}>
                      <div><span>Company Name:</span> {selectedCandidate.roleDetails?.companyName || 'N/A'}</div>
                      <div><span>Designation:</span> {selectedCandidate.roleDetails?.designation || 'N/A'}</div>
                      <div><span>Hiring Domains:</span> {selectedCandidate.roleDetails?.hiringDomains || 'N/A'}</div>
                      {selectedCandidate.roleDetails?.companyWebsite && (
                        <div>
                          <span>Company Website:</span>{' '}
                          <a href={selectedCandidate.roleDetails.companyWebsite} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                            {selectedCandidate.roleDetails.companyWebsite}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedCandidate.role === 'Mentor' && (
                  <div className={styles.detailSection}>
                    <h3>Professional Mentorship Parameters</h3>
                    <div className={styles.detailGrid}>
                      <div><span>Current Company:</span> {selectedCandidate.roleDetails?.currentCompany || 'N/A'}</div>
                      <div><span>Mentorship Role:</span> {selectedCandidate.roleDetails?.mentorRole || 'N/A'}</div>
                      <div><span>Experience Level:</span> {selectedCandidate.roleDetails?.experience || 'N/A'}</div>
                      <div><span>Expertise Areas:</span> {selectedCandidate.roleDetails?.expertiseAreas || 'N/A'}</div>
                    </div>
                  </div>
                )}

                {selectedCandidate.role === 'Investor' && (
                  <div className={styles.detailSection}>
                    <h3>Fund Investment Parameters</h3>
                    <div className={styles.detailGrid}>
                      <div><span>Investment Fund Name:</span> {selectedCandidate.roleDetails?.fundName || 'N/A'}</div>
                      <div><span>Investment Focus:</span> {selectedCandidate.roleDetails?.investmentFocus || 'N/A'}</div>
                      {selectedCandidate.roleDetails?.website && (
                        <div>
                          <span>Fund Website:</span>{' '}
                          <a href={selectedCandidate.roleDetails.website} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                            {selectedCandidate.roleDetails.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {['Working Professional', 'Freelancer', 'Creator'].includes(selectedCandidate.role) && (
                  <div className={styles.detailSection}>
                    <h3>Professional Placement Parameters</h3>
                    <div className={styles.detailGrid}>
                      <div><span>Current Company:</span> {selectedCandidate.roleDetails?.company || 'N/A'}</div>
                      <div><span>Designation:</span> {selectedCandidate.roleDetails?.professionalRole || 'N/A'}</div>
                      <div><span>Total Experience:</span> {selectedCandidate.roleDetails?.professionalExperience || 'N/A'}</div>
                    </div>
                    {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                      <div className={styles.skillsTagWrapper} style={{ marginTop: '1rem' }}>
                        <span>Skills ({selectedCandidate.skills.length}):</span>
                        <div className={styles.skillsTags}>
                          {selectedCandidate.skills.map(sk => <span key={sk} className={styles.modalSkillTag}>{sk}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Social Profiles */}
                <div className={styles.detailSection}>
                  <h3>Linked Social Credentials</h3>
                  <div className={styles.socialButtons}>
                    <a href={selectedCandidate.linkedin} target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.liBtn}`}>
                      <LinkedInIcon /> LinkedIn
                    </a>
                    {selectedCandidate.github && (
                      <a href={selectedCandidate.github} target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.ghBtn}`}>
                        <GitHubIcon /> GitHub
                      </a>
                    )}
                    {selectedCandidate.portfolio && (
                      <a href={selectedCandidate.portfolio} target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.portBtn}`}>
                        <Globe size={16} /> Portfolio
                      </a>
                    )}
                    {selectedCandidate.instagram && (
                      <a href={selectedCandidate.instagram} target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.igBtn}`}>
                        <InstagramIcon /> Instagram
                      </a>
                    )}
                    {selectedCandidate.xTwitter && (
                      <a href={selectedCandidate.xTwitter} target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.twBtn}`}>
                        <TwitterIcon /> X / Twitter
                      </a>
                    )}
                  </div>
                </div>

                {/* Resume Download/Link Box */}
                {selectedCandidate.resumePath && (
                  <div className={styles.detailSection}>
                    <h3>Resume Document</h3>
                    <div className={styles.resumeDownloadBox}>
                      <FileText size={28} className={styles.pdfIcon} />
                      <div className={styles.resumeMeta}>
                        <strong>{selectedCandidate.resumeName || 'Resume'}</strong>
                        <span>
                          {selectedCandidate.resumePath.startsWith('http') 
                            ? 'Public Resume Link' 
                            : 'Secured PDF Storage'}
                        </span>
                      </div>
                      {selectedCandidate.resumePath.startsWith('http') ? (
                        <a 
                          href={selectedCandidate.resumePath} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <ExternalLink size={16} /> Open Resume
                        </a>
                      ) : (
                        <a 
                          href={`/api/download/resume?id=${selectedCandidate.id}`} 
                          target="_blank"
                          className="btn btn-secondary btn-sm"
                          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Download size={16} /> Download Resume
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Vetting controls & Recruiter Referral */}
              <div className={styles.modalRightCol}>
                
                {/* Vetting Status Update Box */}
                <div className={styles.vettingCtrlCard} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Admin Vetting Control</h3>
                    <div className={styles.currentStatusBadgeRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Current Vetting Status:</span>
                      {getStatusBadge(selectedCandidate.status)}
                    </div>
                    {selectedCandidate.memberId && (
                      <div className={styles.verifiedIdRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span>TSS Member ID:</span>
                        <strong>{selectedCandidate.memberId}</strong>
                      </div>
                    )}
                  </div>

                  {/* Profile Completeness Indicator */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      <span>Profile Completeness</span>
                      <span>{calculateProfileCompleteness(selectedCandidate)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          backgroundColor: calculateProfileCompleteness(selectedCandidate) === 100 ? 'var(--success)' : 'var(--primary)', 
                          width: `${calculateProfileCompleteness(selectedCandidate)}%`,
                          transition: 'width 0.3s ease'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Pending Draft Updates Box */}
                  {selectedCandidate.roleDetails?.draftUpdate && (
                    <div style={{ padding: '0.75rem', border: '1px solid var(--primary)', borderRadius: '6px', backgroundColor: 'var(--primary-light)' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Pending Profile Updates</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Approved updates automatically replace previous verified information:</p>
                      <div style={{ display: 'grid', gap: '0.4rem', fontSize: '0.7rem', maxHeight: '180px', overflowY: 'auto' }}>
                        {Object.entries(selectedCandidate.roleDetails.draftUpdate).map(([key, val]: [string, any]) => {
                          const orig = (selectedCandidate as any)[key];
                          return (
                            <div key={key} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.2rem' }}>
                              <strong style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}:</strong>
                              <div style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>{Array.isArray(orig) ? orig.join(', ') : String(orig || 'N/A')}</div>
                              <div style={{ color: '#10b981', fontWeight: 700 }}>{Array.isArray(val) ? val.join(', ') : String(val || 'N/A')}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Candidate Validation Checklist */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Vetting Validation Checklist</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Identity</strong>
                        {renderChecklistItem('fullName', 'Full Name Valid')}
                        {renderChecklistItem('email', 'Email Address Valid')}
                        {renderChecklistItem('mobile', 'Phone Number Valid')}
                        {renderChecklistItem('photo', 'Profile Photo Approved')}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Education</strong>
                        {renderChecklistItem('college', 'College Verified')}
                        {renderChecklistItem('degree', 'Degree Details Complete')}
                        {renderChecklistItem('branch', 'Branch / Specialization Match')}
                        {renderChecklistItem('gradYear', 'Graduation Year Valid')}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resume</strong>
                        {renderChecklistItem('resumeLink', 'Resume Link Accessible')}
                        {renderChecklistItem('resumeAts', 'ATS Friendly File Format')}
                        {renderChecklistItem('resumeComplete', 'Resume Experience Complete')}
                        {renderChecklistItem('resumeProjects', 'Projects Listed Verified')}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Skills</strong>
                        {renderChecklistItem('skillsMatch', 'Skills Match Resume')}
                        {renderChecklistItem('skillsProjects', 'Projects Codebase Match')}
                        {renderChecklistItem('skillsGithub', 'GitHub Repos Verified')}
                        {renderChecklistItem('skillsPortfolio', 'Portfolio Experience Match')}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Social Links</strong>
                        {renderChecklistItem('linkLinkedin', 'LinkedIn Authenticated')}
                        {renderChecklistItem('linkGithub', 'GitHub Link Matches')}
                        {renderChecklistItem('linkPortfolio', 'Portfolio Link Verified')}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verification</strong>
                        {renderChecklistItem('verifiedValid', 'Everything Validated')}
                        {renderChecklistItem('verifiedReady', 'Ready for Member ID Generation')}
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes Box */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Admin Vetting Notes</h4>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                      Add internal verification notes, resume quality observations, duplicate record information, communication history, validation comments, or rejection notes. Invisible to general members.
                    </p>
                    <textarea
                      value={adminNotes}
                      onChange={e => setAdminNotes(e.target.value)}
                      placeholder="Type internal vetting logs or comments..."
                      rows={3}
                      className="form-textarea"
                      style={{ fontSize: '0.8rem' }}
                    />
                    <button 
                      onClick={handleSaveNotesOnly} 
                      className="btn btn-light btn-sm"
                      style={{ width: '100%', marginTop: '0.4rem', fontSize: '0.75rem' }}
                    >
                      Save Vetting Notes Only
                    </button>
                  </div>

                  {/* Action Buttons Panel */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Verification Actions</h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleUpdateStatus('approve')} 
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
                      >
                        Approve & Generate TSS ID
                      </button>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleUpdateStatus('request_changes')} 
                          className="btn btn-outline btn-sm"
                          style={{ color: '#d97706', borderColor: '#d97706' }}
                        >
                          Request Profile Changes
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus('review')} 
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                        >
                          Move to Manual Review
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <button 
                          onClick={() => setShowRejectModal(true)} 
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                        >
                          Reject Profile
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus('suspend')} 
                          className="btn btn-outline btn-sm"
                          style={{ color: '#6b7280', borderColor: '#6b7280' }}
                        >
                          Suspend Verification
                        </button>
                      </div>

                      <button 
                        onClick={() => handleUpdateStatus('delete')} 
                        className="btn btn-light btn-sm"
                        style={{ color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                      >
                        Delete Profile Permanently
                      </button>

                      {selectedCandidate.roleDetails?.rejectionDate && (
                        <button 
                          onClick={() => handleUpdateStatus('allow_early_reapply')} 
                          className="btn btn-outline btn-sm"
                          style={{ color: '#10b981', borderColor: '#10b981', marginTop: '0.25rem' }}
                        >
                          Allow Early Reapplication ✓
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Verification History Logs List */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Verification History Log</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                      {(selectedCandidate.roleDetails?.auditLogs || []).map((log: any, idx: number) => (
                        <div key={idx} style={{ padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.7rem', backgroundColor: 'var(--bg-main)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-main)' }}>
                            <span>{log.event}</span>
                            <span>{log.date}</span>
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '0.1rem' }}>Admin: {log.admin}</div>
                        </div>
                      ))}
                      {(selectedCandidate.roleDetails?.auditLogs || []).length === 0 && (
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No vetting history logs registered.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recruiter Forwarding Panel */}
                <div className={styles.forwardingCard}>
                  <div className={styles.cardHeaderFlex}>
                    <h3>Recruiter Referrals</h3>
                    {!showFwdForm && (
                      <button onClick={() => setShowFwdForm(true)} className="btn btn-light btn-sm">
                        <Plus size={14} /> Forward Candidate
                      </button>
                    )}
                  </div>

                  {/* Recruiter Forward Form */}
                  {showFwdForm && (
                    <form onSubmit={handleForwardToRecruiter} className={styles.fwdForm}>
                      <div className="form-group">
                        <label className="form-label">Recruiter Name</label>
                        <input
                          type="text"
                          value={fwdRecruiterName}
                          onChange={e => setFwdRecruiterName(e.target.value)}
                          placeholder="e.g. Sandra Lee (Google HR)"
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Recruiter Email Address</label>
                        <input
                          type="email"
                          value={fwdRecruiterEmail}
                          onChange={e => setFwdRecruiterEmail(e.target.value)}
                          placeholder="recruiter@company.com"
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Additional Comments (Optional)</label>
                        <textarea
                          value={fwdNotes}
                          onChange={e => setFwdNotes(e.target.value)}
                          placeholder="Enter any comments or specs recruiter requested..."
                          rows={2}
                          className="form-textarea"
                        />
                      </div>
                      <div className={styles.fwdFormActions}>
                        <button type="submit" disabled={isFwdSubmitting} className="btn btn-secondary btn-sm">
                          {isFwdSubmitting ? 'Sending...' : 'Send Referral'} <Send size={12} />
                        </button>
                        <button type="button" onClick={() => setShowFwdForm(false)} className="btn btn-outline btn-sm">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Referral History Log */}
                  <div className={styles.referralLogList}>
                    <h4>Referral History ({candidateFwdLogs.length})</h4>
                    {candidateFwdLogs.length === 0 ? (
                      <p className={styles.noHistoryText}>No referral logs registered for this candidate.</p>
                    ) : (
                      candidateFwdLogs.map(log => (
                        <div key={log.id} className={styles.logCardItem}>
                          <div className={styles.logCardHeader}>
                            <strong>{log.recruiterName}</strong>
                            <span>{new Date(log.sentDate).toLocaleDateString()}</span>
                          </div>
                          <p>{log.recruiterEmail}</p>
                          {log.feedback && <small className={styles.logFeedback}>Note: {log.feedback}</small>}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* --- PREDEFINED REJECTION REASONS MODAL --- */}
      {showRejectModal && (
        <div className={styles.modalOverlay} style={{ zIndex: 1100 }} onClick={() => setShowRejectModal(false)}>
          <div className={styles.modalBody} style={{ maxWidth: '480px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Reject Candidate Profile</h2>
              <button onClick={() => setShowRejectModal(false)} className={styles.closeModalBtn}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Select one or more predefined rejection reasons to communicate to the candidate:
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-main)' }}>
                {[
                  'Incomplete Profile', 'Invalid Resume', 'Duplicate Registration', 'Low Quality Resume',
                  'Missing Portfolio', 'Missing Contact Details', 'Invalid Email', 'Role Mismatch',
                  'Incomplete Education Details', 'Fake Information', 'Already Registered', 'Other'
                ].map(reason => {
                  const isChecked = selectedRejectionReasons.includes(reason);
                  return (
                    <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRejectionReasons(prev => [...prev, reason]);
                          } else {
                            setSelectedRejectionReasons(prev => prev.filter(r => r !== reason));
                          }
                        }}
                      />
                      <span>{reason}</span>
                    </label>
                  );
                })}
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Additional Comments / Feedback</label>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Provide detailed feedback or steps to help the candidate reapply successfully..."
                  rows={3}
                  className="form-textarea"
                  style={{ fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowRejectModal(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button 
                  type="button" 
                  disabled={selectedRejectionReasons.length === 0}
                  onClick={() => handleUpdateStatus('reject')} 
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)', color: '#ffffff' }}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
