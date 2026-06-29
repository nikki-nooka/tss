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
  ArrowRight,
  Lock,
  Unlock,
  MessageSquare,
  Send,
  Globe,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { ScrollReveal, CountUp } from '@/components/AnimatedReveal';

interface Stats {
  communityMembers: number;
  recruiterNetwork: number;
  opportunitiesShared: number;
  eventsConducted: number;
}

export default function Home() {
  const toast = useToast();
  const [stats, setStats] = useState<Stats>({
    communityMembers: 20000,
    recruiterNetwork: 100,
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
          // Fallback to defaults if values are not defined in DB
          setStats({
            communityMembers: data.communityMembers || 20000,
            recruiterNetwork: data.recruiterNetwork || 100,
            opportunitiesShared: data.opportunitiesShared || 800,
            eventsConducted: data.eventsConducted || 40
          });
        }
        setIsLoadingStats(false)
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
      // Fallback local verify for demo convenience
      if (cleanId === 'TSS-ST-260618001' || cleanId === 'TSS-ST-010626001') {
        setIsUnlocked(true);
        localStorage.setItem('tss_community_unlocked', 'true');
        toast.success('Access Unlocked (Demo Mode)! Welcome to TSS.');
      } else {
        toast.error('Verification connection failed. Please check your network.');
      }
    }
  };

  const handleUnlockDemo = () => {
    setIsUnlocked(true);
    localStorage.setItem('tss_community_unlocked', 'true');
    toast.info('Community links unlocked (Demo bypass mode).');
  };

  const handleResetLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem('tss_community_unlocked');
    toast.info('Community links locked.');
  };

  const platforms = [
    { name: 'WhatsApp Channel', count: '5,800+ Followers', desc: 'Verified jobs, immediate notices.', link: 'https://whatsapp.com/channel/0029Vb6ft6072WTxJ5eMKA2I' },
    { name: 'WhatsApp Community', count: '2,000+ Members', desc: 'Peer-to-peer discussions.', link: 'https://chat.whatsapp.com/LxA5xaAdlKp3nvZmIGxLcp' },
    { name: 'LinkedIn Company', count: '4,200+ Followers', desc: 'Industry announcements.', link: 'https://www.linkedin.com/company/thestudentspot/' },
    { name: 'Instagram', count: '880+ Followers', desc: 'Student spotlights, tips.', link: 'https://www.instagram.com/the_studentspot' },
    { name: 'Telegram Hub', count: '200+ Members', desc: 'Immediate announcements backup.', link: 'https://t.me/thestudentspot' },
    { name: 'YouTube', count: '50+ Subscribers', desc: 'Masterclass archives.', link: 'https://youtube.com/@the.studentspot' },
    { name: 'X / Twitter', count: '50+ Followers', desc: 'Daily developer threads.', link: 'https://x.com/the_studentspot' }
  ];

  return (
    <div className={styles.home}>
      
      {/* Floating Vertical Social Bar */}
      <div className={styles.floatingShareBar}>
        <a href="https://www.instagram.com/the_studentspot" target="_blank" rel="noopener noreferrer" className={styles.shareBtnInsta} title="Instagram">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/company/thestudentspot/" target="_blank" rel="noopener noreferrer" className={styles.shareBtnLink} title="LinkedIn">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a href="https://whatsapp.com/channel/0029Vb6ft6072WTxJ5eMKA2I" target="_blank" rel="noopener noreferrer" className={styles.shareBtnWhats} title="WhatsApp Channel">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </a>
      </div>

      {/* 1A. HERO SECTION */}
      <section className={styles.hero}>
        <div className={`${styles.heroContainer} container`}>
          
          {/* Left Column */}
          <ScrollReveal direction="pop" className={styles.heroContent}>
            <div className={styles.eyebrowBadge} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(247, 127, 0, 0.08)', color: 'var(--primary)', border: 'none' }}>
              <Sparkles size={14} style={{ fill: 'currentColor' }} />
              <span>India's Growing Student Ecosystem</span>
            </div>
            <h1 className={styles.headline}>
              From Students<br />
              <span className={styles.highlightText}>To Founders</span>
            </h1>
            <p className={styles.subheadline}>
              We connect students, colleges, companies, startups, incubators, recruiters, mentors, and speakers into one powerful, outcome-driven ecosystem.
            </p>

            <div className={styles.heroBulletList}>
              <p>Build skills.</p>
              <p>Build proof.</p>
              <p className={styles.bulletActive}>Build startups.</p>
              <p className={styles.bulletActive}>Build careers.</p>
            </div>
            
            <div className={styles.heroActions}>
              <Link href="/get-verified" className={styles.btnJoinNow}>
                Join Now &rarr;
              </Link>
              <Link href="/contact" className={styles.btnPartnerWithUs}>
                Partner With Us
              </Link>
            </div>

            <div className={styles.statsDotsRow}>
              <div className={styles.statDotItem}>
                <span className={styles.greenDot}></span>
                <span>20,000+ Students</span>
              </div>
              <div className={styles.statDotItem}>
                <span className={styles.greenDot}></span>
                <span>50+ Colleges</span>
              </div>
              <div className={styles.statDotItem}>
                <span className={styles.greenDot}></span>
                <span>Pan-India Network</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Hero Grid Cards */}
          <ScrollReveal direction="pop" delay={150} className={styles.heroVisualGrid}>
            <div className={styles.heroCardsGrid}>
              {/* Card 1: Career Clarity */}
              <div className={styles.heroCardLight}>
                <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(247, 127, 0, 0.08)', color: 'var(--primary)' }}>
                  <Compass size={20} />
                </div>
                <div>
                  <h4 className={styles.cardTitle}>Career Clarity</h4>
                  <p className={styles.cardDesc}>Know exactly what path to take</p>
                </div>
              </div>

              {/* Card 2: Real Skills */}
              <div className={styles.heroCardLight}>
                <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(193, 18, 31, 0.08)', color: 'var(--secondary)' }}>
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className={styles.cardTitle}>Real Skills</h4>
                  <p className={styles.cardDesc}>Industry-ready training</p>
                </div>
              </div>

              {/* Card 3: Network */}
              <div className={styles.heroCardLight}>
                <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(22, 163, 74, 0.08)', color: '#16a34a' }}>
                  <Users size={20} />
                </div>
                <div>
                  <h4 className={styles.cardTitle}>Network</h4>
                  <p className={styles.cardDesc}>Connect with industry</p>
                </div>
              </div>

              {/* Card 4: Opportunities */}
              <div className={styles.heroCardGradient}>
                <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <div>
                  <h4 className={styles.cardTitle} style={{ color: '#ffffff' }}>Opportunities</h4>
                  <p className={styles.cardDesc} style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Jobs & internships</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 1B. STATS BAR */}
      <section className={styles.statsBar}>
        <div className={`${styles.statsGrid} container`}>
          <div>
            <span className={styles.statVal}>
              {isLoadingStats ? '...' : <CountUp value={stats.communityMembers} suffix="+" />}
            </span>
            <span className={styles.statLabel}>Community Members</span>
          </div>
          <div>
            <span className={styles.statVal}>
              <CountUp value={100} suffix="+" />
            </span>
            <span className={styles.statLabel}>Campuses Reached</span>
          </div>
          <div>
            <span className={styles.statVal}>
              {isLoadingStats ? '...' : <CountUp value={stats.opportunitiesShared} suffix="+" />}
            </span>
            <span className={styles.statLabel}>Placements in 6 Months</span>
          </div>
          <div>
            <span className={styles.statVal}>
              {isLoadingStats ? '...' : <CountUp value={stats.recruiterNetwork} suffix="+" />}
            </span>
            <span className={styles.statLabel}>Recruiter Connections</span>
          </div>
        </div>
      </section>

      {/* 1C. WHAT IS TSS SECTION */}
      <section className={styles.whatIsSection}>
        <div className={`${styles.introSplit} container`}>
          
          {/* Left Text */}
          <ScrollReveal direction="up" className={styles.heroContent}>
            <span className={styles.eyebrow}>WHO WE ARE</span>
            <h2 className={styles.sectionHeading}>
              Not Another Student Group. A System That Actually Moves You Forward.
            </h2>
            <div className={styles.subheadline} style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              <p style={{ marginBottom: '1.25rem' }}>
                We're not a LinkedIn group. We're not another student club. We don't host webinars nobody remembers or share job listings that expired last month.
              </p>
              <p style={{ marginBottom: '1.25rem' }}>
                The Student Spot is a verified professional network linking students, freshers, founders, and recruiters. Once verified, you get a unique TSS Member ID, which is your passport to skip public job application queues.
              </p>
              <p>
                Started in Karimnagar, Telangana, we've grown organically to 100+ campuses across India. High trust, no spam.
              </p>
            </div>
          </ScrollReveal>

          {/* Right Visual: Telangana node dot map */}
          <ScrollReveal direction="pop" delay={150} className={styles.mapVisual}>
            <div className={styles.mapCard}>
              {/* Spreading nodes from center */}
              <div className={styles.mapNode} style={{ top: '50%', left: '50%' }}></div>
              <div className={styles.mapNode} style={{ top: '35%', left: '42%', animationDelay: '0.4s' }}></div>
              <div className={styles.mapNode} style={{ top: '65%', left: '55%', animationDelay: '0.8s' }}></div>
              <div className={styles.mapNode} style={{ top: '40%', left: '60%', animationDelay: '1.2s' }}></div>
              <div className={styles.mapNode} style={{ top: '60%', left: '38%', animationDelay: '1.6s' }}></div>
              
              <span className={styles.mapLabel}> Telangana Node Spreading to 100+ Campuses</span>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 1D. PROGRAMS SECTION */}
      <section className={styles.programsSection}>
        <div className="container">
          <ScrollReveal direction="up" className={styles.programsHeader}>
            <span className={styles.eyebrow}>WHAT WE OFFER</span>
            <h2>Three Programs. One Direction.</h2>
            <p>
              Whether you want to get hired, build something real, or craft the resume that actually gets read — there's a TSS program for exactly where you are.
            </p>
          </ScrollReveal>

          <div className={styles.programsGrid}>
            
            {/* Card 1: 100x Students */}
            <ScrollReveal direction="pop" delay={0} className={styles.programCard} style={{ borderLeft: '3px solid var(--primary)' }}>
              <div>
                <div className={styles.progHeader}>
                  <span className={`${styles.progBadge} ${styles.progBadgePrimary}`}>PREMIUM MEMBERSHIP</span>
                  <span className={styles.progIcon}><Sparkles size={16} style={{ color: 'var(--primary)' }} /></span>
                </div>
                <h3>100x Students</h3>
                <p>
                  Accelerate your preparation. Live expert reviews, private placements pipeline, mock recruiter reviews, and priority access to every TSS node.
                </p>
              </div>
              <Link href="/programs#100x-students" className={styles.progCta}>
                Join 100x Students <ArrowRight size={14} />
              </Link>
            </ScrollReveal>

            {/* Card 2: BuildX */}
            <ScrollReveal direction="pop" delay={100} className={styles.programCard} style={{ borderLeft: '3px solid var(--accent)' }}>
              <div>
                <div className={styles.progHeader}>
                  <span className={`${styles.progBadge} ${styles.progBadgeAmber}`}>BUILDER PROGRAM</span>
                  <span className={styles.progIcon}><Zap size={16} style={{ color: 'var(--accent)' }} /></span>
                </div>
                <h3>BuildX Sandbox</h3>
                <p>
                  30 days. 1 real problem. 1 working product. Pull in teammates, get Sunday code reviews from operators, and show your demo to active founders.
                </p>
              </div>
              <Link href="/programs#buildx" className={styles.progCta}>
                Register for BuildX <ArrowRight size={14} />
              </Link>
            </ScrollReveal>

            {/* Card 3: Resume Studio */}
            <ScrollReveal direction="pop" delay={200} className={styles.programCard} style={{ borderLeft: '3px solid var(--green-light)' }}>
              <div>
                <div className={styles.progHeader}>
                  <span className={`${styles.progBadge} ${styles.progBadgeGreen}`}>FREE FOR ALL MEMBERS</span>
                  <span className={styles.progIcon}><Award size={16} style={{ color: 'var(--success)' }} /></span>
                </div>
                <h3>Resume Studio</h3>
                <p>
                  Build a print-ready, single-column ATS-friendly resume matching FAANG/Startup layout criteria in under 5 minutes. 100% free downloads.
                </p>
              </div>
              <Link href="/programs#resume-studio" className={styles.progCta}>
                Launch Resume Studio <ArrowRight size={14} />
              </Link>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* 1E. COMMUNITY PROOF SECTION */}
      <section id="community-section" className={styles.communitySection}>
        <div className="container">
          <ScrollReveal direction="up" className={styles.communityHeader}>
            <span className={styles.eyebrow}>THE NUMBERS</span>
            <h2>A Community That Ships, Not Just Scrolls.</h2>
            <p>
              Every number here is a real person verified to prevent placement spam. Access to community channels is locked until your Member ID is approved.
            </p>
          </ScrollReveal>

          <div className={styles.platformGrid}>
            {platforms.map((plat, idx) => {
              const numericCount = parseInt(plat.count.replace(/[^0-9]/g, ''), 10);
              const isPlus = plat.count.includes('+');
              const suffix = plat.count.includes('Followers') ? ' Followers' : plat.count.includes('Members') ? ' Members' : plat.count.includes('Subscribers') ? ' Subscribers' : '';
              return (
                <ScrollReveal key={idx} direction="pop" delay={idx * 50} className={styles.platformCard}>
                  <div className={styles.platHeader}>
                    <span>⚡</span>
                    <span>{plat.name}</span>
                  </div>
                  <span className={styles.platNum}>
                    <CountUp value={numericCount} suffix={isPlus ? '+' : ''} />{suffix}
                  </span>
                  <span className={styles.platLabel}>{plat.desc}</span>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Interactive Member ID Unlock Widget */}
          <ScrollReveal direction="up" className={styles.verifUnlockWidget}>
            <h3>Verify Member ID to Unlock Official Links</h3>
            <p>
              Approved members can enter their unique ID below to unlock WhatsApp channels, Telegram handles, and direct access links.
            </p>

            {!isUnlocked ? (
              <form onSubmit={handleUnlock} className={styles.unlockForm}>
                <input 
                  type="text" 
                  className={styles.unlockInput}
                  placeholder="e.g. TSS-ST-260618001" 
                  value={memberIdInput}
                  onChange={(e) => setMemberIdInput(e.target.value)}
                />
                <button type="submit" className={styles.btnAccent} style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}>
                  Verify & Unlock
                </button>
              </form>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--green-light)' }}>
                    <CheckCircle2 size={18} />
                    <strong>Verified Candidate Access Unlocked</strong>
                  </div>
                  <button onClick={handleResetLock} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}>
                    Lock Links
                  </button>
                </div>
                <div className={styles.unlockedLinksGrid}>
                  <a href={platforms[0].link} target="_blank" rel="noopener noreferrer" className={styles.inviteLinkCard}>
                    Join Official WhatsApp Channel <ArrowRight size={14} />
                  </a>
                  <a href={platforms[1].link} target="_blank" rel="noopener noreferrer" className={styles.inviteLinkCard}>
                    Join WhatsApp Community <ArrowRight size={14} />
                  </a>
                  <a href={platforms[4].link} target="_blank" rel="noopener noreferrer" className={styles.inviteLinkCard}>
                    Join Telegram Group <ArrowRight size={14} />
                  </a>
                  <a href={platforms[2].link} target="_blank" rel="noopener noreferrer" className={styles.inviteLinkCard}>
                    Connect LinkedIn Network <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={handleUnlockDemo} style={{ background: 'none', border: 'none', color: 'var(--primary-pale)', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}>
                [Demo Bypass Access]
              </button>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" className={styles.quoteBlock}>
            "Most communities measure followers. We measure verified members. That's who actually shows up."
            <span className={styles.quoteAuthor}>— Rajkamal Panthagani, Founder</span>
          </ScrollReveal>

        </div>
      </section>

      {/* 1F. VERIFICATION CTA SECTION */}
      <section className={styles.ctaSection}>
        <ScrollReveal direction="up" className="container">
          <div className={styles.scanWrapper}>
            <div className={styles.scanLine}></div>
            <div className={styles.memberCard} style={{ opacity: 0.85 }}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLogo}>TSS ⚡</span>
                <span className={styles.cardBadge}>VERIFIED</span>
              </div>
              <div className={styles.cardCenter}>
                <div className={styles.cardId}>TSS-ST-260618001</div>
                <div className={styles.cardSubtitle}>The Student Spot Ecosystem</div>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.cardHolder}>
                  <span className={styles.holderName}>Rajkamal Panthagani</span>
                  <span className={styles.holderRole}>Student · Software</span>
                </div>
                <span className={styles.cardMark}>⚡</span>
              </div>
            </div>
          </div>

          <h2 className={styles.ctaHeading}>Everything in TSS Starts With Your Member ID.</h2>
          <p className={styles.ctaDesc}>
            When you verify your student credentials, you unlock direct referrals, builder sessions, and ATS formatting tools. It takes two minutes and stays free forever.
          </p>

          <span className={styles.largeIdDisplay}>TSS-ST-260618001</span>

          <div>
            <Link href="/get-verified" className={styles.btnAccent} style={{ fontSize: '1.05rem', padding: '1rem 2.2rem' }}>
              Get Verified Free — Takes 2 Minutes <ArrowRight size={18} />
            </Link>
          </div>
          <span className={styles.helperNote}>* Requires verification via college email, ID card, or verified portfolio link.</span>
        </ScrollReveal>
      </section>

      {/* 1G. FINAL SECTION */}
      <section className={styles.finalSection}>
        <ScrollReveal direction="pop" className="container">
          <h2 className={styles.finalHeading}>Stop Waiting. Start Building.</h2>
          <p className={styles.finalDesc}>20,000+ students already inside. Your Member ID is waiting.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/get-verified" className={styles.btnAccent}>
              Get Verified
            </Link>
            <Link href="/contact" className={styles.btnOutline}>
              Contact Us
            </Link>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
