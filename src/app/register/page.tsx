'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  User, 
  BookOpen, 
  Briefcase, 
  FileText, 
  CheckSquare, 
  Upload, 
  X, 
  Plus, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  ShieldAlert,
  Smartphone,
  Mail,
  Camera,
  Layers
} from 'lucide-react';
import { useToast } from '@/components/Toast';

// Role-based list
const ROLE_OPTIONS = [
  'Student',
  'Founder',
  'Recruiter',
  'HR',
  'Mentor',
  'Investor',
  'Freelancer',
  'Creator',
  'Campus Ambassador',
  'Volunteer',
  'Startup',
  'Company'
];

const QUALIFICATION_OPTIONS = [
  '10th', 'Intermediate', 'Diploma', 'ITI', 
  'Undergraduate', 'Postgraduate', 'MBA', 'MTech', 'PhD', 'Other'
];

const STARTUP_STAGES = [
  'Ideation', 'MVP', 'Early Traction', 'Scaling'
];

const TEAM_SIZES = [
  '1-5', '6-20', '21-50', '50+'
];

const EXPERIENCE_LEVELS = [
  'Fresher', '0-1 Years', '1-3 Years', '3-5 Years', '5+ Years'
];

// Define global window type for Phone.email callback
declare global {
  interface Window {
    phoneEmailListener?: (userObj: { user_json_url: string }) => void;
    phoneEmailReceiver?: (userObj: { user_json_url: string }) => void;
  }
}

interface PhoneEmailWidgetProps {
  onVerified: (userJsonUrl: string) => void;
}

const PhoneEmailWidget = React.memo(({ onVerified }: PhoneEmailWidgetProps) => {
  useEffect(() => {
    // Bind listener globally
    window.phoneEmailListener = (userObj) => {
      if (userObj && userObj.user_json_url) {
        onVerified(userObj.user_json_url);
      }
    };

    // Load widget script dynamically
    const script = document.createElement('script');
    script.src = 'https://www.phone.email/sign_in_button_v1.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script and global handler
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      delete window.phoneEmailListener;
    };
  }, [onVerified]);

  return (
    <div 
      className="pe_signin_button" 
      data-client-id="15242599291320279332"
      style={{ display: 'inline-block', width: '100%' }}
    ></div>
  );
});
PhoneEmailWidget.displayName = 'PhoneEmailWidget';

const PhoneEmailEmailWidget = React.memo(({ onVerified }: PhoneEmailWidgetProps) => {
  useEffect(() => {
    // Bind receiver globally
    window.phoneEmailReceiver = (userObj) => {
      if (userObj && userObj.user_json_url) {
        onVerified(userObj.user_json_url);
      }
    };

    // Load widget script dynamically
    const script = document.createElement('script');
    script.src = 'https://www.phone.email/verify_email_v1.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script and global handler
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      delete window.phoneEmailReceiver;
    };
  }, [onVerified]);

  return (
    <div 
      className="pe_verify_email" 
      data-client-id="15242599291320279332"
      style={{ display: 'inline-block', width: '100%' }}
    ></div>
  );
});
PhoneEmailEmailWidget.displayName = 'PhoneEmailEmailWidget';

