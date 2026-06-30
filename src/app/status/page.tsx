'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  Search, 
  Shield, 
  Clock, 
  CheckCircle2, 
  AlertOctagon, 
  HelpCircle, 
  ArrowRight, 
  Award, 
  User, 
  Download,
  ShieldAlert
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface CandidateStatus {
  success: boolean;
  fullName: string;
  role: 'Student' | 'Founder' | 'Recruiter' | 'Mentor' | 'Investor' | 'Working Professional' | string;
  status: 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'Needs Changes' | 'Suspended' | string;
  notes?: string | null;
  memberId: string | null;
  highestQualification?: string | null;
  preferredRoles?: string[];
  registrationDate: string;
  city: string;
  state: string;
  photoPath?: string | null;
  email?: string;
  mobile?: string;
  linkedin?: string;
  github?: string | null;
  portfolio?: string | null;
  skills?: string[];
  college?: string | null;
  graduationYear?: number | null;
  username?: string;
  communityScore?: number;
  level?: string;
  memberSince?: string;
  roleDetails?: any;
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

export default function Status() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useState('');
  const [candidate, setCandidate] = useState<CandidateStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'FAANG' | 'Startup' | 'General'>('FAANG');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    if (candidate && candidate.status === 'Verified') {
      setResumeData({
        fullName: candidate.fullName || '',
        email: candidate.email || '',
        mobile: candidate.mobile || '',
        linkedin: candidate.linkedin || '',
        github: candidate.github || '',
        portfolio: candidate.portfolio || '',
        skills: Array.isArray(candidate.skills) ? candidate.skills.join(', ') : '',
        education: [
          {
            institution: candidate.college || 'My University',
            degree: candidate.highestQualification || 'Bachelor of Technology',
            year: candidate.graduationYear ? String(candidate.graduationYear) : '2026'
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
  }, [candidate]);

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

  const handleDownloadResumePdf = () => {
    if (!resumeData) return;
    toast.info('Generating your resume PDF...');

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      // @ts-ignore
      const html2pdf = window.html2pdf;
      const resumeElement = document.getElementById('tss-resume-preview');

      if (!resumeElement) {
        toast.error('Resume preview element not found.');
        return;
      }

      const opt = {
        margin: [0.4, 0.4, 0.4, 0.4],
        filename: `TSS_Resume_${resumeData.fullName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2.5,
          useCORS: true,
          logging: false
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().from(resumeElement).set(opt).save()
        .then(() => {
          toast.success('Resume Downloaded Successfully!');
        })
        .catch((err: any) => {
          console.error(err);
          toast.error('Failed to generate Resume PDF.');
        });
    };
    script.onerror = () => {
      toast.error('Failed to load PDF library.');
    };
    document.body.appendChild(script);
  };

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

  // Auto check status if URL has memberId or if recent registration exists in localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlMemberId = params.get('memberId');

    if (urlMemberId) {
      const cleanId = urlMemberId.trim().toUpperCase();
      setSearchInput(cleanId);
      fetchStatus(cleanId);
      return;
    }

    const savedEmail = localStorage.getItem('tss_registered_email');
    const savedMobile = localStorage.getItem('tss_registered_mobile');
    const autoQuery = savedEmail || savedMobile;

    if (autoQuery) {
      setSearchInput(autoQuery);
      fetchStatus(autoQuery);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.error('Please enter your email, mobile number, or Member ID');
      return;
    }
    fetchStatus(searchInput.trim());
  };

  const fetchStatus = async (queryVal: string) => {
    setIsLoading(true);
    setSearched(true);
    try {
      const val = queryVal.trim();
      const res = await fetch(`/api/status-check?query=${encodeURIComponent(val)}`);
      const data = await res.json();

      if (data.success) {
        setCandidate(data);
        if (data.status === 'Verified') {
          localStorage.setItem('tss_community_unlocked', 'true');
        }
      } else {
        setCandidate(null);
        toast.error(data.error || 'No registered candidate found.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network connection error. Try again.');
    } finally {
      setIsLoading(false);
    }
  };



  // Dynamic script loader for html2pdf.js to save card as PDF
  const handleDownloadPdf = async () => {
    const printElement = document.getElementById('print-area');
    if (!printElement) {
      toast.error('Card print area not found.');
      return;
    }

    toast.info('Preparing your Digital ID card PDF...');

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
        filename:     `TSS_Member_Card_${candidate?.memberId || 'Card'}.pdf`,
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

      toast.success('PDF Card Downloaded!');
    } catch (err) {
      console.error(err);
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

      toast.error('Failed to generate PDF download.');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.statusPage}>
      {/* Header Banner */}
      <section className={styles.statusHeader}>
        <div className="container">
          <span className={styles.subTitle}>Vetting Lookup</span>
          <h1>Membership Status Check</h1>
          <p className={styles.tagline}>
            Search your registration queue status. If approved, your verified Member Card and ID will be unlocked below.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className={styles.statusContent}>
        <div className="container">
          <div className={styles.statusCard}>
            
            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input
                  type="text"
                  placeholder="Enter registered Email Address or 10-digit Mobile Number"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className={styles.statusSearchInput}
                />
              </div>
              <button type="submit" disabled={isLoading} className="btn btn-primary">
                {isLoading ? 'Checking...' : 'Check Status'}
              </button>
            </form>

            {/* Results display */}
            {isLoading && (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Retrieving registration profile...</p>
              </div>
            )}

            {!isLoading && searched && !candidate && (
              <div className={styles.noResultCard}>
                <AlertOctagon size={48} className={styles.alertIconRed} />
                <h3>No Profile Found</h3>
                <p>
                  We couldn't find any pending or verified profile matching "<strong>{searchInput}</strong>".
                  Please verify that you typed it correctly or try registering.
                </p>
                <Link href="/register" className="btn btn-secondary">
                  Start New Registration
                </Link>
              </div>
            )}

            {!isLoading && candidate && (
              <div className={`${styles.resultCard} fade-in`}>
                
                {/* Vetting Status Alerts */}
                {candidate.status === 'Pending' && (
                  <div className={`${styles.statusAlert} ${styles.pendingAlert}`}>
                    <Clock size={32} className={styles.alertIcon} />
                    <div>
                      <h3>Application Vetting Status: PENDING</h3>
                      <p>
                        Hello <strong>{candidate.fullName}</strong>. Your profile has been queued for documentation verification. 
                        Our vetting team reviews credentials within 24-48 hours. No actions are required at this time.
                      </p>
                    </div>
                  </div>
                )}

                {candidate.status === 'Under Review' && (
                  <div className={`${styles.statusAlert} ${styles.reviewAlert}`}>
                    <Shield size={32} className={styles.alertIcon} />
                    <div>
                      <h3>Application Vetting Status: UNDER REVIEW</h3>
                      <p>
                        Hello <strong>{candidate.fullName}</strong>. An administrator is currently reviewing your resume link, 
                        education history, and social profile links. Check back shortly.
                      </p>
                    </div>
                  </div>
                )}

                {candidate.status === 'Rejected' && (
                  <div className={`${styles.statusAlert} ${styles.rejectedAlert}`}>
                    <AlertOctagon size={32} className={styles.alertIcon} />
                    <div>
                      <h3>Application Vetting Status: NOT APPROVED</h3>
                      <p>
                        Hello <strong>{candidate.fullName}</strong>. Your membership registration could not be verified by our vetting system. 
                        Common reasons include: incomplete/restricted resume link, false profile links, or invalid location inputs.
                      </p>
                      <p className={styles.contactSupportText}>
                        Please <Link href="/contact">contact support</Link> or re-register with valid credentials.
                      </p>
                    </div>
                  </div>
                )}

                {candidate.status === 'Needs Changes' && (
                  <div className={`${styles.statusAlert} ${styles.reviewAlert}`} style={{ borderColor: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.05)' }}>
                    <ShieldAlert size={32} style={{ color: '#eab308', marginRight: '1rem', flexShrink: 0 }} />
                    <div>
                      <h3 style={{ color: '#eab308', margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700 }}>Application Vetting Status: ACTION REQUIRED</h3>
                      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                        Hello <strong>{candidate.fullName}</strong>. The vetting board has requested revisions for your profile parameters.
                      </p>
                      {candidate.notes && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px', borderLeft: '3px solid #eab308', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                          <strong>Feedback Notes:</strong> {candidate.notes}
                        </div>
                      )}
                      <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', margin: '0.75rem 0 0 0' }}>
                        Please <Link href="/dashboard" style={{ color: '#eab308', textDecoration: 'underline', fontWeight: 700 }}>Log In to your Dashboard</Link> to adjust your settings and resubmit.
                      </p>
                    </div>
                  </div>
                )}

                {candidate.status === 'Suspended' && (
                  <div className={`${styles.statusAlert} ${styles.rejectedAlert}`}>
                    <AlertOctagon size={32} className={styles.alertIcon} />
                    <div>
                      <h3>Application Vetting Status: SUSPENDED</h3>
                      <p>
                        Hello <strong>{candidate.fullName}</strong>. Your membership verification has been temporarily suspended.
                      </p>
                      {candidate.notes && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px', borderLeft: '3px solid #ef4444', fontSize: '0.8rem' }}>
                          <strong>Admin Reason:</strong> {candidate.notes}
                        </div>
                      )}
                      <p className={styles.contactSupportText}>
                        Please <Link href="/contact">contact support</Link> to appeal this decision.
                      </p>
                    </div>
                  </div>
                )}

                {candidate.status === 'Verified' && (
                  <div className={styles.verifiedContainer}>
                    <div className={`${styles.statusAlert} ${styles.verifiedAlert}`}>
                      <CheckCircle2 size={32} className={styles.alertIcon} />
                      <div>
                        <h3>Application Vetting Status: VERIFIED</h3>
                        <p>
                          Congratulations <strong>{candidate.fullName}</strong>! Your profile is verified. 
                          Your unique <strong>TSS Member ID</strong> is now active. Your digital card is unlocked below.
                        </p>
                      </div>
                    </div>

                    <div id="print-area" className={styles.membershipCardWrapper} style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
                      {/* FRONT SIDE */}
                      <Link 
                        href={`/status?memberId=${candidate.memberId}`}
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
                          <div className={styles.cardStatusBadge} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                            <span className={styles.statusDot} style={{ width: '6px', height: '6px', backgroundColor: 'var(--success)', borderRadius: '50%' }}></span> Verified {candidate.role}
                          </div>
                        </div>

                        <div className={styles.cardProfileBlock} style={{ zIndex: 2 }}>
                          <div className={styles.cardPhotoWrapper}>
                            {candidate.photoPath ? (
                              <img 
                                src={`data:image/jpeg;base64,${candidate.photoPath}`} 
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
                            <h3 className={styles.memberName}>{candidate.fullName}</h3>
                            <span className={styles.memberRoleTag} style={{ color: '#94a3b8' }}>@{candidate.username || 'username'}</span>
                          </div>
                        </div>

                        <div className={styles.cardFooterGrid} style={{ zIndex: 2 }}>
                          <div className={styles.detailsColumn}>
                            <span className={styles.detailsLabel}>TSS LIFETIME ID</span>
                            <span className={styles.memberIdCode} style={{ color: '#f77f00', fontSize: '1rem', fontWeight: 700 }}>{candidate.memberId}</span>
                          </div>
                          
                          <div className={styles.detailsColumn}>
                            <span className={styles.detailsLabel}>ROLE CATEGORY</span>
                            <span className={styles.detailsValue}>{candidate.role}</span>
                          </div>

                          <div className={styles.qrCodeWrapper}>
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                                typeof window !== 'undefined' 
                                  ? `${window.location.origin}/status?memberId=${candidate.memberId}` 
                                  : `https://thestudentspot.app/status?memberId=${candidate.memberId}`
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
                        href={`/status?memberId=${candidate.memberId}`}
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
                              <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>{candidate.memberSince || 'Jun 2026'}</span>
                            </div>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>COMMUNITY SCORE</span>
                              <span style={{ fontSize: '0.8rem', color: '#f77f00', fontWeight: 700 }}>{candidate.communityScore || 20} pts (Level {candidate.level || 'Explorer'})</span>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>EMERGENCY CONTACT</span>
                              <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>{candidate.roleDetails?.emergencyContact || 'Parent / TSS Security Node'}</span>
                            </div>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>OFFICIAL CONTACT</span>
                              <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>contact@thestudentspot.app</span>
                            </div>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>PROGRAMS ACCESS</span>
                              <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>{candidate.role === 'Student' ? 'BuildX Sandbox, 100X Students' : 'Ecosystem Partner'}</span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.cardHeader} style={{ borderBottom: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0', paddingTop: '0.4rem', zIndex: 2 }}>
                          <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Scan QR code on front side to verify status</span>
                          <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>THE STUDENT SPOT</span>
                        </div>
                      </Link>
                    </div>

                    {/* Card Actions */}
                    <div className={styles.verifiedActions}>
                      <button onClick={handleDownloadPdf} className="btn btn-primary">
                        <Download size={16} /> Download Card PDF
                      </button>
                      <Link href="/#community-section" className="btn btn-outline">
                        Access TSS Network <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            )}

            {!isLoading && !searched && (
              <div className={styles.searchInstructions}>
                <HelpCircle className={styles.helpIcon} size={20} />
                <p>
                  Enter the email address or phone number you used during registration.
                  If you have just registered, details will update here dynamically once reviewed and approved by admins.
                </p>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
