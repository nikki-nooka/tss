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
  X
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

  // Jobs Board Admin States
  const [adminJobs, setAdminJobs] = useState<any[]>([]);
  const [adminApps, setAdminApps] = useState<any[]>([]);
  const [loadingAdminJobs, setLoadingAdminJobs] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobType, setNewJobType] = useState<'Full-time' | 'Part-time' | 'Internship' | 'Contract'>('Full-time');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobReqs, setNewJobReqs] = useState('');
  const [isPostingJob, setIsPostingJob] = useState(false);

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
    if (!newJobTitle || !newJobCompany || !newJobLocation || !newJobDesc) {
      toast.error('Please fill all mandatory fields.');
      return;
    }

    setIsPostingJob(true);
    try {
      const requirementsArray = newJobReqs.split(',').map(r => r.trim()).filter(Boolean);
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newJobTitle,
          companyName: newJobCompany,
          type: newJobType,
          location: newJobLocation,
          salaryRange: newJobSalary,
          description: newJobDesc,
          requirements: requirementsArray
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

  // --- Candidate Assessment Actions ---

  const handleOpenCandidate = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setAdminNotes(candidate.notes || '');
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

  const handleUpdateStatus = async (action: 'approve' | 'reject' | 'review') => {
    if (!selectedCandidate) return;

    try {
      const res = await fetch('/api/admin/candidates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: selectedCandidate.id,
          action,
          notes: adminNotes
        })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success(`Candidate status updated to ${data.candidate.status}`);
        
        // Refresh local items
        setSelectedCandidate(data.candidate);
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
      'Member ID', 'Full Name', 'Role', 'Email', 'Phone', 'Gender', 'DOB', 
      'City', 'State', 'Organization / College', 'Designation / Status', 
      'Vetting Status', 'Registration Date', 'LinkedIn', 'Github', 'Role Details'
    ];

    // Map candidate rows
    const rows = candidates.map(c => {
      const orgDetails = getCandidateOrgDetails(c);
      return [
        c.memberId || 'Pending',
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

  const getStatusBadge = (status: Candidate['status']) => {
    switch (status) {
      case 'Pending': return <span className="badge badge-pending">Pending</span>;
      case 'Under Review': return <span className="badge badge-review">Under Review</span>;
      case 'Verified': return <span className="badge badge-verified">Verified</span>;
      case 'Rejected': return <span className="badge badge-rejected">Rejected</span>;
      default: return <span className="badge">{status}</span>;
    }
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
                                <small className={styles.expTag}>{c.experienceLevel || 'N/A'}</small>
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
                  <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Job Title *</label>
                      <input 
                        type="text" 
                        value={newJobTitle}
                        onChange={e => setNewJobTitle(e.target.value)}
                        className="form-input" 
                        placeholder="e.g. Software Engineering Intern"
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
                        placeholder="e.g. TechSpot Inc"
                        required
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Job Type *</label>
                        <select 
                          value={newJobType}
                          onChange={e => setNewJobType(e.target.value as any)}
                          className="form-input"
                          style={{ backgroundColor: 'var(--bg-card-2)', color: 'var(--text-primary)' }}
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Internship">Internship</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Location *</label>
                        <input 
                          type="text" 
                          value={newJobLocation}
                          onChange={e => setNewJobLocation(e.target.value)}
                          className="form-input" 
                          placeholder="e.g. Hyderabad (Hybrid)"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Salary / Compensation (Optional)</label>
                      <input 
                        type="text" 
                        value={newJobSalary}
                        onChange={e => setNewJobSalary(e.target.value)}
                        className="form-input" 
                        placeholder="e.g. ₹25,000/month or 8-12 LPA"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Requirements (separated by commas)</label>
                      <input 
                        type="text" 
                        value={newJobReqs}
                        onChange={e => setNewJobReqs(e.target.value)}
                        className="form-input" 
                        placeholder="React, TypeScript, Next.js"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Job Description *</label>
                      <textarea 
                        value={newJobDesc}
                        onChange={e => setNewJobDesc(e.target.value)}
                        className="form-input" 
                        placeholder="Detailed role description, responsibilities..."
                        rows={4}
                        style={{ resize: 'none' }}
                        required
                      />
                    </div>
                    <button type="submit" disabled={isPostingJob} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                      {isPostingJob ? 'Posting Job...' : 'Publish Job Opening'}
                    </button>
                  </form>
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
                                  <button 
                                    onClick={() => handleToggleJobStatus(job.id, job.status)}
                                    className="btn btn-outline btn-xs"
                                    style={{ fontSize: '10px', padding: '0.2rem 0.5rem' }}
                                  >
                                    {job.status === 'Active' ? 'Close Job' : 'Re-open'}
                                  </button>
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
                <div className={styles.vettingCtrlCard}>
                  <h3>Admin Vetting Control</h3>
                  <div className={styles.currentStatusBadgeRow}>
                    <span>Current Vetting Status:</span>
                    {getStatusBadge(selectedCandidate.status)}
                  </div>
                  
                  {selectedCandidate.memberId && (
                    <div className={styles.verifiedIdRow}>
                      <span>TSS Member ID:</span>
                      <strong>{selectedCandidate.memberId}</strong>
                    </div>
                  )}

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Administrative / HR Vetting Notes</label>
                    <textarea
                      value={adminNotes}
                      onChange={e => setAdminNotes(e.target.value)}
                      placeholder="Type details about candidate validation, resume check, or rejection reasons..."
                      rows={4}
                      className="form-textarea"
                    />
                  </div>

                  <div className={styles.controlButtons}>
                    <button 
                      onClick={() => handleUpdateStatus('approve')} 
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: 'var(--success)' }}
                    >
                      Approve & Verify ID
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('review')} 
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                    >
                      Move to Review
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('reject')} 
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                    >
                      Reject Profile
                    </button>
                  </div>
                  <button 
                    onClick={handleSaveNotesOnly} 
                    className="btn btn-light btn-sm"
                    style={{ width: '100%', marginTop: '0.75rem' }}
                  >
                    Save Vetting Notes Only
                  </button>
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

    </div>
  );
}
