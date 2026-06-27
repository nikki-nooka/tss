'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  Award, 
  Search, 
  ArrowRight, 
  ArrowLeft,
  Briefcase, 
  GraduationCap, 
  Code, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles, 
  Lock, 
  ShieldAlert, 
  HelpCircle,
  FolderGit2,
  Bookmark,
  Share2
} from 'lucide-react';
import { useToast } from '@/components/Toast';

// Interface definitions
interface EducationEntry {
  institution: string;
  degree: string;
  branch: string;
  cgpa: string;
  startYear: string;
  endYear: string;
  location: string;
  achievements: string;
}

interface ExperienceEntry {
  company: string;
  role: string;
  type: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ProjectEntry {
  name: string;
  description: string;
  tech: string;
  github: string;
  live: string;
  achievements: string;
}

interface CertificationEntry {
  name: string;
  org: string;
  date: string;
  url: string;
}

interface ResumeData {
  // Step 1: Basic
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  photoUrl: string;
  
  // Step 2: Summary
  summary: string;

  // Step 3-5: Lists
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];

  // Step 6: Skills
  skillsLanguages: string[];
  skillsFrameworks: string[];
  skillsDatabases: string[];
  skillsCloud: string[];
  skillsTools: string[];
  skillsSoft: string[];
  customSkills: string[];

  // Step 7-8: Lists
  certifications: CertificationEntry[];
  achievements: string[];

  // Step 9: Extras
  languages: string;
  interests: string;
  volunteer: string;
  leadership: string;

  // Version Control tag
  versionTag: string;
}

