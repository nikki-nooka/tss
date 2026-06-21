'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Search, Shield, Clock, CheckCircle2, AlertOctagon, HelpCircle, ArrowRight, Award, Printer } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface CandidateStatus {
  success: boolean;
  fullName: string;
  status: 'Pending' | 'Under Review' | 'Verified' | 'Rejected';
  memberId: string | null;
  highestQualification: string;
  preferredRoles: string[];
  registrationDate: string;
  city: string;
  state: string;
}

export default function Status() {
  const toast = useToast();
  const [searchInput, setSearchInput] = useState('');
  const [candidate, setCandidate] = useState<CandidateStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto check status if recent registration exists
  useEffect(() => {
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
      toast.error('Please enter your email address or mobile number');
      return;
    }
    fetchStatus(searchInput.trim());
  };

  const fetchStatus = async (queryVal: string) => {
    setIsLoading(true);
    setSearched(true);
    try {
      const isEmail = queryVal.includes('@');
      const param = isEmail ? `email=${encodeURIComponent(queryVal)}` : `mobile=${encodeURIComponent(queryVal)}`;
      
      const res = await fetch(`/api/status-check?${param}`);
      const data = await res.json();

      if (data.success) {
        setCandidate(data);
        if (data.status === 'Verified') {
          // Auto unlock community access
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

  const handlePrintCard = () => {
    window.print();
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
            Search your registration queue status. If approved, your verified Member Card and ID will be displayed below.
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
                        Our HR team manually reviews credentials within 24-48 hours. No actions are required at this time.
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
                        Hello <strong>{candidate.fullName}</strong>. An administrator is currently reviewing your resume PDF, 
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
                        Hello <strong>{candidate.fullName}</strong>. Your membership registration could not be verified by our HR vetting system. 
                        Common reasons include: incomplete/unreadable resume PDF, false profile links, or invalid location inputs.
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
                      <div className={styles.memberCardVirtual}>
                        {/* Background mesh decoration */}
                        <div className={styles.meshBg}></div>
                        
                        {/* Card Header */}
                        <div className={styles.cardHeader}>
                          <div className={styles.cardLogo}>
                            <Award className={styles.cardLogoIcon} size={28} />
                            <div>
                              <h4>THE STUDENT SPOT</h4>
                              <span>VERIFIED NETWORK MEMBER</span>
                            </div>
                          </div>
                          <span className={styles.cardBadge}>TSS</span>
                        </div>

                        {/* Card Content */}
                        <div className={styles.cardBody}>
                          <div className={styles.candidateDetails}>
                            <div className={styles.detailsLabel}>MEMBER NAME</div>
                            <div className={styles.detailsValue}>{candidate.fullName}</div>
                          </div>

                          <div className={styles.candidateDetails}>
                            <div className={styles.detailsLabel}>TSS MEMBER ID</div>
                            <div className={styles.memberIdCode}>{candidate.memberId}</div>
                          </div>

                          <div className={styles.cardRow}>
                            <div className={styles.candidateDetails}>
                              <div className={styles.detailsLabel}>QUALIFICATION</div>
                              <div className={styles.detailsValueShort}>{candidate.highestQualification}</div>
                            </div>
                            <div className={styles.candidateDetails}>
                              <div className={styles.detailsLabel}>LOCATION</div>
                              <div className={styles.detailsValueShort}>{candidate.city}, {candidate.state}</div>
                            </div>
                            <div className={styles.candidateDetails}>
                              <div className={styles.detailsLabel}>JOINED DATE</div>
                              <div className={styles.detailsValueShort}>{formatDate(candidate.registrationDate)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Barcode Sim */}
                        <div className={styles.cardFooter}>
                          <div className={styles.barcodeLines}>
                            {Array.from({ length: 35 }).map((_, i) => (
                              <div 
                                key={i} 
                                className={styles.barcodeLine} 
                                style={{ 
                                  width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2)}px`,
                                  opacity: i % 5 === 0 ? 0.3 : 0.8
                                }} 
                              />
                            ))}
                          </div>
                          <span className={styles.securityCheckText}>SECURE TSS VETTING PASSED</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className={styles.verifiedActions}>
                      <button onClick={handlePrintCard} className="btn btn-secondary">
                        <Printer size={16} /> Print Member ID Card
                      </button>
                      <Link href="/#community-section" className="btn btn-primary">
                        Access Community Circle <ArrowRight size={16} />
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
                  If you have just registered, details will update here dynamically once reviewed by admins.
                </p>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
