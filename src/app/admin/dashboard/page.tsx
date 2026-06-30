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
  Share2,
  Layers,
  ShieldAlert
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

type TabType = 'overview' | 'members' | 'verification' | 'opportunities' | 'applications' | 'emergency' | 'programs' | 'messages' | 'analytics' | 'logs' | 'settings';

export default function AdminDashboard() {
  const toast = useToast();
  const router = useRouter();
  
  // Authentication & Navigation
  const [adminUser, setAdminUser] = useState<{ email: string; role: 'Admin' | 'HR' } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Data Collections
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [emergencies, setEmergencies] = useState<any[]>([]);
  
  // Jobs & Applications (staged for applicant coordination)
  const [adminJobs, setAdminJobs] = useState<any[]>([]);
  const [adminApps, setAdminApps] = useState<any[]>([]);
  const [loadingAdminJobs, setLoadingAdminJobs] = useState(false);

  // Stats Metrics state
  const [metrics, setMetrics] = useState<any>({
    totalRegistrations: 0,
    pendingReviews: 0,
    verifiedMembers: 0,
    rejectedProfiles: 0,
    dailyRegistrations: 0,
    monthlyRegistrations: 0,
  });

  const [landingStats, setLandingStats] = useState({
    communityMembers: 20000,
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

  // New Verification & Application filtering states
  const [verificationStatusTab, setVerificationStatusTab] = useState<string>('Pending');
  const [searchTssId, setSearchTssId] = useState('');
  const [searchOppName, setSearchOppName] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [appStageFilter, setAppStageFilter] = useState('');

  // Selected details targets
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [candidateFwdLogs, setCandidateFwdLogs] = useState<ForwardLog[]>([]);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRejectionReasons, setSelectedRejectionReasons] = useState<string[]>([]);
  const [customRejectionText, setCustomRejectionText] = useState('');

  const [selectedOpp, setSelectedOpp] = useState<any | null>(null);
  const [selectedEm, setSelectedEm] = useState<any | null>(null);
  const [oppRejectionTargetId, setOppRejectionTargetId] = useState<string | null>(null);
  const [emRejectionTargetId, setEmRejectionTargetId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Forward details form state
  const [showFwdForm, setShowFwdForm] = useState(false);
  const [fwdRecruiterName, setFwdRecruiterName] = useState('');
  const [fwdRecruiterEmail, setFwdRecruiterEmail] = useState('');
  const [fwdNotes, setFwdNotes] = useState('');
  const [isFwdSubmitting, setIsFwdSubmitting] = useState(false);

  // Check login session & load data
  useEffect(() => {
    const initDashboard = async () => {
      try {
        const statsRes = await fetch('/api/admin/stats');
        if (!statsRes.ok) {
          router.push('/admin');
          return;
        }

        setAdminUser({ email: 'contact.thestudentspot@gmail.com', role: 'Admin' });

        await Promise.all([
          loadStats(),
          loadCandidates(),
          loadSettings(),
          loadMessages(),
          loadLogs(),
          loadOpportunities(),
          loadEmergencies(),
          fetchAdminJobsData()
        ]);
        
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        router.push('/admin');
      }
    };
    initDashboard();
  }, []);

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

  const loadOpportunities = async () => {
    const res = await fetch('/api/admin/opportunities');
    if (res.ok) {
      const data = await res.json();
      setOpportunities(data);
    }
  };

  const loadEmergencies = async () => {
    const res = await fetch('/api/admin/emergencies');
    if (res.ok) {
      const data = await res.json();
      setEmergencies(data);
    }
  };

  const fetchAdminJobsData = async () => {
    setLoadingAdminJobs(true);
    try {
      const jobsRes = await fetch('/api/jobs');
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
    } finally {
      setLoadingAdminJobs(false);
    }
  };

  const handleUpdateApplicationStage = async (appId: string, newStage: string) => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, stage: newStage })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Application stage updated to ${newStage}`);
        fetchAdminJobsData();
      } else {
        toast.error(data.error || 'Failed to update stage.');
      }
    } catch (err) {
      toast.error('Network connection error.');
    }
  };

  const handleModerateOpportunity = async (oppId: string, action: 'approve' | 'reject' | 'feature' | 'delete', reason = '') => {
    try {
      const res = await fetch('/api/admin/opportunities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oppId, action, rejectionReason: reason })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Opportunity ${action}ed successfully.`);
        loadOpportunities();
        loadStats();
        loadLogs();
      } else {
        toast.error(data.error || 'Failed to update opportunity.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network connection error.');
    }
  };

  const handleModerateEmergency = async (emId: string, action: 'approve' | 'reject' | 'feature' | 'delete', reason = '') => {
    try {
      const res = await fetch('/api/admin/emergencies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emId, action, rejectionReason: reason })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Emergency request ${action}ed successfully.`);
        loadEmergencies();
        loadStats();
        loadLogs();
      } else {
        toast.error(data.error || 'Failed to moderate emergency request.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network connection error.');
    }
  };

  const handleOpenCandidate = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setAdminNotes(candidate.notes || '');
    setChecklistState(candidate.roleDetails?.checklist || {});
    setSelectedRejectionReasons([]);
    setCustomRejectionText('');
    setShowRejectModal(false);
    setShowFwdForm(false);
    
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
          // Automatically switch roster tab to match new candidate status
          if (action === 'approve') setVerificationStatusTab('Verified');
          else if (action === 'reject') setVerificationStatusTab('Rejected');
          else if (action === 'request_changes') setVerificationStatusTab('Needs Changes');
          else if (action === 'review') setVerificationStatusTab('Under Review');
          else if (action === 'suspend') setVerificationStatusTab('Suspended');
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
      }
    } catch {
      toast.error('Failed to update vetting checklist.');
    }
  };

  const handleForwardCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

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
        toast.success(`Profile referral successfully sent to ${fwdRecruiterName}`);
        setFwdRecruiterName('');
        setFwdRecruiterEmail('');
        setFwdNotes('');
        setShowFwdForm(false);
        
        // Reload forwards
        const fwdLogsRes = await fetch(`/api/admin/forward?candidateId=${selectedCandidate.id}`);
        if (fwdLogsRes.ok) {
          const logs = await fwdLogsRes.json();
          setCandidateFwdLogs(logs);
        }
      } else {
        toast.error(data.error || 'Failed to refer profile.');
      }
    } catch (err) {
      toast.error('Connection error forwarding details.');
    } finally {
      setIsFwdSubmitting(false);
    }
  };

  const handleLogout = async () => {
    const res = await fetch('/api/admin/auth', { method: 'DELETE' });
    if (res.ok) {
      router.push('/admin');
    }
  };

  const getCandidateOrgDetails = (c: Candidate) => {
    switch (c.role) {
      case 'Student':
        return { org: c.college || 'N/A', sub: c.currentStatus || 'Student' };
      case 'Founder':
        return { org: c.roleDetails?.startupName || 'N/A', sub: `Founder (Stage: ${c.roleDetails?.startupStage || 'N/A'})` };
      case 'HR':
      case 'Recruiter':
      case 'Company':
        return { org: c.roleDetails?.companyName || 'N/A', sub: c.roleDetails?.designation || c.role };
      case 'Mentor':
        return { org: c.roleDetails?.currentCompany || 'N/A', sub: c.roleDetails?.mentorRole || 'Mentor' };
      case 'Investor':
        return { org: c.roleDetails?.fundName || 'N/A', sub: `Investor (${c.roleDetails?.investmentFocus || 'N/A'})` };
      case 'Freelancer':
      case 'Creator':
        return { org: c.roleDetails?.company || 'N/A', sub: c.roleDetails?.professionalRole || c.role };
      default:
        return { org: 'N/A', sub: c.role || '' };
    }
  };

  const handleExportCSV = () => {
    if (candidates.length === 0) {
      toast.warning('No candidate data available to export');
      return;
    }

    const headers = [
      'Member ID', 'Username', 'Full Name', 'Role', 'Email', 'Phone', 'Gender', 'DOB', 
      'City', 'State', 'Organization / College', 'Designation / Status', 
      'Vetting Status', 'Community Score', 'Level', 'Registration Date', 'LinkedIn', 'Github'
    ];

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
        c.linkedin || '',
        c.github || ''
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TSS_Members_Database_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div className={styles.tabsWrapper} style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch' }}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <TrendingUp size={16} /> Overview
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'members' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('members')}
            >
              <Users size={16} /> Members
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'verification' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('verification')}
            >
              <CheckCircle2 size={16} /> Verification
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'opportunities' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('opportunities')}
            >
              <Briefcase size={16} /> Opportunities ({opportunities.filter(o => o.status === 'Pending').length + emergencies.filter(e => e.status === 'Pending').length})
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'applications' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              <FileSpreadsheet size={16} /> Applications
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'emergency' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('emergency')}
            >
              <ShieldAlert size={16} /> Emergency
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'programs' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('programs')}
            >
              <Calendar size={16} /> Programs
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'messages' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare size={16} /> Inbox ({messages.length})
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'analytics' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp size={16} /> Analytics
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'logs' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <ListTodo size={16} /> Audit Logs
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={16} /> Settings
            </button>
          </div>
        </div>
      </section>

      {/* Main Panel Content */}
      <section className={styles.panelContent}>
        <div className="container">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Overview Dashboard</h3>
                  <p>Real-time metrics, system counters, and ecosystem activity logs.</p>
                </div>
              </div>

              {/* Grid of 10 dynamic metrics cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Total Registrations</span>
                  <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{candidates.length}</strong>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Verified Members</span>
                  <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--green-light)', marginTop: '0.25rem' }}>{candidates.filter(c => c.status === 'Verified').length}</strong>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Pending Verification</span>
                  <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--accent)', marginTop: '0.25rem' }}>{candidates.filter(c => c.status === 'Pending' || c.status === 'Submitted' || c.status === 'Under Review').length}</strong>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Rejected Profiles</span>
                  <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{candidates.filter(c => c.status === 'Rejected').length}</strong>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Active Opportunities</span>
                  <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{opportunities.filter(o => o.status === 'Approved').length}</strong>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Applications Today</span>
                  <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{adminApps.length}</strong>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Companies</span>
                  <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{candidates.filter(c => c.role === 'Company' || c.role === 'Recruiter' || c.role === 'HR').length}</strong>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Colleges</span>
                  <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{new Set(candidates.map(c => c.college).filter(Boolean)).size}</strong>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Founders</span>
                  <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{candidates.filter(c => c.role === 'Founder' || c.role === 'Startup').length}</strong>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Community Score</span>
                  <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{candidates.reduce((sum, c) => sum + (c.communityScore || 0), 0)}</strong>
                </div>
              </div>

              {/* Sub Columns splits */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Latest Registrations */}
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 750, color: 'var(--text-primary)' }}>Latest Registrations</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.5rem' }}>Member</th>
                          <th style={{ padding: '0.5rem' }}>Role</th>
                          <th style={{ padding: '0.5rem' }}>Date</th>
                          <th style={{ padding: '0.5rem' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.slice(0, 5).map(c => (
                          <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '0.5rem' }}>
                              <strong style={{ color: 'var(--text-primary)' }}>{c.fullName}</strong>
                              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.email}</span>
                            </td>
                            <td style={{ padding: '0.5rem' }}>{c.role}</td>
                            <td style={{ padding: '0.5rem' }}>{new Date(c.registrationDate || Date.now()).toLocaleDateString()}</td>
                            <td style={{ padding: '0.5rem' }}>
                              <span style={{ fontSize: '9px', fontWeight: 700, padding: '0.15rem 0.35rem', borderRadius: '4px', backgroundColor: c.status === 'Verified' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: c.status === 'Verified' ? 'var(--green-light)' : 'var(--accent)' }}>{c.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pending Verification Approvals */}
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 750, color: 'var(--text-primary)' }}>Pending Approvals Vetting Queue</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {candidates.filter(c => c.status === 'Pending' || c.status === 'Submitted' || c.status === 'Under Review').slice(0, 4).map(c => (
                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                          <div>
                            <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{c.fullName}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Role: {c.role} | College: {c.college || 'N/A'}</span>
                          </div>
                          <button onClick={() => { setActiveTab('verification'); handleOpenCandidate(c); }} className="btn btn-light btn-xs">Vet Profile</button>
                        </div>
                      ))}
                      {candidates.filter(c => c.status === 'Pending' || c.status === 'Submitted' || c.status === 'Under Review').length === 0 && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Vetting queue completely clear! All profiles verified.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* System Health Status */}
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 750, color: 'var(--text-primary)' }}>System Status</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Database Server</span>
                        <strong style={{ color: 'var(--green-light)' }}>ACTIVE</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>OTP Verification Services</span>
                        <strong style={{ color: 'var(--green-light)' }}>OPERATIONAL</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Member ID Generator</span>
                        <strong style={{ color: 'var(--green-light)' }}>ONLINE</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Auto-audit Logger</span>
                        <strong style={{ color: 'var(--green-light)' }}>ACTIVE</strong>
                      </div>
                    </div>
                  </div>

                  {/* Pending Opportunities */}
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 750, color: 'var(--text-primary)' }}>Pending Listings ({opportunities.filter(o => o.status === 'Pending').length})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {opportunities.filter(o => o.status === 'Pending').slice(0, 3).map(o => (
                        <div key={o.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                          <strong style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>{o.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent)', display: 'block' }}>{o.organization} | Category: {o.type}</span>
                          <button onClick={() => setActiveTab('opportunities')} className="btn btn-light btn-xs" style={{ marginTop: '0.25rem' }}>Review Listing</button>
                        </div>
                      ))}
                      {opportunities.filter(o => o.status === 'Pending').length === 0 && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>No pending opportunity approvals.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBERS DIRECTORY */}
          {activeTab === 'members' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Members Directory</h3>
                  <p>All registered students, mentors, founders, recruiters, and companies inside the TSS ecosystem.</p>
                </div>
                <button onClick={handleExportCSV} className="btn btn-light btn-sm">
                  <FileSpreadsheet size={16} /> Export CSV
                </button>
              </div>

              {/* Filters Pane */}
              <div className={styles.filtersPane} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder="Search by name, ID, or email..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                  />
                  <select 
                    value={roleFilter} 
                    onChange={e => setRoleFilter(e.target.value)}
                    style={{ padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                  >
                    <option value="">All Roles</option>
                    <option value="Student">Student</option>
                    <option value="Founder">Founder</option>
                    <option value="HR">HR</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Investor">Investor</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Creator">Creator</option>
                    <option value="College">College</option>
                    <option value="Company">Company</option>
                  </select>
                </div>
              </div>

              {/* Members table */}
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem' }}>Member Name</th>
                      <th style={{ padding: '0.75rem' }}>Member ID</th>
                      <th style={{ padding: '0.75rem' }}>Role</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem' }}>Email / Phone</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates
                      .filter(c => {
                        const q = searchQuery.toLowerCase();
                        const matchesSearch = c.fullName.toLowerCase().includes(q) || (c.memberId || '').toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
                        const matchesRole = !roleFilter || c.role === roleFilter;
                        return matchesSearch && matchesRole;
                      })
                      .map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.fullName}</td>
                          <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{c.memberId || 'Pending'}</td>
                          <td style={{ padding: '0.75rem' }}>{c.role}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: c.status === 'Verified' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: c.status === 'Verified' ? 'var(--green-light)' : 'var(--accent)' }}>{c.status}</span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <div>{c.email}</div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.mobile}</span>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            <button onClick={() => { setActiveTab('verification'); handleOpenCandidate(c); }} className="btn btn-light btn-xs">Vetting Worksheet</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: VERIFICATION queue */}
          {activeTab === 'verification' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Verification Review Workspace</h3>
                  <p>Check identity records, resume templates, and portfolios. Issue unique TSS Member ID QR cards.</p>
                </div>
              </div>

              {/* Status Tabs Subbar */}
              <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                {['Pending', 'Under Review', 'Needs Changes', 'Verified', 'Rejected', 'Suspended', 'Deleted'].map(status => (
                  <button 
                    key={status}
                    onClick={() => setVerificationStatusTab(status)}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '6px',
                      background: verificationStatusTab === status ? 'var(--primary-pale)' : 'none',
                      color: verificationStatusTab === status ? '#ffffff' : 'var(--text-secondary)',
                      border: '1px solid ' + (verificationStatusTab === status ? 'var(--primary-pale)' : 'var(--border-color)'),
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {status} ({candidates.filter(c => c.status === status).length})
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Left: Queue Roster list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 700 }}>Verification Candidates</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                    {candidates
                      .filter(c => c.status === verificationStatusTab)
                      .map(c => (
                        <div 
                          key={c.id}
                          onClick={() => handleOpenCandidate(c)}
                          style={{
                            padding: '1rem',
                            backgroundColor: selectedCandidate?.id === c.id ? 'rgba(193, 18, 31, 0.05)' : 'var(--bg-card)',
                            border: '1px solid ' + (selectedCandidate?.id === c.id ? 'var(--primary)' : 'var(--border-color)'),
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{c.fullName}</strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{c.role}</span>
                          </div>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{c.email} | registered: {new Date(c.registrationDate || Date.now()).toLocaleDateString()}</span>
                        </div>
                      ))}
                    {candidates.filter(c => c.status === verificationStatusTab).length === 0 && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '3rem' }}>No profiles staged in this category.</p>
                    )}
                  </div>
                </div>

                {/* Right: Selected Candidate Worksheet details */}
                <div>
                  {!selectedCandidate ? (
                    <div style={{ textAlign: 'center', padding: '6rem 1.5rem', border: '1px dashed var(--border-color)', borderRadius: '14px', color: 'var(--text-muted)' }}>
                      Select a candidate from the queue to start profile vetting.
                    </div>
                  ) : (
                    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 800 }}>{selectedCandidate.fullName}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Role: <strong>{selectedCandidate.role}</strong> | City: {selectedCandidate.city || 'Not Provided'}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            padding: '0.25rem 0.6rem', 
                            borderRadius: '20px', 
                            backgroundColor: selectedCandidate.status === 'Verified' ? 'rgba(5, 150, 105, 0.12)' : selectedCandidate.status === 'Under Review' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(220, 38, 38, 0.12)', 
                            color: selectedCandidate.status === 'Verified' ? 'var(--green-light)' : selectedCandidate.status === 'Under Review' ? 'var(--accent)' : '#ef4444' 
                          }}>
                            {selectedCandidate.status}
                          </span>
                          {selectedCandidate.memberId && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {selectedCandidate.memberId}</span>
                          )}
                        </div>
                      </div>

                      {/* Staged Draft Profile Changes Diff Panel */}
                      {selectedCandidate.roleDetails?.draftProfileDetails && (
                        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            ⚠️ Proposed Profile Edits (Awaiting Vetting)
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                            {Object.entries(selectedCandidate.roleDetails.draftProfileDetails).map(([key, newVal]: [string, any]) => {
                              let oldVal = (selectedCandidate as any)[key];
                              if (Array.isArray(oldVal)) oldVal = oldVal.join(', ');
                              if (typeof oldVal === 'object') oldVal = JSON.stringify(oldVal);
                              let renderedNew = Array.isArray(newVal) ? newVal.join(', ') : typeof newVal === 'object' ? JSON.stringify(newVal) : String(newVal);
                              return (
                                <div key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '0.4rem', fontSize: '0.8rem' }}>
                                  <strong style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</strong>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.2rem' }}>
                                    <div style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Was: {String(oldVal || 'None')}</div>
                                    <div style={{ color: 'var(--green-light)', fontWeight: 600, fontSize: '0.75rem' }}>Proposed: {renderedNew}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Vetting Checklist Form */}
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Vetting Checklist</strong>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          {[
                            { key: 'identity', label: 'Identity/DOB Verified' },
                            { key: 'education', label: 'College/Grad Year Match' },
                            { key: 'resume', label: 'Resume File Upload Valid' },
                            { key: 'portfolio', label: 'Portfolio link authentic' },
                            { key: 'linkedin', label: 'LinkedIn profile connected' },
                            { key: 'github', label: 'GitHub account matching' },
                            { key: 'photo', label: 'Profile Photo matches ID' },
                            { key: 'skills', label: 'Skills validated' },
                            { key: 'documents', label: 'Official Documents vetted' }
                          ].map(chk => (
                            <label key={chk.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={!!checklistState[chk.key]}
                                onChange={(e) => handleChecklistChange(chk.key, e.target.checked)}
                              />
                              {chk.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Admin Notes Textbox */}
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Internal Admin Notes</label>
                        <textarea 
                          className="form-input"
                          placeholder="Add comments, missing fields notifications, etc..."
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          rows={3}
                          style={{ resize: 'vertical', width: '100%', fontSize: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-input)', padding: '0.5rem' }}
                        />
                        <button onClick={handleSaveNotesOnly} className="btn btn-outline btn-xs" style={{ marginTop: '0.45rem' }}>Save Notes</button>
                      </div>

                      {/* Recruiter Forwarding Panel */}
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Recruiter Forwarding Link</strong>
                          <button onClick={() => setShowFwdForm(!showFwdForm)} className="btn btn-light btn-xs">{showFwdForm ? 'Hide panel' : 'Forward details'}</button>
                        </div>
                        {showFwdForm && (
                          <form onSubmit={handleForwardCandidate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                            <input 
                              type="text" 
                              placeholder="Recruiter Name" 
                              value={fwdRecruiterName}
                              onChange={e => setFwdRecruiterName(e.target.value)}
                              required
                              style={{ padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                            />
                            <input 
                              type="email" 
                              placeholder="Recruiter Email" 
                              value={fwdRecruiterEmail}
                              onChange={e => setFwdRecruiterEmail(e.target.value)}
                              required
                              style={{ padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                            />
                            <button type="submit" className="btn btn-primary btn-sm" style={{ gridColumn: 'span 2', padding: '0.4rem' }}>Send Profile Email</button>
                          </form>
                        )}
                      </div>

                      {/* Vetting History Timeline */}
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Vetting Audit History</strong>
                        {(!selectedCandidate.roleDetails?.auditLogs || selectedCandidate.roleDetails.auditLogs.length === 0) ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No audit logs generated yet.</span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '100px', overflowY: 'auto' }}>
                            {selectedCandidate.roleDetails.auditLogs.slice(-3).reverse().map((log: any, idx: number) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <span>• {log.event}</span>
                                <span>{log.date}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Vetting Action Buttons */}
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                        <strong style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Vetting Verdict Actions</strong>
                        
                        {selectedCandidate.roleDetails?.draftProfileDetails ? (
                          /* DRAFT CHANGE VETTING ACTIONS */
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                              <button 
                                onClick={() => handleUpdateStatus('approve')} 
                                className="btn btn-primary" 
                                style={{ flex: 1, backgroundColor: 'var(--green-light)', borderColor: 'var(--green-light)', color: '#ffffff', fontWeight: 700, padding: '0.6rem 1.2rem', borderRadius: '8px' }}
                              >
                                Approve & Merge Draft Updates
                              </button>
                              <button 
                                onClick={() => setShowRejectModal(true)} 
                                className="btn btn-outline" 
                                style={{ flex: 1, color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.6rem 1.2rem', borderRadius: '8px' }}
                              >
                                Reject & Discard Draft Updates
                              </button>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => handleUpdateStatus('request_changes')} className="btn btn-light btn-xs" style={{ flex: 1 }}>Ask Candidate to Revise</button>
                              <button onClick={() => handleUpdateStatus('review')} className="btn btn-light btn-xs" style={{ flex: 1 }}>Hold in Manual Review</button>
                            </div>
                          </div>
                        ) : (
                          /* STANDARD REGISTRATION VETTING ACTIONS */
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                              <button 
                                onClick={() => handleUpdateStatus('approve')} 
                                className="btn btn-primary" 
                                style={{ flex: 1, backgroundColor: 'var(--green-light)', borderColor: 'var(--green-light)', color: '#ffffff', fontWeight: 700, padding: '0.6rem 1.2rem', borderRadius: '8px' }}
                              >
                                Approve & Issue Member ID
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus('request_changes')} 
                                className="btn btn-outline" 
                                style={{ color: 'var(--accent)', borderColor: 'rgba(245, 158, 11, 0.3)', padding: '0.6rem 1.2rem', borderRadius: '8px' }}
                              >
                                Request Changes
                              </button>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <button onClick={() => handleUpdateStatus('review')} className="btn btn-light btn-xs" style={{ flex: 1 }}>Manual Review</button>
                              <button onClick={() => setShowRejectModal(true)} className="btn btn-light btn-xs" style={{ flex: 1, color: 'var(--danger)' }}>Reject Profile</button>
                              <button onClick={() => handleUpdateStatus('suspend')} className="btn btn-light btn-xs" style={{ flex: 1, color: 'var(--danger)' }}>Suspend</button>
                              <button onClick={() => handleUpdateStatus('delete')} className="btn btn-xs" style={{ color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.15)', backgroundColor: 'rgba(239, 68, 68, 0.04)' }}>Delete</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OPPORTUNITIES MANAGEMENT */}
          {activeTab === 'opportunities' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Opportunities Moderation Queue</h3>
                  <p>Manage community postings: Jobs, Internships, Freelance Gigs, Projects, Hackathons, Workshops, Funding.</p>
                </div>
              </div>

              {/* Opportunities List Table */}
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem' }}>Listing Title</th>
                      <th style={{ padding: '0.75rem' }}>Category</th>
                      <th style={{ padding: '0.75rem' }}>Organization</th>
                      <th style={{ padding: '0.75rem' }}>Location</th>
                      <th style={{ padding: '0.75rem' }}>Salary/Stipend</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunities.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No opportunities registered.</td>
                      </tr>
                    ) : (
                      opportunities.map(opp => (
                        <tr key={opp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{opp.title}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                              {opp.type}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>{opp.organization}</td>
                          <td style={{ padding: '0.75rem' }}>{opp.location} ({opp.remoteOption})</td>
                          <td style={{ padding: '0.75rem' }}>{opp.salaryStipend || 'N/A'}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: opp.status === 'Approved' ? 'rgba(5, 150, 105, 0.15)' : opp.status === 'Rejected' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: opp.status === 'Approved' ? 'var(--green-light)' : opp.status === 'Rejected' ? '#ef4444' : 'var(--accent)' }}>{opp.status}</span>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                              <button onClick={() => setSelectedOpp(opp)} className="btn btn-light btn-xs">Notes</button>
                              {opp.status !== 'Approved' && (
                                <button onClick={() => handleModerateOpportunity(opp.id, 'approve')} className="btn btn-primary btn-xs" style={{ backgroundColor: 'var(--green-light)', borderColor: 'var(--green-light)', color: '#ffffff' }}>Approve</button>
                              )}
                              {opp.status !== 'Rejected' && (
                                <button onClick={() => setOppRejectionTargetId(opp.id)} className="btn btn-outline btn-xs" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>Reject</button>
                              )}
                              <button onClick={() => handleModerateOpportunity(opp.id, 'delete')} className="btn btn-xs" style={{ color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.1)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: APPLICATIONS MANAGEMENT */}
          {activeTab === 'applications' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Applications Management</h3>
                  <p>View all applicants, coordinate interview status stages, and download spreadsheet lists.</p>
                </div>
              </div>

              {/* Filters Pane */}
              <div className={styles.filtersPane} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder="Search by TSS ID..." 
                    value={searchTssId}
                    onChange={e => setSearchTssId(e.target.value)}
                    style={{ padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Search by Opportunity..." 
                    value={searchOppName}
                    onChange={e => setSearchOppName(e.target.value)}
                    style={{ padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              {/* Applicants table */}
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem' }}>Candidate Name</th>
                      <th style={{ padding: '0.75rem' }}>Opportunity</th>
                      <th style={{ padding: '0.75rem' }}>Company</th>
                      <th style={{ padding: '0.75rem' }}>Applied Date</th>
                      <th style={{ padding: '0.75rem' }}>Stage Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminApps
                      .filter(app => {
                        const q1 = searchTssId.toLowerCase();
                        const q2 = searchOppName.toLowerCase();
                        return (app.candidateId || '').toLowerCase().includes(q1) && (app.jobTitle || '').toLowerCase().includes(q2);
                      })
                      .map((app, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{app.candidateName || `Candidate ID: ${app.candidateId.slice(0,8)}`}</td>
                          <td style={{ padding: '0.75rem' }}>{app.jobTitle}</td>
                          <td style={{ padding: '0.75rem' }}>{app.companyName}</td>
                          <td style={{ padding: '0.75rem' }}>{new Date(app.appliedDate || Date.now()).toLocaleDateString()}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', textTransform: 'uppercase' }}>
                              {app.stage || 'Applied'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            <select 
                              value={app.stage || 'Applied'} 
                              onChange={(e) => handleUpdateApplicationStage(app.id, e.target.value)}
                              style={{ padding: '0.25rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                            >
                              <option value="Applied">Applied</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Interview">Interview</option>
                              <option value="Selected">Selected</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Joined">Joined</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    {adminApps.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No candidate applications registered yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: EMERGENCY QUEUE */}
          {activeTab === 'emergency' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Emergency Support Reviews</h3>
                  <p>Highest priority review workspace for genuine medical blood and platelet requirements.</p>
                </div>
              </div>

              {/* Emergencies list table */}
              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem' }}>Patient & Hospital</th>
                      <th style={{ padding: '0.75rem' }}>Group</th>
                      <th style={{ padding: '0.75rem' }}>Units</th>
                      <th style={{ padding: '0.75rem' }}>Required Before</th>
                      <th style={{ padding: '0.75rem' }}>Hospital Proof</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emergencies.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No emergency requests registered.</td>
                      </tr>
                    ) : (
                      emergencies.map(em => (
                        <tr key={em.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '0.75rem' }}>
                            <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{em.patientName}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{em.hospitalName}</span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{ fontWeight: 800, color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.08)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{em.bloodGroup}</span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>{em.unitsRequired}</td>
                          <td style={{ padding: '0.75rem', color: '#ef4444', fontWeight: 600 }}>{em.requiredBefore}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <a href={em.proofUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-pale)', textDecoration: 'underline' }}>View Case Sheet</a>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: em.status === 'Approved' ? 'rgba(5, 150, 105, 0.15)' : em.status === 'Rejected' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: em.status === 'Approved' ? 'var(--green-light)' : em.status === 'Rejected' ? '#ef4444' : 'var(--accent)' }}>{em.status}</span>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                              <button onClick={() => setSelectedEm(em)} className="btn btn-light btn-xs">Notes</button>
                              {em.status !== 'Approved' && (
                                <button onClick={() => handleModerateEmergency(em.id, 'approve')} className="btn btn-primary btn-xs" style={{ backgroundColor: 'var(--green-light)', borderColor: 'var(--green-light)', color: '#ffffff' }}>Approve</button>
                              )}
                              {em.status !== 'Rejected' && (
                                <button onClick={() => setEmRejectionTargetId(em.id)} className="btn btn-outline btn-xs" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>Reject</button>
                              )}
                              <button onClick={() => handleModerateEmergency(em.id, 'delete')} className="btn btn-xs" style={{ color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.1)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: PROGRAMS */}
          {activeTab === 'programs' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Programs & Build Challenge Sandbox</h3>
                  <p>Manage monthly cycles, status reviews, kickoff Google Meets, and winner declarations.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontWeight: 750, color: 'var(--text-primary)' }}>Sandbox Vetting Cycle</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Current Cycle Status</span>
                      <strong style={{ color: 'var(--green-light)' }}>WEEK 3 REVIEW</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Kickoff Meet Url</span>
                      <a href="https://meet.google.com/tss-sandbox" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-pale)' }}>meet.google.com/tss-sandbox</a>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Active Projects Count</span>
                      <strong style={{ color: 'var(--text-primary)' }}>12 Projects</strong>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontWeight: 750, color: 'var(--text-primary)' }}>Upcoming Deadlines</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div>• Week 3 Progress checklist check: **July 5, 2026**</div>
                    <div>• Staging Review and demo prep: **July 12, 2026**</div>
                    <div>• Demo Day Winner Announcement: **July 19, 2026**</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: CONTACT INBOX */}
          {activeTab === 'messages' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Contact Inbox</h3>
                  <p>Inbound queries, feedback sheets, and customer support messages.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>No inbox messages.</div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{msg.name} ({msg.email})</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(msg.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 9: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Analytics Workspace</h3>
                  <p>Ecosystem statistics, verification success ratios, and top active partners.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Most Active Members */}
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontWeight: 750, color: 'var(--text-primary)' }}>Most Active Members (Streaks)</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.5rem' }}>Member</th>
                        <th style={{ padding: '0.5rem' }}>Logins</th>
                        <th style={{ padding: '0.5rem' }}>Streak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.slice(0, 4).map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>{c.fullName}</td>
                          <td style={{ padding: '0.5rem' }}>{c.loginDays || 36} days</td>
                          <td style={{ padding: '0.5rem', color: '#f97316', fontWeight: 700 }}>🔥 {c.streak || 13} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Top Colleges */}
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontWeight: 750, color: 'var(--text-primary)' }}>Top Colleges Partnered</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Malla Reddy University</span>
                      <strong style={{ color: 'var(--text-primary)' }}>450 registrations</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>IIIT Hyderabad</span>
                      <strong style={{ color: 'var(--text-primary)' }}>120 registrations</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>VNR VJIET</span>
                      <strong style={{ color: 'var(--text-primary)' }}>80 registrations</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Audit Logs Ledger</h3>
                  <p>Chronological security logs capturing all administrative assessment updates.</p>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem' }}>Timestamp</th>
                      <th style={{ padding: '0.75rem' }}>Admin Email</th>
                      <th style={{ padding: '0.75rem' }}>Operation Event</th>
                      <th style={{ padding: '0.75rem' }}>Action Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No audit logs recorded yet.</td>
                      </tr>
                    ) : (
                      activityLogs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 600 }}>{log.adminUser}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, padding: '0.15rem 0.35rem', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>{log.action}</span>
                          </td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{log.details}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 11: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="fade-in">
              <div className={styles.panelHeader}>
                <div>
                  <h3>Settings Workspace</h3>
                  <p>Configuration of automatic metrics calculation, session parameters, and validation logs.</p>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 750, color: 'var(--text-primary)' }}>Dynamically Calculated Counters Summary</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Landing page counters are now fully automated and computed from database states. Manual overrides are disabled to maintain absolute trust.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.8rem' }}>• Candidates base database: **Verified Profiles (+20,000 baseline)**</div>
                  <div style={{ fontSize: '0.8rem' }}>• Opportunities base database: **Active Listings (+800 baseline)**</div>
                  <div style={{ fontSize: '0.8rem' }}>• Recruiter Connection database: **Recruiters & HRs (+300 baseline)**</div>
                  <div style={{ fontSize: '0.8rem' }}>• Placement database: **Joined/Selected Applications (+150 baseline)**</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

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
                  'Falsified Information', 'Inappropriate profile image'
                ].map(reason => {
                  const isChecked = selectedRejectionReasons.includes(reason);
                  return (
                    <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedRejectionReasons(selectedRejectionReasons.filter(r => r !== reason));
                          } else {
                            setSelectedRejectionReasons([...selectedRejectionReasons, reason]);
                          }
                        }}
                      />
                      {reason}
                    </label>
                  );
                })}
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label className="form-label">Custom Actionable Feedback (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Please link a valid PDF instead of empty Drive folder."
                  value={customRejectionText}
                  onChange={e => setCustomRejectionText(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.8rem', padding: '0.45rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowRejectModal(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button
                  type="button"
                  disabled={selectedRejectionReasons.length === 0 && !customRejectionText.trim()}
                  onClick={() => {
                    const finalReasons = [...selectedRejectionReasons];
                    if (customRejectionText.trim()) finalReasons.push(customRejectionText.trim());
                    handleUpdateStatus('reject', finalReasons);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)', color: '#ffffff' }}
                >
                  Confirm Rejection Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- OPPORTUNITY REJECTION REASON DIALOG FOR ADMIN --- */}
      {oppRejectionTargetId && (
        <div className={styles.modalOverlay} style={{ zIndex: 1100 }} onClick={() => setOppRejectionTargetId(null)}>
          <div className={styles.modalBody} style={{ maxWidth: '440px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Reject Opportunity</h2>
              <button onClick={() => setOppRejectionTargetId(null)} className={styles.closeModalBtn}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Reason for Rejection *</label>
                <textarea
                  value={rejectionReasonInput}
                  onChange={e => setRejectionReasonInput(e.target.value)}
                  placeholder="Provide explicit feedback to help the poster correct their listing..."
                  rows={4}
                  className="form-textarea"
                  style={{ fontSize: '0.8rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', width: '100%' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { setOppRejectionTargetId(null); setRejectionReasonInput(''); }} className="btn btn-outline btn-sm">Cancel</button>
                <button 
                  type="button" 
                  disabled={!rejectionReasonInput.trim()}
                  onClick={() => {
                    handleModerateOpportunity(oppRejectionTargetId, 'reject', rejectionReasonInput);
                    setOppRejectionTargetId(null);
                    setRejectionReasonInput('');
                  }} 
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

      {/* --- EMERGENCY DETAILS DIALOG FOR ADMIN --- */}
      {selectedEm && (
        <div className={styles.modalOverlay} style={{ zIndex: 1100 }} onClick={() => setSelectedEm(null)}>
          <div className={styles.modalBody} style={{ maxWidth: '600px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Emergency Request Details</h2>
              <button onClick={() => setSelectedEm(null)} className={styles.closeModalBtn}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div><strong>Patient Name:</strong> {selectedEm.patientName}</div>
              <div><strong>Blood Group:</strong> {selectedEm.bloodGroup}</div>
              <div><strong>Units Required:</strong> {selectedEm.unitsRequired}</div>
              <div><strong>Hospital:</strong> {selectedEm.hospitalName}</div>
              <div><strong>Hospital Address:</strong> {selectedEm.hospitalAddress}, {selectedEm.city}</div>
              <div><strong>Required Before:</strong> {selectedEm.requiredBefore}</div>
              <div><strong>Contact Person:</strong> {selectedEm.contactPerson} ({selectedEm.phoneNumber})</div>
              <div><strong>Medical Case Notes:</strong></div>
              <p style={{ whiteSpace: 'pre-wrap', backgroundColor: 'var(--bg-main)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', margin: 0 }}>{selectedEm.medicalNotes}</p>
              <div><strong>Verification Proof:</strong> <a href={selectedEm.proofUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-pale)', textDecoration: 'underline' }}>View Case Sheet / Medical ID</a></div>
            </div>
          </div>
        </div>
      )}

      {/* --- OPPORTUNITY DETAILS DIALOG FOR ADMIN --- */}
      {selectedOpp && (
        <div className={styles.modalOverlay} style={{ zIndex: 1100 }} onClick={() => setSelectedOpp(null)}>
          <div className={styles.modalBody} style={{ maxWidth: '600px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Opportunity Details</h2>
              <button onClick={() => setSelectedOpp(null)} className={styles.closeModalBtn}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div><strong>Title:</strong> {selectedOpp.title}</div>
              <div><strong>Category:</strong> {selectedOpp.type}</div>
              <div><strong>Organization:</strong> {selectedOpp.organization}</div>
              <div><strong>Location:</strong> {selectedOpp.location} ({selectedOpp.remoteOption})</div>
              <div><strong>Salary / Stipend:</strong> {selectedOpp.salaryStipend || 'N/A'}</div>
              <div><strong>Apply Link:</strong> <a href={selectedOpp.applyLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-pale)', textDecoration: 'underline' }}>{selectedOpp.applyLink}</a></div>
              <div><strong>Description:</strong></div>
              <p style={{ whiteSpace: 'pre-wrap', backgroundColor: 'var(--bg-main)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', margin: 0 }}>{selectedOpp.description}</p>
              {selectedOpp.rejectionReason && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', color: 'var(--danger)' }}>
                  <strong>Admin Rejection Reason:</strong> {selectedOpp.rejectionReason}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- EMERGENCY REJECTION REASON DIALOG --- */}
      {emRejectionTargetId && (
        <div className={styles.modalOverlay} style={{ zIndex: 1100 }} onClick={() => setEmRejectionTargetId(null)}>
          <div className={styles.modalBody} style={{ maxWidth: '440px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Reject Emergency Request</h2>
              <button onClick={() => setEmRejectionTargetId(null)} className={styles.closeModalBtn}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label">Reason for Rejection *</label>
                <textarea
                  value={rejectionReasonInput}
                  onChange={e => setRejectionReasonInput(e.target.value)}
                  placeholder="e.g. Inauthentic medical proof, financial request detected..."
                  rows={4}
                  className="form-textarea"
                  style={{ fontSize: '0.8rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', width: '100%' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { setEmRejectionTargetId(null); setRejectionReasonInput(''); }} className="btn btn-outline btn-sm">Cancel</button>
                <button 
                  type="button" 
                  disabled={!rejectionReasonInput.trim()}
                  onClick={() => {
                    handleModerateEmergency(emRejectionTargetId, 'reject', rejectionReasonInput);
                    setEmRejectionTargetId(null);
                    setRejectionReasonInput('');
                  }} 
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