export default function ResumeStudio() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'landing' | 'builder' | 'guidelines' | 'faq'>('landing');
  
  // Form Steps: 1 - 9
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<'FAANG' | 'Startup' | 'General'>('FAANG');
  const [zoomScale, setZoomScale] = useState(1.0);
  const [mobileViewTab, setMobileViewTab] = useState<'form' | 'preview'>('form');

  // Input states for custom skill adding
  const [skillInput, setSkillInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');

  // Initial Empty Resume Data
  const initialData: ResumeData = {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    photoUrl: '',
    summary: '',
    education: [
      { institution: '', degree: '', branch: '', cgpa: '', startYear: '', endYear: '', location: '', achievements: '' }
    ],
    experience: [
      { company: '', role: '', type: 'Full-time', startDate: '', endDate: '', current: false, description: '' }
    ],
    projects: [
      { name: '', description: '', tech: '', github: '', live: '', achievements: '' }
    ],
    skillsLanguages: [],
    skillsFrameworks: [],
    skillsDatabases: [],
    skillsCloud: [],
    skillsTools: [],
    skillsSoft: [],
    customSkills: [],
    certifications: [
      { name: '', org: '', date: '', url: '' }
    ],
    achievements: [],
    languages: '',
    interests: '',
    volunteer: '',
    leadership: '',
    versionTag: 'Software Engineer'
  };

  const [resumeData, setResumeData] = useState<ResumeData>(initialData);

  // Load from localStorage on mount (for offline draft persistence)
  useEffect(() => {
    const saved = localStorage.getItem('tss_resumestudio_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResumeData(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save changes to localStorage automatically
  const updateResumeState = (updater: (prev: ResumeData) => ResumeData) => {
    setResumeData((prev) => {
      const next = updater(prev);
      localStorage.setItem('tss_resumestudio_draft', JSON.stringify(next));
      return next;
    });
  };

  const getAllSkills = () => {
    const list = [
      ...(resumeData.skillsLanguages || []),
      ...(resumeData.skillsFrameworks || []),
      ...(resumeData.skillsDatabases || []),
      ...(resumeData.skillsCloud || []),
      ...(resumeData.skillsTools || []),
      ...(resumeData.skillsSoft || []),
      ...(resumeData.customSkills || [])
    ].filter(Boolean);
    return list.length > 0 ? list : ['TypeScript', 'React', 'Next.js', 'PostgreSQL', 'AWS', 'Docker', 'Git'];
  };

  const [hasTssSession, setHasTssSession] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('tss_candidate_session');
      setHasTssSession(!!session);
    }
  }, []);

  const importTssProfile = () => {
    const session = localStorage.getItem('tss_candidate_session');
    if (!session) {
      toast.error('No TSS candidate session found. Please sign in via the Dashboard first.');
      return;
    }
    try {
      const profile = JSON.parse(session);
      updateResumeState((prev) => ({
        ...prev,
        fullName: profile.fullName || prev.fullName,
        email: profile.email || prev.email,
        phone: profile.mobile || prev.phone,
        location: profile.city && profile.state ? `${profile.city}, ${profile.state}` : prev.location,
        linkedin: profile.linkedin || prev.linkedin,
        github: profile.github || prev.github,
        portfolio: profile.portfolio || prev.portfolio,
        title: profile.role || prev.title,
        skillsLanguages: profile.skills || prev.skillsLanguages,
        education: [
          {
            institution: profile.college || '',
            degree: profile.highestQualification || '',
            branch: '',
            cgpa: '',
            startYear: '',
            endYear: profile.graduationYear ? String(profile.graduationYear) : '',
            location: '',
            achievements: ''
          }
        ]
      }));
      toast.success('Successfully imported verified TSS candidate profile!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to parse TSS profile session.');
    }
  };

  // Helper field handlers
  const handleFieldChange = (field: keyof ResumeData, value: any) => {
    updateResumeState((prev) => ({ ...prev, [field]: value }));
  };

  // Dynamic Lists Handlers
  const handleListChange = <K extends 'education' | 'experience' | 'projects' | 'certifications'>(
    listName: K,
    index: number,
    field: keyof ResumeData[K][number],
    value: any
  ) => {
    updateResumeState((prev) => {
      const list = [...prev[listName]] as any[];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [listName]: list } as any;
    });
  };

  const addListItem = <K extends 'education' | 'experience' | 'projects' | 'certifications'>(listName: K, emptyItem: any) => {
    updateResumeState((prev) => ({
      ...prev,
      [listName]: [...prev[listName], emptyItem]
    } as any));
  };

  const removeListItem = <K extends 'education' | 'experience' | 'projects' | 'certifications'>(listName: K, index: number) => {
    updateResumeState((prev) => {
      const list = [...prev[listName]];
      if (list.length > 1) {
        list.splice(index, 1);
      }
      return { ...prev, [listName]: list } as any;
    });
  };

  // Skill Add / Delete Helpers
  const addCustomSkill = () => {
    if (!skillInput.trim()) return;
    updateResumeState((prev) => ({
      ...prev,
      customSkills: [...prev.customSkills, skillInput.trim()]
    }));
    setSkillInput('');
  };

  const removeCustomSkill = (index: number) => {
    updateResumeState((prev) => {
      const list = [...prev.customSkills];
      list.splice(index, 1);
      return { ...prev, customSkills: list };
    });
  };

  // Achievement Add / Delete Helpers
  const addAchievementItem = () => {
    if (!achievementInput.trim()) return;
    updateResumeState((prev) => ({
      ...prev,
      achievements: [...prev.achievements, achievementInput.trim()]
    }));
    setAchievementInput('');
  };

  const removeAchievementItem = (index: number) => {
    updateResumeState((prev) => {
      const list = [...prev.achievements];
      list.splice(index, 1);
      return { ...prev, achievements: list };
    });
  };

  // Reset Draft
  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear your entire draft? This will wipe your locally cached draft.')) {
      setResumeData(initialData);
      localStorage.removeItem('tss_resumestudio_draft');
      toast.success('Form cleared successfully.');
    }
  };

  // Switch tabs
  const startBuilding = (templateName?: 'FAANG' | 'Startup' | 'General') => {
    if (templateName) {
      setSelectedTemplate(templateName);
    }
    setActiveTab('builder');
    setCurrentStep(1);
    toast.info('Builder Workspace Activated!');
  };

  // Calculate Scores
  const calculateAtsScore = () => {
    let score = 20; // Base score for starting
    
    if (resumeData.fullName.trim()) score += 10;
    if (resumeData.email.trim() && resumeData.email.includes('@')) score += 10;
    if (resumeData.phone.trim()) score += 10;
    
    // Summary checks
    if (resumeData.summary.trim().length > 50) score += 10;
    
    // Check Lists
    if (resumeData.education.some(edu => edu.institution.trim())) score += 10;
    if (resumeData.experience.some(exp => exp.company.trim())) score += 15;
    if (resumeData.projects.some(proj => proj.name.trim())) score += 15;
    
    // Skills
    const totalSkills = (resumeData.skillsLanguages.length + resumeData.customSkills.length);
    if (totalSkills > 3) score += 10;

    return Math.min(score, 100);
  };

  const calculateFAANGScore = () => {
    let score = 30; // base
    if (selectedTemplate === 'FAANG') score += 20;
    if (resumeData.education.some(edu => edu.cgpa && (parseFloat(edu.cgpa) >= 8.5 || parseFloat(edu.cgpa) >= 3.5))) score += 15;
    if (resumeData.github && resumeData.github.includes('github.com')) score += 15;
    if (resumeData.linkedin) score += 10;
    if (resumeData.skillsLanguages.length >= 3) score += 10;
    return Math.min(score, 100);
  };

  const calculateStartupScore = () => {
    let score = 25;
    if (selectedTemplate === 'Startup') score += 20;
    if (resumeData.projects.length >= 2) score += 25;
    if (resumeData.projects.some(proj => proj.live && proj.live.startsWith('http'))) score += 20;
    if (resumeData.github) score += 10;
    return Math.min(score, 100);
  };

  const calculateRecruiterScore = () => {
    let score = 40; // High base
    if (resumeData.linkedin && resumeData.linkedin.includes('linkedin.com')) score += 20;
    if (resumeData.certifications.some(c => c.name.trim())) score += 20;
    if (resumeData.phone && resumeData.location) score += 20;
    return Math.min(score, 100);
  };

  const atsScore = calculateAtsScore();
  const faangScore = calculateFAANGScore();
  const startupScore = calculateStartupScore();
  const recruiterScore = calculateRecruiterScore();

  // Dynamic Suggestion messages based on active step
  const getStepTips = () => {
    switch (currentStep) {
      case 1:
        return [
          'Use a professional email address (e.g. name@domain.com).',
          'Include custom sub-directories on GitHub & LinkedIn for instant access.',
          'Verify your phone number starts with a country code if applying abroad.'
        ];
      case 2:
        return [
          'Keep your profile introduction brief (less than 4 sentences).',
          'Start with your target title, years of experience, and key technical stack keywords.',
          'State what problems you solve, rather than just what you want.'
        ];
      case 3:
        return [
          'If your CGPA is above 7.5/10 (or 3.2/4), make sure to showcase it.',
          'List relevant academic course tracks (e.g. Data Structures, Operating Systems).',
          'Mention active society involvements or college startup cell initiatives.'
        ];
      case 4:
        return [
          'Quantify accomplishments using the formula: Accomplished X, measured by Y, by doing Z.',
          'Start every bullet point with a powerful action verb (e.g. Developed, Led, Engineered).',
          'Ensure chronological order (most recent work experience at the top).'
        ];
      case 5:
        return [
          'Provide clickable live demo links to show that your code is deployable.',
          'List technical specifications (e.g. React, Docker, AWS) clearly for search checks.',
          'Explain the direct business or community impact of the project.'
        ];
      case 6:
        return [
          'Group your skills logically by category to make it easy for recruiters to scan.',
          'Focus on hard tools and software languages first; soft skills should be verified through experience description bullets.',
          'Include relevant cloud computing and orchestration tools if applicable.'
        ];
      default:
        return [
          'Double-check for any typos or formatting inconsistencies.',
          'Export your resume as a PDF and check it on a mobile screen for readability.',
          'Quantity matters: make sure all achievements list tangible statistics.'
        ];
    }
  };

  // Mock AI Copilot helper
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);

  const requestAiSuggestion = () => {
    setGeneratingAi(true);
    setTimeout(() => {
      setGeneratingAi(false);
      if (currentStep === 2) {
        setAiSuggestion(
          `Refined Summary Option:\n"Motivated ${resumeData.title || 'Software Engineer'} with strong fundamentals in algorithm design and full-stack architecture. Experienced in designing responsive client-facing interfaces and scalable web services. Passionate about participating in Build Challenges, shipping clean documentation, and collaborating with cross-functional cohorts."`
        );
      } else {
        setAiSuggestion(
          `Improvement Tip:\n"Quantified Action Verb Suggestion: Replace 'Worked on code' with 'Engineered high-concurrency Node.js microservices, improving API response times by 32% across verified student cohorts.'"`
        );
      }
      toast.success('AI Suggestion Generated!');
    }, 800);
  };

  // PDF Generation bundle loader
  const handleDownloadPdf = () => {
    if (!resumeData.fullName.trim()) {
      toast.error('Please enter your Full Name in Step 1 before downloading!');
      return;
    }
    toast.info('Rendering print layout. Preparing your PDF download...');

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
        margin: [0.35, 0.35, 0.35, 0.35],
        filename: `TSS_Resume_${resumeData.fullName.replace(/\s+/g, '_')}_${selectedTemplate}.pdf`,
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
          toast.error('PDF generation error.');
        });
    };
    script.onerror = () => {
      toast.error('Failed to load PDF engine library.');
    };
    document.body.appendChild(script);
  };

  // Export data as JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TSS_Resume_Backup_${resumeData.fullName.replace(/\s+/g, '_') || 'Draft'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Resume JSON backup exported successfully!');
  };

  // TEMPLATES RENDER HELPERS
  const renderFaangTemplate = () => {
    return (
      <div className={styles.faangContainer}>
        <div className={styles.faangHeaderBlock}>
          <div className={styles.faangName}>{resumeData.fullName || 'YOUR NAME'}</div>
          <div className={styles.faangContactDetails}>
            {resumeData.email && <span>{resumeData.email}</span>}
            {resumeData.phone && <span> | {resumeData.phone}</span>}
            {resumeData.location && <span> | {resumeData.location}</span>}
            {resumeData.linkedin && <span> | {resumeData.linkedin}</span>}
            {resumeData.github && <span> | {resumeData.github}</span>}
            {resumeData.portfolio && <span> | {resumeData.portfolio}</span>}
          </div>
        </div>

        {resumeData.summary && (
          <div className={styles.faangSectionBlock}>
            <div className={styles.faangSectionTitle}>PROFESSIONAL SUMMARY</div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '9.5pt' }}>{resumeData.summary}</p>
          </div>
        )}

        {resumeData.education.length > 0 && resumeData.education[0].institution && (
          <div className={styles.faangSectionBlock}>
            <div className={styles.faangSectionTitle}>EDUCATION</div>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem' }}>
                <div className={styles.faangItemHeader}>
                  <span>{edu.institution}</span>
                  <span>{edu.location || `${edu.startYear} - ${edu.endYear}`}</span>
                </div>
                <div className={styles.faangItemSubHeader}>
                  <span>{edu.degree} {edu.branch && `in ${edu.branch}`}</span>
                  {edu.cgpa && <span>GPA: {edu.cgpa}</span>}
                </div>
                {edu.achievements && <p style={{ margin: '0', fontSize: '9pt', fontStyle: 'italic' }}>{edu.achievements}</p>}
              </div>
            ))}
          </div>
        )}

        {resumeData.experience.length > 0 && resumeData.experience[0].company && (
          <div className={styles.faangSectionBlock}>
            <div className={styles.faangSectionTitle}>WORK EXPERIENCE</div>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '0.6rem' }}>
                <div className={styles.faangItemHeader}>
                  <span>{exp.company}</span>
                  <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className={styles.faangItemSubHeader}>
                  <span>{exp.role} ({exp.type})</span>
                </div>
                {exp.description && (
                  <ul className={styles.faangBulletsList}>
                    {exp.description.split('\n').filter(Boolean).map((bullet, bidx) => (
                      <li key={bidx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {resumeData.projects.length > 0 && resumeData.projects[0].name && (
          <div className={styles.faangSectionBlock}>
            <div className={styles.faangSectionTitle}>PROJECTS</div>
            {resumeData.projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem' }}>
                <div className={styles.faangItemHeader}>
                  <span>{proj.name} {proj.tech && `| ${proj.tech}`}</span>
                  <span>{proj.github || proj.live}</span>
                </div>
                {proj.description && (
                  <ul className={styles.faangBulletsList}>
                    {proj.description.split('\n').filter(Boolean).map((bullet, bidx) => (
                      <li key={bidx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        <div className={styles.faangSectionBlock}>
          <div className={styles.faangSectionTitle}>SKILLS & CERTIFICATIONS</div>
          <div className={styles.faangSkillsBlock}>
            <strong>Technical Skills: </strong>
            {getAllSkills().join(', ')}
          </div>
            {resumeData.certifications.length > 0 && resumeData.certifications[0].name && (
              <div className={styles.faangSkillsBlock}>
                <strong>Certifications: </strong>
                {resumeData.certifications.map(c => `${c.name} (${c.org})`).join(', ')}
              </div>
            )}
          </div>
        </div>
      );
  };

  const renderStartupTemplate = () => {
    return (
      <div className={styles.startupContainer}>
        <div className={styles.startupHeaderBlock}>
          <div className={styles.startupName}>{resumeData.fullName || 'YOUR NAME'}</div>
          <div className={styles.startupTitle}>{resumeData.title || 'SOFTWARE ENGINEER'}</div>
          <div className={styles.startupContactDetails}>
            {resumeData.email && <span>📧 {resumeData.email}</span>}
            {resumeData.phone && <span>📱 {resumeData.phone}</span>}
            {resumeData.linkedin && <span>🔗 {resumeData.linkedin}</span>}
            {resumeData.github && <span>💻 {resumeData.github}</span>}
          </div>
        </div>

        <div className={styles.startupGrid}>
          {/* Left Column */}
          <div className={styles.startupLeftCol}>
            {resumeData.summary && (
              <div className={styles.startupSection}>
                <div className={styles.startupSectionTitle}>TL;DR</div>
                <p style={{ margin: '0', fontSize: '8.5pt' }}>{resumeData.summary}</p>
              </div>
            )}

            <div className={styles.startupSection}>
              <div className={styles.startupSectionTitle}>STACK</div>
              <div className={styles.startupSkillTags}>
                {getAllSkills().map((skill, sidx) => (
                  <span key={sidx} className={styles.startupSkillTag}>{skill}</span>
                ))}
              </div>
            </div>

            {resumeData.education.length > 0 && resumeData.education[0].institution && (
              <div className={styles.startupSection}>
                <div className={styles.startupSectionTitle}>LEARNING</div>
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className={styles.startupEduItem}>
                    <div className={styles.startupEduYear}>{edu.startYear} - {edu.endYear}</div>
                    <div className={styles.startupEduInst}>{edu.institution}</div>
                    <div style={{ fontSize: '8pt' }}>{edu.degree}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {resumeData.experience.length > 0 && resumeData.experience[0].company && (
              <div className={styles.startupSection}>
                <div className={styles.startupSectionTitle}>EXPERIENCE</div>
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className={styles.startupWorkItem}>
                    <div className={styles.startupWorkHeader}>
                      <span>{exp.role}</span>
                      <span style={{ fontSize: '8pt', color: '#64748b' }}>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className={styles.startupWorkOrg}>{exp.company} ({exp.type})</div>
                    {exp.description && (
                      <ul className={styles.startupBullets}>
                        {exp.description.split('\n').filter(Boolean).map((bullet, bidx) => (
                          <li key={bidx}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {resumeData.projects.length > 0 && resumeData.projects[0].name && (
              <div className={styles.startupSection}>
                <div className={styles.startupSectionTitle}>BUILD COHORTS</div>
                {resumeData.projects.map((proj, idx) => (
                  <div key={idx} className={styles.startupWorkItem}>
                    <div className={styles.startupWorkHeader}>
                      <span>🚀 {proj.name}</span>
                      {proj.tech && <span style={{ fontSize: '7.5pt', color: 'var(--primary)' }}>{proj.tech}</span>}
                    </div>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '8.5pt' }}>{proj.description}</p>
                    {proj.github && <div style={{ fontSize: '7.5pt', color: '#64748b' }}>Git: {proj.github}</div>}
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
    return (
      <div className={styles.proContainer}>
        <div className={styles.proHeaderBlock}>
          <div className={styles.proName}>{resumeData.fullName || 'YOUR NAME'}</div>
          <div className={styles.proTitle}>{resumeData.title || 'Professional Title'}</div>
          <div className={styles.proContactDetails}>
            {resumeData.email && <span><strong>Email:</strong> {resumeData.email}</span>}
            {resumeData.phone && <span><strong>Mobile:</strong> {resumeData.phone}</span>}
            {resumeData.location && <span><strong>City:</strong> {resumeData.location}</span>}
            {resumeData.linkedin && <span><strong>LinkedIn:</strong> {resumeData.linkedin}</span>}
          </div>
        </div>

        {resumeData.summary && (
          <div className={styles.proSummary}>
            {resumeData.summary}
          </div>
        )}

        {resumeData.experience.length > 0 && resumeData.experience[0].company && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div className={styles.proSectionTitle}>Professional Experience</div>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className={styles.proItem}>
                <div className={styles.proItemHeader}>
                  <span>{exp.company}</span>
                  <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className={styles.proItemSubHeader}>
                  <span>{exp.role} ({exp.type})</span>
                </div>
                {exp.description && (
                  <ul className={styles.proBullets}>
                    {exp.description.split('\n').filter(Boolean).map((bullet, bidx) => (
                      <li key={bidx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {resumeData.education.length > 0 && resumeData.education[0].institution && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div className={styles.proSectionTitle}>Education History</div>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className={styles.proItem}>
                <div className={styles.proItemHeader}>
                  <span>{edu.institution}</span>
                  <span>{edu.startYear} - {edu.endYear}</span>
                </div>
                <div className={styles.proItemSubHeader}>
                  <span>{edu.degree} in {edu.branch}</span>
                  {edu.cgpa && <span>GPA: {edu.cgpa}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {resumeData.projects.length > 0 && resumeData.projects[0].name && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div className={styles.proSectionTitle}>Vetted Projects</div>
            {resumeData.projects.map((proj, idx) => (
              <div key={idx} className={styles.proItem}>
                <div className={styles.proItemHeader}>
                  <span>{proj.name}</span>
                  <span>{proj.tech}</span>
                </div>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '9pt' }}>{proj.description}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom: '1.25rem' }}>
          <div className={styles.proSectionTitle}>Core Competencies & Skills</div>
          <p style={{ margin: '0', fontSize: '9.5pt' }}>
            <strong>Technical: </strong>
            {getAllSkills().join(', ')}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.resumeStudioPage}>
      
      {/* LANDING TAB MODE */}
      {activeTab === 'landing' && (
        <div className={styles.landingContainer}>
          <section className={styles.heroSection}>
            <div className="container">
              <span className={styles.heroTag}>TSS RESUME STUDIO</span>
              <h1 className={styles.headline}>Create Your Professional Resume in Minutes</h1>
              <p className={styles.subheadline}>
                Build ATS-friendly resumes designed for internships, jobs, startups, and top tech companies. No signup required.
              </p>
              <div className={styles.heroButtons}>
                <button onClick={() => startBuilding('FAANG')} className="btn btn-primary btn-lg">
                  Create Resume Now
                </button>
                <a href="#templates-section" className="btn btn-outline btn-lg">
                  View Templates
                </a>
              </div>
            </div>

            {/* Statistics */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>18,450+</div>
                <div className={styles.statLabel}>Students Served</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>45,000+</div>
                <div className={styles.statLabel}>Resumes Built</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>94.2%</div>
                <div className={styles.statLabel}>ATS Pass Rate</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>3 Styles</div>
                <div className={styles.statLabel}>Available Templates</div>
              </div>
            </div>
          </section>

          {/* Why TSS section */}
          <section className={styles.featuresSection}>
            <div className="container">
              <h2 className={styles.sectionTitle}>Why TSS Resume Studio?</h2>
              <div className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIconWrapper}><FileText size={24} /></div>
                  <h3>ATS-Optimized Formatting</h3>
                  <p>Our layout parameters follow clean machine-readable rules. No tables, no columns, standard headers.</p>
                </div>
                <div className={styles.featureCard}><div className={styles.featureIconWrapper}><Award size={24} /></div>
                  <h3>FAANG & Startup Ready</h3>
                  <p>Quickly switch between ATS standard minimal, modern startup, and general corporate templates.</p>
                </div>
                <div className={styles.featureCard}><div className={styles.featureIconWrapper}><Lock size={24} /></div>
                  <h3>100% Privacy Checked</h3>
                  <p>Your resume data never leaves your browser. Safe, zero tracking, zero registration constraints.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Templates Section */}
          <section id="templates-section" className={styles.templatesSection}>
            <div className="container">
              <h2 className={styles.sectionTitle}>Recruiter-Approved Templates</h2>
              <div className={styles.templatesGrid}>
                <div onClick={() => startBuilding('FAANG')} className={styles.templateCard}>
                  <div className={styles.templatePreviewMock}>
                    <div className={styles.mockPaper}>
                      <div className={styles.mockTitleLine}></div>
                      <div className={`${styles.mockLine} ${styles.mockSubLine}`}></div>
                      <div className={styles.mockLine}></div>
                      <div className={styles.mockLine}></div>
                    </div>
                  </div>
                  <div className={styles.templateMeta}>
                    <h3>FAANG (ATS Minimal)</h3>
                    <p>Designed specifically for software engineers applying to Big Tech companies. Highly readable for parsing tools.</p>
                    <button className={styles.useTemplateBtn}>Use Template</button>
                  </div>
                </div>

                <div onClick={() => startBuilding('Startup')} className={styles.templateCard}>
                  <div className={styles.templatePreviewMock}>
                    <div className={styles.mockPaper} style={{ borderLeft: '4px solid var(--primary)' }}>
                      <div className={styles.mockTitleLine} style={{ alignSelf: 'flex-start' }}></div>
                      <div className={`${styles.mockLine} ${styles.mockSubLine}`} style={{ alignSelf: 'flex-start' }}></div>
                      <div className={styles.mockLine}></div>
                      <div className={styles.mockLine}></div>
                    </div>
                  </div>
                  <div className={styles.templateMeta}>
                    <h3>Startup (Modern)</h3>
                    <p>Project-focused, technology-centered layouts that look fantastic for product startups and VC reviews.</p>
                    <button className={styles.useTemplateBtn}>Use Template</button>
                  </div>
                </div>

                <div onClick={() => startBuilding('General')} className={styles.templateCard}>
                  <div className={styles.templatePreviewMock}>
                    <div className={styles.mockPaper} style={{ borderTop: '4px solid var(--secondary)' }}>
                      <div className={styles.mockTitleLine}></div>
                      <div className={`${styles.mockLine} ${styles.mockSubLine}`}></div>
                      <div className={styles.mockLine}></div>
                      <div className={styles.mockLine}></div>
                    </div>
                  </div>
                  <div className={styles.templateMeta}>
                    <h3>Corporate General</h3>
                    <p>Standard, traditional formatting designed for business analysts, HR specialists, and banking groups.</p>
                    <button className={styles.useTemplateBtn}>Use Template</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Guidelines */}
          <section className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              <div className={styles.faqItem}>
                <h4>Is it really free? Do I need to create an account?</h4>
                <p>Yes. It is 100% free with no account requirements. Simply fill, preview, and download.</p>
              </div>
              <div className={styles.faqItem}>
                <h4>Will my resume bypass applicant tracking systems (ATS)?</h4>
                <p>Absolutely. Our templates follow structural formatting standards, avoiding parsing issues caused by graphical tables, complex diagrams, or custom fonts.</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* BUILDER WORKSPACE MODE */}
      {activeTab === 'builder' && (
        <div className={styles.builderContainer}>
          <header className={styles.workspaceHeader}>
            <div onClick={() => setActiveTab('landing')} className={styles.workspaceLogo}>
              <Award className={styles.workspaceLogoIcon} size={22} />
              <span>TSS RESUME STUDIO</span>
            </div>

            <div className={styles.workspaceNav}>
              <select 
                value={resumeData.versionTag} 
                onChange={(e) => handleFieldChange('versionTag', e.target.value)}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 600 }}
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="General Internship">General Internship</option>
              </select>

              <button onClick={handleExportJson} className="btn btn-outline btn-sm">
                Export JSON Backup
              </button>
              <button onClick={handleClearForm} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }}>
                Clear Draft
              </button>
              <Link href="/" className={styles.exitLink}>
                Back to TSS <ArrowRight size={14} />
              </Link>
            </div>
          </header>

          {/* Mobile responsive tab switches */}
          <div className={styles.mobileTabHeaders}>
            <button 
              onClick={() => setMobileViewTab('form')} 
              className={`${styles.mobileTabBtn} ${mobileViewTab === 'form' ? styles.mobileTabBtnActive : ''}`}
            >
              1. Edit Form
            </button>
            <button 
              onClick={() => setMobileViewTab('preview')} 
              className={`${styles.mobileTabBtn} ${mobileViewTab === 'preview' ? styles.mobileTabBtnActive : ''}`}
            >
              2. Live Preview ({atsScore}%)
            </button>
          </div>

          <div className={styles.workspaceGrid}>
            
            {/* Left Panel: Steps Form */}
            <div 
              className={styles.formPanel}
              style={{ display: mobileViewTab === 'form' ? 'block' : 'none' }}
            >
              {hasTssSession && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0369a1', fontSize: '0.85rem' }}>
                    <Sparkles size={18} style={{ flexShrink: 0 }} />
                    <div>
                      <strong>TSS Candidate Profile Detected:</strong> You can automatically import your verified name, contacts, skills, and academic history.
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={importTssProfile}
                    className="btn btn-primary btn-sm"
                    style={{ whiteSpace: 'nowrap', backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                  >
                    Import Profile
                  </button>
                </div>
              )}
              
              {/* Step tracker node map */}
              <div className={styles.stepTracker}>
                {[1,2,3,4,5,6,7,8,9].map((stepNum) => (
                  <button 
                    key={stepNum}
                    onClick={() => setCurrentStep(stepNum)}
                    className={`${styles.stepNode} ${currentStep === stepNum ? styles.stepNodeActive : ''} ${currentStep > stepNum ? styles.stepNodeCompleted : ''}`}
                  >
                    Step {stepNum}: {
                      stepNum === 1 ? 'Contact' :
                      stepNum === 2 ? 'Summary' :
                      stepNum === 3 ? 'Education' :
                      stepNum === 4 ? 'Experience' :
                      stepNum === 5 ? 'Projects' :
                      stepNum === 6 ? 'Skills' :
                      stepNum === 7 ? 'Certifications' :
                      stepNum === 8 ? 'Achievements' : 'Extras'
                    }
                  </button>
                ))}
              </div>

              {/* STEP 1: CONTACT */}
              {currentStep === 1 && (
                <div className="fade-in">
                  <div className={styles.formHeader}>
                    <h2>Basic Information</h2>
                    <p>Enter your profile tags and contact details.</p>
                  </div>
                  <div className={styles.formFieldsWrapper}>
                    <div className={styles.formGrid2}>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Full Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Nikki Nooka"
                          value={resumeData.fullName}
                          onChange={(e) => handleFieldChange('fullName', e.target.value)}
                          className={styles.formInput} 
                        />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Professional Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Software Engineer"
                          value={resumeData.title}
                          onChange={(e) => handleFieldChange('title', e.target.value)}
                          className={styles.formInput} 
                        />
                      </div>
                    </div>

                    <div className={styles.formGrid3}>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Email Address</label>
                        <input 
                          type="email" 
                          placeholder="e.g. name@domain.com"
                          value={resumeData.email}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          className={styles.formInput} 
                        />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Phone Number</label>
                        <input 
                          type="text" 
                          placeholder="e.g. +91 9876543210"
                          value={resumeData.phone}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          className={styles.formInput} 
                        />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Location</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Delhi, India"
                          value={resumeData.location}
                          onChange={(e) => handleFieldChange('location', e.target.value)}
                          className={styles.formInput} 
                        />
                      </div>
                    </div>

                    <div className={styles.formGrid3}>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>LinkedIn Profile</label>
                        <input 
                          type="text" 
                          placeholder="linkedin.com/in/username"
                          value={resumeData.linkedin}
                          onChange={(e) => handleFieldChange('linkedin', e.target.value)}
                          className={styles.formInput} 
                        />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>GitHub Link</label>
                        <input 
                          type="text" 
                          placeholder="github.com/username"
                          value={resumeData.github}
                          onChange={(e) => handleFieldChange('github', e.target.value)}
                          className={styles.formInput} 
                        />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Portfolio Website</label>
                        <input 
                          type="text" 
                          placeholder="myportfolio.com"
                          value={resumeData.portfolio}
                          onChange={(e) => handleFieldChange('portfolio', e.target.value)}
                          className={styles.formInput} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SUMMARY */}
              {currentStep === 2 && (
                <div className="fade-in">
                  <div className={styles.formHeader}>
                    <h2>Professional Summary</h2>
                    <p>Introduce your target goals and technical expertise briefly.</p>
                  </div>
                  <div className={styles.formFieldsWrapper}>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Summary Text (Max 250 words)</label>
                      <textarea
                        placeholder="Provide a high-impact overview of your technical skills, active work projects, and achievements..."
                        value={resumeData.summary}
                        onChange={(e) => handleFieldChange('summary', e.target.value)}
                        className={styles.formTextarea}
                        rows={6}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        <span>Character Count: {resumeData.summary.length}</span>
                        <span>Estimated Word Count: {resumeData.summary.split(/\s+/).filter(Boolean).length}/250</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: EDUCATION */}
              {currentStep === 3 && (
                <div className="fade-in">
                  <div className={styles.formHeader}>
                    <h2>Education Details</h2>
                    <p>Add details about your university degree, branches, and GPA.</p>
                  </div>
                  <div className={styles.formFieldsWrapper}>
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className={styles.dynamicItemBlock}>
                        <div className={styles.dynamicBlockHeader}>
                          <h4>Education Block #{idx + 1}</h4>
                          <button type="button" onClick={() => removeListItem('education', idx)} className={styles.removeBlockBtn}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                        <div className={styles.formGrid2}>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Institution / School</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleListChange('education', idx, 'institution', e.target.value)}
                              className={styles.formInput}
                              placeholder="e.g. Indian Institute of Technology"
                            />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleListChange('education', idx, 'degree', e.target.value)}
                              className={styles.formInput}
                              placeholder="e.g. Bachelor of Technology"
                            />
                          </div>
                        </div>

                        <div className={styles.formGrid3}>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Branch / Major</label>
                            <input
                              type="text"
                              value={edu.branch}
                              onChange={(e) => handleListChange('education', idx, 'branch', e.target.value)}
                              className={styles.formInput}
                              placeholder="e.g. Computer Science"
                            />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>CGPA / Marks</label>
                            <input
                              type="text"
                              value={edu.cgpa}
                              onChange={(e) => handleListChange('education', idx, 'cgpa', e.target.value)}
                              className={styles.formInput}
                              placeholder="e.g. 9.1/10"
                            />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Location</label>
                            <input
                              type="text"
                              value={edu.location}
                              onChange={(e) => handleListChange('education', idx, 'location', e.target.value)}
                              className={styles.formInput}
                              placeholder="e.g. Mumbai, India"
                            />
                          </div>
                        </div>

                        <div className={styles.formGrid2}>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Start Year</label>
                            <input
                              type="text"
                              value={edu.startYear}
                              onChange={(e) => handleListChange('education', idx, 'startYear', e.target.value)}
                              className={styles.formInput}
                              placeholder="2022"
                            />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>End Year</label>
                            <input
                              type="text"
                              value={edu.endYear}
                              onChange={(e) => handleListChange('education', idx, 'endYear', e.target.value)}
                              className={styles.formInput}
                              placeholder="2026"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => addListItem('education', { institution: '', degree: '', branch: '', cgpa: '', startYear: '', endYear: '', location: '', achievements: '' })} 
                      className={styles.addBlockBtn}
                    >
                      <Plus size={16} /> Add Another Education
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: EXPERIENCE */}
              {currentStep === 4 && (
                <div className="fade-in">
                  <div className={styles.formHeader}>
                    <h2>Work Experience</h2>
                    <p>Detail your internships, jobs, and leadership milestones.</p>
                  </div>
                  <div className={styles.formFieldsWrapper}>
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className={styles.dynamicItemBlock}>
                        <div className={styles.dynamicBlockHeader}>
                          <h4>Experience Entry #{idx + 1}</h4>
                          <button type="button" onClick={() => removeListItem('experience', idx)} className={styles.removeBlockBtn}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                        <div className={styles.formGrid2}>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Company / Org Name</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleListChange('experience', idx, 'company', e.target.value)}
                              className={styles.formInput}
                              placeholder="e.g. Google"
                            />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Role Title</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => handleListChange('experience', idx, 'role', e.target.value)}
                              className={styles.formInput}
                              placeholder="e.g. Software Engineer Intern"
                            />
                          </div>
                        </div>

                        <div className={styles.formGrid3}>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Employment Type</label>
                            <select
                              value={exp.type}
                              onChange={(e) => handleListChange('experience', idx, 'type', e.target.value)}
                              className={styles.formInput}
                            >
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Internship">Internship</option>
                              <option value="Contract">Contract</option>
                            </select>
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Start Date</label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => handleListChange('experience', idx, 'startDate', e.target.value)}
                              className={styles.formInput}
                              placeholder="June 2025"
                            />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>End Date</label>
                            <input
                              type="text"
                              value={exp.endDate}
                              disabled={exp.current}
                              onChange={(e) => handleListChange('experience', idx, 'endDate', e.target.value)}
                              className={styles.formInput}
                              placeholder="Present"
                            />
                          </div>
                        </div>

                        <div className={styles.formField} style={{ flexDirection: 'row', gap: '0.5rem', alignItems: 'center' }}>
                          <input 
                            type="checkbox" 
                            id={`curr-${idx}`}
                            checked={exp.current}
                            onChange={(e) => handleListChange('experience', idx, 'current', e.target.checked)}
                          />
                          <label htmlFor={`curr-${idx}`} className={styles.formLabel} style={{ marginBottom: 0 }}>Currently Working Here</label>
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Job Description (Enter bullet points on separate lines)</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => handleListChange('experience', idx, 'description', e.target.value)}
                            placeholder="Developed verified identity systems increasing onboarding speeds by 40%&#10;Collaborated with 12 engineering teams to ship the status checkers"
                            className={styles.formTextarea}
                            rows={4}
                          />
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => addListItem('experience', { company: '', role: '', type: 'Internship', startDate: '', endDate: '', current: false, description: '' })} 
                      className={styles.addBlockBtn}
                    >
                      <Plus size={16} /> Add Work Experience
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: PROJECTS */}
              {currentStep === 5 && (
                <div className="fade-in">
                  <div className={styles.formHeader}>
                    <h2>Projects Showcase</h2>
                    <p>Display your technical projects, sandbox deployments, and hackathons.</p>
                  </div>
                  <div className={styles.formFieldsWrapper}>
                    {resumeData.projects.map((proj, idx) => (
                      <div key={idx} className={styles.dynamicItemBlock}>
                        <div className={styles.dynamicBlockHeader}>
                          <h4>Project #{idx + 1}</h4>
                          <button type="button" onClick={() => removeListItem('projects', idx)} className={styles.removeBlockBtn}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                        <div className={styles.formGrid2}>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Project Name</label>
                            <input
                              type="text"
                              value={proj.name}
                              onChange={(e) => handleListChange('projects', idx, 'name', e.target.value)}
                              className={styles.formInput}
                              placeholder="e.g. TSS Identity Portal"
                            />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Technologies Used</label>
                            <input
                              type="text"
                              value={proj.tech}
                              onChange={(e) => handleListChange('projects', idx, 'tech', e.target.value)}
                              className={styles.formInput}
                              placeholder="e.g. Next.js, TypeScript, PostgreSQL"
                            />
                          </div>
                        </div>

                        <div className={styles.formGrid2}>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>GitHub Repository Link</label>
                            <input
                              type="text"
                              value={proj.github}
                              onChange={(e) => handleListChange('projects', idx, 'github', e.target.value)}
                              className={styles.formInput}
                              placeholder="github.com/nikki-nooka/TSS"
                            />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Live Deployment Link</label>
                            <input
                              type="text"
                              value={proj.live}
                              onChange={(e) => handleListChange('projects', idx, 'live', e.target.value)}
                              className={styles.formInput}
                              placeholder="tss-network.com"
                            />
                          </div>
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.formLabel}>Description / Highlights (Separate lines)</label>
                          <textarea
                            value={proj.description}
                            onChange={(e) => handleListChange('projects', idx, 'description', e.target.value)}
                            placeholder="Implemented secure cryptographic credential validation&#10;Handled 1500+ active candidates queries with 99.8% database uptime"
                            className={styles.formTextarea}
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => addListItem('projects', { name: '', description: '', tech: '', github: '', live: '', achievements: '' })} 
                      className={styles.addBlockBtn}
                    >
                      <Plus size={16} /> Add Project
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: SKILLS */}
              {currentStep === 6 && (
                <div className="fade-in">
                  <div className={styles.formHeader}>
                    <h2>Technical Skills</h2>
                    <p>Select your core competencies or add custom skill parameters.</p>
                  </div>
                  <div className={styles.formFieldsWrapper}>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Programming Languages (comma separated)</label>
                      <input
                        type="text"
                        placeholder="TypeScript, JavaScript, Python, Java"
                        value={resumeData.skillsLanguages?.join(', ') || ''}
                        onChange={(e) => handleFieldChange('skillsLanguages', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Frameworks & Libraries</label>
                      <input
                        type="text"
                        placeholder="React, Next.js, Node.js, Express"
                        value={resumeData.skillsFrameworks?.join(', ') || ''}
                        onChange={(e) => handleFieldChange('skillsFrameworks', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Databases</label>
                      <input
                        type="text"
                        placeholder="PostgreSQL, MongoDB, Redis, MySQL"
                        value={resumeData.skillsDatabases?.join(', ') || ''}
                        onChange={(e) => handleFieldChange('skillsDatabases', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Cloud Platforms</label>
                      <input
                        type="text"
                        placeholder="AWS, GCP, Vercel, Firebase"
                        value={resumeData.skillsCloud?.join(', ') || ''}
                        onChange={(e) => handleFieldChange('skillsCloud', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Developer Tools & Orchestrations</label>
                      <input
                        type="text"
                        placeholder="Git, Docker, Kubernetes, Webpack"
                        value={resumeData.skillsTools?.join(', ') || ''}
                        onChange={(e) => handleFieldChange('skillsTools', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Soft Skills</label>
                      <input
                        type="text"
                        placeholder="Agile, Leadership, Technical Writing, Mentoring"
                        value={resumeData.skillsSoft?.join(', ') || ''}
                        onChange={(e) => handleFieldChange('skillsSoft', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Add Custom Skill Chips</label>
                      <div className={styles.skillInputWrapper}>
                        <input
                          type="text"
                          placeholder="e.g. CI/CD, GraphQL, Figma"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                          className={styles.formInput}
                        />
                        <button type="button" onClick={addCustomSkill} className="btn btn-primary">+</button>
                      </div>
                      <div className={styles.skillChipsGrid}>
                        {resumeData.customSkills?.map((tag, sidx) => (
                          <span key={sidx} className={styles.skillChip}>
                            {tag}
                            <button type="button" onClick={() => removeCustomSkill(sidx)} className={styles.removeChipBtn}>&times;</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: CERTIFICATIONS */}
              {currentStep === 7 && (
                <div className="fade-in">
                  <div className={styles.formHeader}>
                    <h2>Certifications</h2>
                    <p>Showcase credentials received from AWS, Google, or Coursera.</p>
                  </div>
                  <div className={styles.formFieldsWrapper}>
                    {resumeData.certifications.map((cert, idx) => (
                      <div key={idx} className={styles.dynamicItemBlock}>
                        <div className={styles.dynamicBlockHeader}>
                          <h4>Certificate #{idx + 1}</h4>
                          <button type="button" onClick={() => removeListItem('certifications', idx)} className={styles.removeBlockBtn}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                        <div className={styles.formGrid2}>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Certificate Name</label>
                            <input
                              type="text"
                              value={cert.name}
                              onChange={(e) => handleListChange('certifications', idx, 'name', e.target.value)}
                              className={styles.formInput}
                              placeholder="e.g. AWS Certified Cloud Practitioner"
                            />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Issuing Organization</label>
                            <input
                              type="text"
                              value={cert.org}
                              onChange={(e) => handleListChange('certifications', idx, 'org', e.target.value)}
                              className={styles.formInput}
                              placeholder="Amazon Web Services"
                            />
                          </div>
                        </div>
                        <div className={styles.formGrid2}>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Issue Date</label>
                            <input
                              type="text"
                              value={cert.date}
                              onChange={(e) => handleListChange('certifications', idx, 'date', e.target.value)}
                              className={styles.formInput}
                              placeholder="December 2025"
                            />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Credential URL</label>
                            <input
                              type="text"
                              value={cert.url}
                              onChange={(e) => handleListChange('certifications', idx, 'url', e.target.value)}
                              className={styles.formInput}
                              placeholder="aws.amazon.com/verification/..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => addListItem('certifications', { name: '', org: '', date: '', url: '' })} 
                      className={styles.addBlockBtn}
                    >
                      <Plus size={16} /> Add Certification
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 8: ACHIEVEMENTS */}
              {currentStep === 8 && (
                <div className="fade-in">
                  <div className={styles.formHeader}>
                    <h2>Awards & Achievements</h2>
                    <p>List hackathon wins, scholarship credentials, or publications.</p>
                  </div>
                  <div className={styles.formFieldsWrapper}>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Add Achievement Parameter</label>
                      <div className={styles.skillInputWrapper}>
                        <input
                          type="text"
                          placeholder="e.g. Winner of TSS Real Problem Hackathon (among 500 teams)"
                          value={achievementInput}
                          onChange={(e) => setAchievementInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievementItem())}
                          className={styles.formInput}
                        />
                        <button type="button" onClick={addAchievementItem} className="btn btn-primary">+</button>
                      </div>
                      <div className={styles.skillChipsGrid}>
                        {resumeData.achievements.map((item, idx) => (
                          <span key={idx} className={styles.skillChip}>
                            🏆 {item}
                            <button type="button" onClick={() => removeAchievementItem(idx)} className={styles.removeChipBtn}>&times;</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 9: EXTRA */}
              {currentStep === 9 && (
                <div className="fade-in">
                  <div className={styles.formHeader}>
                    <h2>Extra Information</h2>
                    <p>Highlight languages, interests, and leadership roles.</p>
                  </div>
                  <div className={styles.formFieldsWrapper}>
                    <div className={styles.formGrid2}>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Languages (comma separated)</label>
                        <input
                          type="text"
                          placeholder="English, Spanish, Hindi"
                          value={resumeData.languages}
                          onChange={(e) => handleFieldChange('languages', e.target.value)}
                          className={styles.formInput}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Interests / Hobbies</label>
                        <input
                          type="text"
                          placeholder="Competitive Coding, Open Source, Hiking"
                          value={resumeData.interests}
                          onChange={(e) => handleFieldChange('interests', e.target.value)}
                          className={styles.formInput}
                        />
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Volunteer / Community Service Experience</label>
                      <textarea
                        placeholder="Campus Ambassador at TSS, volunteering to mentor student hackathon candidates..."
                        value={resumeData.volunteer}
                        onChange={(e) => handleFieldChange('volunteer', e.target.value)}
                        className={styles.formTextarea}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div className={styles.formActionsRow}>
                <button 
                  type="button" 
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                {currentStep < 9 ? (
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    Next Step <ArrowRight size={16} />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => {
                      setMobileViewTab('preview');
                      toast.success('Ready to download! Check the preview panel.');
                    }}
                    className="btn btn-primary"
                  >
                    Review & Download
                  </button>
                )}
              </div>

              {/* SIDEBAR WIDGETS GATHERING */}
              <div className={styles.sidebarGrid}>
                
                {/* 1. Dynamic Resume Tips */}
                <div className={styles.tipCard}>
                  <div className={styles.tipHeader}>
                    <HelpCircle size={18} />
                    <h4>Builder Suggestion Checklist</h4>
                  </div>
                  <ul>
                    {getStepTips().map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>

                {/* 2. ATS Score Card */}
                <div className={styles.atsWidgetCard}>
                  <div className={styles.atsGaugeRow}>
                    <span className={styles.atsTitle}>ATS Score Calculator</span>
                    <span className={styles.scoreMeterBadge}>{atsScore}/100</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressBar} style={{ width: `${atsScore}%` }}></div>
                  </div>
                  <div className={styles.suggestionsBox}>
                    <h5>Form Parameters Verification</h5>
                    <div className={styles.suggestionsList}>
                      <span className={styles.suggestionItem}>
                        <CheckCircle2 size={12} className={styles.suggestionIcon} style={{ color: resumeData.fullName ? 'var(--success)' : 'var(--warning)' }} /> 
                        {resumeData.fullName ? 'Name Registered' : 'Missing Name'}
                      </span>
                      <span className={styles.suggestionItem}>
                        <CheckCircle2 size={12} className={styles.suggestionIcon} style={{ color: resumeData.email.includes('@') ? 'var(--success)' : 'var(--warning)' }} />
                        {resumeData.email.includes('@') ? 'Contact Email Set' : 'Missing Contact Email'}
                      </span>
                      <span className={styles.suggestionItem}>
                        <CheckCircle2 size={12} className={styles.suggestionIcon} style={{ color: resumeData.skillsLanguages.length > 0 ? 'var(--success)' : 'var(--warning)' }} />
                        {resumeData.skillsLanguages.length > 0 ? 'Skills List Found' : 'Missing Skills'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. TSS Readiness Scores Card */}
                <div className={styles.readinessScoresCard}>
                  <span className={styles.atsTitle}>TSS Readiness Scores</span>
                  <div className={styles.readinessGrid}>
                    <div className={styles.readinessItem}>
                      <div className={styles.readinessVal}>{faangScore}%</div>
                      <span className={styles.readinessLabel}>FAANG Ready</span>
                    </div>
                    <div className={styles.readinessItem}>
                      <div className={styles.readinessVal}>{startupScore}%</div>
                      <span className={styles.readinessLabel}>Startup Ready</span>
                    </div>
                    <div className={styles.readinessItem}>
                      <div className={styles.readinessVal}>{recruiterScore}%</div>
                      <span className={styles.readinessLabel}>HR Ready</span>
                    </div>
                  </div>
                </div>

                {/* 4. Client AI Copilot Panel */}
                <div className={styles.aiPanel}>
                  <div className={styles.aiHeader}>
                    <Sparkles size={18} />
                    <h4>TSS AI Assistant</h4>
                  </div>
                  <p className={styles.aiAdviceText}>Click below to optimize your summary or project bullets dynamically.</p>
                  {aiSuggestion && (
                    <div className={styles.aiSuggestionCard} style={{ marginBottom: '1rem' }}>
                      {aiSuggestion}
                    </div>
                  )}
                  <button 
                    type="button" 
                    disabled={generatingAi}
                    onClick={requestAiSuggestion}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', borderColor: '#22c55e', color: '#15803d' }}
                  >
                    {generatingAi ? 'Analyzing Data...' : '✨ Generate AI Optimization'}
                  </button>
                </div>

                {/* 5. TSS Verification Ready Callout */}
                <div className={styles.verificationCallout}>
                  <h4>Want to become TSS Verified?</h4>
                  <p>Get your credentials manually vetted (Student ID, Resume, Skills) and receive a verified Member Card code to bypass recruiter pipelines.</p>
                  <Link href="/register">
                    Submit Verification Request <ArrowRight size={14} />
                  </Link>
                </div>

              </div>

            </div>

            {/* Right Panel: Live Preview Panel */}
            <div 
              className={styles.previewPanel}
              style={{ display: mobileViewTab === 'preview' ? 'flex' : '' }}
            >
              <div className={styles.previewStickyBar}>
                
                {/* Floating Preview Toolbar */}
                <div className={styles.previewToolbar}>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value as any)}
                    style={{ background: 'none', border: 'none', fontStyle: 'italic', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}
                  >
                    <option value="FAANG">FAANG Template</option>
                    <option value="Startup">Startup Template</option>
                    <option value="General">Corporate Template</option>
                  </select>

                  <div className={styles.toolbarDivider}></div>

                  <button type="button" onClick={() => setZoomScale(p => Math.max(p - 0.1, 0.6))} className="btn btn-outline btn-sm" style={{ padding: '0.2rem 0.4rem' }}>
                    <ZoomOut size={14} />
                  </button>
                  <span className={styles.zoomLabel}>{Math.round(zoomScale * 100)}%</span>
                  <button type="button" onClick={() => setZoomScale(p => Math.min(p + 0.1, 1.3))} className="btn btn-outline btn-sm" style={{ padding: '0.2rem 0.4rem' }}>
                    <ZoomIn size={14} />
                  </button>

                  <div className={styles.toolbarDivider}></div>

                  <button type="button" onClick={handleDownloadPdf} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Download size={14} /> Download PDF
                  </button>
                </div>

                {/* Privacy Badge */}
                <div className={styles.privacyNoticeBadge}>
                  <Lock size={12} style={{ color: 'var(--success)' }} />
                  <span>Your draft is stored client-side and is not sent to any remote servers.</span>
                </div>
              </div>

              {/* Scroll Container for Paper */}
              <div 
                className={styles.previewContainerScroll}
                style={{ height: `${1130 * zoomScale}px`, overflow: 'visible' }}
              >
                <div 
                  id="tss-resume-preview" 
                  className={styles.resumePaper}
                  style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
                >
                  {selectedTemplate === 'FAANG' && renderFaangTemplate()}
                  {selectedTemplate === 'Startup' && renderStartupTemplate()}
                  {selectedTemplate === 'General' && renderGeneralTemplate()}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
