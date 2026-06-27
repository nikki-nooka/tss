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
  Briefcase
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
  registrationDate: string;
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

export default function CandidateDashboard() {
  const toast = useToast();
  
  // Auth states
  const [memberIdInput, setMemberIdInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  
  // Dashboard navigation tab
  const [activeTab, setActiveTab] = useState<'card' | 'resume' | 'levels' | 'build' | 'settings' | 'jobs'>('card');
  
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
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  
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
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
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
    if (!memberIdInput.trim() || !emailInput.trim()) {
      toast.error('Please fill in both Member ID and Email.');
      return;
    }
    
    setIsAuthenticating(true);
    try {
      const res = await fetch('/api/auth/candidate-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: memberIdInput.trim(),
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
        portfolio: editPortfolio
      };

      const res = await fetch('/api/auth/update-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profile.id, updates })
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Profile settings updated successfully!');
        
        // Update local session state
        const updatedProfile: CandidateProfile = {
          ...profile,
          ...updates,
          graduationYear: editGraduationYear ? Number(editGraduationYear) : null,
          skills: editSkills.split(',').map(s => s.trim()).filter(Boolean)
        };
        localStorage.setItem('tss_candidate_session', JSON.stringify(updatedProfile));
        setProfile(updatedProfile);
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
    if (activeTab === 'jobs' && profile) {
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
  const handleDownloadPdf = () => {
    if (!profile) return;
    toast.info('Preparing Digital ID card...');

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      // @ts-ignore
      const html2pdf = window.html2pdf;
      const cardElement = document.getElementById('tss-id-card');
      if (!cardElement) return;

      const clone = cardElement.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.width = '440px';
      clone.style.height = '270px';
      clone.style.margin = '0';
      clone.style.position = 'relative';

      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '0';
      tempContainer.style.left = '0';
      tempContainer.style.width = '440px';
      tempContainer.style.height = '270px';
      tempContainer.style.opacity = '0';
      tempContainer.style.zIndex = '-9999';
      tempContainer.appendChild(clone);
      document.body.appendChild(tempContainer);

      const opt = {
        margin: 0,
        filename: `TSS_Card_${profile.memberId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, backgroundColor: '#0f172a' },
        jsPDF: { unit: 'px', format: [440, 270], orientation: 'landscape' }
      };

      html2pdf().from(clone).set(opt).save()
        .then(() => {
          document.body.removeChild(tempContainer);
          toast.success('Digital Card PDF Downloaded!');
        })
        .catch(() => {
          if (document.body.contains(tempContainer)) document.body.removeChild(tempContainer);
          toast.error('PDF generation failed.');
        });
    };
    document.body.appendChild(script);
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
        <div className="container">
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
        <div className="container">
          
          {/* 1. SIGN IN INTERFACE */}
          {!profile ? (
            <div className={styles.loginCard}>
              <div className={styles.loginHeader}>
                <Shield className={styles.lockIcon} size={40} />
                <h2>Verified Account Sign In</h2>
                <p>Enter your approved Member ID and registered email to unlock your workspace.</p>
              </div>

              <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>TSS Member ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. TSS-ST-240626001" 
                    value={memberIdInput}
                    onChange={(e) => setMemberIdInput(e.target.value)}
                    className={styles.formInput}
                    required
                  />
                </div>

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
                  <span>CANDIDATE PANEL</span>
                </div>
                
                <nav className={styles.sidebarMenu}>
                  <button 
                    onClick={() => setActiveTab('card')}
                    className={`${styles.sidebarItem} ${activeTab === 'card' ? styles.sidebarItemActive : ''}`}
                  >
                    <User size={18} />
                    <span>My Member Card</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('resume')}
                    className={`${styles.sidebarItem} ${activeTab === 'resume' ? styles.sidebarItemActive : ''}`}
                  >
                    <FileText size={18} />
                    <span>Resume Studio</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('levels')}
                    className={`${styles.sidebarItem} ${activeTab === 'levels' ? styles.sidebarItemActive : ''}`}
                  >
                    <Layers size={18} />
                    <span>Vetting Levels</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('build')}
                    className={`${styles.sidebarItem} ${activeTab === 'build' ? styles.sidebarItemActive : ''}`}
                  >
                    <Calendar size={18} />
                    <span>Build Challenge</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('jobs')}
                    className={`${styles.sidebarItem} ${activeTab === 'jobs' ? styles.sidebarItemActive : ''}`}
                  >
                    <Briefcase size={18} />
                    <span>Jobs & Openings</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`${styles.sidebarItem} ${activeTab === 'settings' ? styles.sidebarItemActive : ''}`}
                  >
                    <Settings size={18} />
                    <span>Account Settings</span>
                  </button>
                </nav>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                  <LogOut size={16} /> Logout
                </button>
              </aside>

              {/* Right View Panel */}
              <main className={styles.mainPanel}>
                
                {/* A. DIGITAL MEMBER CARD TAB */}
                {activeTab === 'card' && (
                  <div className={`${styles.tabView} fade-in`}>
                    <h2>Digital Membership Card</h2>
                    <p>Your verified credentials card represents high-trust security. Once verified, download it or share the QR validation code.</p>
                    
                    {profile.status !== 'Verified' && (
                      <div className={styles.pendingBanner} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
                        <ShieldAlert className={styles.pendingIcon} style={{ color: 'var(--primary)' }} size={24} />
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Account Vetting in Progress</strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Your profile is currently under manual audit. The verified resume studio, vetting levels logs, and Build sandbox submission features will unlock automatically once an administrator approves your registration.
                          </span>
                        </div>
                      </div>
                    )}

                    <div className={styles.cardContainer}>
                      <div id="tss-id-card" className={styles.memberCardVirtual}>
                        <div className={styles.cardGlow}></div>
                        <div className={styles.meshBg}></div>
                        
                        <div className={styles.cardHeader}>
                          <div className={styles.cardLogo}>
                            <Award className={styles.cardLogoIcon} size={18} />
                            <span>THE STUDENT SPOT</span>
                          </div>
                          <div className={`${styles.cardStatusBadge} ${profile.status === 'Verified' ? styles.statusVerified : styles.statusPending}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                            <span className={styles.statusDot} style={{ width: '6px', height: '6px', backgroundColor: profile.status === 'Verified' ? 'var(--success)' : 'var(--secondary)', borderRadius: '50%' }}></span> {profile.status === 'Verified' ? 'VERIFIED MEMBER' : 'UNDER AUDIT'}
                          </div>
                        </div>

                        <div className={styles.cardProfileBlock}>
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
                            <span className={styles.memberRoleTag}>{profile.role}</span>
                          </div>
                        </div>

                        <div className={styles.cardFooterGrid}>
                          <div className={styles.detailsColumn}>
                            <span className={styles.detailsLabel}>TSS MEMBER ID</span>
                            <span className={styles.memberIdCode}>{profile.status === 'Verified' ? profile.memberId : 'PENDING AUDIT'}</span>
                          </div>
                          
                          <div className={styles.detailsColumn}>
                            <span className={styles.detailsLabel}>LOCATION</span>
                            <span className={styles.detailsValue}>{profile.city}, {profile.state}</span>
                          </div>

                          <div className={styles.detailsColumn}>
                            <span className={styles.detailsLabel}>{profile.status === 'Verified' ? 'VERIFIED ON' : 'SUBMITTED ON'}</span>
                            <span className={styles.detailsValue}>{formatDate(profile.registrationDate)}</span>
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
                      </div>
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
                  </div>
                )}

                {/* B. RESUME STUDIO TAB */}
                {activeTab === 'resume' && (
                  profile.status !== 'Verified' ? renderLockedState('Resume Studio') : (
                    <div className={`${styles.tabView} fade-in`}>
                    <h2>TSS Resume Studio</h2>
                    <p>Customize and download print-ready resumes tailored for different application settings.</p>
                    
                    <div className={styles.templateSelector}>
                      <button
                        type="button"
                        onClick={() => setSelectedTemplate('FAANG')}
                        className={`${styles.templateBtn} ${selectedTemplate === 'FAANG' ? styles.activeTemplateBtn : ''}`}
                      >
                        FAANG (ATS Minimal)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTemplate('Startup')}
                        className={`${styles.templateBtn} ${selectedTemplate === 'Startup' ? styles.activeTemplateBtn : ''}`}
                      >
                        Startup (Modern/Tech)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTemplate('General')}
                        className={`${styles.templateBtn} ${selectedTemplate === 'General' ? styles.activeTemplateBtn : ''}`}
                      >
                        General (Standard Business)
                      </button>
                    </div>

                    <div className={styles.studioGrid}>
                      {/* Left: Editor */}
                      <div className={styles.editorPanel}>
                        <h3>1. Edit Resume Details</h3>

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
                {activeTab === 'levels' && (
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
                {activeTab === 'build' && (
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
                {activeTab === 'settings' && (
                  <form onSubmit={handleSaveSettings} className={`${styles.tabView} fade-in`}>
                    <h2>Account Settings</h2>
                    <p>Update your registration parameters. These changes sync with the database and dynamically update your resume builder.</p>
                    
                    <div className={styles.settingsGrid}>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Full Name</label>
                        <input 
                          type="text" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={styles.formInput}
                          required
                        />
                      </div>

                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Mobile Number</label>
                        <input 
                          type="text" 
                          value={editMobile}
                          onChange={(e) => setEditMobile(e.target.value)}
                          className={styles.formInput}
                          required
                        />
                      </div>

                      <div className={styles.formField}>
                        <label className={styles.formLabel}>College / Institution</label>
                        <input 
                          type="text" 
                          value={editCollege}
                          onChange={(e) => setEditCollege(e.target.value)}
                          className={styles.formInput}
                        />
                      </div>

                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Graduation Year</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 2026" 
                          value={editGraduationYear}
                          onChange={(e) => setEditGraduationYear(e.target.value)}
                          className={styles.formInput}
                        />
                      </div>

                      <div className={styles.formField} style={{ gridColumn: 'span 2' }}>
                        <label className={styles.formLabel}>Skills (separated by commas)</label>
                        <input 
                          type="text" 
                          placeholder="React, Next.js, Python, PostgreSQL" 
                          value={editSkills}
                          onChange={(e) => setEditSkills(e.target.value)}
                          className={styles.formInput}
                        />
                      </div>

                      <div className={styles.formField}>
                        <label className={styles.formLabel}>LinkedIn Profile</label>
                        <input 
                          type="url" 
                          value={editLinkedin}
                          onChange={(e) => setEditLinkedin(e.target.value)}
                          className={styles.formInput}
                          required
                        />
                      </div>

                      <div className={styles.formField}>
                        <label className={styles.formLabel}>GitHub Profile</label>
                        <input 
                          type="url" 
                          value={editGithub}
                          onChange={(e) => setEditGithub(e.target.value)}
                          className={styles.formInput}
                        />
                      </div>

                      <div className={styles.formField} style={{ gridColumn: 'span 2' }}>
                        <label className={styles.formLabel}>Portfolio Website</label>
                        <input 
                          type="url" 
                          value={editPortfolio}
                          onChange={(e) => setEditPortfolio(e.target.value)}
                          className={styles.formInput}
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={isUpdatingSettings} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                      {isUpdatingSettings ? 'Saving Settings...' : 'Save Profile Changes'}
                    </button>
                  </form>
                )}

                {/* F. JOBS BOARD TAB */}
                {activeTab === 'jobs' && (
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
                              {job.appliedStatus ? (
                                <button disabled style={{ backgroundColor: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)', color: 'var(--green-light)', padding: '0.55rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <CheckCircle2 size={14} /> Applied ({job.appliedStatus})
                                </button>
                              ) : (
                                <button 
                                  onClick={() => setSelectedJobForApply(job)}
                                  disabled={profile.status !== 'Verified'}
                                  className="btn btn-primary"
                                  style={{ padding: '0.55rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem' }}
                                >
                                  Apply Direct
                                </button>
                              )}
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

              </main>

            </div>
          )}

        </div>
      </section>
    </div>
  );
}
