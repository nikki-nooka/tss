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
  role: 'Student' | 'Founder' | 'Recruiter' | 'Mentor' | 'Investor' | 'Working Professional';
  status: 'Pending' | 'Under Review' | 'Verified' | 'Rejected';
  memberId: string | null;
  highestQualification?: string | null;
  preferredRoles?: string[];
  registrationDate: string;
  city: string;
  state: string;
  photoPath?: string | null;
}

export default function Status() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useState('');
  const [candidate, setCandidate] = useState<CandidateStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

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
                                  : `https://thestudentspot.com/status?memberId=${candidate.memberId}`
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