export default function Register() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    role: 'Student',
    fullName: '',
    gender: 'Prefer Not To Say',
    dob: '',
    mobile: '',
    email: '',
    city: '',
    state: '',
    country: 'India',
    linkedin: '',
    github: '',
    portfolio: '',
    declaration: false,

    // Student fields
    highestQualification: 'Undergraduate',
    college: '',
    degree: '',
    specialization: '',
    graduationYear: new Date().getFullYear(),
    skills: [] as string[],
    preferredDomain: 'Software Engineering',
    internshipInterested: 'No',
    jobInterested: 'No',
    startupInterested: 'No',
    buildxInterested: 'No',
    resumeLink: '',

    // Founder fields
    startupName: '',
    startupStage: 'Ideation',
    industry: '',
    website: '',
    startupDescription: '',
    teamSize: '1-5',

    // Recruiter fields
    companyName: '',
    designation: '',
    hiringDomains: '',
    companyWebsite: '',

    // Mentor fields
    currentCompany: '',
    mentorRole: '',
    experience: 'Fresher',
    expertiseAreas: '',

    // Investor fields
    fundName: '',
    investmentFocus: '',

    // Working Professional fields
    company: '',
    professionalRole: '',
    professionalExperience: 'Fresher'
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [isDevBypass, setIsDevBypass] = useState(false);

  // OTP Verification States
  const [phoneOtpState, setPhoneOtpState] = useState({
    verified: false,
    loading: false
  });

  const [emailOtpState, setEmailOtpState] = useState({
    verified: false,
    loading: false
  });

  // Handle standard input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add skill chip
  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (!cleanSkill) return;

    if (formData.skills.length >= 20) {
      toast.warning('Maximum 20 skills allowed');
      return;
    }

    if (formData.skills.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
      toast.warning('Skill already added');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, cleanSkill]
    }));
    setSkillInput('');
  };

  // Remove skill chip
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  // Handle Profile Photo Selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const validExts = ['.jpg', '.jpeg', '.png'];
    const nameLower = file.name.toLowerCase();
    const isValid = validExts.some(ext => nameLower.endsWith(ext));
    if (!isValid) {
      toast.error('Invalid image format. Only JPG, JPEG, and PNG are allowed.');
      e.target.value = '';
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error('Photo size exceeds the 2MB limit.');
      e.target.value = '';
      return;
    }

    setPhotoFile(file);
    toast.success(`Photo attached: ${file.name}`);
  };

  // --- Phone.email Verification Callback ---
  const handlePhoneEmailVerified = React.useCallback(async (user_json_url: string) => {
    setPhoneOtpState(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'phone_email_verify',
          user_json_url
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const rawPhone = data.phone || '';
        const tenDigitPhone = rawPhone.replace(/\D/g, '').slice(-10);
        
        setFormData(prev => ({ ...prev, mobile: tenDigitPhone }));
        setPhoneOtpState({
          verified: true,
          loading: false
        });
        toast.success(`Phone verified successfully: ${tenDigitPhone}`);
      } else {
        toast.error(data.error || 'Failed to verify phone number.');
        setPhoneOtpState(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Verification connection failed.');
      setPhoneOtpState(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);

  // --- Phone.email Email Verification Callback ---
  const handleEmailVerified = React.useCallback(async (user_json_url: string) => {
    setEmailOtpState(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'phone_email_email_verify',
          user_json_url
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const verifiedEmail = data.email || '';
        
        setFormData(prev => ({ ...prev, email: verifiedEmail }));
        setEmailOtpState({
          verified: true,
          loading: false
        });
        toast.success(`Email verified successfully: ${verifiedEmail}`);
      } else {
        toast.error(data.error || 'Failed to verify email address.');
        setEmailOtpState(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Email verification connection failed.');
      setEmailOtpState(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);

  // --- Step Navigation & Validations ---

  const validateStep = () => {
    if (step === 1) {
      if (!formData.role) {
        toast.error('Please select your membership role.');
        return false;
      }
      if (isDevBypass) {
        if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length !== 10) {
          toast.error('Please enter a valid 10-digit mobile number.');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
          toast.error('Please enter a valid email address.');
          return false;
        }
      } else {
        if (!phoneOtpState.verified) {
          toast.error('Please verify your Mobile Number using OTP.');
          return false;
        }
        if (!emailOtpState.verified) {
          toast.error('Please verify your Email Address using OTP.');
          return false;
        }
      }
    }

    if (step === 2) {
      // 1. Validate common personal fields
      const nameRegex = /^[A-Za-z\s]+$/;
      if (formData.fullName.trim().length < 3 || formData.fullName.trim().length > 60) {
        toast.error('Full Name must be between 3 and 60 characters.');
        return false;
      }
      if (!nameRegex.test(formData.fullName.trim())) {
        toast.error('Name can only contain alphabets and spaces.');
        return false;
      }
      if (!formData.dob) {
        toast.error('Date of Birth is required.');
        return false;
      }
      
      const dobDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      if (age < 16 || age > 60 || isNaN(age)) {
        toast.error('Age must be between 16 and 60 years.');
        return false;
      }

      if (!formData.city.trim() || !formData.state.trim()) {
        toast.error('City and State are required.');
        return false;
      }

      // 2. Validate role specific fields
      if (['Student', 'Campus Ambassador', 'Volunteer'].includes(formData.role)) {
        if (!formData.college.trim()) {
          toast.error('College Name is required.');
          return false;
        }
        if (!formData.degree.trim()) {
          toast.error('Degree selection is required.');
          return false;
        }
        if (!formData.specialization.trim()) {
          toast.error('Specialization is required.');
          return false;
        }
        const year = parseInt(formData.graduationYear as any, 10);
        if (isNaN(year) || year < 2000 || year > 2045) {
          toast.error('Graduation Year must be between 2000 and 2045.');
          return false;
        }
        if (formData.skills.length === 0) {
          toast.error('Please add at least one skill.');
          return false;
        }
      } 
      else if (['Founder', 'Startup'].includes(formData.role)) {
        if (!formData.startupName.trim() || !formData.industry.trim() || !formData.startupDescription.trim()) {
          toast.error('Startup Name, Industry, and Description are required.');
          return false;
        }
      } 
      else if (['Recruiter', 'HR', 'Company'].includes(formData.role)) {
        if (!formData.companyName.trim() || !formData.designation.trim() || !formData.hiringDomains.trim()) {
          toast.error('Company Name, Designation, and Hiring Domains are required.');
          return false;
        }
      } 
      else if (formData.role === 'Mentor') {
        if (!formData.currentCompany.trim() || !formData.mentorRole.trim() || !formData.expertiseAreas.trim()) {
          toast.error('Current Company, Role, and Expertise Areas are required.');
          return false;
        }
      } 
      else if (formData.role === 'Investor') {
        if (!formData.fundName.trim() || !formData.investmentFocus.trim()) {
          toast.error('Fund Name and Investment Focus are required.');
          return false;
        }
      } 
      else if (['Working Professional', 'Freelancer', 'Creator'].includes(formData.role)) {
        if (!formData.company.trim() || !formData.professionalRole.trim()) {
          toast.error('Company Name and Designation are required.');
          return false;
        }
        if (formData.skills.length === 0) {
          toast.error('Please add at least one skill.');
          return false;
        }
      }
    }

    if (step === 3) {
      if (!formData.linkedin.trim() || !formData.linkedin.toLowerCase().includes('linkedin.com/')) {
        toast.error('A valid LinkedIn URL is required.');
        return false;
      }
      if (['Student', 'Campus Ambassador', 'Volunteer'].includes(formData.role)) {
        if (!formData.resumeLink.trim()) {
          toast.error('Resume URL link is required.');
          return false;
        }
        const urlPattern = /^https?:\/\/.+/i;
        if (!urlPattern.test(formData.resumeLink.trim())) {
          toast.error('Please enter a valid URL (e.g., https://drive.google.com/...)');
          return false;
        }
      }
      if (!photoFile) {
        toast.error('Profile Photo upload is required.');
        return false;
      }
      if (!formData.declaration) {
        toast.error('You must accept the terms and declaration.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      
      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'skills') {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value.toString());
        }
      });

      // Append files
      if (photoFile) {
        data.append('photo', photoFile);
      }
      // resumeLink is part of formData and is already appended above.

      const res = await fetch('/api/register', {
        method: 'POST',
        body: data
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success('Registration submitted! Verification pending.');
        
        // Save to ease status checking
        localStorage.setItem('tss_registered_email', formData.email);
        localStorage.setItem('tss_registered_mobile', formData.mobile);

        // Advance to success page (step 4)
        setStep(4);
      } else {
        toast.error(result.error || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failed. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <section className={styles.registerHeader}>
        <div className="container">
          <h1>TSS Network Verification</h1>
          <p>Phase 1 credential vetting. Register to receive your unique verified identity card.</p>
        </div>
      </section>

      <section className={styles.formContainer}>
        <div className="container">
          <div className={styles.formCard}>
            
            {/* Horizontal 3-Step Stepper */}
            {step < 4 && (
              <div className={styles.stepper}>
                <div className={`${styles.stepIndicator} ${step === 1 ? styles.active : ''} ${step > 1 ? styles.completed : ''}`}>
                  <span className={styles.stepNum}>1</span>
                  <span className={styles.stepName}>Verification</span>
                </div>
                <div className={styles.stepLine}></div>
                <div className={`${styles.stepIndicator} ${step === 2 ? styles.active : ''} ${step > 2 ? styles.completed : ''}`}>
                  <span className={styles.stepNum}>2</span>
                  <span className={styles.stepName}>Profile Info</span>
                </div>
                <div className={styles.stepLine}></div>
                <div className={`${styles.stepIndicator} ${step === 3 ? styles.active : ''}`}>
                  <span className={styles.stepNum}>3</span>
                  <span className={styles.stepName}>Socials & Photo</span>
                </div>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              
              {/* STEP 1: ROLE SELECTION & OTP VERIFICATION */}
              {step === 1 && (
                <div className="fade-in">
                  <div className={styles.stepHeader}>
                    <Layers className={styles.stepIcon} size={24} />
                    <h2>Select Role & Verify Contacts</h2>
                  </div>

                  <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                    <label className="form-label">I am registering as a: <span className="required">*</span></label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="form-select"
                      style={{ fontSize: '1.05rem', padding: '0.85rem 1.15rem' }}
                    >
                      {ROLE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <small className={styles.inputHelp}>Your profile fields and TSS ID will adapt dynamically to this selection.</small>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    background: '#f8fafc',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#64748b' }}></span>
                      <span><strong>Testing Mode:</strong> Skip WhatsApp / Email OTP verification</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDevBypass(!isDevBypass)}
                      style={{
                        background: isDevBypass ? 'var(--primary)' : 'var(--border-color)',
                        color: isDevBypass ? 'var(--text-inverse)' : 'var(--text-main)',
                        border: 'none',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      {isDevBypass ? 'Enabled' : 'Enable Bypass'}
                    </button>
                  </div>

                  {isDevBypass ? (
                    <div className="fade-in" style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">WhatsApp/Mobile Number <span className="required">*</span></label>
                        <input
                          type="tel"
                          name="mobile"
                          placeholder="e.g., 9876543210"
                          value={formData.mobile}
                          onChange={handleChange}
                          className="form-input"
                          maxLength={10}
                        />
                        <small className={styles.inputHelp}>Enter a 10-digit number for mock testing.</small>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Email Address <span className="required">*</span></label>
                        <input
                          type="email"
                          name="email"
                          placeholder="e.g., candidate@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input"
                        />
                        <small className={styles.inputHelp}>Enter an email address for mock testing.</small>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Mobile & OTP Block */}
                      <div className={styles.otpGrid} style={{ gridTemplateColumns: '1fr', padding: '1.5rem', background: '#fff', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                        {phoneOtpState.verified ? (
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Verified Mobile Number <span className="required">*</span></label>
                            <div className={styles.inputWithBtn}>
                              <input
                                type="tel"
                                name="mobile"
                                readOnly={true}
                                value={formData.mobile}
                                className="form-input"
                              />
                              <div className={styles.verifiedText} style={{ paddingBottom: 0, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                <Check size={16} /> Verified
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">WhatsApp/Mobile Verification <span className="required">*</span></label>
                            <div style={{ width: '100%', marginTop: '0.5rem' }}>
                              <PhoneEmailWidget onVerified={handlePhoneEmailVerified} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Email & OTP Block */}
                      <div className={styles.otpGrid} style={{ gridTemplateColumns: '1fr', padding: '1.5rem', background: '#fff', border: '1px solid var(--border-color)' }}>
                        {emailOtpState.verified ? (
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Verified Email Address <span className="required">*</span></label>
                            <div className={styles.inputWithBtn}>
                              <input
                                type="email"
                                name="email"
                                readOnly={true}
                                value={formData.email}
                                className="form-input"
                              />
                              <div className={styles.verifiedText} style={{ paddingBottom: 0, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                <Check size={16} /> Verified
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Email Address Verification <span className="required">*</span></label>
                            <div style={{ width: '100%', marginTop: '0.5rem' }}>
                              <PhoneEmailEmailWidget onVerified={handleEmailVerified} />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 2: PROFILE DETAILS (DYNAMIC BY ROLE) */}
              {step === 2 && (
                <div className="fade-in">
                  <div className={styles.stepHeader}>
                    <User className={styles.stepIcon} size={24} />
                    <h2>{formData.role} Profile Information</h2>
                  </div>

                  {/* Common Personal Fields */}
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Full Name <span className="required">*</span></label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="As shown in credentials"
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender <span className="required">*</span></label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer Not To Say">Prefer Not To Say</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Date of Birth <span className="required">*</span></label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City <span className="required">*</span></label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Hyderabad"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">State <span className="required">*</span></label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g. Telangana"
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Country <span className="required">*</span></label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  {/* DYNAMIC FIELD SECTIONS BY ROLE */}

                  {/* 1. STUDENT FIELDS */}
                  {['Student', 'Campus Ambassador', 'Volunteer'].includes(formData.role) && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">College / University Name <span className="required">*</span></label>
                          <input
                            type="text"
                            name="college"
                            value={formData.college}
                            onChange={handleChange}
                            placeholder="Full College Name"
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Degree <span className="required">*</span></label>
                          <select
                            name="degree"
                            value={formData.degree}
                            onChange={handleChange}
                            className="form-select"
                            required
                          >
                            <option value="">Select Degree</option>
                            <option value="BTech">B.Tech</option>
                            <option value="MTech">M.Tech</option>
                            <option value="BCA">BCA</option>
                            <option value="MCA">MCA</option>
                            <option value="BSc">B.Sc</option>
                            <option value="BCom">B.Com</option>
                            <option value="MBA">MBA</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Specialization <span className="required">*</span></label>
                          <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            placeholder="e.g. Computer Science"
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Graduation Year <span className="required">*</span></label>
                          <input
                            type="number"
                            name="graduationYear"
                            value={formData.graduationYear}
                            onChange={handleChange}
                            className="form-input"
                            min="2000"
                            max="2045"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Skills (Max 20) <span className="required">*</span></label>
                        <div className={styles.skillInputBox}>
                          <input
                            type="text"
                            placeholder="Type a skill and click Add"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                            className="form-input"
                          />
                          <button type="button" onClick={() => handleAddSkill()} className="btn btn-secondary">Add</button>
                        </div>
                        <div className={styles.skillsContainer}>
                          {formData.skills.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.25rem' }}>No skills added yet.</span>}
                          {formData.skills.map((skill) => (
                            <span key={skill} className={styles.skillChip}>
                              {skill}
                              <button type="button" onClick={() => handleRemoveSkill(skill)} className={styles.removeSkillBtn}>
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Preferred Domain <span className="required">*</span></label>
                          <select
                            name="preferredDomain"
                            value={formData.preferredDomain}
                            onChange={handleChange}
                            className="form-select"
                            required
                          >
                            <option value="Software Engineering">Software Engineering</option>
                            <option value="Frontend Development">Frontend Development</option>
                            <option value="Backend Development">Backend Development</option>
                            <option value="UI UX Design">UI UX Design</option>
                            <option value="Data & AI">Data & AI</option>
                            <option value="Product Management">Product Management</option>
                            <option value="Marketing & Sales">Marketing & Sales</option>
                            <option value="Operations">Operations</option>
                          </select>
                        </div>
                      </div>

                      {/* Checkbox interests */}
                      <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label className="form-label">Opportunities I am interested in:</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                          <label className={styles.declarationLabel}>
                            <input
                              type="checkbox"
                              checked={formData.internshipInterested === 'Yes'}
                              onChange={(e) => setFormData(prev => ({ ...prev, internshipInterested: e.target.checked ? 'Yes' : 'No' }))}
                            />
                            <span>Internships</span>
                          </label>
                          <label className={styles.declarationLabel}>
                            <input
                              type="checkbox"
                              checked={formData.jobInterested === 'Yes'}
                              onChange={(e) => setFormData(prev => ({ ...prev, jobInterested: e.target.checked ? 'Yes' : 'No' }))}
                            />
                            <span>Full-Time Jobs</span>
                          </label>
                          <label className={styles.declarationLabel}>
                            <input
                              type="checkbox"
                              checked={formData.startupInterested === 'Yes'}
                              onChange={(e) => setFormData(prev => ({ ...prev, startupInterested: e.target.checked ? 'Yes' : 'No' }))}
                            />
                            <span>Startup Vetting</span>
                          </label>
                          <label className={styles.declarationLabel}>
                            <input
                              type="checkbox"
                              checked={formData.buildxInterested === 'Yes'}
                              onChange={(e) => setFormData(prev => ({ ...prev, buildxInterested: e.target.checked ? 'Yes' : 'No' }))}
                            />
                            <span>BuildX Program</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. FOUNDER FIELDS */}
                  {['Founder', 'Startup'].includes(formData.role) && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Startup / Company Name <span className="required">*</span></label>
                          <input
                            type="text"
                            name="startupName"
                            value={formData.startupName}
                            onChange={handleChange}
                            placeholder="Startup Legal or Brand Name"
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Startup Stage <span className="required">*</span></label>
                          <select
                            name="startupStage"
                            value={formData.startupStage}
                            onChange={handleChange}
                            className="form-select"
                            required
                          >
                            {STARTUP_STAGES.map(stage => (
                              <option key={stage} value={stage}>{stage}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Industry Sector <span className="required">*</span></label>
                          <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            placeholder="e.g. FinTech, SaaS, EdTech"
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Startup Website URL</label>
                          <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://company.com"
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Team Size <span className="required">*</span></label>
                          <select
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleChange}
                            className="form-select"
                            required
                          >
                            {TEAM_SIZES.map(sz => (
                              <option key={sz} value={sz}>{sz} members</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Startup Description / Brief Pitch <span className="required">*</span></label>
                        <textarea
                          name="startupDescription"
                          value={formData.startupDescription}
                          onChange={handleChange}
                          placeholder="Briefly describe what your startup builds and your current mission (Max 300 characters)..."
                          className="form-textarea"
                          rows={3}
                          maxLength={300}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* 3. RECRUITER FIELDS */}
                  {['Recruiter', 'HR', 'Company'].includes(formData.role) && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Company / Organization <span className="required">*</span></label>
                          <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="e.g. Google, TCS, Startup Corp"
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Designation <span className="required">*</span></label>
                          <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            placeholder="e.g. HR Manager, Talent Lead"
                            className="form-input"
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Hiring Domains <span className="required">*</span></label>
                          <input
                            type="text"
                            name="hiringDomains"
                            value={formData.hiringDomains}
                            onChange={handleChange}
                            placeholder="e.g. Tech, Marketing, Sales"
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Company Website URL</label>
                          <input
                            type="text"
                            name="companyWebsite"
                            value={formData.companyWebsite}
                            onChange={handleChange}
                            placeholder="https://company.com"
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. MENTOR FIELDS */}
                  {formData.role === 'Mentor' && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Current Company <span className="required">*</span></label>
                          <input
                            type="text"
                            name="currentCompany"
                            value={formData.currentCompany}
                            onChange={handleChange}
                            placeholder="Current organization name"
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Role / Job Title <span className="required">*</span></label>
                          <input
                            type="text"
                            name="mentorRole"
                            value={formData.mentorRole}
                            onChange={handleChange}
                            placeholder="e.g. Principal Architect, Director"
                            className="form-input"
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Mentoring Experience Level <span className="required">*</span></label>
                          <select
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className="form-select"
                            required
                          >
                            {EXPERIENCE_LEVELS.map(lvl => (
                              <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Expertise Areas <span className="required">*</span></label>
                        <textarea
                          name="expertiseAreas"
                          value={formData.expertiseAreas}
                          onChange={handleChange}
                          placeholder="e.g. System Design, Product Strategy, Interview Prep"
                          className="form-textarea"
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* 5. INVESTOR FIELDS */}
                  {formData.role === 'Investor' && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Fund / Venture Capital Name <span className="required">*</span></label>
                          <input
                            type="text"
                            name="fundName"
                            value={formData.fundName}
                            onChange={handleChange}
                            placeholder="e.g. Sequoia Capital, Angle Fund"
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Investment Focus <span className="required">*</span></label>
                          <input
                            type="text"
                            name="investmentFocus"
                            value={formData.investmentFocus}
                            onChange={handleChange}
                            placeholder="e.g. Pre-seed Tech, Clean Energy, Web3"
                            className="form-input"
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Fund Website URL</label>
                          <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://fund.com"
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. WORKING PROFESSIONAL FIELDS */}
                  {['Working Professional', 'Freelancer', 'Creator'].includes(formData.role) && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Company Name <span className="required">*</span></label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Current employer name"
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Professional Role / Designation <span className="required">*</span></label>
                          <input
                            type="text"
                            name="professionalRole"
                            value={formData.professionalRole}
                            onChange={handleChange}
                            placeholder="e.g. Senior Software Engineer"
                            className="form-input"
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="form-group">
                          <label className="form-label">Work Experience <span className="required">*</span></label>
                          <select
                            name="professionalExperience"
                            value={formData.professionalExperience}
                            onChange={handleChange}
                            className="form-select"
                            required
                          >
                            {EXPERIENCE_LEVELS.map(lvl => (
                              <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Skills (Max 20) <span className="required">*</span></label>
                        <div className={styles.skillInputBox}>
                          <input
                            type="text"
                            placeholder="Type a skill and click Add"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                            className="form-input"
                          />
                          <button type="button" onClick={() => handleAddSkill()} className="btn btn-secondary">Add</button>
                        </div>
                        <div className={styles.skillsContainer}>
                          {formData.skills.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.25rem' }}>No skills added yet.</span>}
                          {formData.skills.map((skill) => (
                            <span key={skill} className={styles.skillChip}>
                              {skill}
                              <button type="button" onClick={() => handleRemoveSkill(skill)} className={styles.removeSkillBtn}>
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* STEP 3: SOCIAL LINKS & CREDENTIAL UPLOADS */}
              {step === 3 && (
                <div className="fade-in">
                  <div className={styles.stepHeader}>
                    <FileText className={styles.stepIcon} size={24} />
                    <h2>Credentials & Social Uploads</h2>
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile URL <span className="required">*</span></label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                      className="form-input"
                      required
                    />
                  </div>

                  {['Student', 'Campus Ambassador', 'Volunteer'].includes(formData.role) && (
                    <div className={styles.formRow}>
                      <div className="form-group">
                        <label className="form-label">GitHub Profile URL</label>
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          placeholder="https://github.com/username"
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Personal Portfolio URL</label>
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleChange}
                          placeholder="https://mywebsite.dev"
                          className="form-input"
                        />
                      </div>
                    </div>
                  )}

                  {/* Photo Upload (Required for all roles) */}
                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label className="form-label">Profile Photo (For digital ID card generation) <span className="required">*</span></label>
                    <div className={styles.uploadArea}>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handlePhotoChange}
                        className={styles.fileInputHidden}
                      />
                      <div className={styles.uploadLabel}>
                        <Camera className={styles.uploadIcon} size={28} />
                        {photoFile ? (
                          <div>
                            <span className={styles.uploadedName}>{photoFile.name}</span>
                            <span className={styles.uploadedSize}>{(photoFile.size / 1024).toFixed(0)} KB</span>
                          </div>
                        ) : (
                          <div>
                            <span className={styles.uploadedName}>Select Profile Photo</span>
                            <span className={styles.uploadedSize}>Accepts JPG, JPEG, PNG (Max 2MB)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resume Link (Student Only) */}
                  {['Student', 'Campus Ambassador', 'Volunteer'].includes(formData.role) && (
                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                      <label className="form-label">Resume Link (Google Drive, Dropbox, etc.) <span className="required">*</span></label>
                      <input
                        type="url"
                        name="resumeLink"
                        value={formData.resumeLink || ''}
                        onChange={handleChange}
                        placeholder="https://drive.google.com/file/d/... or public URL"
                        className="form-input"
                        required
                      />
                      <div className={styles.publicLinkAlert}>
                        <ShieldAlert className={styles.alertIcon} size={18} />
                        <div>
                          <strong>Public Link Required:</strong> Make sure the link sharing setting is set to <strong>"Anyone with the link can view"</strong>. Private or restricted links cannot be verified and will result in your application being rejected.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terms & Declaration Checkbox */}
                  <div className={styles.declarationBox}>
                    <label className={styles.declarationLabel}>
                      <input
                        type="checkbox"
                        checked={formData.declaration}
                        onChange={(e) => setFormData((prev) => ({ ...prev, declaration: e.target.checked }))}
                        required
                      />
                      <span>
                        I declare that all credentials, files, and URLs uploaded here are authentic. 
                        I understand that any fraudulent entries will lead to immediate rejection, 
                        blacklisting, and cancellation of the TSS ID.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS VIEW */}
              {step === 4 && (
                <div className={`${styles.successContent} fade-in`}>
                  <div className={styles.successIconCircle}>
                    <Check size={40} />
                  </div>
                  <h2>Registration Queued!</h2>
                  <p>
                    Hello <strong>{formData.fullName}</strong>. Your profile has been queued for verification.
                    The admin reviews all social profile links, photos, and resumes manually.
                  </p>
                  
                  <div className={styles.nextStepsCard}>
                    <h4>Next Vetting Steps:</h4>
                    <ul>
                      <li>Our vetting team reviews profile details within 24-48 hours.</li>
                      <li>Upon approval, your unique <strong>TSS Member ID</strong> will be generated.</li>
                      <li>You will receive access to download your Digital Member ID Card.</li>
                      <li>Use the Status Lookup tool at any time to check approval progression.</li>
                    </ul>
                  </div>

                  <div className={styles.successActions}>
                    <Link href="/status" className="btn btn-primary">
                      Lookup Membership Status
                    </Link>
                    <Link href="/" className="btn btn-outline">
                      Go to Home
                    </Link>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              {step < 4 && (
                <div className={styles.actions}>
                  {step > 1 ? (
                    <button type="button" onClick={handleBack} className="btn btn-outline">
                      <ArrowLeft size={16} /> Back
                    </button>
                  ) : (
                    <div></div> // Spacing placeholder
                  )}

                  {step < 3 ? (
                    <button type="button" onClick={handleNext} className="btn btn-primary">
                      Next Step <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleSubmit} 
                      disabled={isSubmitting} 
                      className="btn btn-secondary"
                    >
                      {isSubmitting ? 'Submitting Details...' : 'Request Vetting Approval'}
                    </button>
                  )}
                </div>
              )}

            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
