'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  Shield, 
  Award, 
  User, 
  Download, 
  ArrowRight, 
  LogOut, 
  Settings, 
  Layers, 
  Calendar, 
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  AlertOctagon,
  FileText,
  Lock,
  ShieldAlert,
  Briefcase,
  Search,
  Share2,
  Phone,
  ExternalLink,
  Bookmark,
  Eye,
  Heart,
  X,
  Globe,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface CandidateProfile {
  id: string;
  role: string;
  fullName: string;
  memberId: string;
  status: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  country: string;
  highestQualification?: string | null;
  college?: string | null;
  graduationYear?: number | null;
  skills?: string[];
  linkedin: string;
  github?: string | null;
  portfolio?: string | null;
  photoPath?: string | null;
  resumePath?: string | null;
  resumeLink?: string | null;
  registrationDate: string;
  username?: string;
  communityScore?: number;
  level?: string;
  memberSince?: string;
  notes?: string | null;
  roleDetails?: any;
  loginDays?: number;
  streak?: number;
  lastCheckinDate?: string;
  bloodGroup?: string;
  willingToDonate?: boolean;
  availableForEmergency?: boolean;
  lastDonationDate?: string;
  emergencyContact?: string;
  achievements?: string[];
  certificates?: string[];
  coverImage?: string;
  bio?: string;
  experience?: any[];
  education?: any[];
}

interface ResumeEdu {
  institution: string;
  degree: string;
  year: string;
}

interface ResumeExp {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface ResumeProj {
  title: string;
  tech: string;
  description: string;
}

interface ResumeData {
  fullName: string;
  email: string;
  mobile: string;
  linkedin: string;
  github: string;
  portfolio: string;
  skills: string;
  education: ResumeEdu[];
  experience: ResumeExp[];
  projects: ResumeProj[];
}

const getSkillsString = (skills: any): string => {
  if (!skills) return '';
  if (Array.isArray(skills)) return skills.join(', ');
  if (typeof skills === 'string') {
    try {
      const parsed = JSON.parse(skills);
      if (Array.isArray(parsed)) return parsed.join(', ');
    } catch {}
    return skills;
  }
  return '';
};

export default function CandidateDashboard() {
  const toast = useToast();
  
  // Auth states
  const [memberIdInput, setMemberIdInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  
  // Dashboard navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard-home' | 'profile' | 'card' | 'resume' | 'opportunity-hub' | 'applications' | 'saved-opportunities' | 'build' | 'events' | 'community' | 'emergency-support' | 'settings' | 'notifications'>('dashboard-home');
  const [profileSubTab, setProfileSubTab] = useState<'details' | 'experience' | 'achievements' | 'resume'>('details');
  const [oppsSubTab, setOppsSubTab] = useState<'feed' | 'saved' | 'applications' | 'build'>('feed');
  const [emergencySubTab, setEmergencySubTab] = useState<'feed' | 'settings'>('feed');

  // Trust-based custom fields states
  const [editBio, setEditBio] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  const [editAchievements, setEditAchievements] = useState('');
  const [editCertificates, setEditCertificates] = useState('');
  const [editExperience, setEditExperience] = useState<any[]>([]);
  const [editEducation, setEditEducation] = useState<any[]>([]);
  const [editWillingToDonate, setEditWillingToDonate] = useState(false);
  const [editAvailableForEmergency, setEditAvailableForEmergency] = useState(false);

  // Emergency fields state
  const [editBloodGroup, setEditBloodGroup] = useState('Unknown');
  const [editEmergencyContact, setEditEmergencyContact] = useState('');
  const [editAvailableBloodDonation, setEditAvailableBloodDonation] = useState('No');
  const [editAvailablePlateletDonation, setEditAvailablePlateletDonation] = useState('No');
  const [editLastDonationDate, setEditLastDonationDate] = useState('');

  // Opportunity Hub States
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [oppSearch, setOppSearch] = useState('');
  const [oppFilterType, setOppFilterType] = useState('All'); // tabs
  const [oppFilterRemote, setOppFilterRemote] = useState('All');
  const [oppFilterPaid, setOppFilterPaid] = useState('All');
  const [oppFilterVerifiedOnly, setOppFilterVerifiedOnly] = useState(false);
  const [oppSortBy, setOppSortBy] = useState('newest'); // newest, trust, applied
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null);
  
  // Post Opportunity Form States
  const [showPostOppModal, setShowPostOppModal] = useState(false);
  const [newOppType, setNewOppType] = useState('Job');
  const [newOppTitle, setNewOppTitle] = useState('');
  const [newOppDesc, setNewOppDesc] = useState('');
  const [newOppOrg, setNewOppOrg] = useState('');
  const [newOppLocation, setNewOppLocation] = useState('');
  const [newOppRemote, setNewOppRemote] = useState('Onsite');
  const [newOppSkills, setNewOppSkills] = useState('');
  const [newOppExperience, setNewOppExperience] = useState('');
  const [newOppSalary, setNewOppSalary] = useState('');
  const [newOppDeadline, setNewOppDeadline] = useState('');
  const [newOppLink, setNewOppLink] = useState('');
  const [newOppWebsite, setNewOppWebsite] = useState('');
  const [newOppEmail, setNewOppEmail] = useState('');
  const [newOppLinks, setNewOppLinks] = useState('');
  const [newOppTerms, setNewOppTerms] = useState(false);
  const [isSubmittingOpp, setIsSubmittingOpp] = useState(false);

  // Saved & My Posts lists
  const [savedOppIds, setSavedOppIds] = useState<string[]>([]);

  // Emergency Support States
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [emSearch, setEmSearch] = useState('');
  const [emFilterGroup, setEmFilterGroup] = useState('All');
  const [selectedEm, setSelectedEm] = useState<any | null>(null);

  // Create Emergency Request Form States
  const [showPostEmModal, setShowPostEmModal] = useState(false);
  const [newEmType, setNewEmType] = useState('Blood Requirement');
  const [newEmPatientName, setNewEmPatientName] = useState('');
  const [newEmHospitalName, setNewEmHospitalName] = useState('');
  const [newEmBloodGroup, setNewEmBloodGroup] = useState('A+');
  const [newEmUnits, setNewEmUnits] = useState(1);
  const [newEmAddress, setNewEmAddress] = useState('');
  const [newEmCity, setNewEmCity] = useState('');
  const [newEmContactPerson, setNewEmContactPerson] = useState('');
  const [newEmPhone, setNewEmPhone] = useState('');
  const [newEmBefore, setNewEmBefore] = useState('');
  const [newEmNotes, setNewEmNotes] = useState('');
  const [newEmProof, setNewEmProof] = useState('');
  const [newEmInfo, setNewEmInfo] = useState('');
  const [isSubmittingEm, setIsSubmittingEm] = useState(false);

  // Notifications State
  const [dashboardNotifications, setDashboardNotifications] = useState<any[]>([
    { id: 'nt-1', text: 'Welcome to the new TSS Verified Ecosystem Dashboard!', date: 'Just now', unread: true },
    { id: 'nt-2', text: 'Review the Vetting Levels under Profile to check your digital card eligibility.', date: '1 day ago', unread: false }
  ]);
  
  // Resume studio states
  const [selectedTemplate, setSelectedTemplate] = useState<'FAANG' | 'Startup' | 'General'>('FAANG');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  
  // Settings edit states
  const [editName, setEditName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editGraduationYear, setEditGraduationYear] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editPortfolio, setEditPortfolio] = useState('');
  const [editResumeLink, setEditResumeLink] = useState('');
  const [editPhotoPath, setEditPhotoPath] = useState('');
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  // ATS Optimizer states
  const [jdInput, setJdInput] = useState('');
  const [atsAnalysis, setAtsAnalysis] = useState<any | null>(null);
  const [isAnalyzingAts, setIsAnalyzingAts] = useState(false);
  const [resumeSubTab, setResumeSubTab] = useState<'edit' | 'ats'>('edit');
  
  // Build Challenge state
  const [buildProblemPitch, setBuildProblemPitch] = useState('');
  const [buildTeamLinks, setBuildTeamLinks] = useState('');
  const [isSubmittingBuild, setIsSubmittingBuild] = useState(false);

  // Job board states
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<any | null>(null);
  const [coverLetterInput, setCoverLetterInput] = useState('');
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

  // Loyalty check-in states
  const [loginDays, setLoginDays] = useState(36);
  const [streak, setStreak] = useState(13);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  useEffect(() => {
    if (profile) {
      setLoginDays(profile.loginDays !== undefined ? profile.loginDays : 36);
      setStreak(profile.streak !== undefined ? profile.streak : 13);
      const todayStr = new Date().toISOString().split('T')[0];
      setHasCheckedInToday(profile.lastCheckinDate === todayStr);
    }
  }, [profile]);

