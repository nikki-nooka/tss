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
  Mail
} from 'lucide-react';
import { useToast } from '@/components/Toast';

const PREFERRED_ROLE_OPTIONS = [
  'Software Engineer', 'Data Analyst', 'Product Manager', 
  'UI UX Designer', 'Marketing', 'Sales', 
  'HR', 'Finance', 'Founder', 'Operations'
];

const QUALIFICATION_OPTIONS = [
  '10th', 'Intermediate', 'Diploma', 'ITI', 
  'Undergraduate', 'Postgraduate', 'MBA', 'MTech', 'PhD', 'Other'
];

const STATUS_OPTIONS = [
  'Pursuing', 'Graduated', 'Working Professional', 'Founder', 'Freelancer', 'Recruiter'
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
    // Step 1: Personal Info
    fullName: '',
    gender: 'Prefer Not To Say',
    dob: '',
    mobile: '',
    email: '',
    city: '',
    state: '',
    country: 'India',
    
    // Step 2: Education
    highestQualification: 'Undergraduate',
    currentStatus: 'Pursuing',
    college: '',
    graduationYear: new Date().getFullYear(),

    // Step 3: Professional Info
    currentRole: '',
    preferredRoles: [] as string[],
    skills: [] as string[],
    experienceLevel: 'Fresher',

    // Step 4: Socials & Resume
    linkedin: '',
    github: '',
    portfolio: '',
    instagram: '',
    xTwitter: '',
    declaration: false
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [skillInput, setSkillInput] = useState('');

  // OTP Verification States
  const [phoneOtpState, setPhoneOtpState] = useState({
    sent: false,
    verified: false,
    loading: false,
    inputCode: '',
    sentCode: ''
  });

  const [emailOtpState, setEmailOtpState] = useState({
    sent: false,
    verified: false,
    loading: false,
    inputCode: '',
    sentCode: ''
  });

  // Handle standard input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add/Remove Preferred Roles (Multi select checkbox)
  const handleRoleToggle = (role: string) => {
    setFormData((prev) => {
      const preferredRoles = prev.preferredRoles.includes(role)
        ? prev.preferredRoles.filter((r) => r !== role)
        : [...prev.preferredRoles, role];
      return { ...prev, preferredRoles };
    });
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

  // Handle Resume File Selection & Client-Side Scan
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // Validate type (PDF only)
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Invalid format. Only PDF resumes are accepted.');
      e.target.value = '';
      return;
    }

    // Validate size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error('File size exceeds the 5MB limit.');
      e.target.value = '';
      return;
    }

    setResumeFile(file);
    toast.success(`Resume uploaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
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
        setPhoneOtpState(prev => ({
          ...prev,
          verified: true,
          loading: false
        }));
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
        setEmailOtpState(prev => ({
          ...prev,
          verified: true,
          loading: false
        }));
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

  // --- OTP Verification Logic ---
  
  const sendOtp = async (type: 'phone' | 'email') => {
    const target = type === 'phone' ? formData.mobile : formData.email;
    if (!target) {
      toast.error(`Please enter your ${type === 'phone' ? 'mobile number' : 'email address'} first.`);
      return;
    }

    if (type === 'phone' && formData.mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (type === 'email' && !formData.email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const stateSetter = type === 'phone' ? setPhoneOtpState : setEmailOtpState;
    
    stateSetter(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', type, target })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        stateSetter(prev => ({
          ...prev,
          sent: true,
          sentCode: data.otp, // In production this is NOT returned, it's sent via SMS/Email
          loading: false
        }));
        
        // Popup Toast containing the Mock OTP
        toast.warning(`[MOCK OTP] Verification code for ${target} is: ${data.otp}`, 15000);
      } else {
        toast.error(data.error || 'Failed to send verification code.');
        stateSetter(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error.');
      stateSetter(prev => ({ ...prev, loading: false }));
    }
  };

  const verifyOtp = async (type: 'phone' | 'email') => {
    const otpState = type === 'phone' ? phoneOtpState : emailOtpState;
    const target = type === 'phone' ? formData.mobile : formData.email;
    const stateSetter = type === 'phone' ? setPhoneOtpState : setEmailOtpState;

    if (!otpState.inputCode) {
      toast.error('Please enter the verification code.');
      return;
    }

    stateSetter(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          target,
          code: otpState.inputCode,
          expectedCode: otpState.sentCode
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        stateSetter(prev => ({
          ...prev,
          verified: true,
          loading: false
        }));
        toast.success(`${type === 'phone' ? 'Phone' : 'Email'} verified successfully!`);
      } else {
        toast.error(data.error || 'Invalid OTP code.');
        stateSetter(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Verification failed.');
      stateSetter(prev => ({ ...prev, loading: false }));
    }
  };

  // --- Step Navigation & Validations ---

  const validateStep = () => {
    if (step === 1) {
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
      
      // DOB Age check
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

      // Check OTP verification
      if (!phoneOtpState.verified) {
        toast.error('Please verify your Mobile Number using OTP.');
        return false;
      }
      if (!emailOtpState.verified) {
        toast.error('Please verify your Email Address using OTP.');
        return false;
      }
    }

    if (step === 2) {
      if (formData.currentStatus === 'Pursuing' && !formData.college.trim()) {
        toast.error('College / University is required for students.');
        return false;
      }
      const year = parseInt(formData.graduationYear as any, 10);
      if (isNaN(year) || year < 2000 || year > 2045) {
        toast.error('Graduation Year must be between 2000 and 2045.');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.currentRole.trim()) {
        toast.error('Current Role is required.');
        return false;
      }
      if (formData.preferredRoles.length === 0) {
        toast.error('Select at least one Preferred Role.');
        return false;
      }
      if (formData.skills.length === 0) {
        toast.error('Add at least one skill.');
        return false;
      }
    }

    if (step === 4) {
      if (!formData.linkedin.trim() || !formData.linkedin.toLowerCase().includes('linkedin.com/')) {
        toast.error('A valid LinkedIn URL is required.');
        return false;
      }
      if (!resumeFile) {
        toast.error('Resume upload is required.');
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
    if (!formData.declaration) {
      toast.error('You must accept the declaration to submit.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Assemble Multipart FormData
      const data = new FormData();
      
      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value.toString());
        }
      });

      // Append file
      if (resumeFile) {
        data.append('resume', resumeFile);
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        body: data // Fetch handles multipart encoding automatically for FormData
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success('Registration submitted! Redirecting to status check...');
        
        // Save candidate email to localStorage for status check ease
        localStorage.setItem('tss_registered_email', formData.email);
        localStorage.setItem('tss_registered_mobile', formData.mobile);

        // Advance to a custom success step (step 6)
        setStep(6);
      } else {
        toast.error(result.error || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failed. Please check backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <section className={styles.registerHeader}>
        <div className="container">
          <h1>TSS Member Registration</h1>
          <p>India's verified startup and talent network. Phase 1 credentials vetting.</p>
        </div>
      </section>

      <section className={styles.formContainer}>
        <div className="container">
          <div className={styles.formCard}>
            
            {/* Step Indicators */}
            {step <= 5 && (
              <div className={styles.stepper}>
                <div className={`${styles.stepIndicator} ${step >= 1 ? styles.active : ''} ${step > 1 ? styles.completed : ''}`}>
                  <span className={styles.stepNum}>{step > 1 ? <Check size={16} /> : '1'}</span>
                  <span className={styles.stepName}>Personal</span>
                </div>
                <div className={styles.stepLine}></div>
                <div className={`${styles.stepIndicator} ${step >= 2 ? styles.active : ''} ${step > 2 ? styles.completed : ''}`}>
                  <span className={styles.stepNum}>{step > 2 ? <Check size={16} /> : '2'}</span>
                  <span className={styles.stepName}>Education</span>
                </div>
                <div className={styles.stepLine}></div>
                <div className={`${styles.stepIndicator} ${step >= 3 ? styles.active : ''} ${step > 3 ? styles.completed : ''}`}>
                  <span className={styles.stepNum}>{step > 3 ? <Check size={16} /> : '3'}</span>
                  <span className={styles.stepName}>Professional</span>
                </div>
                <div className={styles.stepLine}></div>
                <div className={`${styles.stepIndicator} ${step >= 4 ? styles.active : ''} ${step > 4 ? styles.completed : ''}`}>
                  <span className={styles.stepNum}>{step > 4 ? <Check size={16} /> : '4'}</span>
                  <span className={styles.stepName}>Credentials</span>
                </div>
                <div className={styles.stepLine}></div>
                <div className={`${styles.stepIndicator} ${step >= 5 ? styles.active : ''}`}>
                  <span className={styles.stepNum}>5</span>
                  <span className={styles.stepName}>Declaration</span>
                </div>
              </div>
            )}

            {/* STEP 1: Personal Information */}
            {step === 1 && (
              <div className="fade-in">
                <div className={styles.stepHeader}>
                  <User size={24} className={styles.stepIcon} />
                  <h2>Personal Information</h2>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name (letters and spaces only)"
                    className="form-input"
                    required
                  />
                  <small className={styles.inputHelp}>3 to 60 characters. Must match your official documents.</small>
                </div>

                <div className={styles.formRow}>
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
                    <small className={styles.inputHelp}>Age limit: 16 to 60 years.</small>
                  </div>
                </div>

                {/* Mobile & OTP Block */}
                <div className={styles.otpGrid} style={{ gridTemplateColumns: '1fr' }}>
                  {phoneOtpState.verified ? (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Mobile Number <span className="required">*</span></label>
                      <div className={styles.inputWithBtn}>
                        <input
                          type="tel"
                          name="mobile"
                          readOnly={true}
                          value={formData.mobile}
                          className="form-input"
                          required
                        />
                        <div className={styles.verifiedText} style={{ paddingBottom: 0, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                          <Check size={16} /> Mobile Number Verified
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Mobile Number Verification <span className="required">*</span></label>
                      <div style={{ width: '100%', marginTop: '0.5rem' }}>
                        <PhoneEmailWidget onVerified={handlePhoneEmailVerified} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Email & OTP Block */}
                <div className={styles.otpGrid} style={{ gridTemplateColumns: '1fr' }}>
                  {emailOtpState.verified ? (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Email Address <span className="required">*</span></label>
                      <div className={styles.inputWithBtn}>
                        <input
                          type="email"
                          name="email"
                          readOnly={true}
                          value={formData.email}
                          className="form-input"
                          required
                        />
                        <div className={styles.verifiedText} style={{ paddingBottom: 0, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                          <Check size={16} /> Email Address Verified
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

                {/* Location Block */}
                <div className={styles.formRow}>
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

                <div className={styles.actions}>
                  <div></div>
                  <button type="button" onClick={handleNext} className="btn btn-primary">
                    Next Section <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Education Details */}
            {step === 2 && (
              <div className="fade-in">
                <div className={styles.stepHeader}>
                  <BookOpen size={24} className={styles.stepIcon} />
                  <h2>Education Details</h2>
                </div>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Highest Qualification <span className="required">*</span></label>
                    <select
                      name="highestQualification"
                      value={formData.highestQualification}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      {QUALIFICATION_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Status <span className="required">*</span></label>
                    <select
                      name="currentStatus"
                      value={formData.currentStatus}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.currentStatus === 'Pursuing' && (
                  <div className="form-group">
                    <label className="form-label">College / University Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="Enter your college name in full"
                      className="form-input"
                      required
                    />
                  </div>
                )}

                <div className="form-group" style={{ maxWidth: '300px' }}>
                  <label className="form-label">Graduation Year <span className="required">*</span></label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    min="2000"
                    max="2045"
                    className="form-input"
                    required
                  />
                  <small className={styles.inputHelp}>Valid range: 2000 to 2045.</small>
                </div>

                <div className={styles.actions}>
                  <button type="button" onClick={handleBack} className="btn btn-outline">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="button" onClick={handleNext} className="btn btn-primary">
                    Next Section <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Professional Info */}
            {step === 3 && (
              <div className="fade-in">
                <div className={styles.stepHeader}>
                  <Briefcase size={24} className={styles.stepIcon} />
                  <h2>Professional Details</h2>
                </div>

                <div className="form-group">
                  <label className="form-label">Current Role / Tagline <span className="required">*</span></label>
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    placeholder="e.g. Student at IIIT / Junior React Dev / Aspiring Designer"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Roles <span className="required">*</span></label>
                  <div className={styles.rolesGrid}>
                    {PREFERRED_ROLE_OPTIONS.map((role) => (
                      <label key={role} className={`${styles.roleCheckbox} ${formData.preferredRoles.includes(role) ? styles.checked : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.preferredRoles.includes(role)}
                          onChange={() => handleRoleToggle(role)}
                        />
                        <span>{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Skills Chip Input */}
                <div className="form-group">
                  <label className="form-label">Skills (Max 20) <span className="required">*</span></label>
                  <div className={styles.skillInputBox}>
                    <input
                      type="text"
                      placeholder="Type a skill and click Add (e.g. React, Figma, Python)"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="form-input"
                    />
                    <button type="button" onClick={() => handleAddSkill()} className="btn btn-secondary btn-sm">
                      <Plus size={16} /> Add
                    </button>
                  </div>

                  <div className={styles.skillsContainer}>
                    {formData.skills.map((skill) => (
                      <span key={skill} className={styles.skillChip}>
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className={styles.removeSkillBtn}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <small className={styles.inputHelp}>{formData.skills.length}/20 skills added.</small>
                </div>

                <div className="form-group" style={{ maxWidth: '300px' }}>
                  <label className="form-label">Experience Level <span className="required">*</span></label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="Fresher">Fresher</option>
                    <option value="0-1 Years">0-1 Years</option>
                    <option value="1-3 Years">1-3 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>

                <div className={styles.actions}>
                  <button type="button" onClick={handleBack} className="btn btn-outline">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="button" onClick={handleNext} className="btn btn-primary">
                    Next Section <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Socials & Resume */}
            {step === 4 && (
              <div className="fade-in">
                <div className={styles.stepHeader}>
                  <FileText size={24} className={styles.stepIcon} />
                  <h2>Socials & Resume</h2>
                </div>

                <div className="form-group">
                  <label className="form-label">LinkedIn URL <span className="required">*</span></label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="form-input"
                    required
                  />
                  <small className={styles.inputHelp}>Must be a valid LinkedIn profile link.</small>
                </div>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">GitHub URL <span className="input-optional">(Optional)</span></label>
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
                    <label className="form-label">Portfolio Website <span className="input-optional">(Optional)</span></label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Instagram Profile <span className="input-optional">(Optional)</span></label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="https://instagram.com/handle"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">X / Twitter URL <span className="input-optional">(Optional)</span></label>
                    <input
                      type="url"
                      name="xTwitter"
                      value={formData.xTwitter}
                      onChange={handleChange}
                      placeholder="https://x.com/handle"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* File Upload Box */}
                <div className="form-group">
                  <label className="form-label">Resume Upload (PDF Only) <span className="required">*</span></label>
                  <div className={styles.uploadArea}>
                    <input
                      type="file"
                      id="resumeFile"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className={styles.fileInputHidden}
                      required
                    />
                    <label htmlFor="resumeFile" className={styles.uploadLabel}>
                      <Upload size={32} className={styles.uploadIcon} />
                      {resumeFile ? (
                        <div>
                          <strong className={styles.uploadedName}>{resumeFile.name}</strong>
                          <p className={styles.uploadedSize}>Click to change resume (PDF, max 5MB)</p>
                        </div>
                      ) : (
                        <div>
                          <strong>Select Resume PDF</strong>
                          <p>Only PDF format accepted. Maximum file size: 5MB.</p>
                        </div>
                      )}
                    </label>
                  </div>
                  <small className={styles.inputHelp}>NOTE: DOC, DOCX, ZIP, or RAR packages will be rejected by security filter.</small>
                </div>

                <div className={styles.actions}>
                  <button type="button" onClick={handleBack} className="btn btn-outline">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="button" onClick={handleNext} className="btn btn-primary">
                    Next Section <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Declaration & Review */}
            {step === 5 && (
              <div className="fade-in">
                <div className={styles.stepHeader}>
                  <CheckSquare size={24} className={styles.stepIcon} />
                  <h2>Review & Declaration</h2>
                </div>

                {/* Review Data summary card */}
                <div className={styles.reviewCard}>
                  <h3>Review Profile Summary</h3>
                  <div className={styles.reviewGrid}>
                    <div>
                      <span>Name:</span> <strong>{formData.fullName}</strong>
                    </div>
                    <div>
                      <span>Contact:</span> <strong>{formData.email} | {formData.mobile}</strong>
                    </div>
                    <div>
                      <span>Location:</span> <strong>{formData.city}, {formData.state}, {formData.country}</strong>
                    </div>
                    <div>
                      <span>Status:</span> <strong>{formData.currentStatus} ({formData.highestQualification})</strong>
                    </div>
                    <div>
                      <span>Current Role:</span> <strong>{formData.currentRole}</strong>
                    </div>
                    <div>
                      <span>Preferred:</span> <strong>{formData.preferredRoles.join(', ')}</strong>
                    </div>
                    <div>
                      <span>Skills ({formData.skills.length}):</span> <strong>{formData.skills.join(', ')}</strong>
                    </div>
                    <div>
                      <span>Experience:</span> <strong>{formData.experienceLevel}</strong>
                    </div>
                    <div>
                      <span>LinkedIn:</span> <strong>{formData.linkedin}</strong>
                    </div>
                    <div>
                      <span>Resume File:</span> <strong>{resumeFile ? resumeFile.name : 'None'}</strong>
                    </div>
                  </div>
                </div>

                <div className={styles.declarationBox}>
                  <label className={styles.declarationLabel}>
                    <input
                      type="checkbox"
                      checked={formData.declaration}
                      onChange={(e) => setFormData((prev) => ({ ...prev, declaration: e.target.checked }))}
                      required
                    />
                    <span>
                      I confirm all information provided is accurate and understand that providing false information may result in rejection or removal from the TSS Network.
                    </span>
                  </label>
                </div>

                <div className={styles.actions}>
                  <button type="button" onClick={handleBack} className="btn btn-outline" disabled={isSubmitting}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'} <Check size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: Success Page */}
            {step === 6 && (
              <div className={`${styles.successContent} fade-in`}>
                <div className={styles.successIconCircle}>
                  <Check size={48} className={styles.successIconCheck} />
                </div>
                <h2>Application Submitted Successfully!</h2>
                <p>
                  Thank you for registering at <strong>The Student Spot (TSS)</strong>. 
                  Your profile has been queued for admin review.
                </p>
                <div className={styles.nextStepsCard}>
                  <h4>What happens next?</h4>
                  <ul>
                    <li><strong>Vetting Process:</strong> TSS Administrators will check your details and verify your uploaded resume.</li>
                    <li><strong>Status Updates:</strong> Verification can take up to 24-48 hours. You can check your progress anytime in the Status section.</li>
                    <li><strong>Unlocking Memberships:</strong> Once approved, you will be assigned a unique TSS Member ID to access community circles and direct recruiter forwarding services.</li>
                  </ul>
                </div>
                <div className={styles.successActions}>
                  <Link href="/status" className="btn btn-primary">
                    Check Vetting Status
                  </Link>
                  <Link href="/" className="btn btn-outline">
                    Back to Homepage
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
