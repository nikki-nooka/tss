'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  Check, 
  X, 
  ArrowUpRight, 
  Target, 
  Eye, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function About() {
  const tssIs = [
    'A verified network where every person has a real, unique Member ID',
    'A talent platform actively used by 100+ recruiters to source candidates',
    'A monthly builder program where real problems become real products',
    'A career ecosystem with mentors, experts, and practitioners',
    'Permanently free to join'
  ];

  const tssIsNot = [
    'A job board where listings expire and nobody responds',
    'An edtech platform selling courses you\'ll finish 20% of',
    'A community that asks you to pay to apply for an internship',
    'A platform that takes equity from what you build',
    'A WhatsApp group where "opportunities" are MLM schemes'
  ];

  const stats = [
    { num: '20,000+', label: 'Community members', desc: 'Across 7 platforms in 2 years of building' },
    { num: '100+', label: 'Campuses', desc: 'Organic. No paid campaigns. No ads.' },
    { num: '30+', label: 'Placements', desc: 'In the last 6 months via the Talent Network' },
    { num: '100+', label: 'Recruiter network', desc: 'HR professionals who actively source from TSS' },
    { num: '₹0', label: 'Charged to apply', desc: 'For any job or internship. Always. Non-negotiable.' }
  ];

  return (
    <div className={styles.aboutPage}>
      
      {/* 2A. HERO */}
      <section className={styles.aboutHeader}>
        <div className={styles.container}>
          <span className={styles.label}>OUR STORY</span>
          <h1 className={styles.heading}>Built Because the System Wasn't Working.</h1>
          <p className={styles.description}>
            Indian students are brilliant. The system built around them, less so. College placements are a lottery. LinkedIn is too noisy. Job portals go stale. And the word 'networking' sounds like something that happens in hotel lobbies between people who already have jobs.
          </p>
          <p className={styles.description} style={{ marginTop: '1rem', fontSize: '1rem' }}>
            We got tired of watching talented students get left behind by a system that wasn't designed for them. So we built a better one.
          </p>
        </div>
      </section>

      {/* 2B. ORIGIN STORY */}
      <section className={styles.originSection}>
        <div className={styles.container}>
          <div className={styles.splitGrid}>
            
            {/* Left: Content */}
            <div className={styles.textCol}>
              <h2 className={styles.subHeading}>How TSS Started</h2>
              <div className={styles.bodyText}>
                <p>
                  The Student Spot started in 2024 as one WhatsApp channel in Karimnagar, Telangana.
                </p>
                <p>
                  One rule from day one: only real, verified job opportunities. No spam. No fake listings. No company asking you to pay for a 'training certificate' before your internship.
                </p>
                <p>
                  It grew because it was honest. Students shared it because it actually worked. Within months, one channel became a movement — 100+ campuses, thousands of students, and a growing network of 100+ HR professionals and recruiters who began to trust the quality of candidates coming from TSS.
                </p>
                <p>
                  We've never run paid ads. Every member is organic. Every recruiter relationship is earned. And the number we care most about isn't followers — it's verified members, because that's who actually shows up.
                </p>
              </div>
            </div>

            {/* Right: Vertical Timeline */}
            <div className={styles.visualCol} style={{ justifyContent: 'flex-start' }}>
              <div className={styles.timeline}>
                
                <div className={`${styles.timelineItem} ${styles.timelineItemActive}`}>
                  <div className={styles.timelineDot}></div>
                  <span className={styles.timelineYear}>2024</span>
                  <div className={styles.timelineText}>
                    <h4>First Node Roots</h4>
                    <p>One WhatsApp channel. One rule. Karimnagar, Telangana.</p>
                  </div>
                </div>

                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <span className={styles.timelineYear}>2025</span>
                  <div className={styles.timelineText}>
                    <h4>Scaling Infrastructure</h4>
                    <p>10,000 members. 50+ campuses. First Talent Network placements.</p>
                  </div>
                </div>

                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <span className={styles.timelineYear}>2026</span>
                  <div className={styles.timelineText}>
                    <h4>Verified Network</h4>
                    <p>20,000+ members. 100+ campuses. TSS ID system. Verified infrastructure.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2C. MISSION & VISION */}
      <section className={styles.mvSection}>
        <div className={styles.container}>
          <div className={styles.mvGrid}>
            
            <div className={`${styles.mvCard} ${styles.mvCardPrimary}`}>
              <span className={styles.mvLabel}>MISSION</span>
              <h3>What We're Here to Do</h3>
              <p>
                To build India's most trusted student-to-founder ecosystem — where every student gets verified, every builder gets recognised, and every founder gets connected.
              </p>
            </div>

            <div className={`${styles.mvCard} ${styles.mvCardAccent}`}>
              <span className={styles.mvLabel}>VISION</span>
              <h3>Where We're Going</h3>
              <p>
                A future where where you studied matters less than what you built, who you know, and how you show up. TSS is the infrastructure for that future — starting in Telangana, scaling across India.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 2D. WHAT TSS IS AND ISN'T */}
      <section className={styles.comparisonSection}>
        <div className={styles.container}>
          <h2 className={styles.subHeading} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            What TSS Is. And What It Isn't.
          </h2>

          <div className={styles.comparisonGrid}>
            
            {/* What it IS */}
            <div className={styles.compCol}>
              <h3>What It IS</h3>
              <div className={styles.compList}>
                {tssIs.map((item, idx) => (
                  <div key={idx} className={`${styles.compItem} ${styles.compCheck}`}>
                    <CheckCircle2 size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What it IS NOT */}
            <div className={styles.compCol}>
              <h3>What It IS NOT</h3>
              <div className={styles.compList}>
                {tssIsNot.map((item, idx) => (
                  <div key={idx} className={`${styles.compItem} ${styles.compCross}`}>
                    <X size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className={styles.compHighlightQuote}>
            "Genuine jobs are always free. That rule hasn't changed since Day 1 — and it never will."
          </div>
        </div>
      </section>

      {/* 2E. FOUNDER SECTION */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.teamHeadingBlock}>
            <span className={styles.label}>THE TEAM</span>
            <h2>The People Building TSS</h2>
          </div>

          {/* Featured Founder */}
          <div className={styles.founderFeaturedCard}>
            <div className={styles.founderAvatarCol}>
              <div className={styles.founderInitials}>RP</div>
              <div className={styles.founderMeta}>
                <h3>Rajkamal Panthagani</h3>
                <span>Founder & CEO</span>
              </div>
            </div>
            <div className={styles.founderDesc}>
              <p className={styles.founderBio}>
                Former Accounts Manager at Way2News. Mentor at Wadhwani Foundation. Started TSS in Karimnagar in 2024 with a WhatsApp channel and a refusal to accept that talented students don't get the opportunities they deserve. Building this full-time.
              </p>
              <div className={styles.founderLinks}>
                <a href="https://linkedin.com/in/rajkamalprls" target="_blank" rel="noopener noreferrer" className={styles.founderSocialBtn}>
                  <LinkedInIcon /> LinkedIn
                </a>
                <a href="https://instagram.com/rajkamalpanthagani" target="_blank" rel="noopener noreferrer" className={styles.founderSocialBtn}>
                  <InstagramIcon /> Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Secondary Team */}
          <div className={styles.teamGrid}>
            
            <div className={styles.teamCard}>
              <h3>Prathima Panthagani</h3>
              <span>Co-Operations Lead & Community Builder</span>
              <p>
                Keeps the community running with the kind of consistent care that numbers rarely capture.
              </p>
            </div>

            <div className={`${styles.teamCard} ${styles.teamCardOpen}`}>
              <div>
                <h3>This seat is open.</h3>
                <span>Core Squad</span>
                <p>
                  We're building the team that builds the future of TSS. If this resonates — apply below.
                </p>
              </div>
              <a href="https://forms.gle/DyfMSzGJdQMVBbqRA" target="_blank" rel="noopener noreferrer" className={styles.btnText}>
                Apply for Core Squad <ArrowUpRight size={14} />
              </a>
            </div>

            <div className={`${styles.teamCard} ${styles.teamCardOpen}`}>
              <div>
                <h3>Want to represent?</h3>
                <span>Campus Ambassador</span>
                <p>
                  Bring TSS opportunities directly to your university cohort. Coordinate local nodes.
                </p>
              </div>
              <a href="https://forms.gle/GGGKNDZYFXBgqsqw8" target="_blank" rel="noopener noreferrer" className={styles.btnText}>
                Become Ambassador <ArrowUpRight size={14} />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 2F. STATS */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <h2 className={styles.subHeading} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            The Numbers That Matter
          </h2>
          
          <div className={styles.statsGrid}>
            {stats.map((stat, idx) => (
              <div key={idx} className={styles.statCard}>
                <span className={styles.statNum}>{stat.num}</span>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statDesc}>{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