  const handleDailyCheckIn = async () => {
    if (!profile) return;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const newDays = loginDays + 1;
    const newStreak = streak + 1;
    const newScore = (profile.communityScore || 20) + 10;
    
    setLoginDays(newDays);
    setStreak(newStreak);
    setHasCheckedInToday(true);
    
    try {
      const res = await fetch('/api/auth/update-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: profile.id,
          updates: {
            loginDays: newDays,
            streak: newStreak,
            lastCheckinDate: todayStr,
            communityScore: newScore
          }
        })
      });
      const data = await res.json();
      if (data.success && data.candidate) {
        setProfile(data.candidate);
        localStorage.setItem('tss_candidate_session', JSON.stringify(data.candidate));
        toast.success(`Check-in claimed! +10 community points added to your score.`);
      } else {
        toast.error(data.error || 'Failed to save check-in.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network connection error.');
    }
  };

  const getLoyaltyTier = (days: number) => {
    if (days <= 30) return { name: 'Spark', icon: '🌱', color: '#10b981', next: 'Builder', nextDays: 31, req: 30 };
    if (days <= 100) return { name: 'Builder', icon: '🔨', color: '#f77f00', next: 'Founder', nextDays: 101, req: 100 };
    if (days <= 365) return { name: 'Founder', icon: '🚀', color: '#7c3aed', next: 'Legend', nextDays: 366, req: 365 };
    return { name: 'Legend', icon: '⭐', color: '#f59e0b', next: '', nextDays: 365, req: 365 };
  };

  const tier = getLoyaltyTier(loginDays);

  // Check login on load & process query credentials (for direct validation email links)
  useEffect(() => {
    // 1. Check if URL has memberId & email parameters for auto-login
    const params = new URLSearchParams(window.location.search);
    const urlMemberId = params.get('memberId');
    const urlEmail = params.get('email');

    if (urlMemberId && urlEmail) {
      const cleanId = urlMemberId.trim().toUpperCase();
      const cleanEmail = urlEmail.trim().toLowerCase();
      
      setIsAuthenticating(true);
      fetch('/api/auth/candidate-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: cleanId, email: cleanEmail })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success('Successfully signed in via validation link!');
          localStorage.setItem('tss_candidate_session', JSON.stringify(data.candidate));
          setProfile(data.candidate);
          initializeSettings(data.candidate);
          
          // Clean URL parameters without reloading
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        } else {
          toast.error(data.error || 'Failed to authenticate via link.');
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Network connection error.');
      })
      .finally(() => {
        setIsAuthenticating(false);
      });
      return;
    }

    // 2. Fallback to existing localStorage session
    const savedSession = localStorage.getItem('tss_candidate_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setProfile(parsed);
        initializeSettings(parsed);

        // Sync candidate profile dynamically from server database on mount
        fetch(`/api/status-check?email=${encodeURIComponent(parsed.email)}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              const updatedProfile = {
                ...parsed,
                ...data
              };
              localStorage.setItem('tss_candidate_session', JSON.stringify(updatedProfile));
              setProfile(updatedProfile);
              initializeSettings(updatedProfile);
            }
          })
          .catch(err => console.error('Failed to sync candidate profile:', err));
      } catch (e) {
        console.error('Failed to parse session', e);
        localStorage.removeItem('tss_candidate_session');
      }
    }
  }, []);

  // Sync settings inputs when profile loaded
  const initializeSettings = (p: CandidateProfile) => {
    setEditName(p.fullName || '');
    setEditMobile(p.mobile || '');
    setEditCollege(p.college || '');
    setEditGraduationYear(p.graduationYear ? String(p.graduationYear) : '');
    setEditSkills(Array.isArray(p.skills) ? p.skills.join(', ') : '');
    setEditLinkedin(p.linkedin || '');
    setEditGithub(p.github || '');
    setEditPortfolio(p.portfolio || '');
    setEditResumeLink(p.resumeLink || p.resumePath || '');
    setEditPhotoPath(p.photoPath || '');

    // Emergency fields
    setEditBloodGroup(p.bloodGroup || p.roleDetails?.bloodGroup || 'Unknown');
    setEditEmergencyContact(p.emergencyContact || p.roleDetails?.emergencyContact || '');
    setEditAvailableBloodDonation(p.willingToDonate ? 'Yes' : 'No');
    setEditAvailablePlateletDonation(p.availableForEmergency ? 'Yes' : 'No');
    setEditLastDonationDate(p.lastDonationDate || p.roleDetails?.lastDonationDate || '');

    // Trust fields
    setEditBio(p.bio || '');
    setEditCoverImage(p.coverImage || '');
    setEditAchievements(Array.isArray(p.achievements) ? p.achievements.join(', ') : '');
    setEditCertificates(Array.isArray(p.certificates) ? p.certificates.join(', ') : '');
    setEditExperience(Array.isArray(p.experience) ? p.experience : []);
    setEditEducation(Array.isArray(p.education) ? p.education : []);
    setEditWillingToDonate(p.willingToDonate !== undefined ? !!p.willingToDonate : false);
    setEditAvailableForEmergency(p.availableForEmergency !== undefined ? !!p.availableForEmergency : false);
  };

  // Sync resume builder with current profile values
  useEffect(() => {
    if (profile) {
      setResumeData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        mobile: profile.mobile || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        portfolio: profile.portfolio || '',
        skills: getSkillsString(profile.skills),
        education: [
          {
            institution: profile.college || 'My University',
            degree: profile.highestQualification || 'Bachelor of Technology',
            year: profile.graduationYear ? String(profile.graduationYear) : '2026'
          }
        ],
        experience: [
          {
            company: 'The Student Spot (TSS)',
            role: 'Ecosystem Collaborator',
            duration: 'June 2026 - Present',
            description: 'Collaborated on deploying verified student identity features and networking systems.\nAssisted in building proof-of-work project sandboxes and organizing community cohorts.'
          }
        ],
        projects: [
          {
            title: 'TSS Innovate Portal',
            tech: 'React, Next.js, PostgreSQL, Supabase',
            description: 'Engineered a vetted credentials showcase for young founders, campus ambassadors, and partners.\nImplemented a dynamic multi-step verification and lookup engine.'
          }
        ]
      });
    } else {
      setResumeData(null);
    }
  }, [profile]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      toast.error('Please enter your registered email address.');
      return;
    }
    
    setIsAuthenticating(true);
    try {
      const res = await fetch('/api/auth/candidate-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim()
        })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Login Successful! Welcome, ' + data.candidate.fullName);
        localStorage.setItem('tss_candidate_session', JSON.stringify(data.candidate));
        setProfile(data.candidate);
        initializeSettings(data.candidate);
      } else {
        toast.error(data.error || 'Authentication failed. Please verify your details.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network connection error. Try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchOppsAndEmergencies = async () => {
    try {
      const resOpp = await fetch('/api/opportunities');
      const dataOpp = await resOpp.json();
      if (dataOpp.opportunities) {
        setOpportunities(dataOpp.opportunities);
      }

      const resEm = await fetch('/api/emergencies');
      const dataEm = await resEm.json();
      if (dataEm.emergencies) {
        setEmergencies(dataEm.emergencies);
      }
    } catch (err) {
      console.error('Failed to load portal data:', err);
    }
  };

  // Sync portal content when profile is set
  useEffect(() => {
    if (profile) {
      fetchOppsAndEmergencies();
      
      const saved = localStorage.getItem(`tss_saved_opps_${profile.id}`);
      if (saved) {
        try {
          setSavedOppIds(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [profile]);

  const handlePostOpportunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!newOppTitle.trim() || !newOppDesc.trim() || !newOppOrg.trim() || !newOppLocation.trim() || !newOppSalary.trim() || !newOppDeadline.trim() || !newOppLink.trim()) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }
    if (!newOppTerms) {
      toast.error('You must accept the terms & conditions.');
      return;
    }
    
    setIsSubmittingOpp(true);
    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newOppType,
          title: newOppTitle.trim(),
          description: newOppDesc.trim(),
          organization: newOppOrg.trim(),
          location: newOppLocation.trim(),
          remoteOption: newOppRemote,
          skillsRequired: newOppSkills.split(',').map(s => s.trim()).filter(Boolean),
          experienceRequired: newOppExperience.trim(),
          salaryStipend: newOppSalary.trim(),
          deadline: newOppDeadline,
          applyLink: newOppLink.trim(),
          website: newOppWebsite.trim(),
          contactEmail: newOppEmail.trim(),
          supportingLinks: newOppLinks.trim(),
          postedBy: profile.id
        })
      });
      const data = await res.json();
      if (data.success && data.opportunity) {
        toast.success('Opportunity submitted successfully! Pending admin approval.');
        setOpportunities(prev => [data.opportunity, ...prev]);
        setShowPostOppModal(false);
        setNewOppTitle('');
        setNewOppDesc('');
        setNewOppOrg('');
        setNewOppLocation('');
        setNewOppSkills('');
        setNewOppExperience('');
        setNewOppSalary('');
        setNewOppDeadline('');
        setNewOppLink('');
        setNewOppWebsite('');
        setNewOppEmail('');
        setNewOppLinks('');
        setNewOppTerms(false);
      } else {
        toast.error(data.error || 'Failed to submit opportunity.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network connection error.');
    } finally {
      setIsSubmittingOpp(false);
    }
  };

  const handlePostEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!newEmPatientName.trim() || !newEmHospitalName.trim() || !newEmAddress.trim() || !newEmCity.trim() || !newEmContactPerson.trim() || !newEmPhone.trim() || !newEmBefore.trim()) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmittingEm(true);
    try {
      const res = await fetch('/api/emergencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newEmType,
          patientName: newEmPatientName.trim(),
          hospitalName: newEmHospitalName.trim(),
          bloodGroup: newEmBloodGroup,
          unitsRequired: newEmUnits,
          hospitalAddress: newEmAddress.trim(),
          city: newEmCity.trim(),
          contactPerson: newEmContactPerson.trim(),
          phoneNumber: newEmPhone.trim(),
          requiredBefore: newEmBefore,
          medicalNotes: newEmNotes.trim(),
          proofUrl: newEmProof.trim(),
          additionalInfo: newEmInfo.trim(),
          postedBy: profile.id
        })
      });
      const data = await res.json();
      if (data.success && data.emergency) {
        toast.success('Emergency request submitted successfully! Pending details audit.');
        setEmergencies(prev => [data.emergency, ...prev]);
        setShowPostEmModal(false);
        setNewEmPatientName('');
        setNewEmHospitalName('');
        setNewEmAddress('');
        setNewEmCity('');
        setNewEmContactPerson('');
        setNewEmPhone('');
        setNewEmBefore('');
        setNewEmNotes('');
        setNewEmProof('');
        setNewEmInfo('');
      } else {
        toast.error(data.error || 'Failed to submit emergency request.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network connection error.');
    } finally {
      setIsSubmittingEm(false);
    }
  };

  const handleRegisterDonor = (emId: string) => {
    if (!profile) return;
    
    setEmergencies(prev => prev.map(em => {
      if (em.id === emId) {
        const list = em.potentialDonors || [];
        const exists = list.includes(profile.id);
        const newList = exists 
          ? list.filter((id: string) => id !== profile.id)
          : [...list, profile.id];
        
        if (!exists) {
          toast.success('Thank you! Your availability has been registered and the contact person has been notified.');
        } else {
          toast.success('Your donor registration has been withdrawn.');
        }
        return {
          ...em,
          potentialDonors: newList,
          donorsCount: newList.length
        };
      }
      return em;
    }));
  };

  const handleToggleSaveOpportunity = (oppId: string) => {
    if (!profile) return;
    const isSaved = savedOppIds.includes(oppId);
    let newList;
    if (isSaved) {
      newList = savedOppIds.filter(id => id !== oppId);
      toast.success('Removed opportunity from saved bookmarks.');
    } else {
      newList = [...savedOppIds, oppId];
      toast.success('Opportunity saved successfully.');
    }
    setSavedOppIds(newList);
    localStorage.setItem(`tss_saved_opps_${profile.id}`, JSON.stringify(newList));
  };

  const handleLogout = () => {
    localStorage.removeItem('tss_candidate_session');
    setProfile(null);
    setMemberIdInput('');
    setEmailInput('');
    toast.success('Logged out successfully.');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (!editName.trim() || !editMobile.trim()) {
      toast.error('Full Name and Mobile cannot be empty.');
      return;
    }

    setIsUpdatingSettings(true);
    try {
      const updates = {
        fullName: editName,
        mobile: editMobile,
        college: editCollege,
        graduationYear: editGraduationYear,
        skills: editSkills,
        linkedin: editLinkedin,
        github: editGithub,
        portfolio: editPortfolio,
        resumeLink: editResumeLink,
        photoPath: editPhotoPath,
        bloodGroup: editBloodGroup,
        emergencyContact: editEmergencyContact,
        willingToDonate: editWillingToDonate,
        availableForEmergency: editAvailableForEmergency,
        lastDonationDate: editLastDonationDate,
        bio: editBio,
        coverImage: editCoverImage,
        achievements: editAchievements.split(',').map(s => s.trim()).filter(Boolean),
        certificates: editCertificates.split(',').map(s => s.trim()).filter(Boolean),
        experience: editExperience,
        education: editEducation
      };

      const res = await fetch('/api/auth/update-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profile.id, updates })
      });
      const data = await res.json();

      if (data.success && data.candidate) {
        toast.success(data.message || 'Profile settings updated successfully!');
        localStorage.setItem('tss_candidate_session', JSON.stringify(data.candidate));
        setProfile(data.candidate);
      } else if (data.success) {
        toast.success('Profile settings updated successfully!');
        const updatedProfile = {
          ...profile,
          ...updates,
          graduationYear: editGraduationYear ? Number(editGraduationYear) : null,
          skills: editSkills.split(',').map(s => s.trim()).filter(Boolean)
        };
        localStorage.setItem('tss_candidate_session', JSON.stringify(updatedProfile));
        setProfile(updatedProfile as any);
      } else {
        toast.error(data.error || 'Failed to save updates.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network connection error. Try again.');
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const getReapplyCountdown = () => {
    if (!profile || profile.status !== 'Rejected') return null;
    const rejDateStr = profile.roleDetails?.rejectionDate;
    if (!rejDateStr) return null;

    if (profile.roleDetails?.allowEarlyReapply) return null;

    const rejTime = new Date(rejDateStr).getTime();
    const now = Date.now();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    const remaining = rejTime + threeDaysMs - now;

    if (remaining <= 0) return null;

    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    return { days, hours, minutes, remaining };
  };

  const handleReapplySubmit = async () => {
    if (!profile) return;
    
    setIsUpdatingSettings(true);
    try {
      const res = await fetch('/api/admin/candidates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: profile.id,
          action: 'review'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Your profile reapplication has been successfully submitted.');
        localStorage.setItem('tss_candidate_session', JSON.stringify(data.candidate));
        setProfile(data.candidate);
      } else {
        toast.error(data.error || 'Failed to submit reapplication.');
      }
    } catch {
      toast.error('Network connection error.');
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!profile) return;
    const confirmDelete = window.confirm(
      "Deleting your TSS profile will permanently remove:\n- Personal Information\n- Verification Status\n- Resume Link\n- TSS ID\n- Digital ID Card\n\nThis action cannot be undone. Are you sure you want to proceed?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch('/api/admin/candidates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: profile.id, action: 'delete' })
      });
      if (res.ok) {
        toast.success('Your TSS profile has been permanently deleted.');
        localStorage.removeItem('tss_candidate_session');
        window.location.href = '/';
      } else {
        toast.error('Failed to delete profile.');
      }
    } catch (err) {
      toast.error('Network connection error.');
    }
  };

  const handleResetResume = () => {
    if (!profile) return;
    const confirmReset = window.confirm(
      "Are you sure you want to reset your resume details to default profile values?"
    );
    if (!confirmReset) return;

    setResumeData({
      fullName: profile.fullName || '',
      email: profile.email || '',
      mobile: profile.mobile || '',
      linkedin: profile.linkedin || '',
      github: profile.github || '',
      portfolio: profile.portfolio || '',
      skills: getSkillsString(profile.skills),
      education: [
        {
          institution: profile.college || 'My University',
          degree: profile.highestQualification || 'Bachelor of Technology',
          year: profile.graduationYear ? String(profile.graduationYear) : '2026'
        }
      ],
      experience: [
        {
          company: 'The Student Spot (TSS)',
          role: 'Ecosystem Collaborator',
          duration: 'June 2026 - Present',
          description: 'Collaborated on deploying verified student identity features and networking systems.\nAssisted in building proof-of-work project sandboxes and organizing community cohorts.'
        }
      ],
      projects: [
        {
          title: 'TSS Innovate Portal',
          tech: 'React, Next.js, PostgreSQL, Supabase',
          description: 'Engineered a vetted credentials showcase for young founders, campus ambassadors, and partners.\nImplemented a dynamic multi-step verification and lookup engine.'
        }
      ]
    });
    toast.success('Resume details reset successfully.');
  };

  const handleAtsAnalysis = () => {
    if (!jdInput.trim() || !resumeData) {
      toast.error('Please paste a Job Description and ensure resume details are filled.');
      return;
    }
    setIsAnalyzingAts(true);
    
    setTimeout(() => {
      const jdClean = jdInput.toLowerCase();
      const commonTechKeywords = [
        'react', 'next.js', 'typescript', 'javascript', 'python', 'django', 'flask', 'fastapi',
        'node.js', 'express', 'postgresql', 'supabase', 'mongodb', 'docker', 'kubernetes', 'aws',
        'azure', 'gcp', 'graphql', 'rest api', 'git', 'ci/cd', 'testing', 'cypress', 'jest',
        'tailwind', 'css', 'html', 'java', 'spring boot', 'c++', 'go', 'rust', 'ruby', 'rails',
        'redux', 'sql', 'nosql', 'redis', 'elasticsearch', 'machine learning', 'ai', 'devops',
        'agile', 'scrum', 'system design', 'microservices'
      ];
      
      const foundInJd = commonTechKeywords.filter(kw => jdClean.includes(kw));
      
      const resumeContent = [
        resumeData.fullName.toLowerCase(),
        resumeData.skills.toLowerCase(),
        ...resumeData.education.map(e => e.institution.toLowerCase() + ' ' + e.degree.toLowerCase()),
        ...resumeData.experience.map(e => e.company.toLowerCase() + ' ' + e.role.toLowerCase() + ' ' + e.description.toLowerCase()),
        ...resumeData.projects.map(p => p.title.toLowerCase() + ' ' + p.tech.toLowerCase() + ' ' + p.description.toLowerCase())
      ].join(' ');

      const matched = foundInJd.filter(kw => resumeContent.includes(kw));
      const missing = foundInJd.filter(kw => !resumeContent.includes(kw));

      let score = 50; 
      if (foundInJd.length > 0) {
        score += Math.round((matched.length / foundInJd.length) * 40);
      } else {
        score += 30; 
      }

      const hasLinkedIn = !!resumeData.linkedin;
      const hasGitHub = !!resumeData.github;
      const hasPortfolio = !!resumeData.portfolio;
      const bulletsCount = resumeData.experience.reduce((acc, exp) => acc + exp.description.split('\n').filter(Boolean).length, 0);

      if (hasLinkedIn) score += 3;
      if (hasGitHub) score += 3;
      if (hasPortfolio) score += 4;
      
      score = Math.min(100, score);

      setAtsAnalysis({
        score,
        matched,
        missing,
        hasLinkedIn,
        hasGitHub,
        hasPortfolio,
        bulletsCount,
        recommendations: [
          missing.length > 0 ? `Incorporate missing keywords: ${missing.slice(0, 4).join(', ')} directly into your skills block.` : 'Great job! You match all the key terms extracted from the description.',
          bulletsCount < 4 ? 'Add more metrics-driven bullets in your Experience section (e.g. "Improved performance by 15%").' : 'Experience section bullets are descriptive and complete.',
          !hasGitHub ? 'Provide a public GitHub link to increase credibility for developer/engineering roles.' : 'GitHub profile is connected.',
          !hasPortfolio ? 'Include a personal portfolio web URL to showcase live deployment projects.' : 'Portfolio website is configured.'
        ]
      });
      setIsAnalyzingAts(false);
      toast.success('ATS match analysis completed! Review findings.');
    }, 800);
  };

  const renderStatusBanner = () => {
    if (!profile) return null;
    
    const status = profile.status;
    if (status === 'Verified') return null;

    let bannerColor = 'var(--primary-light)';
    let borderColor = 'rgba(var(--primary-rgb), 0.2)';
    let textColor = 'var(--text-main)';
    let title = 'Account Submitted';
    let desc = 'Your registration parameters are currently queued for vetting review.';

    if (status === 'Under Review') {
      bannerColor = 'rgba(249, 115, 22, 0.08)';
      borderColor = 'rgba(249, 115, 22, 0.2)';
      title = 'Account Under Review';
      desc = 'Our admin verification team is actively auditing your portfolios and credentials details.';
    } else if (status === 'Needs Changes') {
      bannerColor = 'rgba(234, 179, 8, 0.08)';
      borderColor = 'rgba(234, 179, 8, 0.2)';
      title = 'Action Required: Profile Changes Requested';
      desc = `The review board requested changes: "${profile.notes || 'Please ensure your resume link is public and accessible.'}" Update your settings parameters below to resubmit.`;
    } else if (status === 'Resubmitted') {
      bannerColor = 'rgba(37, 99, 235, 0.08)';
      borderColor = 'rgba(37, 99, 235, 0.2)';
      title = 'Profile Updates Resubmitted';
      desc = 'Your updated parameters have been successfully queued for audit review.';
    } else if (status === 'Suspended') {
      bannerColor = 'rgba(107, 114, 128, 0.08)';
      borderColor = 'rgba(107, 114, 128, 0.2)';
      title = 'Verification Suspended';
      desc = 'Your TSS account verification audit has been suspended. Please check notes or contact support.';
    } else if (status === 'Deleted') {
      bannerColor = 'rgba(0, 0, 0, 0.08)';
      borderColor = 'rgba(0, 0, 0, 0.2)';
      title = 'Profile Marked Deleted';
      desc = 'Your TSS profile details have been scheduled for deletion removal.';
    } else if (status === 'Rejected') {
      bannerColor = 'rgba(239, 68, 68, 0.08)';
      borderColor = 'rgba(239, 68, 68, 0.2)';
      title = 'Profile Verification Rejected';
      
      const reasons = profile.roleDetails?.rejectionReasons || [];
      const countdown = getReapplyCountdown();
      
      return (
        <div style={{ backgroundColor: bannerColor, border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', color: textColor }}>
          <strong style={{ display: 'block', fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#ef4444' }}>
            {title}
          </strong>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <p style={{ margin: 0 }}>Your profile vetting could not be verified.</p>
            {reasons.length > 0 && (
              <div>
                <strong>Reasons:</strong>
                <ul style={{ margin: '0.25rem 0 0 1.25rem', paddingLeft: 0 }}>
                  {reasons.map((r: string) => <li key={r}>{r}</li>)}
                </ul>
              </div>
            )}
            {profile.notes && (
              <p style={{ margin: 0 }}>
                <strong>Additional Notes:</strong> {profile.notes}
              </p>
            )}

            {countdown ? (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.04)' }}>
                <strong>Reapplication Locked:</strong> You can edit your profile details and reapply after the cooling period ends in:{' '}
                <span style={{ fontWeight: 700, color: '#ef4444' }}>
                  {countdown.days}d {countdown.hours}h {countdown.minutes}m
                </span>
              </div>
            ) : (
              <div style={{ marginTop: '0.75rem' }}>
                <button 
                  onClick={handleReapplySubmit}
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', color: '#ffffff' }}
                >
                  Submit Reapplication Now
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={{ backgroundColor: bannerColor, border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <ShieldAlert style={{ color: borderColor.includes('249') ? '#f97316' : 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} size={24} />
        <div>
          <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.2rem', fontWeight: 700 }}>{title}</strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{desc}</span>
        </div>
      </div>
    );
  };

  const fetchJobsData = async () => {
    if (!profile) return;
    setLoadingJobs(true);
    try {
      const res = await fetch(`/api/jobs?candidateId=${profile.id}`);
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
      if (data.applications) {
        setAppliedJobs(data.applications);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      toast.error('Failed to load jobs list.');
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !selectedJobForApply) return;
    
    if (profile.status !== 'Verified') {
      toast.error('Only Verified members can apply to jobs. Please wait for admin approval.');
      return;
    }

    setIsSubmittingApplication(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJobForApply.id,
          candidateId: profile.id,
          coverLetter: coverLetterInput
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Your application was submitted successfully!');
        setSelectedJobForApply(null);
        setCoverLetterInput('');
        fetchJobsData();
      } else {
        toast.error(data.error || 'Failed to submit application.');
      }
    } catch (err) {
      console.error('Apply error:', err);
      toast.error('Failed to submit application due to a network error.');
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'opportunity-hub' && profile) {
      fetchJobsData();
    }
  }, [activeTab, profile]);

  // Resume Studio callbacks
  const handleFieldChange = (field: keyof ResumeData, value: string) => {
    if (!resumeData) return;
    setResumeData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleNestedChange = (type: 'education' | 'experience' | 'projects', index: number, field: string, value: string) => {
    if (!resumeData) return;
    setResumeData((prev) => {
      if (!prev) return null;
      const list = [...prev[type]] as any[];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [type]: list };
    });
  };

  const addListItem = (type: 'education' | 'experience' | 'projects') => {
    if (!resumeData) return;
    setResumeData((prev) => {
      if (!prev) return null;
      const newItem = type === 'education'
        ? { institution: '', degree: '', year: '' }
        : type === 'experience'
          ? { company: '', role: '', duration: '', description: '' }
          : { title: '', tech: '', description: '' };
      return { ...prev, [type]: [...prev[type], newItem] } as any;
    });
  };

  const deleteListItem = (type: 'education' | 'experience' | 'projects', index: number) => {
    if (!resumeData) return;
    setResumeData((prev) => {
      if (!prev) return null;
      const list = [...prev[type]];
      list.splice(index, 1);
      return { ...prev, [type]: list } as any;
    });
  };

  // Virtual card PDF download
  const handleDownloadPdf = async () => {
    const printElement = document.getElementById('print-area');
    if (!printElement) {
      toast.error('Card print area not found.');
      return;
    }

    toast.info('Preparing Digital ID card...');

    // Save original styles of the live container and children
    const originalDisplay = printElement.style.display;
    const originalFlexWrap = printElement.style.flexWrap;
    const originalGap = printElement.style.gap;
    const originalJustify = printElement.style.justifyContent;
    const originalWidth = printElement.style.width;
    const originalPadding = printElement.style.padding;
    const originalBg = printElement.style.backgroundColor;
    const originalMargin = printElement.style.margin;

    const frontCard = document.getElementById('tss-id-card-front');
    const backCard = document.getElementById('tss-id-card-back');

    const originalFrontMargin = frontCard ? frontCard.style.margin : '';
    const originalFrontDisplay = frontCard ? frontCard.style.display : '';
    const originalFrontWidth = frontCard ? frontCard.style.width : '';
    const originalFrontHeight = frontCard ? frontCard.style.height : '';

    const originalBackMargin = backCard ? backCard.style.margin : '';
    const originalBackDisplay = backCard ? backCard.style.display : '';
    const originalBackWidth = backCard ? backCard.style.width : '';
    const originalBackHeight = backCard ? backCard.style.height : '';

    // Apply temporary layout overrides to stack cards vertically inside a 440px viewport block
    printElement.style.display = 'block';
    printElement.style.width = '440px';
    printElement.style.padding = '20px';
    printElement.style.backgroundColor = '#f5f5f7';
    printElement.style.margin = '0 auto';

    if (frontCard) {
      frontCard.style.margin = '0 0 20px 0';
      frontCard.style.display = 'block';
      frontCard.style.width = '440px';
      frontCard.style.height = '270px';
    }
    if (backCard) {
      backCard.style.margin = '0';
      backCard.style.display = 'block';
      backCard.style.width = '440px';
      backCard.style.height = '270px';
    }

    try {
      // Dynamically import local package client-side
      // @ts-ignore
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;

      const opt = {
        margin:       10,
        filename:     `TSS_Card_${profile?.memberId || 'pending'}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { 
          scale: 2.5, 
          useCORS: true, 
          backgroundColor: '#f5f5f7',
          logging: false
        },
        jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().from(printElement).set(opt).save();

      // Restore original styles of container and children
      printElement.style.display = originalDisplay;
      printElement.style.flexWrap = originalFlexWrap;
      printElement.style.gap = originalGap;
      printElement.style.justifyContent = originalJustify;
      printElement.style.width = originalWidth;
      printElement.style.padding = originalPadding;
      printElement.style.backgroundColor = originalBg;
      printElement.style.margin = originalMargin;

      if (frontCard) {
        frontCard.style.margin = originalFrontMargin;
        frontCard.style.display = originalFrontDisplay;
        frontCard.style.width = originalFrontWidth;
        frontCard.style.height = originalFrontHeight;
      }
      if (backCard) {
        backCard.style.margin = originalBackMargin;
        backCard.style.display = originalBackDisplay;
        backCard.style.width = originalBackWidth;
        backCard.style.height = originalBackHeight;
      }

      toast.success('Digital Card PDF Downloaded!');
    } catch (err) {
      console.error('PDF creation error:', err);
      // Restore original styles on error
      printElement.style.display = originalDisplay;
      printElement.style.flexWrap = originalFlexWrap;
      printElement.style.gap = originalGap;
      printElement.style.justifyContent = originalJustify;
      printElement.style.width = originalWidth;
      printElement.style.padding = originalPadding;
      printElement.style.backgroundColor = originalBg;
      printElement.style.margin = originalMargin;

      if (frontCard) {
        frontCard.style.margin = originalFrontMargin;
        frontCard.style.display = originalFrontDisplay;
        frontCard.style.width = originalFrontWidth;
        frontCard.style.height = originalFrontHeight;
      }
      if (backCard) {
        backCard.style.margin = originalBackMargin;
        backCard.style.display = originalBackDisplay;
        backCard.style.width = originalBackWidth;
        backCard.style.height = originalBackHeight;
      }

      toast.error('PDF generation failed.');
    }
  };

  // Resume PDF download
  const handleDownloadResumePdf = () => {
    if (!resumeData) return;
    toast.info('Generating your resume PDF...');

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      // @ts-ignore
      const html2pdf = window.html2pdf;
      const resumeElement = document.getElementById('tss-resume-preview');
      if (!resumeElement) return;

      const opt = {
        margin: [0.4, 0.4, 0.4, 0.4],
        filename: `TSS_Resume_${resumeData.fullName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2.5, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().from(resumeElement).set(opt).save()
        .then(() => toast.success('Resume downloaded!'))
        .catch(() => toast.error('Resume PDF download failed.'));
    };
    document.body.appendChild(script);
  };

  const handleBuildSandboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildProblemPitch.trim()) {
      toast.error('Please write a brief pitch for your sandbox project.');
      return;
    }
    setIsSubmittingBuild(true);
    setTimeout(() => {
      toast.success('Build Sandbox Project proposal submitted successfully!');
      setBuildProblemPitch('');
      setBuildTeamLinks('');
      setIsSubmittingBuild(false);
    }, 1500);
  };

  // Resume render helpers
  const renderFaangTemplate = () => {
    if (!resumeData) return null;
    return (
      <div className={styles.faangContainer}>
        <div className={styles.faangHeader}>
          <h1>{resumeData.fullName}</h1>
          <div className={styles.faangContact}>
            {resumeData.email && <span>{resumeData.email}</span>}
            {resumeData.mobile && <span> | {resumeData.mobile}</span>}
            {resumeData.linkedin && <span> | <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></span>}
            {resumeData.github && <span> | <a href={resumeData.github} target="_blank" rel="noopener noreferrer">GitHub</a></span>}
            {resumeData.portfolio && <span> | <a href={resumeData.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></span>}
          </div>
        </div>

        <div className={styles.faangSection}>
          <h2 className={styles.faangSectionTitle}>EDUCATION</h2>
          {resumeData.education.map((edu, i) => (
            <div key={i} className={styles.faangItem}>
              <div className={styles.faangItemRow}>
                <strong>{edu.institution}</strong>
                <span>{edu.year}</span>
              </div>
              <div className={styles.faangItemRow}>
                <span>{edu.degree}</span>
              </div>
            </div>
          ))}
        </div>

        {resumeData.experience.length > 0 && (
          <div className={styles.faangSection}>
            <h2 className={styles.faangSectionTitle}>EXPERIENCE</h2>
            {resumeData.experience.map((exp, i) => (
              <div key={i} className={styles.faangItem}>
                <div className={styles.faangItemRow}>
                  <strong>{exp.company}</strong>
                  <span>{exp.duration}</span>
                </div>
                <div className={styles.faangItemRow}>
                  <em>{exp.role}</em>
                </div>
                {exp.description && (
                  <ul className={styles.faangBullets}>
                    {exp.description.split('\n').filter(Boolean).map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {resumeData.projects.length > 0 && (
          <div className={styles.faangSection}>
            <h2 className={styles.faangSectionTitle}>PROJECTS</h2>
            {resumeData.projects.map((proj, i) => (
              <div key={i} className={styles.faangItem}>
                <div className={styles.faangItemRow}>
                  <strong>{proj.title}</strong>
                  <span>{proj.tech}</span>
                </div>
                {proj.description && (
                  <ul className={styles.faangBullets}>
                    {proj.description.split('\n').filter(Boolean).map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {resumeData.skills && (
          <div className={styles.faangSection}>
            <h2 className={styles.faangSectionTitle}>TECHNICAL SKILLS</h2>
            <p className={styles.faangSkillsList}>
              <strong>Skills:</strong> {resumeData.skills}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderStartupTemplate = () => {
    if (!resumeData) return null;
    return (
      <div className={styles.startupContainer}>
        <div className={styles.startupHeader}>
          <h1>{resumeData.fullName}</h1>
          <div className={styles.startupLinks}>
            {resumeData.email && <span>📧 {resumeData.email}</span>}
            {resumeData.mobile && <span>📱 {resumeData.mobile}</span>}
            {resumeData.linkedin && <span>🔗 <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></span>}
            {resumeData.github && <span>💻 <a href={resumeData.github} target="_blank" rel="noopener noreferrer">GitHub</a></span>}
            {resumeData.portfolio && <span>🌐 <a href={resumeData.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></span>}
          </div>
        </div>

        <div className={styles.startupBodyGrid}>
          <div className={styles.startupLeftColumn}>
            {resumeData.skills && (
              <div className={styles.startupSubSection}>
                <h3>SKILLS</h3>
                <div className={styles.startupSkillsContainer}>
                  {resumeData.skills.split(',').map((skill, idx) => (
                    <span key={idx} className={styles.startupSkillBadge}>{skill.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.startupSubSection}>
              <h3>EDUCATION</h3>
              {resumeData.education.map((edu, i) => (
                <div key={i} className={styles.startupEduItem}>
                  <div className={styles.startupEduYear}>{edu.year}</div>
                  <div className={styles.startupEduInst}>{edu.institution}</div>
                  <div className={styles.startupEduDegree}>{edu.degree}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.startupRightColumn}>
            {resumeData.experience.length > 0 && (
              <div className={styles.startupSubSection}>
                <h3>EXPERIENCE</h3>
                {resumeData.experience.map((exp, i) => (
                  <div key={i} className={styles.startupWorkItem}>
                    <div className={styles.startupItemTitleRow}>
                      <strong>{exp.role}</strong>
                      <span>{exp.duration}</span>
                    </div>
                    <div className={styles.startupItemOrg}>{exp.company}</div>
                    {exp.description && (
                      <ul className={styles.startupBullets}>
                        {exp.description.split('\n').filter(Boolean).map((bullet, j) => (
                          <li key={j}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {resumeData.projects.length > 0 && (
              <div className={styles.startupSubSection}>
                <h3>PROJECTS</h3>
                {resumeData.projects.map((proj, i) => (
                  <div key={i} className={styles.startupWorkItem}>
                    <div className={styles.startupItemTitleRow}>
                      <strong>{proj.title}</strong>
                      <span className={styles.startupTechTag}>{proj.tech}</span>
                    </div>
                    {proj.description && (
                      <ul className={styles.startupBullets}>
                        {proj.description.split('\n').filter(Boolean).map((bullet, j) => (
                          <li key={j}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGeneralTemplate = () => {
    if (!resumeData) return null;
    return (
      <div className={styles.generalContainer}>
        <div className={styles.generalHeader}>
          <h1>{resumeData.fullName}</h1>
          <p className={styles.generalSubTitle}>Professional Resume</p>
          <div className={styles.generalContactGrid}>
            {resumeData.email && <span><strong>Email:</strong> {resumeData.email}</span>}
            {resumeData.mobile && <span><strong>Phone:</strong> {resumeData.mobile}</span>}
            {resumeData.linkedin && <span><strong>LinkedIn:</strong> <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer">{resumeData.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
            {resumeData.github && <span><strong>GitHub:</strong> <a href={resumeData.github} target="_blank" rel="noopener noreferrer">{resumeData.github.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
            {resumeData.portfolio && <span><strong>Portfolio:</strong> <a href={resumeData.portfolio} target="_blank" rel="noopener noreferrer">{resumeData.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
          </div>
        </div>

        <div className={styles.generalBody}>
          <div className={styles.generalSection}>
            <h3 className={styles.generalSectionTitle}>Professional Experience</h3>
            {resumeData.experience.map((exp, i) => (
              <div key={i} className={styles.generalItem}>
                <div className={styles.generalItemHeader}>
                  <strong>{exp.role}</strong>
                  <span>{exp.duration}</span>
                </div>
                <div className={styles.generalItemSub}>{exp.company}</div>
                {exp.description && (
                  <ul className={styles.generalBullets}>
                    {exp.description.split('\n').filter(Boolean).map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className={styles.generalSection}>
            <h3 className={styles.generalSectionTitle}>Academic Projects</h3>
            {resumeData.projects.map((proj, i) => (
              <div key={i} className={styles.generalItem}>
                <div className={styles.generalItemHeader}>
                  <strong>{proj.title}</strong>
                  <span className={styles.generalTech}>{proj.tech}</span>
                </div>
                {proj.description && (
                  <ul className={styles.generalBullets}>
                    {proj.description.split('\n').filter(Boolean).map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className={styles.generalSection}>
            <h3 className={styles.generalSectionTitle}>Education</h3>
            {resumeData.education.map((edu, i) => (
              <div key={i} className={styles.generalItem}>
                <div className={styles.generalItemHeader}>
                  <strong>{edu.degree}</strong>
                  <span>{edu.year}</span>
                </div>
                <div className={styles.generalItemSub}>{edu.institution}</div>
              </div>
            ))}
          </div>

          {resumeData.skills && (
            <div className={styles.generalSection}>
              <h3 className={styles.generalSectionTitle}>Core Competencies & Skills</h3>
              <p className={styles.generalSkillsText}>{resumeData.skills}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderLockedState = (tabName: string) => {
    return (
      <div className={styles.lockedStateCard}>
        <Lock size={40} className={styles.lockStateIcon} />
        <h3>{tabName} is Locked</h3>
        <p>
          This workspace panel is only available for verified members. 
          Your candidate registration status is currently <strong>PENDING REVIEW</strong>.
        </p>
        <div className={styles.pendingAuditNotice}>
          Vetting audits usually take 24-48 hours. You will receive an approval email once validated.
        </div>
      </div>
    );
  };

  // RENDERING
  return (
    <div className={styles.dashboardPage}>
      {/* Dynamic Header Banner */}
      <section className={styles.dashboardHeader}>
        <div className={styles.dashboardContainer}>
          <span className={styles.subTitle}>TSS Candidate Portal</span>
          <h1>{profile ? `Welcome Back, ${profile.fullName}` : 'Sign In to Your Workspace'}</h1>
          <p className={styles.tagline}>
            {profile 
              ? `Status: ${profile.status} | Role: ${profile.role} ${profile.memberId ? `| Member ID: ${profile.memberId}` : ''}`
              : 'Access your TSS virtual ID card, dynamic resume builder studio, and vetting levels logs.'}
          </p>
        </div>
      </section>

      <section className={styles.dashboardContent}>
        <div className={styles.dashboardContainer}>
          
          {/* 1. SIGN IN INTERFACE */}
          {!profile ? (
            <div className={styles.loginCard}>
              <div className={styles.loginHeader}>
                <Shield className={styles.lockIcon} size={40} />
                <h2>Verified Account Sign In</h2>
                <p>Enter your registered email to unlock your candidate dashboard.</p>
              </div>

              <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Registered Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@college.com" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className={styles.formInput}
                    required
                  />
                </div>

                <button type="submit" disabled={isAuthenticating} className="btn btn-primary">
                  {isAuthenticating ? 'Signing In...' : 'Verify & Enter Dashboard'}
                </button>
              </form>
              
              <div className={styles.loginHelp}>
                <p>
                  Haven't registered or been verified yet? <Link href="/register">Register here</Link> or <Link href="/status">check status</Link>.
                </p>
              </div>
            </div>
          ) : (
            
            // 2. LOGGED IN PORTAL WORKSPACE
            <div className={styles.dashboardLayout}>
              
              {/* Left Sidebar */}
              <aside className={styles.sidebar}>
                <div className={styles.sidebarBrand}>
                  <Award className={styles.brandIcon} size={20} />
                  <span>TSS MEMBER PORTAL</span>
                </div>
                
                <nav className={styles.sidebarMenu} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', paddingRight: '0.25rem' }}>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('dashboard-home')}
                    className={`${styles.sidebarItem} ${activeTab === 'dashboard-home' ? styles.sidebarItemActive : ''}`}
                  >
                    <Layers size={18} />
                    <span>Dashboard</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setActiveTab('profile'); setProfileSubTab('details'); }}
                    className={`${styles.sidebarItem} ${activeTab === 'profile' ? styles.sidebarItemActive : ''}`}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setActiveTab('opportunity-hub'); setOppsSubTab('feed'); }}
                    className={`${styles.sidebarItem} ${activeTab === 'opportunity-hub' ? styles.sidebarItemActive : ''}`}
                  >
                    <Briefcase size={18} />
                    <span>Opportunity Hub</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setActiveTab('emergency-support'); setEmergencySubTab('feed'); }}
                    className={`${styles.sidebarItem} ${activeTab === 'emergency-support' ? styles.sidebarItemActive : ''}`}
                    style={{ borderLeftColor: activeTab === 'emergency-support' ? '#ef4444' : 'transparent' }}
                  >
                    <ShieldAlert size={18} style={{ color: activeTab === 'emergency-support' ? '#ef4444' : 'var(--text-muted)' }} />
                    <span style={{ color: activeTab === 'emergency-support' ? '#ef4444' : 'inherit', fontWeight: activeTab === 'emergency-support' ? 700 : 'normal' }}>Emergency Support</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setActiveTab('notifications')}
                    className={`${styles.sidebarItem} ${activeTab === 'notifications' ? styles.sidebarItemActive : ''}`}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                      <Calendar size={18} />
                      <span>Notifications</span>
                      {dashboardNotifications.some(n => n.unread) && (
                        <span style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%', marginLeft: 'auto' }}></span>
                      )}
                    </span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className={`${styles.sidebarItem} ${activeTab === 'settings' ? styles.sidebarItemActive : ''}`}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                </nav>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                  <LogOut size={16} /> Logout
                </button>
              </aside>

              {/* Right View Panel */}
              <main className={styles.mainPanel}>
                
                {activeTab === 'opportunity-hub' && (
                  <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', paddingBottom: '0.5rem', overflowX: 'auto' }}>
                    <button 
                      type="button"
                      onClick={() => setOppsSubTab('feed')}
                      style={{ padding: '0.5rem 1.25rem', background: 'none', border: 'none', borderBottom: oppsSubTab === 'feed' ? '2px solid var(--primary-pale)' : '2px solid transparent', color: oppsSubTab === 'feed' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }}
                    >
                      Browse Feed
                    </button>
                    <button 
                      type="button"
                      onClick={() => setOppsSubTab('saved')}
                      style={{ padding: '0.5rem 1.25rem', background: 'none', border: 'none', borderBottom: oppsSubTab === 'saved' ? '2px solid var(--primary-pale)' : '2px solid transparent', color: oppsSubTab === 'saved' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }}
                    >
                      Saved Bookmarks
                    </button>
                    <button 
                      type="button"
                      onClick={() => setOppsSubTab('applications')}
                      style={{ padding: '0.5rem 1.25rem', background: 'none', border: 'none', borderBottom: oppsSubTab === 'applications' ? '2px solid var(--primary-pale)' : '2px solid transparent', color: oppsSubTab === 'applications' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }}
                    >
                      Hiring Pipeline
                    </button>
                    <button 
                      type="button"
                      onClick={() => setOppsSubTab('build')}
                      style={{ padding: '0.5rem 1.25rem', background: 'none', border: 'none', borderBottom: oppsSubTab === 'build' ? '2px solid var(--primary-pale)' : '2px solid transparent', color: oppsSubTab === 'build' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }}
                    >
                      Build Sandbox
                    </button>
                  </div>
                )}

                {activeTab === 'emergency-support' && (
                  <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', paddingBottom: '0.5rem', overflowX: 'auto' }}>
                    <button 
                      type="button"
                      onClick={() => setEmergencySubTab('feed')}
                      style={{ padding: '0.5rem 1.25rem', background: 'none', border: 'none', borderBottom: emergencySubTab === 'feed' ? '2px solid var(--primary-pale)' : '2px solid transparent', color: emergencySubTab === 'feed' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }}
                    >
                      Emergency Requests Feed
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEmergencySubTab('settings')}
                      style={{ padding: '0.5rem 1.25rem', background: 'none', border: 'none', borderBottom: emergencySubTab === 'settings' ? '2px solid var(--primary-pale)' : '2px solid transparent', color: emergencySubTab === 'settings' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }}
                    >
                      Donation Settings
                    </button>
                  </div>
                )}
                
                {activeTab === 'profile' && (
                  <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', paddingBottom: '0.5rem', overflowX: 'auto' }}>
                    <button 
                      type="button"
                      onClick={() => setProfileSubTab('details')}
                      style={{ padding: '0.5rem 1.25rem', background: 'none', border: 'none', borderBottom: profileSubTab === 'details' ? '2px solid var(--primary-pale)' : '2px solid transparent', color: profileSubTab === 'details' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }}
                    >
                      Profile Info
                    </button>
                    <button 
                      type="button"
                      onClick={() => setProfileSubTab('experience')}
                      style={{ padding: '0.5rem 1.25rem', background: 'none', border: 'none', borderBottom: profileSubTab === 'experience' ? '2px solid var(--primary-pale)' : '2px solid transparent', color: profileSubTab === 'experience' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }}
                    >
                      Experience & Education
                    </button>
                    <button 
                      type="button"
                      onClick={() => setProfileSubTab('achievements')}
                      style={{ padding: '0.5rem 1.25rem', background: 'none', border: 'none', borderBottom: profileSubTab === 'achievements' ? '2px solid var(--primary-pale)' : '2px solid transparent', color: profileSubTab === 'achievements' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }}
                    >
                      Achievements & Credentials
                    </button>
                    <button 
                      type="button"
                      onClick={() => setProfileSubTab('resume')}
                      style={{ padding: '0.5rem 1.25rem', background: 'none', border: 'none', borderBottom: profileSubTab === 'resume' ? '2px solid var(--primary-pale)' : '2px solid transparent', color: profileSubTab === 'resume' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem' }}
                    >
                      Resume Studio
                    </button>
                  </div>
                )}
                
                {/* A. DIGITAL MEMBER CARD TAB */}
                {activeTab === 'card' && (
                  <div className={`${styles.tabView} fade-in`}>
                    <h2>Digital Membership Card</h2>
                    <p>Your verified credentials card represents high-trust security. Once verified, download it or share the QR validation code.</p>
                    
                    {renderStatusBanner()}

                    <div id="print-area" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
                      {/* FRONT SIDE */}
                      <Link 
                        href={`/status?memberId=${profile.status === 'Verified' ? profile.memberId : profile.id}`}
                        target="_blank"
                        id="tss-id-card-front" 
                        className={styles.memberCardVirtual}
                        style={{ cursor: 'pointer', textDecoration: 'none' }}
                      >
                        <div className={styles.cardGlow}></div>
                        <div className={styles.meshBg}></div>
                        <div className={styles.cardHeader} style={{ zIndex: 2 }}>
                          <div className={styles.cardLogo}>
                            <img src="/logo.png" alt="TSS Logo" style={{ height: '18px', width: 'auto', marginRight: '0.35rem', objectFit: 'contain' }} />
                            <span>THE STUDENT SPOT</span>
                          </div>
                          <div className={`${styles.cardStatusBadge} ${profile.status === 'Verified' ? styles.statusVerified : styles.statusPending}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                            <span className={styles.statusDot} style={{ width: '6px', height: '6px', backgroundColor: profile.status === 'Verified' ? 'var(--success)' : 'var(--secondary)', borderRadius: '50%' }}></span> {profile.status === 'Verified' ? `Verified ${profile.role}` : 'UNDER AUDIT'}
                          </div>
                        </div>

                        <div className={styles.cardProfileBlock} style={{ zIndex: 2 }}>
                          <div className={styles.cardPhotoWrapper}>
                            {profile.photoPath ? (
                              <img 
                                src={`data:image/jpeg;base64,${profile.photoPath}`} 
                                className={styles.cardPhoto} 
                                alt="Member" 
                              />
                            ) : (
                              <div className={styles.cardPhotoPlaceholder}>
                                <User size={24} />
                              </div>
                            )}
                          </div>
                          <div className={styles.cardProfileMeta}>
                            <h3 className={styles.memberName}>{profile.fullName}</h3>
                            <span className={styles.memberRoleTag} style={{ color: '#94a3b8' }}>@{profile.username || 'username'}</span>
                          </div>
                        </div>

                        <div className={styles.cardFooterGrid} style={{ zIndex: 2 }}>
                          <div className={styles.detailsColumn}>
                            <span className={styles.detailsLabel}>TSS LIFETIME ID</span>
                            <span className={styles.memberIdCode} style={{ color: '#f77f00', fontSize: '1rem', fontWeight: 700 }}>{profile.status === 'Verified' ? profile.memberId : 'PENDING AUDIT'}</span>
                          </div>
                          
                          <div className={styles.detailsColumn}>
                            <span className={styles.detailsLabel}>ROLE CATEGORY</span>
                            <span className={styles.detailsValue}>{profile.role}</span>
                          </div>

                          <div className={styles.qrCodeWrapper}>
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                                typeof window !== 'undefined' 
                                  ? `${window.location.origin}/status?memberId=${profile.status === 'Verified' ? profile.memberId : profile.id}` 
                                  : `https://thestudentspot.app/status?memberId=${profile.status === 'Verified' ? profile.memberId : profile.id}`
                              )}`} 
                              crossOrigin="anonymous"
                              className={styles.cardQrCode} 
                              alt="QR Code" 
                            />
                          </div>
                        </div>
                      </Link>

                      {/* BACK SIDE */}
                      <Link 
                        href={`/status?memberId=${profile.status === 'Verified' ? profile.memberId : profile.id}`}
                        target="_blank"
                        id="tss-id-card-back" 
                        className={styles.memberCardVirtual}
                        style={{ border: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem', paddingBottom: '1rem', cursor: 'pointer', textDecoration: 'none' }}
                      >
                        <div className={styles.cardGlow}></div>
                        <div className={styles.meshBg}></div>
                        <div className={styles.cardHeader} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', zIndex: 2, paddingBottom: '0.4rem' }}>
                          <div className={styles.cardLogo}>
                            <img src="/logo.png" alt="TSS Logo" style={{ height: '18px', width: 'auto', marginRight: '0.35rem', objectFit: 'contain' }} />
                            <span style={{ color: '#ffffff' }}>TSS LIFELONG IDENTITY</span>
                          </div>
                          <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>BACK SIDE</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.4rem 0', flexGrow: 1, zIndex: 2 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>WEBSITE</span>
                              <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>thestudentspot.app</span>
                            </div>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>MEMBER SINCE</span>
                              <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>{profile.memberSince || 'Jun 2026'}</span>
                            </div>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>COMMUNITY SCORE</span>
                              <span style={{ fontSize: '0.8rem', color: '#f77f00', fontWeight: 700 }}>{profile.communityScore || 20} pts (Level {profile.level || 'Explorer'})</span>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>EMERGENCY CONTACT</span>
                              <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>{profile.roleDetails?.emergencyContact || 'Parent / TSS Security Node'}</span>
                            </div>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>OFFICIAL CONTACT</span>
                              <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>contact@thestudentspot.app</span>
                            </div>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>PROGRAMS ACCESS</span>
                              <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>{profile.role === 'Student' ? 'BuildX Sandbox, 100X Students' : 'Ecosystem Partner'}</span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.cardHeader} style={{ borderBottom: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0', paddingTop: '0.4rem', zIndex: 2 }}>
                          <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Scan QR code on front side to verify status</span>
                          <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>THE STUDENT SPOT</span>
                        </div>
                      </Link>
                    </div>

                    {profile.status === 'Verified' && (
                      <div className={styles.tabActions}>
                        <button onClick={handleDownloadPdf} className="btn btn-primary">
                          <Download size={16} /> Download Card PDF
                        </button>
                      </div>
                    )}

                    {profile.status === 'Verified' && (
                      <div className={styles.unlockedLinks}>
                        <h3>🚀 Unlocked Ecosystem Connections</h3>
                        <p>As a verified talent, you have immediate access to regional cohorts:</p>
                      <div className={styles.linkButtonsGrid}>
                        <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className={styles.linkBox}>
                          <strong>WhatsApp Group</strong>
                          <span>Official verified announcements chat</span>
                        </a>
                        <a href="https://telegram.org" target="_blank" rel="noreferrer" className={styles.linkBox}>
                          <strong>Telegram Lounge</strong>
                          <span>Collaborate with co-founders and freshers</span>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.linkBox}>
                          <strong>LinkedIn Directory</strong>
                          <span>Fast-track hiring recommendations list</span>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.linkBox}>
                          <strong>Instagram Network</strong>
                          <span>Event stories and build sandbox announcements</span>
                        </a>
                      </div>
                    </div>
                    )}

                    {/* Loyalty Status & Streak Tracker Section */}
                    {profile.status === 'Verified' && (
                      <div className={styles.loyaltyWrapper}>
                        <div className={styles.loyaltyHeader}>
                          <h3>TSS Loyalty & Check-ins</h3>
                          <p>Stay consistent, build your identity, and earn premium ecosystem tiers.</p>
                        </div>

                        <div className={styles.loyaltyGrid}>
                          {/* Card 1: Current Tier */}
                          <div className={styles.loyaltyStatCard} style={{ borderLeft: `4px solid ${tier.color}` }}>
                            <div className={styles.statCardHeader}>
                              <span className={styles.statCardLabel}>Current Tier</span>
                              <span style={{ fontSize: '1.25rem' }}>{tier.icon}</span>
                            </div>
                            <span className={styles.statCardValue} style={{ color: tier.color }}>{tier.name}</span>
                            <span className={styles.statCardDesc}>Level status verified</span>
                          </div>

                          {/* Card 2: Cumulative Logins */}
                          <div className={styles.loyaltyStatCard} style={{ borderLeft: '4px solid var(--primary)' }}>
                            <div className={styles.statCardHeader}>
                              <span className={styles.statCardLabel}>Total Logins</span>
                              <span style={{ fontSize: '1.25rem' }}>📅</span>
                            </div>
                            <span className={styles.statCardValue}>{loginDays} Days</span>
                            <span className={styles.statCardDesc}>Cumulative check-ins log</span>
                          </div>

                          {/* Card 3: Daily Streak */}
                          <div className={styles.loyaltyStatCard} style={{ borderLeft: '4px solid #f97316' }}>
                            <div className={styles.statCardHeader}>
                              <span className={styles.statCardLabel}>Daily Streak</span>
                              <span style={{ fontSize: '1.25rem' }}>🔥</span>
                            </div>
                            <span className={styles.statCardValue}>{streak} Days</span>
                            <div className={styles.statCardDesc}>
                              <button 
                                onClick={handleDailyCheckIn} 
                                disabled={hasCheckedInToday}
                                className="btn btn-primary"
                                style={{ 
                                  padding: '0.25rem 0.5rem', 
                                  fontSize: '0.7rem', 
                                  marginTop: '0.25rem',
                                  backgroundColor: hasCheckedInToday ? 'var(--border-color)' : '#f97316',
                                  borderColor: hasCheckedInToday ? 'var(--border-color)' : '#f97316',
                                  color: '#ffffff'
                                }}
                              >
                                {hasCheckedInToday ? 'Checked In Today ✓' : 'Claim Check-in'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {tier.next && (
                          <div className={styles.progressContainer}>
                            <div className={styles.progressHeader}>
                              <span>Progress to {tier.next}</span>
                              <span>{loginDays} / {tier.req} days</span>
                            </div>
                            <div className={styles.progressBarBg}>
                              <div 
                                className={styles.progressBarFill} 
                                style={{ 
                                  width: `${Math.min(100, (loginDays / tier.req) * 100)}%`,
                                  backgroundColor: tier.color 
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Perks Listing */}
                        <div className={styles.perksSection}>
                          <h4>Unlocked {tier.name} Perks</h4>
                          <div className={styles.perksGrid}>
                            <div className={`${styles.perkItem} ${loginDays < 1 ? styles.perkItemLocked : ''}`}>
                              <span>{loginDays >= 1 ? '✓' : '🔒'}</span>
                              <span>Verified Member Badge & Community Card</span>
                            </div>
                            <div className={`${styles.perkItem} ${loginDays < 1 ? styles.perkItemLocked : ''}`}>
                              <span>{loginDays >= 1 ? '✓' : '🔒'}</span>
                              <span>Access to public Jobs board & Resume Studio</span>
                            </div>
                            <div className={`${styles.perkItem} ${loginDays < 31 ? styles.perkItemLocked : ''}`}>
                              <span>{loginDays >= 31 ? '✓' : '🔒'}</span>
                              <span>Priority Shortlisting in Partner Job Applications</span>
                            </div>
                            <div className={`${styles.perkItem} ${loginDays < 31 ? styles.perkItemLocked : ''}`}>
                              <span>{loginDays >= 31 ? '✓' : '🔒'}</span>
                              <span>Access to BuildX Cohorts & Sunday reviews</span>
                            </div>
                            <div className={`${styles.perkItem} ${loginDays < 101 ? styles.perkItemLocked : ''}`}>
                              <span>{loginDays >= 101 ? '✓' : '🔒'}</span>
                              <span>Founder Badge & direct intro to VC/Recruiter lists</span>
                            </div>
                            <div className={`${styles.perkItem} ${loginDays < 365 ? styles.perkItemLocked : ''}`}>
                              <span>{loginDays >= 365 ? '✓' : '🔒'}</span>
                              <span>Legend status & Private Legend communication channel</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* B. RESUME STUDIO TAB */}
                {(activeTab === 'resume' || (activeTab === 'profile' && profileSubTab === 'resume')) && (
                  profile.status !== 'Verified' ? renderLockedState('Resume Studio') : (
                    <div className={`${styles.tabView} fade-in`}>
                    <h2>TSS Resume Studio</h2>
                    <p>Customize and download print-ready resumes tailored for different application settings.</p>
                    
                    <div className={styles.templateSelectorOuter} style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                      <div className={styles.segmentedControl} style={{ maxWidth: '600px', width: '100%' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedTemplate('FAANG')}
                          className={`${styles.segmentBtn} ${selectedTemplate === 'FAANG' ? styles.activeSegmentBtn : ''}`}
                        >
                          FAANG (ATS Minimal)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedTemplate('Startup')}
                          className={`${styles.segmentBtn} ${selectedTemplate === 'Startup' ? styles.activeSegmentBtn : ''}`}
                        >
                          Startup (Modern/Tech)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedTemplate('General')}
                          className={`${styles.segmentBtn} ${selectedTemplate === 'General' ? styles.activeSegmentBtn : ''}`}
                        >
                          General (Standard Business)
                        </button>
                      </div>
                    </div>

                    <div className={styles.studioGrid}>
                      {/* Left: Editor */}
                      <div className={styles.editorPanel}>
                        <div className={styles.segmentedControl}>
                          <button
                            type="button"
                            onClick={() => setResumeSubTab('edit')}
                            className={`${styles.segmentBtn} ${resumeSubTab === 'edit' ? styles.activeSegmentBtn : ''}`}
                          >
                            1. Edit Details
                          </button>
                          <button
                            type="button"
                            onClick={() => setResumeSubTab('ats')}
                            className={`${styles.segmentBtn} ${resumeSubTab === 'ats' ? styles.activeSegmentBtn : ''}`}
                          >
                            2. ATS Match Checker
                          </button>
                        </div>

                        {resumeSubTab === 'edit' ? (
                          <div className="fade-in">
                            <div className={styles.editorGroup}>
                              <h4>Contact Information</h4>
                              <div className={styles.formRow}>
                                <div className={styles.formField}>
                                  <label className={styles.formLabel}>Full Name</label>
                                  <input
                                    type="text"
                                    value={resumeData?.fullName || ''}
                                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                                    className={styles.formInput}
                                  />
                                </div>
                              </div>
                              <div className={styles.formGrid2}>
                                <div className={styles.formField}>
                                  <label className={styles.formLabel}>Email</label>
                                  <input
                                    type="email"
                                    value={resumeData?.email || ''}
                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                    className={styles.formInput}
                                  />
                                </div>
                                <div className={styles.formField}>
                                  <label className={styles.formLabel}>Mobile</label>
                                  <input
                                    type="text"
                                    value={resumeData?.mobile || ''}
                                    onChange={(e) => handleFieldChange('mobile', e.target.value)}
                                    className={styles.formInput}
                                  />
                                </div>
                              </div>
                              <div className={styles.formGrid3}>
                                <div className={styles.formField}>
                                  <label className={styles.formLabel}>LinkedIn</label>
                                  <input
                                    type="text"
                                    value={resumeData?.linkedin || ''}
                                    onChange={(e) => handleFieldChange('linkedin', e.target.value)}
                                    className={styles.formInput}
                                  />
                                </div>
                                <div className={styles.formField}>
                                  <label className={styles.formLabel}>GitHub</label>
                                  <input
                                    type="text"
                                    value={resumeData?.github || ''}
                                    onChange={(e) => handleFieldChange('github', e.target.value)}
                                    className={styles.formInput}
                                  />
                                </div>
                                <div className={styles.formField}>
                                  <label className={styles.formLabel}>Portfolio</label>
                                  <input
                                    type="text"
                                    value={resumeData?.portfolio || ''}
                                    onChange={(e) => handleFieldChange('portfolio', e.target.value)}
                                    className={styles.formInput}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className={styles.editorGroup}>
                              <h4>Skills</h4>
                              <div className={styles.formField}>
                                <label className={styles.formLabel}>Skills (comma separated)</label>
                                <input
                                  type="text"
                                  value={resumeData?.skills || ''}
                                  onChange={(e) => handleFieldChange('skills', e.target.value)}
                                  className={styles.formInput}
                                />
                              </div>
                            </div>

                            <div className={styles.editorGroup}>
                              <div className={styles.groupHeader}>
                                <h4>Education</h4>
                                <button type="button" onClick={() => addListItem('education')} className={styles.addBtn}>+ Add</button>
                              </div>
                              {resumeData?.education.map((edu, index) => (
                                <div key={index} className={styles.listItemForm}>
                                  <div className={styles.listItemHeader}>
                                    <span>Education #{index + 1}</span>
                                    {resumeData.education.length > 1 && (
                                      <button type="button" onClick={() => deleteListItem('education', index)} className={styles.deleteBtn}>Remove</button>
                                    )}
                                  </div>
                                  <div className={styles.formField}>
                                    <label className={styles.formLabel}>Institution / College</label>
                                    <input
                                      type="text"
                                      value={edu.institution}
                                      onChange={(e) => handleNestedChange('education', index, 'institution', e.target.value)}
                                      className={styles.formInput}
                                    />
                                  </div>
                                  <div className={styles.formGrid2}>
                                    <div className={styles.formField}>
                                      <label className={styles.formLabel}>Degree</label>
                                      <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => handleNestedChange('education', index, 'degree', e.target.value)}
                                        className={styles.formInput}
                                      />
                                    </div>
                                    <div className={styles.formField}>
                                      <label className={styles.formLabel}>Graduation Year</label>
                                      <input
                                        type="text"
                                        value={edu.year}
                                        onChange={(e) => handleNestedChange('education', index, 'year', e.target.value)}
                                        className={styles.formInput}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className={styles.editorGroup}>
                              <div className={styles.groupHeader}>
                                <h4>Experience</h4>
                                <button type="button" onClick={() => addListItem('experience')} className={styles.addBtn}>+ Add</button>
                              </div>
                              {resumeData?.experience.map((exp, index) => (
                                <div key={index} className={styles.listItemForm}>
                                  <div className={styles.listItemHeader}>
                                    <span>Experience #{index + 1}</span>
                                    <button type="button" onClick={() => deleteListItem('experience', index)} className={styles.deleteBtn}>Remove</button>
                                  </div>
                                  <div className={styles.formGrid2}>
                                    <div className={styles.formField}>
                                      <label className={styles.formLabel}>Company</label>
                                      <input
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => handleNestedChange('experience', index, 'company', e.target.value)}
                                        className={styles.formInput}
                                      />
                                    </div>
                                    <div className={styles.formField}>
                                      <label className={styles.formLabel}>Role</label>
                                      <input
                                        type="text"
                                        value={exp.role}
                                        onChange={(e) => handleNestedChange('experience', index, 'role', e.target.value)}
                                        className={styles.formInput}
                                      />
                                    </div>
                                  </div>
                                  <div className={styles.formField}>
                                    <label className={styles.formLabel}>Duration</label>
                                    <input
                                      type="text"
                                      value={exp.duration}
                                      onChange={(e) => handleNestedChange('experience', index, 'duration', e.target.value)}
                                      className={styles.formInput}
                                    />
                                  </div>
                                  <div className={styles.formField}>
                                    <label className={styles.formLabel}>Description (one bullet per line)</label>
                                    <textarea
                                      value={exp.description}
                                      onChange={(e) => handleNestedChange('experience', index, 'description', e.target.value)}
                                      className={styles.formTextarea}
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className={styles.editorGroup}>
                              <div className={styles.groupHeader}>
                                <h4>Projects</h4>
                                <button type="button" onClick={() => addListItem('projects')} className={styles.addBtn}>+ Add</button>
                              </div>
                              {resumeData?.projects.map((proj, index) => (
                                <div key={index} className={styles.listItemForm}>
                                  <div className={styles.listItemHeader}>
                                    <span>Project #{index + 1}</span>
                                    <button type="button" onClick={() => deleteListItem('projects', index)} className={styles.deleteBtn}>Remove</button>
                                  </div>
                                  <div className={styles.formGrid2}>
                                    <div className={styles.formField}>
                                      <label className={styles.formLabel}>Title</label>
                                      <input
                                        type="text"
                                        value={proj.title}
                                        onChange={(e) => handleNestedChange('projects', index, 'title', e.target.value)}
                                        className={styles.formInput}
                                      />
                                    </div>
                                    <div className={styles.formField}>
                                      <label className={styles.formLabel}>Tech Stack</label>
                                      <input
                                        type="text"
                                        value={proj.tech}
                                        onChange={(e) => handleNestedChange('projects', index, 'tech', e.target.value)}
                                        className={styles.formInput}
                                      />
                                    </div>
                                  </div>
                                  <div className={styles.formField}>
                                    <label className={styles.formLabel}>Description (one bullet per line)</label>
                                    <textarea
                                      value={proj.description}
                                      onChange={(e) => handleNestedChange('projects', index, 'description', e.target.value)}
                                      className={styles.formTextarea}
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px dashed rgba(0, 0, 0, 0.06)', paddingTop: '1.25rem' }}>
                              <button 
                                type="button" 
                                onClick={handleResetResume} 
                                className="btn btn-light btn-sm"
                                style={{ color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                              >
                                Reset Resume to Default
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="fade-in">
                            <div>
                              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 700 }}>Job Description Analyzer</h3>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Paste the description of your target job below to run real-time keyword matching and format audits.</p>
                            </div>
                            
                            <textarea
                              value={jdInput}
                              onChange={(e) => setJdInput(e.target.value)}
                              placeholder="Paste the target Job Description (JD) text here..."
                              rows={8}
                              className="form-textarea"
                              style={{ fontSize: '0.825rem', fontFamily: 'var(--font-main)' }}
                            />

                            <button 
                              type="button"
                              onClick={handleAtsAnalysis} 
                              disabled={isAnalyzingAts || !jdInput.trim()}
                              className="btn btn-primary"
                              style={{ width: '100%' }}
                            >
                              {isAnalyzingAts ? 'Analyzing Keywords...' : 'Verify ATS Compatibility Score'}
                            </button>

                            {/* ATS Analysis Scorecard Details */}
                            {atsAnalysis && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', backgroundColor: 'var(--bg-card)' }} className="fade-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>ATS Match Score:</span>
                                  <span 
                                    style={{ 
                                      fontSize: '1.5rem', 
                                      fontWeight: 800, 
                                      color: atsAnalysis.score >= 80 ? 'var(--success)' : atsAnalysis.score >= 60 ? '#f59e0b' : '#ef4444' 
                                    }}
                                  >
                                    {atsAnalysis.score}%
                                  </span>
                                </div>

                                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div 
                                    style={{ 
                                      height: '100%', 
                                      backgroundColor: atsAnalysis.score >= 80 ? 'var(--success)' : atsAnalysis.score >= 60 ? '#f59e0b' : '#ef4444',
                                      width: `${atsAnalysis.score}%`,
                                      transition: 'width 0.4s ease'
                                    }}
                                  ></div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                                  <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Matched Tech Keywords ({atsAnalysis.matched.length})</strong>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                                    {atsAnalysis.matched.map((kw: string) => (
                                      <span key={kw} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                                        {kw} ✓
                                      </span>
                                    ))}
                                    {atsAnalysis.matched.length === 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None matched.</span>}
                                  </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                                  <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Missing Key Skills ({atsAnalysis.missing.length})</strong>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                                    {atsAnalysis.missing.map((kw: string) => (
                                      <span key={kw} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                                        + {kw}
                                      </span>
                                    ))}
                                    {atsAnalysis.missing.length === 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No missing key terms!</span>}
                                  </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                                  <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Optimization Suggestions</strong>
                                  <ul style={{ margin: '0.5rem 0 0 1rem', paddingLeft: 0, fontSize: '0.78rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    {atsAnalysis.recommendations.map((rec: string, idx: number) => (
                                      <li key={idx}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Preview */}
                      <div className={styles.previewPanel}>
                        <div className={styles.previewHeader}>
                          <h3>2. Live Resume Preview</h3>
                          <button onClick={handleDownloadResumePdf} className="btn btn-primary btn-sm">
                            <Download size={14} /> Download PDF
                          </button>
                        </div>
                        <div className={styles.previewScrollBox}>
                          <div id="tss-resume-preview" className={`${styles.resumePaper} ${styles['template-' + selectedTemplate.toLowerCase()]}`}>
                            {selectedTemplate === 'FAANG' && renderFaangTemplate()}
                            {selectedTemplate === 'Startup' && renderStartupTemplate()}
                            {selectedTemplate === 'General' && renderGeneralTemplate()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

                {/* C. VETTING LEVELS TAB */}
                {activeTab === 'profile' && profileSubTab === ('levels' as any) && (
                  profile.status !== 'Verified' ? renderLockedState('Vetting Levels Logs') : (
                    <div className={`${styles.tabView} fade-in`}>
                    <h2>TSS Verification Levels</h2>
                    <p>Track your trust indicators and vetted levels on the Student Spot platform.</p>

                    <div className={styles.levelsGrid}>
                      <div className={`${styles.levelCard} ${styles.levelUnlocked}`}>
                        <CheckCircle2 className={styles.levelIconSuccess} size={28} />
                        <div>
                          <h4>Verified Student</h4>
                          <p>Profile vetting for student status confirmed.</p>
                        </div>
                      </div>

                      <div className={`${styles.levelCard} ${profile.github || profile.portfolio ? styles.levelUnlocked : styles.levelLocked}`}>
                        {profile.github || profile.portfolio ? (
                          <CheckCircle2 className={styles.levelIconSuccess} size={28} />
                        ) : (
                          <AlertOctagon className={styles.levelIconWarning} size={28} />
                        )}
                        <div>
                          <h4>Verified Portfolio</h4>
                          <p>{profile.github || profile.portfolio ? 'Checked social/experience portfolio link.' : 'Configure GitHub or portfolio link to unlock.'}</p>
                        </div>
                      </div>

                      <div className={`${styles.levelCard} ${profile.skills && profile.skills.length > 0 ? styles.levelUnlocked : styles.levelLocked}`}>
                        {profile.skills && profile.skills.length > 0 ? (
                          <CheckCircle2 className={styles.levelIconSuccess} size={28} />
                        ) : (
                          <AlertOctagon className={styles.levelIconWarning} size={28} />
                        )}
                        <div>
                          <h4>Verified Skills</h4>
                          <p>{profile.skills && profile.skills.length > 0 ? 'Verified skill credentials.' : 'Add your skills in settings.'}</p>
                        </div>
                      </div>

                      <div className={`${styles.levelCard} ${profile.role === 'Founder' ? styles.levelUnlocked : styles.levelLocked}`}>
                        {profile.role === 'Founder' ? (
                          <CheckCircle2 className={styles.levelIconSuccess} size={28} />
                        ) : (
                          <AlertOctagon className={styles.levelIconMuted} size={28} />
                        )}
                        <div>
                          <h4>Verified Startup</h4>
                          <p>{profile.role === 'Founder' ? 'Incubated founder validation activated.' : 'Available for verified Founder roles.'}</p>
                        </div>
                      </div>

                      <div className={`${styles.levelCard} ${styles.levelLocked}`}>
                        <AlertOctagon className={styles.levelIconMuted} size={28} />
                        <div>
                          <h4>Verified Project</h4>
                          <p>Build Challenge sandbox credentials verification (requires submitting project on Demo Day).</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

                {/* D. BUILD CHALLENGE TAB */}
                {(activeTab === 'opportunity-hub' && oppsSubTab === 'build') && (
                  profile.status !== 'Verified' ? renderLockedState('Build Challenge Sandbox') : (
                    <div className={`${styles.tabView} fade-in`}>
                    <h2>TSS Build Challenge Sandbox</h2>
                    <p>Submit problems, join active 30-day cohorts, and collaborate on real-world projects.</p>

                    <div className={styles.buildInstructions}>
                      <h4>Sandbox Cycle:</h4>
                      <p>Community submits problems ➔ Team selects Top 3 ➔ Google Meet Kickoff ➔ 30 Days Building ➔ Weekly status reviews ➔ Demo Day ➔ Startup Support & Mentoring.</p>
                    </div>

                    <form onSubmit={handleBuildSandboxSubmit} className={styles.buildForm}>
                      <h3>Submit Project Idea</h3>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Problem Pitch (What are you building & why?)</label>
                        <textarea
                          placeholder="Provide a 2-3 sentence overview of the problem and your solution..."
                          value={buildProblemPitch}
                          onChange={(e) => setBuildProblemPitch(e.target.value)}
                          className={styles.formTextarea}
                          rows={4}
                          required
                        />
                      </div>

                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Team Members / GitHub Links (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. GitHub repo link, teammate names..."
                          value={buildTeamLinks}
                          onChange={(e) => setBuildTeamLinks(e.target.value)}
                          className={styles.formInput}
                        />
                      </div>

                      <button type="submit" disabled={isSubmittingBuild} className="btn btn-primary">
                        <Send size={16} /> {isSubmittingBuild ? 'Submitting...' : 'Submit Pitch to Team'}
                      </button>
                    </form>
                  </div>
                  )
                )}

                {/* E. ACCOUNT SETTINGS TAB */}
                {((activeTab === 'settings' || activeTab === 'profile') && profileSubTab === 'details') && (
                  <form onSubmit={handleSaveSettings} className={`${styles.tabView} fade-in`}>
                    <h2>Profile Information</h2>
                    <p>Update your background and basic member information. Changes require admin validation before publication.</p>
                    
                    {profile.roleDetails?.draftProfileDetails && (
                      <div className={styles.pendingBanner} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
                        <ShieldAlert style={{ color: '#eab308' }} size={24} />
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Profile Changes Pending Review</strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Your recent updates are currently queued for administrator approval. Previously verified details remain active.
                          </span>
                        </div>
                      </div>
                    )}

                    <div className={styles.settingsGrid}>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Full Name</label>
                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className={styles.formInput} required />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Mobile Number</label>
                        <input type="text" value={editMobile} onChange={(e) => setEditMobile(e.target.value)} className={styles.formInput} required />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>College / Institution</label>
                        <input type="text" value={editCollege} onChange={(e) => setEditCollege(e.target.value)} className={styles.formInput} required />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Graduation Year</label>
                        <input type="number" value={editGraduationYear} onChange={(e) => setEditGraduationYear(e.target.value)} className={styles.formInput} required />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>LinkedIn Profile URL</label>
                        <input type="url" value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} className={styles.formInput} required />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>GitHub Profile URL</label>
                        <input type="url" value={editGithub} onChange={(e) => setEditGithub(e.target.value)} className={styles.formInput} />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Personal Portfolio Link</label>
                        <input type="url" value={editPortfolio} onChange={(e) => setEditPortfolio(e.target.value)} className={styles.formInput} />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Resume Drive URL (No raw files allowed)</label>
                        <input type="url" value={editResumeLink} onChange={(e) => setEditResumeLink(e.target.value)} className={styles.formInput} placeholder="Google Drive / Dropbox link" required />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Profile Photo Path (Base64 data or URL)</label>
                        <input type="text" value={editPhotoPath} onChange={(e) => setEditPhotoPath(e.target.value)} className={styles.formInput} />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Cover Image URL</label>
                        <input type="text" value={editCoverImage} onChange={(e) => setEditCoverImage(e.target.value)} className={styles.formInput} placeholder="e.g. https://images.unsplash.com/photo-..." />
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                      <label className={styles.formLabel}>Professional Bio Summary</label>
                      <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} className={styles.formInput} style={{ minHeight: '80px', fontFamily: 'inherit' }} placeholder="Short tagline detailing your core focus and skills..." />
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                      <label className={styles.formLabel}>Skills Tags (comma-separated)</label>
                      <input type="text" value={editSkills} onChange={(e) => setEditSkills(e.target.value)} className={styles.formInput} placeholder="e.g. React, Node.js, Python, TypeScript" />
                    </div>

                    <button type="submit" disabled={isUpdatingSettings} className="btn btn-primary" style={{ marginTop: '2rem' }}>
                      {isUpdatingSettings ? 'Submitting for Verification...' : 'Save & Stage Updates'}
                    </button>
                  </form>
                )}

                {activeTab === 'profile' && profileSubTab === 'experience' && profile && (
                  <form onSubmit={handleSaveSettings} className={`${styles.tabView} fade-in`}>
                    <h2>Experience & Education</h2>
                    <p>Configure your historical timelines. These details sync with the ATS Resume Studio automatically.</p>
                    
                    {profile.roleDetails?.draftProfileDetails && (
                      <div className={styles.pendingBanner} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
                        <ShieldAlert style={{ color: '#eab308' }} size={24} />
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Profile Changes Pending Review</strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Your recent updates are currently queued for administrator approval. Previously verified details remain active.
                          </span>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {/* EXPERIENCES BLOCK */}
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>Professional Experience</span>
                          <button 
                            type="button" 
                            onClick={() => setEditExperience([...editExperience, { title: '', company: '', duration: '', description: '' }])}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '6px' }}
                          >
                            + Add Experience
                          </button>
                        </h3>

                        {editExperience.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No experiences declared yet.</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {editExperience.map((exp, idx) => (
                              <div key={idx} style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', position: 'relative' }}>
                                <button 
                                  type="button" 
                                  onClick={() => setEditExperience(editExperience.filter((_, i) => i !== idx))}
                                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                  Remove
                                </button>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                                  <div>
                                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Job Title / Role</label>
                                    <input 
                                      type="text" 
                                      value={exp.title}
                                      onChange={(e) => {
                                        const next = [...editExperience];
                                        next[idx].title = e.target.value;
                                        setEditExperience(next);
                                      }}
                                      className={styles.formInput} 
                                      placeholder="e.g. Software Engineer Intern"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Company / Organization</label>
                                    <input 
                                      type="text" 
                                      value={exp.company}
                                      onChange={(e) => {
                                        const next = [...editExperience];
                                        next[idx].company = e.target.value;
                                        setEditExperience(next);
                                      }}
                                      className={styles.formInput} 
                                      placeholder="e.g. TSS Startup Hub"
                                      required
                                    />
                                  </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                                  <div>
                                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Duration (e.g. May 2025 - Present)</label>
                                    <input 
                                      type="text" 
                                      value={exp.duration}
                                      onChange={(e) => {
                                        const next = [...editExperience];
                                        next[idx].duration = e.target.value;
                                        setEditExperience(next);
                                      }}
                                      className={styles.formInput}
                                      placeholder="e.g. June 2025 - Aug 2025"
                                      required
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Key Contributions & Description</label>
                                  <textarea 
                                    value={exp.description || ''}
                                    onChange={(e) => {
                                      const next = [...editExperience];
                                      next[idx].description = e.target.value;
                                      setEditExperience(next);
                                    }}
                                    className={styles.formInput}
                                    style={{ minHeight: '80px', fontFamily: 'inherit' }}
                                    placeholder="Explain your tasks and achievements (use bullet points if possible)"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* EDUCATION BLOCK */}
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>Education Records</span>
                          <button 
                            type="button" 
                            onClick={() => setEditEducation([...editEducation, { school: '', degree: '', year: '' }])}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '6px' }}
                          >
                            + Add Education
                          </button>
                        </h3>

                        {editEducation.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No education rows declared yet.</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {editEducation.map((edu, idx) => (
                              <div key={idx} style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', position: 'relative' }}>
                                <button 
                                  type="button" 
                                  onClick={() => setEditEducation(editEducation.filter((_, i) => i !== idx))}
                                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                  Remove
                                </button>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.5fr', gap: '1rem' }}>
                                  <div>
                                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>School / College</label>
                                    <input 
                                      type="text" 
                                      value={edu.school}
                                      onChange={(e) => {
                                        const next = [...editEducation];
                                        next[idx].school = e.target.value;
                                        setEditEducation(next);
                                      }}
                                      className={styles.formInput} 
                                      placeholder="e.g. Malla Reddy University"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Degree / Course</label>
                                    <input 
                                      type="text" 
                                      value={edu.degree}
                                      onChange={(e) => {
                                        const next = [...editEducation];
                                        next[idx].degree = e.target.value;
                                        setEditEducation(next);
                                      }}
                                      className={styles.formInput} 
                                      placeholder="e.g. B.Tech Computer Science"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Graduation Year</label>
                                    <input 
                                      type="text" 
                                      value={edu.year}
                                      onChange={(e) => {
                                        const next = [...editEducation];
                                        next[idx].year = e.target.value;
                                        setEditEducation(next);
                                      }}
                                      className={styles.formInput} 
                                      placeholder="e.g. 2026"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button type="submit" disabled={isUpdatingSettings} className="btn btn-primary" style={{ marginTop: '2rem' }}>
                      {isUpdatingSettings ? 'Submitting for Verification...' : 'Save & Stage Updates'}
                    </button>
                  </form>
                )}

                {activeTab === 'profile' && profileSubTab === 'achievements' && profile && (
                  <form onSubmit={handleSaveSettings} className={`${styles.tabView} fade-in`}>
                    <h2>Achievements & Credentials</h2>
                    <p>Showcase your verified credentials, certifications, and wins within and outside the TSS network.</p>

                    {profile.roleDetails?.draftProfileDetails && (
                      <div className={styles.pendingBanner} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
                        <ShieldAlert style={{ color: '#eab308' }} size={24} />
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Profile Changes Pending Review</strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Your recent updates are currently queued for administrator approval. Previously verified details remain active.
                          </span>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <label className={styles.formLabel}>Achievements (comma-separated list)</label>
                        <textarea 
                          value={editAchievements}
                          onChange={(e) => setEditAchievements(e.target.value)}
                          className={styles.formInput}
                          style={{ minHeight: '120px', fontFamily: 'inherit' }}
                          placeholder="e.g. TSS Build Challenge Winner #1, Finalist Malla Reddy Hackathon, Google Cloud Certified Associate Cloud Engineer"
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Comma separated list of awards, honors, and milestones.</span>
                      </div>

                      <div>
                        <label className={styles.formLabel}>Certificates & Badges Links (comma-separated URLs)</label>
                        <textarea 
                          value={editCertificates}
                          onChange={(e) => setEditCertificates(e.target.value)}
                          className={styles.formInput}
                          style={{ minHeight: '120px', fontFamily: 'inherit' }}
                          placeholder="e.g. https://cloud.google.com/verify/123, https://creds.tss/verify-hackathon"
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>URLs pointing to public credential checkers or portfolio files.</span>
                      </div>
                    </div>

                    <button type="submit" disabled={isUpdatingSettings} className="btn btn-primary" style={{ marginTop: '2rem' }}>
                      {isUpdatingSettings ? 'Submitting for Verification...' : 'Save & Stage Updates'}
                    </button>
                  </form>
                )}

                                {activeTab === 'emergency-support' && emergencySubTab === 'settings' && profile && (
                  <form onSubmit={handleSaveSettings} className={`${styles.tabView} fade-in`}>
                    <h2>Emergency Donation Settings</h2>
                    <p>Toggle blood and platelet emergency options matching community requests. No commercial activity is allowed.</p>
                    <div className={styles.settingsGrid}>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Blood Group</label>
                        <select 
                          value={editBloodGroup}
                          onChange={(e) => setEditBloodGroup(e.target.value)}
                          className={styles.formInput}
                          style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem', width: '100%' }}
                        >
                          <option value="Unknown">Unknown</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Emergency Contact Number</label>
                        <input type="text" value={editEmergencyContact} onChange={(e) => setEditEmergencyContact(e.target.value)} className={styles.formInput} required />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Last Donation Date</label>
                        <input type="date" value={editLastDonationDate} onChange={(e) => setEditLastDonationDate(e.target.value)} className={styles.formInput} />
                      </div>
                      <div className={styles.formField} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', gridColumn: 'span 2', marginTop: '1rem' }}>
                        <input type="checkbox" checked={editWillingToDonate} onChange={(e) => setEditWillingToDonate(e.target.checked)} id="willingToDonateCheck" />
                        <label htmlFor="willingToDonateCheck" className={styles.formLabel} style={{ margin: 0, cursor: 'pointer' }}>Willing to Donate Blood & Platelets</label>
                      </div>
                      <div className={styles.formField} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', gridColumn: 'span 2' }}>
                        <input type="checkbox" checked={editAvailableForEmergency} onChange={(e) => setEditAvailableForEmergency(e.target.checked)} id="availableForEmergencyCheck" />
                        <label htmlFor="availableForEmergencyCheck" className={styles.formLabel} style={{ margin: 0, cursor: 'pointer' }}>Available for Immediate Medical Emergency Alerts</label>
                      </div>
                    </div>
                    <button type="submit" disabled={isUpdatingSettings} className="btn btn-primary" style={{ marginTop: '2rem' }}>
                      {isUpdatingSettings ? 'Saving...' : 'Save Settings'}
                    </button>
                  </form>
                )}

                {/* F. JOBS BOARD TAB */}
                {profile && activeTab === ('jobs' as any) && (
                  <div className={`${styles.tabView} fade-in`}>
                    <h2>Jobs & Internship Openings</h2>
                    <p>Access high-trust partner roles. Applying requires a verified TSS Member ID. Applications skip first-round public resume queues.</p>
                    
                    {profile.status !== 'Verified' ? (
                      <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <Lock size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.15rem' }} />
                        <div>
                          <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Account Verification Required</h4>
                          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                            Your TSS ID validation is currently <strong>{profile.status}</strong>. You can view available jobs, but you can only submit applications after an administrator approves your verification.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div style={{ backgroundColor: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.25)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <CheckCircle2 size={20} style={{ color: 'var(--green-light)', flexShrink: 0, marginTop: '0.15rem' }} />
                        <div>
                          <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Verified Candidate Perks Active</h4>
                          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                            Welcome, {profile.fullName}! Your TSS Member ID (<code>{profile.memberId}</code>) is fully verified. You can now apply directly with one click.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Section 1: Applied Jobs */}
                    {appliedJobs.length > 0 && (
                      <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Your Applications</h3>
                        <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Job Title</th>
                                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Company</th>
                                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Applied On</th>
                                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {appliedJobs.map((app) => (
                                <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{app.jobTitle}</td>
                                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{app.companyName}</td>
                                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                  <td style={{ padding: '0.75rem 1rem' }}>
                                    <span style={{
                                      display: 'inline-block',
                                      padding: '0.15rem 0.5rem',
                                      borderRadius: '4px',
                                      fontSize: '10px',
                                      fontWeight: 700,
                                      textTransform: 'uppercase',
                                      backgroundColor: 
                                        app.status === 'Shortlisted' ? 'rgba(5,150,105,0.15)' :
                                        app.status === 'Rejected' ? 'rgba(220,38,38,0.15)' :
                                        app.status === 'Reviewing' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.08)',
                                      color:
                                        app.status === 'Shortlisted' ? 'var(--green-light)' :
                                        app.status === 'Rejected' ? '#ef4444' :
                                        app.status === 'Reviewing' ? 'var(--accent)' : 'var(--text-secondary)'
                                    }}>
                                      {app.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Section 2: Available Openings */}
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Available Openings</h3>
                    {loadingJobs ? (
                      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading job board listings...</div>
                    ) : jobs.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                        No active jobs posted at the moment. Please check back later.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {jobs.map((job) => (
                          <div key={job.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.75rem', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                              <div>
                                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{job.title}</h4>
                                <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>{job.companyName}</span>
                              </div>
                              <span style={{ fontSize: '10px', fontFamily: 'Space Mono', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(139,92,246,0.1)', color: 'var(--primary-pale)' }}>
                                {job.type}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                              <span>📍 {job.location}</span>
                              {job.salaryRange && <span>💰 {job.salaryRange}</span>}
                              <span>📅 Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                            </div>

                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', whiteSpace: 'pre-line' }}>{job.description}</p>

                            {job.requirements && job.requirements.length > 0 && (
                              <div style={{ marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>Key Requirements:</span>
                                <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                  {job.requirements.map((req: string, i: number) => (
                                    <li key={i}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div>
                               <Link 
                                 href={`/opportunities/${job.id}`}
                                 className="btn btn-primary"
                                 style={{ padding: '0.55rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', display: 'inline-block', textAlign: 'center' }}
                               >
                                 View Opportunity →
                               </Link>
                             </div>
                            </div>
                        ))}
                      </div>
                    )}

                    {/* Apply Confirmation Modal overlay */}
                    {selectedJobForApply && (
                      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', maxWidth: '520px', width: '100%', margin: '0 auto', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Apply for {selectedJobForApply.title}</h3>
                          <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, display: 'block', marginBottom: '1.25rem' }}>at {selectedJobForApply.companyName}</span>
                          
                          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                            Your verified candidate profile, contact details, LinkedIn handle, and TSS resume will be submitted automatically with this application.
                          </p>

                          <form onSubmit={(e) => { e.preventDefault(); handleApplySubmit(e); }}>
                            <div className={styles.formField} style={{ marginBottom: '1.5rem' }}>
                              <label className={styles.formLabel}>Short Cover Letter / Pitch (Optional)</label>
                              <textarea
                                placeholder="Introduce yourself, explain why you are interested, or highlight relevant project builds..."
                                value={coverLetterInput}
                                onChange={(e) => setCoverLetterInput(e.target.value)}
                                className={styles.formInput}
                                rows={4}
                                style={{ resize: 'none', fontFamily: 'inherit', fontSize: '0.85rem', width: '100%' }}
                              />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                              <button 
                                type="button" 
                                onClick={() => { setSelectedJobForApply(null); setCoverLetterInput(''); }}
                                className="btn btn-outline"
                                style={{ padding: '0.55rem 1.25rem', borderRadius: '8px' }}
                              >
                                Cancel
                              </button>
                              <button 
                                type="submit" 
                                disabled={isSubmittingApplication}
                                className="btn btn-primary"
                                style={{ padding: '0.55rem 1.25rem', borderRadius: '8px' }}
                              >
                                {isSubmittingApplication ? 'Submitting...' : 'Submit Application'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* G. OPPORTUNITY HUB TAB */}
                {activeTab === 'opportunity-hub' && oppsSubTab === 'feed' && (
                  <div className={`${styles.tabView} fade-in`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Briefcase style={{ color: 'var(--primary-pale)' }} /> Opportunity Hub
                        </h2>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Discover. Create. Connect.</span>
                        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '800px', lineHeight: 1.5 }}>
                          Explore verified opportunities or share new ones with the community. Every listing is reviewed by the TSS Admin Team before publication to maintain quality and trust.
                        </p>
                      </div>
                      
                      {profile.status === 'Verified' ? (
                        <button onClick={() => setShowPostOppModal(true)} className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Plus size={16} /> Post Opportunity
                        </button>
                      ) : (
                        <button onClick={() => { setActiveTab('profile'); setProfileSubTab('details'); toast.error('Account verification is required to post. Complete your profile details first.'); }} className="btn btn-outline" style={{ borderRadius: '8px', padding: '0.65rem 1.25rem', borderColor: 'var(--accent)', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Lock size={16} /> Verification Required
                        </button>
                      )}
                    </div>

                    {/* Stats overview cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Applications Submitted</span>
                        <strong style={{ display: 'block', fontSize: '1.85rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{appliedJobs.length}</strong>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>My Shared Listings</span>
                        <strong style={{ display: 'block', fontSize: '1.85rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{opportunities.filter(o => o.postedBy === profile.id).length}</strong>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Saved Bookmarks</span>
                        <strong style={{ display: 'block', fontSize: '1.85rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{savedOppIds.length}</strong>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Reputation / Level</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                          <strong style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>{profile.communityScore || 20}</strong>
                          <span style={{ fontSize: '0.7rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>{profile.level || 'Explorer'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Filter categories tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '0.75rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                      {['All', 'Jobs', 'Internships', 'Freelance Gigs', 'Part-time Jobs', 'Projects', 'Startup Collaborations', 'Hackathons', 'Competitions', 'Events', 'Workshops', 'Scholarships', 'Funding', 'Emergency Requests', 'My Posts', 'Saved'].map((cat) => (
                        <button 
                          key={cat}
                          onClick={() => setOppFilterType(cat)}
                          style={{
                            padding: '0.45rem 1rem',
                            borderRadius: '20px',
                            background: oppFilterType === cat ? 'var(--primary-pale)' : 'none',
                            color: oppFilterType === cat ? '#ffffff' : 'var(--text-secondary)',
                            border: '1px solid ' + (oppFilterType === cat ? 'var(--primary-pale)' : 'var(--border-color)'),
                            fontSize: '0.8rem',
                            fontWeight: oppFilterType === cat ? 600 : 'normal',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Search & Filter dropdown inputs */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                      <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          placeholder="Search title, organization, skills..." 
                          value={oppSearch}
                          onChange={(e) => setOppSearch(e.target.value)}
                          className={styles.formInput}
                          style={{ paddingLeft: '2.25rem', width: '100%' }}
                        />
                      </div>
                      
                      <select 
                        value={oppFilterRemote} 
                        onChange={(e) => setOppFilterRemote(e.target.value)}
                        className={styles.formInput} 
                        style={{ maxWidth: '140px', width: '100%', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                      >
                        <option value="All">All Formats</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Onsite">Onsite</option>
                      </select>

                      <select 
                        value={oppSortBy} 
                        onChange={(e) => setOppSortBy(e.target.value)}
                        className={styles.formInput} 
                        style={{ maxWidth: '150px', width: '100%', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                      >
                        <option value="newest">Newest First</option>
                        <option value="trust">Highest Trust</option>
                        <option value="applied">Most Applications</option>
                      </select>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                        <input 
                          type="checkbox" 
                          checked={oppFilterVerifiedOnly} 
                          onChange={(e) => setOppFilterVerifiedOnly(e.target.checked)} 
                        />
                        Verified Users Only
                      </label>
                    </div>

                    {/* Opportunity list */}
                    {(() => {
                      let list = [...opportunities];

                      // 1. Tab filters
                      if (oppFilterType === 'My Posts') {
                        list = list.filter(o => o.postedBy === profile.id);
                      } else if (oppFilterType === 'Saved') {
                        list = list.filter(o => savedOppIds.includes(o.id));
                      } else if (oppFilterType !== 'All') {
                        const typeMap: Record<string, string> = {
                          'Jobs': 'Job', 
                          'Internships': 'Internship', 
                          'Freelance Gigs': 'Freelance Gig',
                          'Part-time Jobs': 'Part-time Job',
                          'Projects': 'Project',
                          'Startup Collaborations': 'Startup Collaboration',
                          'Hackathons': 'Hackathon',
                          'Competitions': 'Competition',
                          'Events': 'Event',
                          'Workshops': 'Workshop',
                          'Scholarships': 'Scholarship',
                          'Funding': 'Funding',
                          'Emergency Requests': 'Emergency Request'
                        };
                        const mappedType = typeMap[oppFilterType] || oppFilterType;
                        list = list.filter(o => o.type === mappedType);
                      }

                      // Only show approved listings to general users unless viewing own draft/pending posts
                      if (oppFilterType !== 'My Posts') {
                        list = list.filter(o => o.status === 'Approved');
                      }

                      // 2. Keyword Filter
                      if (oppSearch.trim()) {
                        const kw = oppSearch.toLowerCase();
                        list = list.filter(o => 
                          o.title.toLowerCase().includes(kw) || 
                          o.description.toLowerCase().includes(kw) || 
                          o.organization.toLowerCase().includes(kw) || 
                          o.skillsRequired?.some((sk: string) => sk.toLowerCase().includes(kw))
                        );
                      }

                      // 3. format Filter
                      if (oppFilterRemote !== 'All') {
                        list = list.filter(o => o.remoteOption === oppFilterRemote);
                      }

                      // 4. Verified Only Filter
                      if (oppFilterVerifiedOnly) {
                        list = list.filter(o => o.trustScore && o.trustScore >= 50);
                      }

                      // 5. Sorting
                      if (oppSortBy === 'newest') {
                        list.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
                      } else if (oppSortBy === 'trust') {
                        list.sort((a, b) => (b.trustScore || 0) - (a.trustScore || 0));
                      } else if (oppSortBy === 'applied') {
                        list.sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0));
                      }

                      if (list.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                            No opportunities found. Change filters or post a new one.
                          </div>
                        );
                      }

                      // Render Cards
                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                          {list.map((opp) => (
                            <div key={opp.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease' }}>
                              
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                  {opp.type}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                  {opp.remoteOption} ({opp.location})
                                </span>
                              </div>

                              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{opp.title}</h4>
                              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                                {opp.organization} 
                                <CheckCircle2 size={12} style={{ color: 'var(--green-light)' }} />
                              </span>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                                <span>By: {opp.postedByName || 'TSS Member'}</span>
                                <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '50%' }}></span>
                                <span>🛡️ Trust Score: {opp.trustScore || 20}</span>
                              </div>

                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1rem 0', height: '2.9rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {opp.description}
                              </p>

                              {opp.skillsRequired && opp.skillsRequired.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1.25rem' }}>
                                  {opp.skillsRequired.slice(0, 3).map((sk: string, index: number) => (
                                    <span key={index} style={{ fontSize: '9px', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                                      {sk}
                                    </span>
                                  ))}
                                  {opp.skillsRequired.length > 3 && (
                                    <span style={{ fontSize: '9px', fontWeight: 700, padding: '0.15rem 0.4rem', color: 'var(--text-muted)' }}>
                                      +{opp.skillsRequired.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}

                              {oppFilterType === 'My Posts' && (
                                <div style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '0.15rem 0.4rem',
                                    borderRadius: '4px',
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    backgroundColor: 
                                      opp.status === 'Approved' ? 'rgba(5, 150, 105, 0.15)' :
                                      opp.status === 'Rejected' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                    color:
                                      opp.status === 'Approved' ? 'var(--green-light)' :
                                      opp.status === 'Rejected' ? '#ef4444' : 'var(--accent)'
                                  }}>
                                    {opp.status}
                                  </span>
                                  {opp.status === 'Rejected' && opp.rejectionReason && (
                                    <p style={{ margin: '0.4rem 0 0 0', color: '#ef4444', fontStyle: 'italic', fontSize: '0.75rem' }}>
                                      Feedback: {opp.rejectionReason}
                                    </p>
                                  )}
                                </div>
                              )}

                              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                                <span>💰 {opp.salaryStipend}</span>
                                <span>📅 Apply by: {opp.deadline}</span>
                              </div>

                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                  onClick={() => setSelectedOpp(opp)}
                                  className="btn btn-outline btn-sm" 
                                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem', borderRadius: '6px' }}
                                >
                                  Details
                                </button>
                                
                                {opp.status === 'Approved' && (
                                  <a 
                                    href={opp.applyLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                      setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, applicationsCount: o.applicationsCount + 1 } : o));
                                    }}
                                    className="btn btn-primary btn-sm" 
                                    style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem', borderRadius: '6px', textAlign: 'center', display: 'inline-block', color: '#ffffff' }}
                                  >
                                    Apply
                                  </a>
                                )}

                                <button 
                                  onClick={() => handleToggleSaveOpportunity(opp.id)}
                                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.45rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'none', color: savedOppIds.includes(opp.id) ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                  <Bookmark size={14} fill={savedOppIds.includes(opp.id) ? 'currentColor' : 'none'} />
                                </button>

                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/opportunities/${opp.id}`);
                                    toast.success('Share link copied to clipboard!');
                                  }}
                                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.45rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                  <Share2 size={14} />
                                </button>
                              </div>

                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* H. EMERGENCY SUPPORT TAB */}
                {activeTab === 'emergency-support' && emergencySubTab === 'feed' && (
                  <div className={`${styles.tabView} fade-in`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ShieldAlert /> Emergency Support
                        </h2>
                        <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Emergency Requests for the Community</span>
                        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '800px', lineHeight: 1.5 }}>
                          Help save lives by responding to verified emergency requests. Every request is manually verified by TSS administrators before publication.
                        </p>
                      </div>
                      
                      <button onClick={() => setShowPostEmModal(true)} className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.65rem 1.25rem', backgroundColor: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Plus size={16} /> Create Emergency Request
                      </button>
                    </div>

                    {/* Critical Warning Banner */}
                    <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <AlertOctagon size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Strict Medical Emergencies Only</strong>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          Fundraising, payments, donations, money requests, or financial requests of any type are strictly prohibited. Violators are permanently banned from the TSS ecosystem.
                        </span>
                      </div>
                    </div>

                    {/* Search & filters */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                      <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          placeholder="Search patient, hospital, city or notes..." 
                          value={emSearch}
                          onChange={(e) => setEmSearch(e.target.value)}
                          className={styles.formInput}
                          style={{ paddingLeft: '2.25rem', width: '100%' }}
                        />
                      </div>

                      <select 
                        value={emFilterGroup} 
                        onChange={(e) => setEmFilterGroup(e.target.value)}
                        className={styles.formInput} 
                        style={{ maxWidth: '160px', width: '100%', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                      >
                        <option value="All">All Blood Groups</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                    </div>

                    {/* Request Cards Grid */}
                    {(() => {
                      let list = emergencies.filter(e => e.status === 'Approved');

                      if (emSearch.trim()) {
                        const kw = emSearch.toLowerCase();
                        list = list.filter(e => 
                          e.patientName.toLowerCase().includes(kw) || 
                          e.hospitalName.toLowerCase().includes(kw) || 
                          e.city.toLowerCase().includes(kw) || 
                          e.medicalNotes?.toLowerCase().includes(kw)
                        );
                      }

                      if (emFilterGroup !== 'All') {
                        list = list.filter(e => e.bloodGroup === emFilterGroup);
                      }

                      // Sort featured/urgent requests to the top
                      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

                      if (list.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                            No active emergency support requests found. Click "Create Emergency Request" to post one.
                          </div>
                        );
                      }

                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                          {list.map((em) => (
                            <div key={em.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid ' + (em.isFeatured ? '#ef4444' : 'var(--border-color)'), borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: em.isFeatured ? '0 4px 20px rgba(239, 68, 68, 0.08)' : 'var(--shadow-sm)', transition: 'all 0.2s ease' }}>
                              
                              {/* Pulsing URGENT pill */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span className={em.isFeatured ? 'pulsing-urgent-badge' : ''} style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <span style={{ width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span> URGENT REQUIREMENT
                                </span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green-light)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  🛡️ TSS VERIFIED
                                </span>
                              </div>

                              <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                {/* Big Circle Blood Group Display */}
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <strong style={{ fontSize: '1.25rem', color: '#ef4444', lineHeight: 1 }}>{em.bloodGroup}</strong>
                                  <span style={{ fontSize: '8px', color: '#ef4444', fontWeight: 800 }}>GROUP</span>
                                </div>
                                
                                <div>
                                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{em.type}</h4>
                                  <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'block' }}>Patient: <strong>{em.patientName}</strong></span>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Required: {em.unitsRequired} Units</span>
                                </div>
                              </div>

                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                                <span>🏥 Hospital: {em.hospitalName}</span>
                                <span>📍 Address: {em.hospitalAddress}, {em.city}</span>
                                <span>⏰ Required before: <strong style={{ color: '#ef4444' }}>{em.requiredBefore}</strong></span>
                              </div>

                              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1.25rem 0', height: '3.0rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontStyle: 'italic' }}>
                                &ldquo;{em.medicalNotes || 'No medical notes provided.'}&rdquo;
                              </p>

                              {/* Action Row */}
                              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                                <a 
                                  href={`tel:${em.phoneNumber}`} 
                                  className="btn btn-outline btn-sm"
                                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                                >
                                  <Phone size={12} /> Call Contact
                                </a>

                                <button 
                                  onClick={() => handleRegisterDonor(em.id)}
                                  className="btn btn-primary btn-sm"
                                  style={{ flex: 1.2, padding: '0.45rem', fontSize: '0.75rem', borderRadius: '6px', backgroundColor: em.potentialDonors?.includes(profile.id) ? 'var(--green-light)' : '#ef4444', borderColor: em.potentialDonors?.includes(profile.id) ? 'var(--green-light)' : '#ef4444', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                                >
                                  <Heart size={12} fill={em.potentialDonors?.includes(profile.id) ? '#ffffff' : 'none'} />
                                  {em.potentialDonors?.includes(profile.id) ? 'Registered (Cancel)' : 'I Can Donate'}
                                </button>
                                
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(`URGENT BLOOD REQUIRED: ${em.bloodGroup} at ${em.hospitalName}, ${em.city}. Contact: ${em.contactPerson} (${em.phoneNumber}). Verified by TSS: ${window.location.origin}/status`);
                                    toast.success('Emergency template copied to clipboard!');
                                  }}
                                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.45rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                  title="Share Emergency Details"
                                >
                                  <Share2 size={14} />
                                </button>
                              </div>

                              {em.donorsCount && em.donorsCount > 0 ? (
                                <div style={{ fontSize: '10px', color: 'var(--green-light)', fontWeight: 700, marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <span>💚</span> {em.donorsCount} TSS Member(s) volunteered to donate.
                                </div>
                              ) : null}

                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* I. NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                  <div className={`${styles.tabView} fade-in`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>System Notifications</h2>
                        <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage your incoming updates, alerts, and platform notifications.</p>
                      </div>
                      
                      {dashboardNotifications.some(n => n.unread) && (
                        <button 
                          onClick={() => {
                            setDashboardNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                            toast.success('All notifications marked as read.');
                          }} 
                          className="btn btn-outline btn-sm"
                          style={{ borderRadius: '8px' }}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {dashboardNotifications.map((nt) => (
                        <div 
                          key={nt.id} 
                          onClick={() => {
                            setDashboardNotifications(prev => prev.map(n => n.id === nt.id ? { ...n, unread: false } : n));
                          }}
                          style={{ 
                            backgroundColor: nt.unread ? 'rgba(59, 130, 246, 0.04)' : 'var(--bg-card)', 
                            border: '1px solid ' + (nt.unread ? 'rgba(59, 130, 246, 0.15)' : 'var(--border-color)'), 
                            borderRadius: '12px', 
                            padding: '1.25rem', 
                            position: 'relative', 
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {nt.unread && (
                            <span style={{ position: 'absolute', left: '12px', top: '24px', width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></span>
                          )}
                          <div style={{ paddingLeft: nt.unread ? '1rem' : 0 }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: nt.unread ? 600 : 'normal', color: 'var(--text-primary)' }}>{nt.text}</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>{nt.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODAL 1: OPPORTUNITY DETAILS OVERLAY */}
                {selectedOpp && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)' }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '2rem', maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'inline-block', marginBottom: '0.5rem' }}>
                            {selectedOpp.type}
                          </span>
                          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{selectedOpp.title}</h3>
                          <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                            {selectedOpp.organization} <CheckCircle2 size={12} style={{ color: 'var(--green-light)' }} />
                          </span>
                        </div>
                        <button 
                          onClick={() => setSelectedOpp(null)}
                          style={{ border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: '10px', fontSize: '0.85rem' }}>
                        <div>📍 Format: <strong>{selectedOpp.remoteOption} ({selectedOpp.location})</strong></div>
                        <div>💰 Compensation: <strong>{selectedOpp.salaryStipend}</strong></div>
                        <div>⏰ Deadline: <strong>{selectedOpp.deadline}</strong></div>
                        {selectedOpp.experienceRequired && <div>💼 Exp: <strong>{selectedOpp.experienceRequired}</strong></div>}
                      </div>

                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Opportunity Description</span>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                          {selectedOpp.description}
                        </p>
                      </div>

                      {selectedOpp.skillsRequired && selectedOpp.skillsRequired.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Required Technical Skills</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {selectedOpp.skillsRequired.map((sk: string, i: number) => (
                              <span key={i} style={{ fontSize: '10px', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contact & Links */}
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                        {selectedOpp.website && (
                          <div>🌐 Website: <a href={selectedOpp.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-pale)', textDecoration: 'underline' }}>{selectedOpp.website}</a></div>
                        )}
                        {selectedOpp.contactEmail && (
                          <div>📧 Contact: <a href={`mailto:${selectedOpp.contactEmail}`} style={{ color: 'var(--primary-pale)' }}>{selectedOpp.contactEmail}</a></div>
                        )}
                        {selectedOpp.supportingLinks && (
                          <div>🔗 Documents/Links: <a href={selectedOpp.supportingLinks} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-pale)', textDecoration: 'underline' }}>{selectedOpp.supportingLinks}</a></div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                          Listing ID: <code>{selectedOpp.id}</code> | Posted on: {new Date(selectedOpp.postedDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                        <button 
                          onClick={() => handleToggleSaveOpportunity(selectedOpp.id)}
                          className="btn btn-outline" 
                          style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Bookmark size={14} fill={savedOppIds.includes(selectedOpp.id) ? 'currentColor' : 'none'} />
                          {savedOppIds.includes(selectedOpp.id) ? 'Saved' : 'Bookmark'}
                        </button>
                        
                        <a 
                          href={selectedOpp.applyLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => {
                            setOpportunities(prev => prev.map(o => o.id === selectedOpp.id ? { ...o, applicationsCount: o.applicationsCount + 1 } : o));
                            setSelectedOpp(null);
                          }}
                          className="btn btn-primary" 
                          style={{ padding: '0.6rem 1.75rem', borderRadius: '8px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#ffffff' }}
                        >
                          Apply Now <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL 2: POST OPPORTUNITY FORM OVERLAY */}
                {showPostOppModal && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)' }}>
                    <form 
                      onSubmit={handlePostOpportunitySubmit}
                      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '2rem', maxWidth: '660px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Post Verified Opportunity</h3>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Share roles, projects, or initiatives with the spot community</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setShowPostOppModal(false)}
                          style={{ border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className={styles.settingsGrid}>
                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Opportunity Type *</label>
                          <select 
                            value={newOppType} 
                            onChange={(e: any) => setNewOppType(e.target.value)}
                            className={styles.formInput} 
                            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem', width: '100%' }}
                            required
                          >
                            <option value="Job">Job</option>
                            <option value="Internship">Internship</option>
                            <option value="Freelance Gig">Freelance Gig</option>
                            <option value="Part-time Job">Part-time Job</option>
                            <option value="Project">Project</option>
                            <option value="Startup Collaboration">Startup Collaboration</option>
                            <option value="Hackathon">Hackathon</option>
                            <option value="Competition">Competition</option>
                            <option value="Event">Event</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Scholarship">Scholarship</option>
                            <option value="Funding">Funding</option>
                            <option value="Emergency Request">Emergency Request</option>
                          </select>
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Opportunity Title *</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Next.js Developer"
                            value={newOppTitle}
                            onChange={(e) => setNewOppTitle(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField} style={{ gridColumn: 'span 2' }}>
                          <label className={styles.formLabel}>Full Description *</label>
                          <textarea 
                            placeholder="Detail out roles, responsibilities, context, qualifications, and project scopes..."
                            value={newOppDesc}
                            onChange={(e) => setNewOppDesc(e.target.value)}
                            className={styles.formInput}
                            rows={4}
                            style={{ resize: 'vertical' }}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Organization Name *</label>
                          <input 
                            type="text" 
                            placeholder="Company, Lab, or Project name"
                            value={newOppOrg}
                            onChange={(e) => setNewOppOrg(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Location City *</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Hyderabad, Remote"
                            value={newOppLocation}
                            onChange={(e) => setNewOppLocation(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Work format *</label>
                          <select 
                            value={newOppRemote} 
                            onChange={(e: any) => setNewOppRemote(e.target.value)}
                            className={styles.formInput} 
                            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem', width: '100%' }}
                            required
                          >
                            <option value="Onsite">Onsite</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Salary / Stipend *</label>
                          <input 
                            type="text" 
                            placeholder="e.g. ₹20,000/month or Equity"
                            value={newOppSalary}
                            onChange={(e) => setNewOppSalary(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Required Skills (Comma separated) *</label>
                          <input 
                            type="text" 
                            placeholder="e.g. React, Node.js, Python"
                            value={newOppSkills}
                            onChange={(e) => setNewOppSkills(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Application Deadline *</label>
                          <input 
                            type="date" 
                            value={newOppDeadline}
                            onChange={(e) => setNewOppDeadline(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField} style={{ gridColumn: 'span 2' }}>
                          <label className={styles.formLabel}>Application / Apply Link (External URL) *</label>
                          <input 
                            type="url" 
                            placeholder="https://company.com/careers or Form link"
                            value={newOppLink}
                            onChange={(e) => setNewOppLink(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Website URL (Optional)</label>
                          <input 
                            type="url" 
                            placeholder="https://company.com"
                            value={newOppWebsite}
                            onChange={(e) => setNewOppWebsite(e.target.value)}
                            className={styles.formInput}
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Contact Person Email (Optional)</label>
                          <input 
                            type="email" 
                            placeholder="hiring@company.com"
                            value={newOppEmail}
                            onChange={(e) => setNewOppEmail(e.target.value)}
                            className={styles.formInput}
                          />
                        </div>

                        <div className={styles.formField} style={{ gridColumn: 'span 2' }}>
                          <label className={styles.formLabel}>Experience Required (Optional)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Fresher, 1-2 years, No limit"
                            value={newOppExperience}
                            onChange={(e) => setNewOppExperience(e.target.value)}
                            className={styles.formInput}
                          />
                        </div>

                        <div className={styles.formField} style={{ gridColumn: 'span 2' }}>
                          <label className={styles.formLabel}>Supporting links / PDF Docs (Optional)</label>
                          <input 
                            type="url" 
                            placeholder="Google Drive link to JD sheet"
                            value={newOppLinks}
                            onChange={(e) => setNewOppLinks(e.target.value)}
                            className={styles.formInput}
                          />
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <input 
                            type="checkbox" 
                            id="terms-check" 
                            checked={newOppTerms} 
                            onChange={(e) => setNewOppTerms(e.target.checked)} 
                            style={{ marginTop: '0.2rem' }}
                            required
                          />
                          <label htmlFor="terms-check" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, cursor: 'pointer' }}>
                            I agree that this opportunity is authentic, verified, does not require candidate payment, and complies with TSS ecosystem quality standards.
                          </label>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                        <button 
                          type="button" 
                          onClick={() => setShowPostOppModal(false)}
                          className="btn btn-outline" 
                          style={{ padding: '0.55rem 1.25rem', borderRadius: '8px' }}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          disabled={isSubmittingOpp}
                          className="btn btn-primary" 
                          style={{ padding: '0.55rem 1.75rem', borderRadius: '8px' }}
                        >
                          {isSubmittingOpp ? 'Submitting...' : 'Submit for Review'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* MODAL 3: POST EMERGENCY REQUEST OVERLAY */}
                {showPostEmModal && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)' }}>
                    <form 
                      onSubmit={handlePostEmergencySubmit}
                      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '2rem', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ef4444', margin: 0 }}>Create Medical Emergency Request</h3>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Volunteers and matching blood donors will receive instant alerts.</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setShowPostEmModal(false)}
                          style={{ border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Warning */}
                      <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: '10px', padding: '1rem', fontSize: '0.75rem', color: '#ef4444', lineHeight: 1.4 }}>
                        🚨 <strong>CRITICAL POLICY REMINDER</strong>: Absolutely no fundraising links, UPI IDs, money details, or payment requests are allowed. Requests containing financial claims will be rejected instantly and flagged.
                      </div>

                      <div className={styles.settingsGrid}>
                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Emergency Type *</label>
                          <select 
                            value={newEmType} 
                            onChange={(e: any) => setNewEmType(e.target.value)}
                            className={styles.formInput} 
                            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem', width: '100%' }}
                            required
                          >
                            <option value="Blood Requirement">Blood Requirement</option>
                            <option value="Platelet Requirement">Platelet Requirement</option>
                            <option value="Rare Blood Group Requirement">Rare Blood Group Requirement</option>
                            <option value="Emergency Blood Donor">Emergency Blood Donor</option>
                            <option value="Medical Volunteer Request">Medical Volunteer Request</option>
                          </select>
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Patient Name *</label>
                          <input 
                            type="text" 
                            placeholder="Full name of the patient"
                            value={newEmPatientName}
                            onChange={(e) => setNewEmPatientName(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Hospital Name *</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Apollo Hospital"
                            value={newEmHospitalName}
                            onChange={(e) => setNewEmHospitalName(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Hospital Address *</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Road No 2, Banjara Hills"
                            value={newEmAddress}
                            onChange={(e) => setNewEmAddress(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>City *</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Hyderabad"
                            value={newEmCity}
                            onChange={(e) => setNewEmCity(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Blood Group Required *</label>
                          <select 
                            value={newEmBloodGroup} 
                            onChange={(e: any) => setNewEmBloodGroup(e.target.value)}
                            className={styles.formInput} 
                            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem', width: '100%' }}
                            required
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="Unknown">Unknown</option>
                          </select>
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Units Required *</label>
                          <input 
                            type="number" 
                            min={1}
                            value={newEmUnits}
                            onChange={(e) => setNewEmUnits(Number(e.target.value))}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Required Before Date *</label>
                          <input 
                            type="date" 
                            value={newEmBefore}
                            onChange={(e) => setNewEmBefore(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Contact Person *</label>
                          <input 
                            type="text" 
                            placeholder="Name of family contact member"
                            value={newEmContactPerson}
                            onChange={(e) => setNewEmContactPerson(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Contact Phone Number *</label>
                          <input 
                            type="tel" 
                            placeholder="e.g. 9876543210"
                            value={newEmPhone}
                            onChange={(e) => setNewEmPhone(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField} style={{ gridColumn: 'span 2' }}>
                          <label className={styles.formLabel}>Hospital Medical Proof / ID / case sheet (Link / text description) *</label>
                          <input 
                            type="text" 
                            placeholder="Drive link to case sheet, or Patient ID card details to verify authenticity"
                            value={newEmProof}
                            onChange={(e) => setNewEmProof(e.target.value)}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formField} style={{ gridColumn: 'span 2' }}>
                          <label className={styles.formLabel}>Emergency Medical Notes *</label>
                          <textarea 
                            placeholder="Undergoing surgery, accident case, critical platelet count drops, etc..."
                            value={newEmNotes}
                            onChange={(e) => setNewEmNotes(e.target.value)}
                            className={styles.formInput}
                            rows={3}
                            style={{ resize: 'vertical' }}
                            required
                          />
                        </div>

                        <div className={styles.formField} style={{ gridColumn: 'span 2' }}>
                          <label className={styles.formLabel}>Additional Information / Instructions (Optional)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Attenders should report at block 3, 2nd floor ICU"
                            value={newEmInfo}
                            onChange={(e) => setNewEmInfo(e.target.value)}
                            className={styles.formInput}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                        <button 
                          type="button" 
                          onClick={() => setShowPostEmModal(false)}
                          className="btn btn-outline" 
                          style={{ padding: '0.55rem 1.25rem', borderRadius: '8px' }}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          disabled={isSubmittingEm}
                          className="btn btn-primary" 
                          style={{ padding: '0.55rem 1.75rem', borderRadius: '8px', backgroundColor: '#ef4444', borderColor: '#ef4444' }}
                        >
                          {isSubmittingEm ? 'Submitting...' : 'Submit Verification'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* H. DASHBOARD HOME TAB */}
                {activeTab === 'dashboard-home' && (
                  <div className={`${styles.tabView} fade-in`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Welcome back, {profile.fullName}!</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Ecosystem Member ID: <strong style={{ color: 'var(--accent)' }}>{profile.memberId || 'Pending'}</strong></p>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '20px', backgroundColor: profile.status === 'Verified' ? 'rgba(5, 150, 105, 0.12)' : 'rgba(245, 158, 11, 0.12)', color: profile.status === 'Verified' ? 'var(--green-light)' : 'var(--accent)' }}>
                          🛡️ {profile.status === 'Verified' ? 'Verified Student' : profile.status}
                        </span>
                        {!hasCheckedInToday ? (
                          <button onClick={handleDailyCheckIn} className="btn btn-primary" style={{ padding: '0.45rem 1.25rem', fontSize: '0.8rem', borderRadius: '8px' }}>
                            ⚡ Daily Check In
                          </button>
                        ) : (
                          <button disabled className="btn btn-outline" style={{ padding: '0.45rem 1.25rem', fontSize: '0.8rem', borderRadius: '8px', opacity: 0.6 }}>
                            ✓ Checked In Today
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quick Metrics Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Ecosystem Level</span>
                        <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{profile.level || 'Explorer'}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status verified</span>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Community Points</span>
                        <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{profile.communityScore || 20}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accumulated score</span>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Daily Streak</span>
                        <strong style={{ display: 'block', fontSize: '1.65rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>🔥 {streak} Days</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consistency tracking</span>
                      </div>
                    </div>

                    <div className={styles.dashboardSplit}>
                      {/* Left: Quick Actions */}
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Ecosystem Quick Actions</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                          <button onClick={() => { setActiveTab('profile'); setProfileSubTab('details'); }} className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', borderRadius: '12px', gap: '0.5rem', textAlign: 'center', height: '110px' }}>
                            <User size={24} style={{ color: 'var(--primary-pale)' }} />
                            <strong style={{ fontSize: '0.85rem' }}>Complete Profile</strong>
                          </button>
                          <button onClick={() => setActiveTab('resume')} className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', borderRadius: '12px', gap: '0.5rem', textAlign: 'center', height: '110px' }}>
                            <FileText size={24} style={{ color: 'var(--primary-pale)' }} />
                            <strong style={{ fontSize: '0.85rem' }}>Resume Studio</strong>
                          </button>
                          <button onClick={() => setActiveTab('opportunity-hub')} className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', borderRadius: '12px', gap: '0.5rem', textAlign: 'center', height: '110px' }}>
                            <Briefcase size={24} style={{ color: 'var(--primary-pale)' }} />
                            <strong style={{ fontSize: '0.85rem' }}>Browse Opportunities</strong>
                          </button>
                          <button onClick={() => { setActiveTab('opportunity-hub'); setShowPostOppModal(true); }} className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', borderRadius: '12px', gap: '0.5rem', textAlign: 'center', height: '110px' }}>
                            <Plus size={24} style={{ color: 'var(--primary-pale)' }} />
                            <strong style={{ fontSize: '0.85rem' }}>Post Opportunity</strong>
                          </button>
                          <button onClick={() => setActiveTab('build')} className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', borderRadius: '12px', gap: '0.5rem', textAlign: 'center', height: '110px' }}>
                            <TrendingUp size={24} style={{ color: 'var(--primary-pale)' }} />
                            <strong style={{ fontSize: '0.85rem' }}>Build Challenge</strong>
                          </button>
                          <button onClick={() => setActiveTab('card')} className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', borderRadius: '12px', gap: '0.5rem', textAlign: 'center', height: '110px' }}>
                            <Award size={24} style={{ color: 'var(--primary-pale)' }} />
                            <strong style={{ fontSize: '0.85rem' }}>Download TSS Card</strong>
                          </button>
                          <button onClick={() => setActiveTab('community')} className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', borderRadius: '12px', gap: '0.5rem', textAlign: 'center', height: '110px' }}>
                            <Globe size={24} style={{ color: 'var(--primary-pale)' }} />
                            <strong style={{ fontSize: '0.85rem' }}>Community Lounges</strong>
                          </button>
                          <button onClick={() => setActiveTab('emergency-support')} className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', borderRadius: '12px', gap: '0.5rem', textAlign: 'center', height: '110px' }}>
                            <ShieldAlert size={24} style={{ color: '#ef4444' }} />
                            <strong style={{ fontSize: '0.85rem', color: '#ef4444' }}>Emergency Support</strong>
                          </button>
                        </div>
                      </div>

                      {/* Right: Upcoming Events & Activity */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Ecosystem Events</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                              <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-primary)' }}>TSS Real Problem Hackathon</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📅 Starts July 10, 2026 | Google Meet</span>
                            </div>
                            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                              <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-primary)' }}>Monthly Sandbox Build Review</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📅 Weekly Status updates starting Sunday</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Ecosystem Quick Links</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <a href="https://chat.whatsapp.com/tss" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '0.6rem 1rem', backgroundColor: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.2)', color: 'var(--green-light)', borderRadius: '8px', fontSize: '0.825rem', fontWeight: 600, textDecoration: 'none' }}>
                              💚 WhatsApp Lounge Invitation
                            </a>
                            <a href="https://t.me/tss" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '0.6rem 1rem', backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#3b82f6', borderRadius: '8px', fontSize: '0.825rem', fontWeight: 600, textDecoration: 'none' }}>
                              💙 Telegram Lounge Invitation
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* I. APPLICATIONS TAB */}
                {activeTab === 'opportunity-hub' && oppsSubTab === 'applications' && (
                  <div className={`${styles.tabView} fade-in`}>
                    <h2>My Applications</h2>
                    <p>Track the hiring progress, referral recommendations, and status updates of your submitted applications.</p>
                    
                    {appliedJobs.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '4rem 1.5rem', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
                        You haven't submitted any job or opportunity applications yet.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                        {appliedJobs.map((app, i) => (
                          <div key={i} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'block' }}>{app.jobTitle}</strong>
                              <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>{app.companyName}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>Applied on: {new Date(app.appliedDate).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', textTransform: 'uppercase' }}>
                                Stage: {app.stage || 'Applied'}
                              </span>
                              {app.feedback && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>&ldquo;{app.feedback}&rdquo;</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* J. SAVED OPPORTUNITIES TAB */}
                {activeTab === 'opportunity-hub' && oppsSubTab === 'saved' && (
                  <div className={`${styles.tabView} fade-in`}>
                    <h2>Saved Bookmarks</h2>
                    <p>Keep track of opportunities you have saved for later review or reference.</p>
                    
                    {(() => {
                      const bookmarked = opportunities.filter(o => savedOppIds.includes(o.id));
                      if (bookmarked.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
                            No saved opportunities. Go to the Opportunities tab to bookmark roles.
                          </div>
                        );
                      }
                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                          {bookmarked.map(opp => (
                            <div key={opp.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                  {opp.type}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                  {opp.remoteOption} ({opp.location})
                                </span>
                              </div>
                              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{opp.title}</h4>
                              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                                {opp.organization} <CheckCircle2 size={12} style={{ color: 'var(--green-light)' }} />
                              </span>
                              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setSelectedOpp(opp)} className="btn btn-outline btn-sm" style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem', borderRadius: '6px' }}>Details</button>
                                <button onClick={() => handleToggleSaveOpportunity(opp.id)} className="btn btn-sm" style={{ padding: '0.45rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'none', color: 'var(--accent)' }}>
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* K. EVENTS TAB */}
                {activeTab === 'events' && (
                  <div className={`${styles.tabView} fade-in`}>
                    <h2>Ecosystem Events</h2>
                    <p>Register and attend verified events, hackathons, and cohort reviews organized by TSS partners.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'inline-block', marginBottom: '0.75rem' }}>
                          Real Problem Hackathon
                        </span>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>TSS Real Problem Hackathon Kickoff</h4>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          Assemble teams, select real challenges submitted by community organizations, and start building. Winners receive direct startup incubation support.
                        </p>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏰ Schedule: <strong>July 10, 2026 at 6:00 PM</strong> | Venue: <strong>Google Meet Lounge</strong></div>
                      </div>
                      
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'inline-block', marginBottom: '0.75rem' }}>
                          Build Challenge Status
                        </span>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Sandbox Weekly Review & Demo Day Prep</h4>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          Get feedback on your sandbox progress from Malla Reddy University and corporate mentors. Align builds with placement tracks.
                        </p>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏰ Schedule: <strong>Every Sunday at 4:00 PM</strong> | Venue: <strong>TSS Private Discord Channel</strong></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* L. COMMUNITY TAB */}
                {activeTab === 'community' && (
                  <div className={`${styles.tabView} fade-in`}>
                    <h2>Community Lounges</h2>
                    <p>Get verified access to exclusive student groups, mentors, founders, and recruitment circles.</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>🟢 WhatsApp Official Lounge</strong>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>Directly interact with student builders and core community mentors.</p>
                        <a href="https://chat.whatsapp.com/tss" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ marginTop: 'auto', textAlign: 'center', borderColor: 'var(--green-light)', color: 'var(--green-light)' }}>Join WhatsApp Lounge</a>
                      </div>
                      
                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>🔵 Telegram Resource Channel</strong>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>Access hackathon sheets, placement sheets, templates, and sandbox docs.</p>
                        <a href="https://t.me/tss" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ marginTop: 'auto', textAlign: 'center', borderColor: '#3b82f6', color: '#3b82f6' }}>Join Telegram Channel</a>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>💼 LinkedIn Directory</strong>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>View placement directories, verified profile shares, and recruiter recommendations.</p>
                        <a href="https://linkedin.com/company/thestudentsspot" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ marginTop: 'auto', textAlign: 'center' }}>Follow Directory</a>
                      </div>
                    </div>
                  </div>
                )}

              </main>

            </div>
          )}

        </div>
      </section>
    </div>
  );
}
