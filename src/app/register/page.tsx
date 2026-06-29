'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  User, 
  Layers, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Check, 
  AlertCircle,
  HelpCircle,
  FileText,
  Lock,
  Sparkles,
  Search,
  Plus,
  ChevronDown
} from 'lucide-react';
import { useToast } from '@/components/Toast';

const ROLE_OPTIONS = [
  { name: 'Student', desc: 'Ambitious learner launching a career' },
  { name: 'Founder', desc: 'Building the next big thing' },
  { name: 'Recruiter', desc: 'Sourcing verified builder talent' },
  { name: 'HR', desc: 'Managing workforce and partnerships' },
  { name: 'Mentor', desc: 'Guiding students and founders' },
  { name: 'Investor', desc: 'Backing high-potential projects' },
  { name: 'Freelancer', desc: 'Offering professional services' },
  { name: 'Creator', desc: 'Building audience and content' },
  { name: 'College', desc: 'Campus representative and admin' },
  { name: 'Company', desc: 'Partnering organization' },
  { name: 'Volunteer', desc: 'Giving back to the community' },
  { name: 'Campus Ambassador', desc: 'Leading TSS on campus' }
];

export default function Register() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Card Selector & Username secures
  const [selectedRole, setSelectedRole] = useState('Student');
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameAlternatives, setUsernameAlternatives] = useState<string[]>([]);

  // Profile Photo Upload states
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic forms data state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: '',
    state: '',
    country: 'India',
    gender: 'Prefer Not To Say',
    dob: '2000-01-01',
    linkedin: '',
    github: '',
    portfolio: '',

    // Student specific
    college: '',
    university: '',
    degree: '',
    branch: '', // branch / specialization
    graduationYear: 2026,
    skills: '', // comma separated raw string
    careerInterest: '',
    preferredRoles: '', // comma separated raw string
    resumeLink: '',

    // Founder specific
    startupName: '',
    startupStage: 'Ideation',
    industry: '',
    website: '',
    startupDeckLink: '',
    teamSize: '1-5',
    lookingFor: '',

    // Recruiter / HR specific
    companyName: '',
    designation: '',
    hiringCategories: '',
    companyWebsite: '',

    // Mentor specific
    currentCompany: '',
    experience: 'Fresher',
    expertise: '',

    // Investor specific
    investmentFocus: '',
    fundName: '',
    preferredStartupStage: 'Ideation',

    // Secondary categories custom text helper
    organizationName: '',
    servicesOffered: '',
    contentNiche: '',
    socialLink: '',
    skillsInterests: ''
  });

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check Username uniqueness with debounce
  useEffect(() => {
    if (!usernameInput) {
      setUsernameStatus('idle');
      setUsernameAlternatives([]);
      return;
    }

    const cleaned = usernameInput.trim().replace(/^@/, '').toLowerCase();
    if (cleaned.length < 3) {
      setUsernameStatus('idle');
      setUsernameAlternatives([]);
      return;
    }

    setUsernameStatus('checking');
    const delayDebounceFn = setTimeout(() => {
      fetch('/api/auth/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleaned })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.available) {
            setUsernameStatus('available');
            setUsernameAlternatives([]);
          } else {
            setUsernameStatus('taken');
            setUsernameAlternatives(data.alternatives || []);
          }
        } else {
          setUsernameStatus('idle');
        }
      })
      .catch(() => setUsernameStatus('idle'));
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [usernameInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Invalid photo format. Only JPG, JPEG, and PNG are allowed.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Photo size exceeds 2MB limit.');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const validateStep1 = () => {
    if (!usernameInput) {
      toast.error('Please enter a preferred username.');
      return false;
    }
    if (usernameStatus !== 'available') {
      toast.error('Please select an available username before proceeding.');
      return false;
    }
    return true;
  };

  const handleNextStep1 = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.fullName.trim()) {
      toast.error('Full Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email Address is required.');
      return;
    }
    if (!formData.mobile.trim()) {
      toast.error('Phone number is required.');
      return;
    }
    if (!formData.city.trim() || !formData.state.trim()) {
      toast.error('Location details (City & State) are required.');
      return;
    }
    if (!formData.linkedin.trim() || !formData.linkedin.toLowerCase().includes('linkedin.com/')) {
      toast.error('A valid LinkedIn URL is required.');
      return;
    }

    // Role specific checks
    if (selectedRole === 'Student') {
      if (!formData.college.trim() || !formData.degree.trim() || !formData.branch.trim()) {
        toast.error('College details, Degree, and Branch are required.');
        return;
      }
      if (!formData.skills.trim()) {
        toast.error('Please add at least one skill.');
        return;
      }
      if (!formData.resumeLink.trim() || (!formData.resumeLink.toLowerCase().includes('drive.google.com') && !formData.resumeLink.toLowerCase().includes('docs.google.com'))) {
        toast.error('Google Drive URL is required for student resume links.');
        return;
      }
    } else if (selectedRole === 'Founder') {
      if (!formData.startupName.trim() || !formData.industry.trim() || !formData.lookingFor.trim()) {
        toast.error('Startup Name, Stage, Industry, and Looking For are required.');
        return;
      }
    } else if (['Recruiter', 'HR'].includes(selectedRole)) {
      if (!formData.companyName.trim() || !formData.designation.trim() || !formData.hiringCategories.trim()) {
        toast.error('Company Name, Designation, and Hiring Categories are required.');
        return;
      }
    } else if (selectedRole === 'Mentor') {
      if (!formData.currentCompany.trim() || !formData.expertise.trim()) {
        toast.error('Current Company and Areas of Expertise are required.');
        return;
      }
    } else if (selectedRole === 'Investor') {
      if (!formData.fundName.trim() || !formData.investmentFocus.trim()) {
        toast.error('Fund Name and Investment Focus are required.');
        return;
      }
    }

    if (!photoFile) {
      toast.error('Profile Photo upload is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('role', selectedRole);
      data.append('username', usernameInput.trim().replace(/^@/, '').toLowerCase());
      data.append('fullName', formData.fullName.trim());
      data.append('email', formData.email.trim().toLowerCase());
      data.append('mobile', formData.mobile.trim());
      data.append('city', formData.city.trim());
      data.append('state', formData.state.trim());
      data.append('country', formData.country);
      data.append('gender', formData.gender);
      data.append('dob', formData.dob);
      data.append('linkedin', formData.linkedin.trim());
      data.append('github', formData.github.trim());
      data.append('portfolio', formData.portfolio.trim());
      data.append('declaration', 'true');
      data.append('photo', photoFile);

      // Append role specific fields
      if (selectedRole === 'Student') {
        data.append('highestQualification', 'Undergraduate');
        data.append('currentStatus', 'Pursuing');
        data.append('college', formData.college.trim());
        data.append('university', formData.university.trim() || formData.college.trim());
        data.append('degree', formData.degree.trim());
        data.append('specialization', formData.branch.trim());
        data.append('graduationYear', formData.graduationYear.toString());
        data.append('resumeLink', formData.resumeLink.trim());
        
        // Serialize skills
        const skillsArr = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
        data.append('skills', JSON.stringify(skillsArr));

        // Preferred roles
        const rolesArr = formData.preferredRoles.split(',').map(r => r.trim()).filter(Boolean);
        data.append('preferredRoles', JSON.stringify(rolesArr));
        data.append('preferredDomain', formData.careerInterest.trim() || 'Software Engineering');
      } 
      else if (selectedRole === 'Founder') {
        data.append('startupName', formData.startupName.trim());
        data.append('startupStage', formData.startupStage);
        data.append('industry', formData.industry.trim());
        data.append('website', formData.website.trim());
        data.append('startupDescription', formData.lookingFor.trim());
        data.append('teamSize', formData.teamSize);
        data.append('resumeLink', formData.startupDeckLink.trim()); // deck url
      } 
      else if (['Recruiter', 'HR'].includes(selectedRole)) {
        data.append('companyName', formData.companyName.trim());
        data.append('designation', formData.designation.trim());
        data.append('hiringDomains', formData.hiringCategories.trim());
        data.append('companyWebsite', formData.companyWebsite.trim());
      } 
      else if (selectedRole === 'Mentor') {
        data.append('currentCompany', formData.currentCompany.trim());
        data.append('mentorRole', 'Mentor');
        data.append('experience', formData.experience);
        data.append('expertiseAreas', formData.expertise.trim());
      } 
      else if (selectedRole === 'Investor') {
        data.append('fundName', formData.fundName.trim());
        data.append('investmentFocus', formData.investmentFocus.trim());
        data.append('website', formData.website.trim());
        data.append('preferredStartupStage', formData.preferredStartupStage);
      } 
      else {
        // Fallback working professional mapping for secondary roles
        data.append('company', formData.organizationName.trim() || 'N/A');
        data.append('professionalRole', selectedRole);
        data.append('professionalExperience', '1-3 Years');
        
        const genericSkills = (formData.skillsInterests || formData.servicesOffered || 'General').split(',').map(s => s.trim()).filter(Boolean);
        data.append('skills', JSON.stringify(genericSkills));
        
        data.append('college', formData.college.trim() || 'N/A');
        data.append('degree', formData.degree.trim() || 'N/A');
        data.append('specialization', formData.branch.trim() || 'N/A');
        data.append('graduationYear', formData.graduationYear.toString());
        data.append('resumeLink', formData.linkedin.trim());
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        body: data
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success('Registration submitted! Verification pending.');
        localStorage.setItem('tss_registered_email', formData.email.trim());
        setStep(3);
        window.scrollTo(0, 0);
      } else {
        toast.error(result.error || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network connection error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        
        {/* Header section */}
        <div className={styles.headerSection}>
          <h1>TSS Verification</h1>
          <p>Register once to secure your lifelong professional identity and get verified by the admin team.</p>
        </div>

        {/* Dynamic Card Container */}
        <div className={styles.card}>
          
          {/* Progress Indicators */}
          <div className={styles.stepper}>
            <div className={`${styles.stepNode} ${step === 1 ? styles.stepNodeActive : ''}`}>
              <div className={`${styles.stepCircle} ${step === 1 ? styles.stepCircleActive : ''}`}>1</div>
              <span>Choose Role</span>
            </div>
            <div className={`${styles.stepNode} ${step === 2 ? styles.stepNodeActive : ''}`}>
              <div className={`${styles.stepCircle} ${step === 2 ? styles.stepCircleActive : ''}`}>2</div>
              <span>Profile Information</span>
            </div>
            <div className={`${styles.stepNode} ${step === 3 ? styles.stepNodeActive : ''}`}>
              <div className={`${styles.stepCircle} ${step === 3 ? styles.stepCircleActive : ''}`}>✓</div>
              <span>Verification</span>
            </div>
          </div>

          {/* STEP 1: Select Role & Preferred Username */}
          {step === 1 && (
            <div className="fade-in">
              <h2 className={styles.stepTitle}>Select Your Role & Secure Username</h2>
              
              {/* Dropdown Role Selector */}
              <div ref={dropdownRef} className={styles.dropdownContainer}>
                <label className={styles.label}>Choose Your Role <span style={{ color: 'red' }}>*</span></label>
                <div 
                  className={styles.dropdownToggle}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className={styles.dropdownSelectedInfo}>
                    <span className={styles.selectedRoleName}>
                      {selectedRole}
                    </span>
                    <span className={styles.selectedRoleDesc}>
                      {ROLE_OPTIONS.find(r => r.name === selectedRole)?.desc}
                    </span>
                  </div>
                  <ChevronDown className={`${styles.dropdownChevron} ${isDropdownOpen ? styles.chevronOpen : ''}`} size={20} />
                </div>

                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    {ROLE_OPTIONS.map((opt) => (
                      <div 
                        key={opt.name}
                        className={`${styles.dropdownItem} ${selectedRole === opt.name ? styles.dropdownItemActive : ''}`}
                        onClick={() => {
                          setSelectedRole(opt.name);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div className={styles.itemMeta}>
                          <span className={styles.itemName}>{opt.name}</span>
                          <span className={styles.itemDesc}>{opt.desc}</span>
                        </div>
                        {selectedRole === opt.name && <Check size={16} className={styles.checkIcon} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Secure Username */}
              <div className={styles.formGroup} style={{ maxWidth: '450px', margin: '2rem auto 0' }}>
                <label className={styles.label}>Preferred Lifetime Username <span style={{ color: 'red' }}>*</span></label>
                <div className={styles.usernameWrapper}>
                  <span className={styles.usernamePrefix}>@</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="e.g. rajkamal"
                    className={`${styles.input} ${styles.usernameInput}`}
                  />
                  <div className={styles.usernameStatus}>
                    {usernameStatus === 'checking' && <small style={{ color: 'var(--text-muted)' }}>Checking...</small>}
                    {usernameStatus === 'available' && <Check size={18} style={{ color: 'var(--success)' }} />}
                    {usernameStatus === 'taken' && <AlertCircle size={18} style={{ color: 'red' }} />}
                  </div>
                </div>
                
                {usernameStatus === 'taken' && usernameAlternatives.length > 0 && (
                  <div className={styles.suggestions}>
                    <span className={styles.suggestionsTitle}>Unavailable. Try one of these:</span>
                    {usernameAlternatives.map((alt) => (
                      <span 
                        key={alt} 
                        className={styles.suggestionBadge}
                        onClick={() => setUsernameInput(alt)}
                      >
                        @{alt}
                      </span>
                    ))}
                  </div>
                )}
                <small style={{ color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block', fontSize: '0.78rem' }}>
                  Usernames cannot contain spaces or special characters except dot (.) and underscore (_).
                </small>
              </div>

              {/* Action Buttons */}
              <div className={styles.actions} style={{ justifyContent: 'center' }}>
                <button 
                  type="button" 
                  onClick={handleNextStep1}
                  disabled={usernameStatus !== 'available'}
                  className={styles.primaryBtn}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DYNAMIC PROFILE QUESTIONS */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="fade-in">
              <h2 className={styles.stepTitle}>{selectedRole} Verification Details</h2>

              {/* Profile Photo Block (Required for all) */}
              <div className={styles.formGroup} style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <label className={styles.label}>Profile Photo <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoChange} 
                  accept="image/jpeg,image/png,image/jpg" 
                  style={{ display: 'none' }} 
                />
                
                {photoPreview ? (
                  <div onClick={handlePhotoClick} style={{ cursor: 'pointer' }}>
                    <img src={photoPreview} alt="Preview" className={styles.photoPreview} />
                    <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Change Photo</p>
                  </div>
                ) : (
                  <div className={styles.uploadZone} onClick={handlePhotoClick}>
                    <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Upload Profile Photo</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPG, JPEG or PNG up to 2MB</span>
                  </div>
                )}
              </div>

              {/* Core Common fields */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@domain.com"
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile"
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>LinkedIn Profile URL <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              {/* Dynamic inputs based on selected role */}
              
              {/* STUDENT FORM */}
              {selectedRole === 'Student' && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>College Name <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleInputChange}
                        placeholder="e.g. IIIT Hyderabad"
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>University Name</label>
                      <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        placeholder="e.g. Osmania University"
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Degree <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        placeholder="e.g. B.Tech / B.Sc"
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Branch / Specialization <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        placeholder="e.g. Computer Science"
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Graduation Year <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="number"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Resume Link (Google Drive URL only) <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="url"
                        name="resumeLink"
                        value={formData.resumeLink}
                        onChange={handleInputChange}
                        placeholder="Must be a shared Google Drive link"
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>GitHub Profile URL</label>
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        placeholder="https://github.com/username"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Portfolio Website</label>
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        placeholder="https://myportfolio.com"
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Skills (Comma-separated) <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="e.g. React, Next.js, Python, SQL"
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Career Interest</label>
                      <input
                        type="text"
                        name="careerInterest"
                        value={formData.careerInterest}
                        onChange={handleInputChange}
                        placeholder="e.g. AI Research, Web Dev"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Preferred Roles</label>
                      <input
                        type="text"
                        name="preferredRoles"
                        value={formData.preferredRoles}
                        onChange={handleInputChange}
                        placeholder="e.g. Frontend Engineer, Product Manager"
                        className={styles.input}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* FOUNDER FORM */}
              {selectedRole === 'Founder' && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Startup Name <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        name="startupName"
                        value={formData.startupName}
                        onChange={handleInputChange}
                        placeholder="Enter startup name"
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Startup Stage <span style={{ color: 'red' }}>*</span></label>
                      <select
                        name="startupStage"
                        value={formData.startupStage}
                        onChange={handleInputChange}
                        className={styles.select}
                      >
                        <option value="Ideation">Ideation</option>
                        <option value="MVP">MVP</option>
                        <option value="Early Traction">Early Traction</option>
                        <option value="Scaling">Scaling</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Industry <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="e.g. FinTech, AI, EdTech"
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Team Size</label>
                      <select
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        className={styles.select}
                      >
                        <option value="1-5">1-5 Members</option>
                        <option value="6-20">6-20 Members</option>
                        <option value="21-50">21-50 Members</option>
                        <option value="50+">50+ Members</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Startup Website URL</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://startup.com"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Startup Pitch Deck Link</label>
                      <input
                        type="url"
                        name="startupDeckLink"
                        value={formData.startupDeckLink}
                        onChange={handleInputChange}
                        placeholder="Google Drive, DocSend or Notion URL"
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Looking For <span style={{ color: 'red' }}>*</span></label>
                    <textarea
                      name="lookingFor"
                      value={formData.lookingFor}
                      onChange={handleInputChange}
                      placeholder="e.g. Co-founders, Hires, Funding, Mentorship..."
                      className={styles.textarea}
                      required
                    />
                  </div>
                </>
              )}

              {/* RECRUITER / HR FORM */}
              {['Recruiter', 'HR'].includes(selectedRole) && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Company Name <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Google, Razorpay"
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Designation <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="e.g. Talent Acquisition Lead"
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Company Website URL</label>
                      <input
                        type="url"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleInputChange}
                        placeholder="https://company.com"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Hiring Categories <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        name="hiringCategories"
                        value={formData.hiringCategories}
                        onChange={handleInputChange}
                        placeholder="e.g. Tech Interns, Sales, Designers"
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* MENTOR FORM */}
              {selectedRole === 'Mentor' && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Current Company / Title <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleInputChange}
                        placeholder="e.g. Staff Engineer @ Meta"
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Experience Level</label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className={styles.select}
                      >
                        <option value="0-1 Years">0-1 Years</option>
                        <option value="1-3 Years">1-3 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5+ Years">5+ Years</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Areas of Expertise <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        name="expertise"
                        value={formData.expertise}
                        onChange={handleInputChange}
                        placeholder="e.g. System Design, Product Strategy, Scaling"
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Portfolio / Website URL</label>
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        placeholder="https://mywork.com"
                        className={styles.input}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* INVESTOR FORM */}
              {selectedRole === 'Investor' && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Fund / Firm Name <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        name="fundName"
                        value={formData.fundName}
                        onChange={handleInputChange}
                        placeholder="e.g. Sequoia Capital / Angel"
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Investment Focus <span style={{ color: 'red' }}>*</span></label>
                      <input
                        type="text"
                        name="investmentFocus"
                        value={formData.investmentFocus}
                        onChange={handleInputChange}
                        placeholder="e.g. SaaS, DeepTech, Web3"
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Preferred Startup Stage</label>
                      <select
                        name="preferredStartupStage"
                        value={formData.preferredStartupStage}
                        onChange={handleInputChange}
                        className={styles.select}
                      >
                        <option value="Ideation">Ideation / Pre-Seed</option>
                        <option value="MVP">Seed / Early Stage</option>
                        <option value="Early Traction">Series A / B</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Website URL</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://fundsite.com"
                        className={styles.input}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* SECONDARY ROLES FALLBACKS */}
              {!['Student', 'Founder', 'Recruiter', 'HR', 'Mentor', 'Investor'].includes(selectedRole) && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Organization / Company / Brand Name</label>
                      <input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        placeholder="Name of your setup"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Official Portfolio or Channel URL</label>
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        placeholder="https://social-link.com"
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      {selectedRole === 'Freelancer' && 'Services Offered'}
                      {selectedRole === 'Creator' && 'Content Niche / Platforms'}
                      {selectedRole === 'Campus Ambassador' && 'Campus Outreach Strategies'}
                      {selectedRole === 'Volunteer' && 'Skills / Area of Support'}
                      {selectedRole === 'College' && 'College Authorization Details'}
                      {selectedRole === 'Company' && 'Partnership Goals'}
                    </label>
                    <textarea
                      name="servicesOffered"
                      value={formData.servicesOffered}
                      onChange={handleInputChange}
                      placeholder="Please elaborate on your work, goals, or community contributions..."
                      className={styles.textarea}
                    />
                  </div>
                </>
              )}

              {/* Location inputs */}
              <div className={styles.formRow} style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>City <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Karimnagar"
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>State <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Telangana"
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actions}>
                <button type="button" onClick={handleBack} className={styles.backBtn}>
                  <ArrowLeft size={16} /> Choose Role
                </button>
                <button type="submit" disabled={isSubmitting} className={styles.primaryBtn}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'} <Check size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS APPLICATION PENDING VIEW */}
          {step === 3 && (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <Lock size={32} />
              </div>
              <h2>Application Pending Review</h2>
              <p>
                Thank you! Your verification request has been logged successfully. The TSS admin team reviews all applications manually within 24–48 hours.
              </p>
              <div style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                maxWidth: '480px',
                margin: '0 auto 2.5rem',
                textAlign: 'left'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700 }}>What happens next?</h4>
                <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <li style={{ marginBottom: '0.5rem' }}>Admin team checks your LinkedIn profile and registered details.</li>
                  <li style={{ marginBottom: '0.5rem' }}>On approval, your official permanent lifetime TSS ID (e.g. TSS-000257) is generated.</li>
                  <li style={{ marginBottom: '0.5rem' }}>You will receive a confirmation email containing your digital member card and QR verification code.</li>
                  <li>Your ID credentials will unlock access to jobs, monthly build sandboxes, events, and official WhatsApp spaces.</li>
                </ol>
              </div>
              
              <Link href="/" className={styles.primaryBtn} style={{ margin: '0 auto', display: 'inline-flex' }}>
                Return to Homepage
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
