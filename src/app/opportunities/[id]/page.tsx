'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Lock, 
  Briefcase, 
  MapPin, 
  Coins, 
  Calendar, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Phone, 
  ExternalLink,
  ShieldAlert,
  Shield
} from 'lucide-react';
import styles from '@/app/dashboard/page.module.css';
import { useToast } from '@/components/Toast';

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const id = params?.id as string;

  // Session & Load States
  const [profile, setProfile] = useState<any | null>(null);
  const [opportunity, setOpportunity] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Authentication Fields (for Inline Gate)
  const [emailInput, setEmailInput] = useState('');
  const [memberIdInput, setMemberIdInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check Session & Fetch Job Data
  const initPage = async () => {
    setLoading(true);
    try {
      // 1. Fetch Job info
      const jobRes = await fetch(`/api/jobs?id=${id}`);
      if (!jobRes.ok) {
        setOpportunity(null);
      } else {
        const jobData = await jobRes.json();
        setOpportunity(jobData.job);
      }

      // 2. Fetch Session info
      const sessionStr = localStorage.getItem('tss_candidate_session');
      if (sessionStr) {
        const sessObj = JSON.parse(sessionStr);
        // Refresh profile state
        const profRes = await fetch(`/api/status-check?email=${encodeURIComponent(sessObj.email)}&memberId=${encodeURIComponent(sessObj.memberId)}`);
        if (profRes.ok) {
          const profData = await profRes.json();
          if (profData.exists) {
            setProfile(profData.candidate);
          }
        }
      }
    } catch (err) {
      console.error('Failed to initialize opportunity details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      initPage();
    }
  }, [id]);

  // Inline sign-in handler
  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      toast.warning('Please enter your Registered Email.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/auth/candidate-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('tss_candidate_session', JSON.stringify(data.candidate));
        setProfile(data.candidate);
        toast.success('Successfully authenticated TSS Member Session!');
      } else {
        toast.error(data.error || 'Invalid credentials. Please register or retry.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network connection error.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Copy opportunity URL to clipboard
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Opportunity URL copied to clipboard! Share it with fellow students.');
    }
  };

  // Helper: Format Apply Link action
  const renderApplyAction = (link: string) => {
    if (!link) return null;
    const cleaned = link.trim();
    // Check if it's a URL
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      return (
        <a 
          href={cleaned} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.75rem 1.75rem' }}
        >
          Apply Externally <ExternalLink size={16} />
        </a>
      );
    }
    
    // Check if WhatsApp format or standard mobile number
    const digitsOnly = cleaned.replace(/[^0-9+]/g, '');
    const isPhone = digitsOnly.length >= 8;

    if (isPhone) {
      const waLink = `https://wa.me/${digitsOnly.startsWith('+') ? digitsOnly.substring(1) : (digitsOnly.startsWith('91') ? digitsOnly : '91' + digitsOnly)}`;
      return (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a 
            href={`tel:${digitsOnly}`}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.75rem 1.75rem' }}
          >
            Call Recruiter <Phone size={16} />
          </a>
          <a 
            href={waLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.75rem 1.75rem', borderColor: '#25D366', color: '#25D366' }}
          >
            WhatsApp Message
          </a>
        </div>
      );
    }

    return (
      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>
          <strong>Apply Instructions:</strong> {cleaned}
        </p>
      </div>
    );
  };

  return (
    <div className={styles.dashboardPage} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Radial glow background elements */}
      <div style={{ position: 'absolute', top: '0', left: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245, 143, 29, 0.04) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '30%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(214, 40, 40, 0.03) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header banner */}
      <header className={styles.dashboardHeader} style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <span className={styles.subTitle}>Community Opportunity</span>
          <h1>{opportunity ? opportunity.title : 'Opportunity Portal'}</h1>
          <p className={styles.tagline}>
            {opportunity ? `Shared from the recruiter network of ${opportunity.companyName}` : 'Gated community opportunity for verified candidates.'}
          </p>
        </div>
      </header>

      <section className={styles.dashboardContent} style={{ position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1rem' }}>
          
          {/* Back button */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Link 
              href="/dashboard" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>

          {loading ? (
             <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
               Loading opportunity parameters...
             </div>
          ) : !opportunity ? (
             <div className={styles.loginCard} style={{ textAlign: 'center', maxWidth: '100%' }}>
               <ShieldAlert size={40} style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
               <h2>Opportunity Not Found</h2>
               <p>This opening may have closed, or the link has expired.</p>
               <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: '1.25rem', display: 'inline-block' }}>
                 Return to Dashboard
               </Link>
             </div>
          ) : (
            <div>
              
              {/* 1. Opportunity Metadata Card */}
              <div className={styles.loginCard} style={{ maxWidth: '100%', marginBottom: '1.5rem', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.04)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--primary)', transition: 'var(--transition)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'Space Mono', padding: '0.15rem 0.4rem', backgroundColor: 'rgba(245,143,29,0.1)', color: 'var(--primary)', borderRadius: '3px', fontWeight: 700, textTransform: 'uppercase' }}>
                        {opportunity.type || 'Full-time'}
                      </span>
                      <span style={{ fontSize: '9px', fontFamily: 'Space Mono', padding: '0.15rem 0.4rem', backgroundColor: 'rgba(5,150,105,0.08)', color: 'var(--success)', borderRadius: '3px', fontWeight: 700, textTransform: 'uppercase' }}>
                        Active
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      {opportunity.title}
                    </h3>
                    <span style={{ fontSize: '1.05rem', color: 'var(--primary)', fontWeight: 700, marginTop: '0.15rem', display: 'block' }}>
                      {opportunity.companyName}
                    </span>
                  </div>
                  <button 
                    onClick={handleCopyLink}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    <Share2 size={12} /> Share Link
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1.25rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={14} /> {opportunity.location}
                  </span>
                  {opportunity.salaryRange && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Coins size={14} /> {opportunity.salaryRange}
                    </span>
                  )}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} /> Posted {new Date(opportunity.postedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* 2. Authentication Gate: NOT Signed In */}
              {!profile ? (
                <div className={styles.loginCard} style={{ maxWidth: '100%' }}>
                  <div className={styles.loginHeader} style={{ marginBottom: '2rem' }}>
                    <Shield className={styles.lockIcon} size={40} style={{ color: 'var(--primary)', marginBottom: '0.75rem' }} />
                    <h2>TSS Member Sign In</h2>
                    <p style={{ margin: 0 }}>This community opportunity is exclusive to verified members. Enter your registered email to view recruiter contacts.</p>
                  </div>

                  <form onSubmit={handleInlineLogin} className={styles.loginForm}>
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

                    <button type="submit" disabled={isLoggingIn} className="btn btn-primary" style={{ width: '100%' }}>
                      {isLoggingIn ? 'Verifying Email...' : 'Verify Session & Unlock'}
                    </button>
                  </form>

                  <div className={styles.loginHelp}>
                    <p>
                      Don't have a Member ID? <Link href="/register">Register here</Link> or <Link href="/status">check status</Link>.
                    </p>
                  </div>
                </div>
              ) : profile.status !== 'Verified' ? (
                /* 3. Verification Gate: Signed In, NOT Verified */
                <div className={styles.loginCard} style={{ maxWidth: '100%', textAlign: 'center' }}>
                  <Clock size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                  <h2>ID Verification Review Pending</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Hello, <strong>{profile.fullName}</strong>. Your session is active, but your TSS Member ID (<code>{profile.memberId}</code>) is currently <strong>{profile.status}</strong>.
                  </p>
                  <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    This opportunity's apply links and contact parameters will automatically unlock here once the team approves your verification.
                  </div>
                </div>
              ) : (
                /* 4. CONTENT: Signed In & Verified */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Description & Requirements */}
                  <div className={styles.loginCard} style={{ maxWidth: '100%', boxShadow: 'none', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                      Role Description
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>
                      {opportunity.description}
                    </p>

                    {opportunity.requirements && opportunity.requirements.length > 0 && (
                      <div style={{ marginTop: '1.75rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                          Requirements & Skills
                        </h3>
                        <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyleType: 'disc', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {opportunity.requirements.map((req: string, i: number) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                       </div>
                    )}
                  </div>

                  {/* Apply CTA Container */}
                  <div className={styles.loginCard} style={{ maxWidth: '100%', border: '1px dashed var(--primary)', backgroundColor: 'rgba(245, 143, 29, 0.03)', boxShadow: 'none' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.15rem' }} />
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>TSS Verified Member Access Active</h4>
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          You can now reach out or apply to this opportunity directly using the contact pathways below:
                         </p>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      {renderApplyAction(opportunity.applyLink)}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      </section>
    </div>
  );
}
