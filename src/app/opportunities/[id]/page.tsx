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
  Send
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
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
    if (!emailInput.trim() || !memberIdInput.trim()) {
      toast.warning('Please enter both Email and Member ID.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/auth/candidate-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), memberId: memberIdInput.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('tss_candidate_session', JSON.stringify({
          email: data.candidate.email,
          memberId: data.candidate.memberId
        }));
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
    // Clean string of spaces/dashes
    const digitsOnly = cleaned.replace(/[^0-9+]/g, '');
    const isPhone = digitsOnly.length >= 8;

    if (isPhone) {
      // WhatsApp default link is awesome as fallback
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

    // Default fallback text representation
    return (
      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-card-2)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
          <strong>Apply Instructions:</strong> {cleaned}
        </p>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-void)', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--text-primary)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '5rem 1rem 8rem' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Back button */}
          <Link 
            href="/dashboard" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '2rem' }}
          >
            <ArrowLeft size={16} /> Back to dashboard
          </Link>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-secondary)' }}>
              <div className="loading-spinner" style={{ marginBottom: '1rem' }} />
              Loading opportunity details...
            </div>
          ) : !opportunity ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
              <ShieldAlert size={48} style={{ color: 'var(--accent)', marginBottom: '1.5rem' }} />
              <h3>Opportunity Not Found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
                This link may have expired, or the opportunity has been closed by the community administration.
              </p>
              <Link href="/dashboard" className="btn btn-primary btn-sm">
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <div>
              {/* HEADER DETAILS PANEL */}
              <div className="premium-card" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', marginBottom: '2rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'Space Mono', color: 'var(--accent)', fontWeight: 600, display: 'block', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      {opportunity.type} OPPORTUNITY
                    </span>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {opportunity.title}
                    </h1>
                    <span style={{ fontSize: '1.1rem', color: 'var(--primary-pale)', fontWeight: 700, marginTop: '0.25rem', display: 'block' }}>
                      {opportunity.companyName}
                    </span>
                  </div>

                  <button 
                    onClick={handleCopyLink}
                    className="btn btn-outline btn-sm" 
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                    title="Copy opportunity link to share"
                  >
                    <Share2 size={14} /> Share Link
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} style={{ color: 'var(--accent)' }} /> {opportunity.location}
                  </div>
                  {opportunity.salaryRange && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Coins size={16} style={{ color: 'var(--accent)' }} /> {opportunity.salaryRange}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} style={{ color: 'var(--accent)' }} /> Posted {new Date(opportunity.postedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* GATE CONTAINER */}
              {!profile ? (
                /* GATE A: Candidate Login REQUIRED */
                <div className="premium-card" style={{ padding: '3rem 2rem', backgroundColor: 'rgba(13,17,32,0.7)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', textAlign: 'center', backdropFilter: 'blur(8px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                  <Lock size={44} style={{ color: 'var(--accent)', marginBottom: '1.5rem', animation: 'pulse 2s infinite' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>TSS Community Membership Lock</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.5 }}>
                    This opportunity details, compensation ranges, and contact parameters are exclusive to verified TSS community members. Authenticate below to unlock.
                  </p>

                  <form onSubmit={handleInlineLogin} style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Email Address</label>
                      <input 
                        type="email" 
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                        placeholder="e.g. name@domain.com"
                        className="form-input" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>TSS Member ID</label>
                      <input 
                        type="text" 
                        value={memberIdInput}
                        onChange={e => setMemberIdInput(e.target.value)}
                        placeholder="e.g. TSS-ST-2606..."
                        className="form-input" 
                        required 
                      />
                    </div>
                    <button type="submit" disabled={isLoggingIn} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                      {isLoggingIn ? 'Verifying Credentials...' : 'Unlock Opportunity'}
                    </button>
                  </form>

                  <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Don't have a Member ID? <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Register now for free verification</Link>
                  </div>
                </div>
              ) : profile.status !== 'Verified' ? (
                /* GATE B: Logged in, but NOT Verified */
                <div className="premium-card" style={{ padding: '3.5rem 2rem', backgroundColor: 'rgba(13,17,32,0.8)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '16px', textAlign: 'center' }}>
                  <Clock size={48} style={{ color: 'var(--accent)', marginBottom: '1.5rem' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Verification Review Pending</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                    Hello, <strong>{profile.fullName}</strong>. Your session is active, but your TSS Member ID status is currently <strong>{profile.status}</strong>.
                  </p>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '8px', maxWidth: '480px', margin: '0 auto', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Community contact link access unlocks automatically as soon as an administrator vets and approves your registration profile. Please check back in a short while.
                  </div>
                </div>
              ) : (
                /* CONTENT: Logged in & Verified (Success) */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Job Details Card */}
                  <div className="premium-card" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Role Description</h3>
                    <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line', margin: 0 }}>
                      {opportunity.description}
                    </p>

                    {opportunity.requirements && opportunity.requirements.length > 0 && (
                      <div style={{ marginTop: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Skills & Requirements</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                          {opportunity.requirements.map((req: string, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              <CheckCircle2 size={16} style={{ color: 'var(--green-light)', flexShrink: 0, marginTop: '0.1rem' }} />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Apply Actions Lock Unlock */}
                  <div className="premium-card" style={{ padding: '2rem', backgroundColor: 'rgba(5, 150, 105, 0.04)', border: '1px dashed rgba(5, 150, 105, 0.25)', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <CheckCircle2 size={24} style={{ color: 'var(--green-light)', flexShrink: 0 }} />
                      <div>
                        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>TSS Verified Member Access Active</h4>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          As a verified member, you can connect directly with the hiring team using the contacts below.
                        </p>
                      </div>
                    </div>

                    {renderApplyAction(opportunity.applyLink)}
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
