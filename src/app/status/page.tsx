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
  Download 
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface CandidateStatus {
  success: boolean;
  fullName: string;
  role: 'Student' | 'Founder' | 'Recruiter' | 'Mentor' | 'Investor' | 'Working Professional' | string;
  status: 'Pending' | 'Under Review' | 'Verified' | 'Rejected';
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
      let param = '';
      if (val.toUpperCase().startsWith('TSS-')) {
        param = `memberId=${encodeURIComponent(val)}`;
      } else if (val.includes('@')) {
        param = `email=${encodeURIComponent(val)}`;
      } else {
        param = `mobile=${encodeURIComponent(val)}`;
      }
      
      const res = await fetch(`/api/status-check?${param}`);
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
  const handleDownloadPdf = () => {
    if (!candidate || !candidate.memberId) return;
    
    toast.info('Preparing your Digital ID card PDF...');

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      // @ts-ignore
      const html2pdf = window.html2pdf;
      const cardElement = document.getElementById('tss-id-card');
      
      if (!cardElement) {
        toast.error('ID Card element not found.');
        return;
      }

      // Create an unscaled clone of the card to bypass mobile responsive transforms
      const clone = cardElement.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.width = '440px';
      clone.style.height = '270px';
      clone.style.margin = '0';
      clone.style.position = 'relative';

      // Create a temporary container in the viewport but completely invisible (prevents scroll offset bugs)
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '0';
      tempContainer.style.left = '0';
      tempContainer.style.width = '440px';
      tempContainer.style.height = '270px';
      tempContainer.style.opacity = '0';
      tempContainer.style.pointerEvents = 'none';
      tempContainer.style.zIndex = '-9999';
      tempContainer.appendChild(clone);
      document.body.appendChild(tempContainer);
      
      const opt = {
        margin: 0,
        filename: `TSS_Member_Card_${candidate.memberId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 3, 
          useCORS: true, 
          logging: false,
          backgroundColor: '#0f172a',
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { unit: 'px', format: [440, 270], orientation: 'landscape' }
      };
      
      html2pdf().from(clone).set(opt).save()
        .then(() => {
          document.body.removeChild(tempContainer);
          toast.success('PDF Card Downloaded!');
        })
        .catch((err: any) => {
          console.error(err);
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
          }
          toast.error('Failed to generate PDF download.');
        });
    };
    script.onerror = () => {
      toast.error('Failed to load PDF export library.');
    };
    document.body.appendChild(script);
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

                    {/* Digital Membership Card Mockup */}
                    <div id="print-area" className={styles.membershipCardWrapper}>
                      <div id="tss-id-card" className={styles.memberCardVirtual}>
                        {/* Background glowing gradients */}
                        <div className={styles.cardGlow}></div>
                        <div className={styles.meshBg}></div>
                        
                        {/* Header */}
                        <div className={styles.cardHeader}>
                          <div className={styles.cardLogo}>
                            <Award className={styles.cardLogoIcon} size={18} />
                            <span>THE STUDENT SPOT</span>
                          </div>
                          <div className={styles.cardStatusBadge}>
                            <span className={styles.statusDot}></span> VERIFIED TALENT
                          </div>
                        </div>

                        {/* Middle: Profile Header */}
                        <div className={styles.cardProfileBlock}>
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
                            <span className={styles.memberRoleTag}>{candidate.role}</span>
                          </div>
                        </div>

                        {/* Bottom details & QR code */}
                        <div className={styles.cardFooterGrid}>
                          <div className={styles.detailsColumn}>
                            <span className={styles.detailsLabel}>TSS MEMBER ID</span>
                            <span className={styles.memberIdCode}>{candidate.memberId}</span>
                          </div>
                          
                          <div className={styles.detailsColumn}>
                            <span className={styles.detailsLabel}>LOCATION</span>
                            <span className={styles.detailsValue}>{candidate.city}, {candidate.state}</span>
                          </div>

                          <div className={styles.detailsColumn}>
                            <span className={styles.detailsLabel}>VERIFIED ON</span>
                            <span className={styles.detailsValue}>{formatDate(candidate.registrationDate)}</span>
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
                      </div>
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

                    {/* TSS Resume Studio */}
                    <div className={styles.resumeStudioSection}>
                      <div className={styles.studioHeader}>
                        <Award size={24} className={styles.studioIcon} />
                        <h2>TSS Resume Studio</h2>
                        <p>Create and download a professional, recruiter-approved resume in one click.</p>
                      </div>

                      {/* Templates Selector */}
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
                        {/* Left Column: Editor Form */}
                        <div className={styles.editorPanel}>
                          <h3>1. Edit Resume Details</h3>

                          {/* Personal Info */}
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

                          {/* Skills */}
                          <div className={styles.editorGroup}>
                            <h4>Skills</h4>
                            <div className={styles.formField}>
                              <label className={styles.formLabel}>Skills (comma separated)</label>
                              <input
                                type="text"
                                value={resumeData?.skills || ''}
                                onChange={(e) => handleFieldChange('skills', e.target.value)}
                                className={styles.formInput}
                                placeholder="e.g. React, Next.js, Python, PostgreSQL"
                              />
                            </div>
                          </div>

                          {/* Education */}
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
                                    <label className={styles.formLabel}>Degree / Qualification</label>
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

                          {/* Experience */}
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
                                    <label className={styles.formLabel}>Company Name</label>
                                    <input
                                      type="text"
                                      value={exp.company}
                                      onChange={(e) => handleNestedChange('experience', index, 'company', e.target.value)}
                                      className={styles.formInput}
                                    />
                                  </div>
                                  <div className={styles.formField}>
                                    <label className={styles.formLabel}>Role / Title</label>
                                    <input
                                      type="text"
                                      value={exp.role}
                                      onChange={(e) => handleNestedChange('experience', index, 'role', e.target.value)}
                                      className={styles.formInput}
                                    />
                                  </div>
                                </div>
                                <div className={styles.formField}>
                                  <label className={styles.formLabel}>Duration (e.g. June 2026 - Present)</label>
                                  <input
                                    type="text"
                                    value={exp.duration}
                                    onChange={(e) => handleNestedChange('experience', index, 'duration', e.target.value)}
                                    className={styles.formInput}
                                  />
                                </div>
                                <div className={styles.formField}>
                                  <label className={styles.formLabel}>Description (Enter each bullet point on a new line)</label>
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

                          {/* Projects */}
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
                                    <label className={styles.formLabel}>Project Title</label>
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
                                  <label className={styles.formLabel}>Description (Enter each bullet point on a new line)</label>
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

                        {/* Right Column: Visual Previewer */}
                        <div className={styles.previewPanel}>
                          <div className={styles.previewHeader}>
                            <h3>2. Live Resume Preview</h3>
                            <button type="button" onClick={handleDownloadResumePdf} className="btn btn-primary btn-sm">
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
