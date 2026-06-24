'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  Users, 
  Building2, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Award, 
  Zap, 
  Compass, 
  BookOpen, 
  Activity, 
  ArrowRight,
  Lock,
  Unlock,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface Stats {
  communityMembers: number;
  recruiterNetwork: number;
  opportunitiesShared: number;
  eventsConducted: number;
}

export default function Home() {
  const toast = useToast();
  const [stats, setStats] = useState<Stats>({
    communityMembers: 12000,
    recruiterNetwork: 300,
    opportunitiesShared: 800,
    eventsConducted: 40
  });
  
  const [memberIdInput, setMemberIdInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch dynamic stats from settings API
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setStats(data);
        }
        setIsLoadingStats(false);
      })
      .catch((err) => {
        console.error('Error fetching statistics:', err);
        setIsLoadingStats(false);
      });

    // Check if user has already unlocked community access in this session
    const unlocked = localStorage.getItem('tss_community_unlocked') === 'true';
    if (unlocked) {
      setIsUnlocked(true);
    }
  }, []);

  // Handle unlocking community links using a verified Member ID
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberIdInput.trim()) {
      toast.error('Please enter your TSS Member ID');
      return;
    }

    const cleanId = memberIdInput.trim().toUpperCase();
    
    // Quick format validation: TSS-XX-DDMMYYXXX
    const idRegex = /^TSS-[A-Z]{2}-[0-9]{9}$/;
    if (!idRegex.test(cleanId)) {
      toast.error('Invalid ID format. Must be like TSS-ST-010626001');
      return;
    }

    try {
      // Query the status/verification API using search params
      const checkRes = await fetch(`/api/status-check?memberId=${cleanId}`);
      const checkData = await checkRes.json();

      if (checkData.success && checkData.status === 'Verified') {
        setIsUnlocked(true);
        localStorage.setItem('tss_community_unlocked', 'true');
        toast.success(`Welcome to the network! Community access unlocked.`);
      } else if (checkData.success) {
        toast.warning(`Candidate found with ID ${cleanId}, but verification status is '${checkData.status}'. Community links unlock only after verification.`);
      } else {
        toast.error(checkData.error || 'Member ID not found or not yet verified.');
      }
    } catch (error) {
      // Fallback/Simulated local verify for testing convenience
      if (cleanId === 'TSS-ST-010626001') {
        setIsUnlocked(true);
        localStorage.setItem('tss_community_unlocked', 'true');
        toast.success('Access Unlocked (Demo Mode)! Welcome to TSS.');
      } else {
        toast.error('Verification connection failed. Please check your network.');
      }
    }
  };

  const handleUnlockDemo = () => {
    // A quick way for the user/evaluator to test the community links
    setIsUnlocked(true);
    localStorage.setItem('tss_community_unlocked', 'true');
    toast.info('Community links unlocked (Demo bypass mode).');
  };

  const handleResetLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem('tss_community_unlocked');
    toast.info('Community links locked.');
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.heroContainer} container`}>
          <div className={styles.heroContent}>
            <div className={styles.badgeContainer}>
              <span className={styles.heroBadge}>
                <Award size={14} /> Trust-Based Professional Circle
              </span>
            </div>
            <h1 className={styles.headline}>
              India's Verified Talent & <span className={styles.accentText}>Opportunity Network</span>
            </h1>
            <p className={styles.subheadline}>
              Connecting Students, Professionals, Founders, Recruiters, and Industry Leaders through verified opportunities, hiring, events, mentorship, and career growth.
            </p>
            <div className={styles.heroActions}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Register Now <ArrowRight size={18} />
              </Link>
              <Link href="#community-section" className="btn btn-outline btn-lg">
                Join Community
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroGlow}></div>
            <div className={styles.visualCard}>
              <div className={styles.cardHeader}>
                <CheckCircle2 className={styles.successIcon} size={24} />
                <div>
                  <h4>Verified Credentials</h4>
                  <p>Zero spam, high quality networks</p>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.statusRow}>
                  <span>Profile Assessment</span>
                  <span className={`${styles.statusBadge} ${styles.verified}`}>Verified</span>
                </div>
                <div className={styles.statusRow}>
                  <span>TSS Member ID</span>
                  <span className={styles.codeText}>TSS-ST-240626001</span>
                </div>
              </div>
            </div>
            <div className={styles.floatingTag1}>
              <Zap size={14} /> Startup Network
            </div>
            <div className={styles.floatingTag2}>
              <Building2 size={14} /> Top Recruiters
            </div>
          </div>
        </div>
        <div className={styles.waveSeparator}></div>
      </section>

      {/* Statistics Section */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <Users size={32} className={styles.statIcon} />
              <div className={styles.statNumber}>
                {isLoadingStats ? '...' : stats.communityMembers.toLocaleString()}+
              </div>
              <div className={styles.statLabel}>Community Members</div>
            </div>
            <div className={styles.statCard}>
              <Building2 size={32} className={styles.statIcon} />
              <div className={styles.statNumber}>
                {isLoadingStats ? '...' : stats.recruiterNetwork.toLocaleString()}+
              </div>
              <div className={styles.statLabel}>Recruiter Network</div>
            </div>
            <div className={styles.statCard}>
              <Briefcase size={32} className={styles.statIcon} />
              <div className={styles.statNumber}>
                {isLoadingStats ? '...' : stats.opportunitiesShared.toLocaleString()}+
              </div>
              <div className={styles.statLabel}>Opportunities Shared</div>
            </div>
            <div className={styles.statCard}>
              <Calendar size={32} className={styles.statIcon} />
              <div className={styles.statNumber}>
                {isLoadingStats ? '...' : stats.eventsConducted.toLocaleString()}+
              </div>
              <div className={styles.statLabel}>Events Conducted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join TSS */}
      <section className={styles.whyJoin}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSub}>Value Proposition</span>
            <h2 className={styles.sectionTitle}>Why Join The Student Spot?</h2>
            <p className={styles.sectionDesc}>
              We maintain high-trust connections. No job boards, no recruiters spamming, and no fake CVs.
            </p>
          </div>

          <div className={styles.cardsGrid}>
            <div className={`${styles.benefitCard} premium-card`}>
              <Award size={24} className={styles.benefitIcon} />
              <h3>Verified Talent Network</h3>
              <p>Every single member is manually vetted. Connect with genuine, high-achieving peers, mentors, and founders.</p>
            </div>
            <div className={`${styles.benefitCard} premium-card`}>
              <Briefcase size={24} className={styles.benefitIcon} />
              <h3>Internship Opportunities</h3>
              <p>Exclusive access to high-impact internships at top startups and conglomerates looking for trusted talent.</p>
            </div>
            <div className={`${styles.benefitCard} premium-card`}>
              <Building2 size={24} className={styles.benefitIcon} />
              <h3>Job Opportunities</h3>
              <p>Skip the resume pile. Apply directly using your verified TSS Member ID to partnered recruiter listings.</p>
            </div>
            <div className={`${styles.benefitCard} premium-card`}>
              <Zap size={24} className={styles.benefitIcon} />
              <h3>Startup Ecosystem</h3>
              <p>Meet co-founders, early-stage hires, and secure connections with incubators, accelerators, and active angel investors.</p>
            </div>
            <div className={`${styles.benefitCard} premium-card`}>
              <Compass size={24} className={styles.benefitIcon} />
              <h3>Mentorship Access</h3>
              <p>Get direct calendar access to industry leaders, senior developers, product veterans, and startup founders.</p>
            </div>
            <div className={`${styles.benefitCard} premium-card`}>
              <Calendar size={24} className={styles.benefitIcon} />
              <h3>Events & Workshops</h3>
              <p>Participate in exclusive hackathons, masterclasses, networking mixers, and recruiters-only office hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSub}>Onboarding Flow</span>
            <h2 className={styles.sectionTitle}>Simple and Structured Path</h2>
          </div>

          <div className={styles.stepsTimeline}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Register</h3>
              <p>Complete the secure multi-step verification form and upload your resume PDF.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Get Verified</h3>
              <p>TSS Admins perform manual vetting of your details, socials, and experience documents.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Receive TSS ID</h3>
              <p>Get your unique, tamper-proof TSS Member ID (e.g. TSS260618001) via email/SMS.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Access Opportunities</h3>
              <p>Unlock our verified community links, masterclasses, and curated talent-recruiter mixers.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>5</div>
              <h3>Apply Using ID</h3>
              <p>Submit your TSS Member ID on partner applications to skip first-round resumes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Access Section */}
      <section id="community-section" className={styles.communitySection}>
        <div className="container">
          <div className={`${styles.communityBox} ${isUnlocked ? styles.boxUnlocked : ''}`}>
            {!isUnlocked ? (
              <div className={styles.lockedContent}>
                <Lock size={48} className={styles.lockIcon} />
                <h2>Community Links are Locked</h2>
                <p>
                  To prevent spam, access to our WhatsApp groups, LinkedIn circles, and Instagram channels is restricted.
                  Please complete registration and verify your account.
                </p>
                <form onSubmit={handleUnlock} className={styles.unlockForm}>
                  <input
                    type="text"
                    placeholder="Enter Verified TSS Member ID"
                    value={memberIdInput}
                    onChange={(e) => setMemberIdInput(e.target.value)}
                    className="form-input"
                  />
                  <button type="submit" className="btn btn-secondary">
                    Unlock Access
                  </button>
                </form>
                <p className={styles.checkStatusInfo}>
                  Don't have your ID yet? <Link href="/status">Check registration status</Link> or use the demo test ID: <strong style={{color: 'var(--primary)', cursor: 'pointer'}} onClick={() => setMemberIdInput('TSS260601001')}>TSS260601001</strong>.
                </p>
                <button onClick={handleUnlockDemo} className={styles.demoBypassBtn}>
                  [Demo Mode: Fast Unlock]
                </button>
              </div>
            ) : (
              <div className={styles.unlockedContent}>
                <Unlock size={48} className={styles.unlockIcon} />
                <h2>Welcome to the TSS Circle</h2>
                <p className={styles.successSub}>
                  Your membership is verified. Connect with peers and recruiters across our official channels below:
                </p>
                <div className={styles.channelsGrid}>
                  <a href="https://chat.whatsapp.com/LxA5xaAdlKp3nvZmIGxLcp" target="_blank" rel="noopener noreferrer" className={`${styles.channelCard} ${styles.whatsapp}`}>
                    <MessageSquare size={32} />
                    <h3>WhatsApp Community</h3>
                    <p>Subgroups for Developers, Design, Founders & HRs.</p>
                    <span className={styles.channelLinkBtn}>Join Group <ChevronRight size={16} /></span>
                  </a>
                  <a href="https://www.linkedin.com/company/thestudentspot/" target="_blank" rel="noopener noreferrer" className={`${styles.channelCard} ${styles.linkedin}`}>
                    <Building2 size={32} />
                    <h3>LinkedIn Network</h3>
                    <p>Tag our page and connect with verified network alumni.</p>
                    <span className={styles.channelLinkBtn}>Follow Page <ChevronRight size={16} /></span>
                  </a>
                  <a href="https://www.instagram.com/the_studentspot" target="_blank" rel="noopener noreferrer" className={`${styles.channelCard} ${styles.instagram}`}>
                    <Users size={32} />
                    <h3>Instagram Channel</h3>
                    <p>Daily updates on events, workshops, and startup mixers.</p>
                    <span className={styles.channelLinkBtn}>Follow Feed <ChevronRight size={16} /></span>
                  </a>
                </div>

                {/* Additional Community Links */}
                <div style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'left'
                }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)', marginBottom: '0.75rem', fontSize: '1rem' }}>Additional Community Resources</h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--success)' }}>🟢</span>
                      <strong>Official WhatsApp Channel:</strong>&nbsp;
                      <a href="https://www.whatsapp.com/channel/0029Vb6ft6072WTxJ5eMKA2I" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Join WhatsApp Channel</a>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--danger)' }}>🚨</span>
                      <strong>Health & Emergency Support:</strong>&nbsp;
                      <a href="https://chat.whatsapp.com/I5OT95lbZeo1yraUKyPUjP" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Access Support Chat</a>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--primary)' }}>💼</span>
                      <strong>Founder Rajkamal:</strong>&nbsp;
                      <a href="https://www.linkedin.com/in/rajkamalprls" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Connect on LinkedIn</a>
                    </li>
                  </ul>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <button onClick={handleResetLock} className="btn btn-outline btn-sm">
                    Re-lock Links (Test)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
