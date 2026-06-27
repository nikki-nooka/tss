'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  Star, 
  FileText, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Shield, 
  Activity, 
  Sparkles, 
  Code,
  ArrowUpRight
} from 'lucide-react';

export default function Programs() {
  return (
    <div className={styles.programsPage}>
      {/* 3A. PAGE HEADER */}
      <section className={styles.pageHeader}>
        <div className={styles.container}>
          <span className={styles.label}>WHAT WE OFFER</span>
          <h1 className={styles.heading}>Three Programs. One Direction.</h1>
          <p className={styles.description}>
            Whether you're figuring out your career, building your first product, or upgrading your resume — TSS has a program built for exactly where you are right now.
          </p>

          {/* Jump Nav (anchor links) */}
          <div className={styles.jumpNav}>
            <a href="#100x-students" className={styles.jumpLink}>100x Students</a>
            <a href="#buildx" className={styles.jumpLink}>BuildX Sandbox</a>
            <a href="#resume-studio" className={styles.jumpLink}>Resume Studio</a>
          </div>
        </div>
      </section>

      <div className={styles.thinDivider}></div>

      {/* 3B. PROGRAM 1 — 100x STUDENTS */}
      <section id="100x-students" className={styles.programSection}>
        <div className={styles.container}>
          <div className={styles.splitGrid}>
            
            {/* Left Column: Text & Features */}
            <div className={styles.textCol}>
              <span className={styles.tagPill}>PREMIUM MEMBERSHIP</span>
              <span className={`${styles.tagPill} ${styles.tagPillPrimary}`} style={{ marginLeft: '0.5rem' }}>₹499/month</span>
              
              <h2 className={styles.subHeading} style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
                The Career Accelerator for Students Who Mean Business.
              </h2>
              
              <div className={styles.bodyText}>
                <p><strong>Not another course. Not a subscription to watch videos you forget.</strong></p>
                <p>
                  100x Students is the premium layer of TSS — a live, expert-led community for students who want more than tips. They want results.
                </p>
                <p>
                  Resume reviews. Monthly sessions with people who actually hire. Referrals for jobs before they're posted publicly. First access to every TSS opportunity.
                </p>
                <p>
                  This is for the students who aren't waiting for placement season to decide their future.
                </p>
              </div>

              {/* What you get — 5 feature rows */}
              <div className={styles.featureList}>
                <div className={`${styles.featureRow} ${styles.featureRowAmber}`}>
                  <div className={styles.featureIcon}>
                    <Star size={18} />
                  </div>
                  <div className={styles.featureContent}>
                    <h4>Expert Sessions</h4>
                    <p>Monthly live sessions with professionals who have 10+ years of experience. Tech, marketing, HR, sales, design, startups. Not lectures. Real conversations.</p>
                  </div>
                </div>

                <div className={`${styles.featureRow} ${styles.featureRowAmber}`}>
                  <div className={styles.featureIcon}>
                    <FileText size={18} />
                  </div>
                  <div className={styles.featureContent}>
                    <h4>Resume Reviews</h4>
                    <p>Your resume reviewed in FAANG and McKinsey format — structured, achievement-first, ATS-ready. No more generic formats that look like everyone else's.</p>
                  </div>
                </div>

                <div className={`${styles.featureRow} ${styles.featureRowAmber}`}>
                  <div className={styles.featureIcon}>
                    <Sparkles size={18} />
                  </div>
                  <div className={styles.featureContent}>
                    <h4>Priority Job Referrals</h4>
                    <p>Jobs that never get posted publicly — shared first with 100x members because our recruiters trust the quality of students who come through here.</p>
                  </div>
                </div>

                <div className={`${styles.featureRow} ${styles.featureRowAmber}`}>
                  <div className={styles.featureIcon}>
                    <Lock size={18} />
                  </div>
                  <div className={styles.featureContent}>
                    <h4>Exclusive 100x Community</h4>
                    <p>Private WhatsApp group for 100x members only. Invitation-only. High signal, no noise. The people here are serious.</p>
                  </div>
                </div>

                <div className={`${styles.featureRow} ${styles.featureRowAmber}`}>
                  <div className={styles.featureIcon}>
                    <Activity size={18} />
                  </div>
                  <div className={styles.featureContent}>
                    <h4>First Access to Everything</h4>
                    <p>Workshops, BuildX spots, campus events, partnership opportunities — announced to 100x members before anyone else.</p>
                  </div>
                </div>
              </div>

              {/* Who it's for */}
              <div className={styles.whoItFor}>
                <h4>WHO IT'S FOR</h4>
                <div className={styles.whoGrid}>
                  <div className={styles.whoItem}><Check size={14} /> Campus Placement Prep</div>
                  <div className={styles.whoItem}><Check size={14} /> Tech, Marketing, HR, Design</div>
                  <div className={styles.whoItem}><Check size={14} /> Ambitious 2nd & 3rd Years</div>
                  <div className={styles.whoItem}><Check size={14} /> Grads Seeking First Roles</div>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Stack card fan */}
            <div className={styles.visualCol}>
              <div className={styles.stackWrapper}>
                <div className={`${styles.fanCard} ${styles.fanCard1}`}>
                  <div className={styles.fanCardTitle}>EXPERT SESSION · TECH</div>
                  <h4 className={styles.fanCardHeading}>Systems Architect @ AWS</h4>
                  <p className={styles.fanCardBody}>Live mapping of microservices and deployment pipelines for verified candidates.</p>
                </div>
                <div className={`${styles.fanCard} ${styles.fanCard2}`}>
                  <div className={styles.fanCardTitle}>RESUME REVIEW · 1:1</div>
                  <h4 className={styles.fanCardHeading}>FAANG Standard Vetting</h4>
                  <p className={styles.fanCardBody}>Achievement-first structuring showing exact metrics and developer credentials.</p>
                </div>
                <div className={`${styles.fanCard} ${styles.fanCard3}`}>
                  <div className={styles.fanCardTitle}>JOB REFERRAL · EXCLUSIVE</div>
                  <h4 className={styles.fanCardHeading}>Startup Founder Pipeline</h4>
                  <p className={styles.fanCardBody}>Bypass public queues directly to WhatsApp channels of hiring partners.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Pricing Card */}
          <div className={styles.pricingCard}>
            <div className={styles.priceValue}>₹499 / month</div>
            <div className={styles.priceSub}>or ₹2,999 / year</div>
            <div className={styles.saveBadge}>Save ₹2,989/yr</div>
            <div style={{ margin: '1.5rem 0' }}>
              <Link href="/register" className={styles.btnAccent} style={{ width: '100%', justifyContent: 'center' }}>
                Join 100x Students <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.pricingDesc}>
              Founding member pricing • Limited seats at this rate
            </div>
          </div>

        </div>
      </section>

      {/* 3C. PROGRAM 2 — BUILDX */}
      <section id="buildx" className={styles.programSection} style={{ backgroundColor: 'rgba(13, 17, 32, 0.4)' }}>
        <div className={styles.container}>
          <div className={styles.timelineHeadingBlock}>
            <span className={`${styles.tagPill} ${styles.tagPillPrimary}`}>MONTHLY BUILDER PROGRAM</span>
            <span className={`${styles.tagPill} ${styles.tagPillPrimary}`} style={{ marginLeft: '0.5rem' }}>🚀 Launching July 2026</span>
            
            <h2 className={styles.heading} style={{ fontSize: '2.5rem' }}>30 Days. 1 Real Problem. 1 Product.</h2>
            <p>
              This is not a hackathon for certificates. This is not content for TSS to post and forget. This is how founders actually get built.
            </p>
          </div>

          <div className={styles.bodyText} style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
            <p>
              Every month, TSS opens the floor to our entire community: what problem in your daily life is genuinely broken and genuinely fixable? We collect them all. We screen them honestly. We pick 3.
            </p>
            <p>
              Then you have 30 days to build the solution — with mentors checking in every week, your community watching, and TSS amplifying your work at every step of the way.
            </p>
          </div>

          {/* The 30-Day Cycle — 4 phase cards */}
          <div className={styles.phaseGrid}>
            
            <div className={styles.phaseCard}>
              <span className={styles.phaseNumber}>01</span>
              <span className={styles.phaseDays}>Days 1–5</span>
              <h4 className={styles.phaseTitle}>Intake Phase</h4>
              <p className={styles.phaseDesc}>
                Post your real problem in the BuildX group — not a business idea, a genuine daily-life frustration that you know others face too. We run a Google Form tracker so nothing gets lost.
              </p>
            </div>

            <div className={styles.phaseCard}>
              <span className={styles.phaseNumber}>02</span>
              <span className={styles.phaseDays}>Days 6–7</span>
              <h4 className={styles.phaseTitle}>Selection</h4>
              <p className={styles.phaseDesc}>
                We screen every submission against 3 filters: Is it real? Is it buildable solo or in a small team in 30 days? Does it fit TSS's strongest domains? We publish our final 3 picks publicly with explanations.
              </p>
            </div>

            <div className={styles.phaseCard}>
              <span className={styles.phaseNumber}>03</span>
              <span className={styles.phaseDays}>Days 8–28</span>
              <h4 className={styles.phaseTitle}>The Build</h4>
              <p className={styles.phaseDesc}>
                You own the build. Pull in any TSS member to help. Every Sunday: 20-minute Google Meet status review per problem. Midpoint updates go out to the whole community.
              </p>
            </div>

            <div className={styles.phaseCard}>
              <span className={styles.phaseNumber}>04</span>
              <span className={styles.phaseDays}>Days 29–30</span>
              <h4 className={styles.phaseTitle}>Demo Day</h4>
              <p className={styles.phaseDesc}>
                Live demo on Google Meet. Even rough builds get shown. Every builder gets TSS project verification, a LinkedIn feature, and direct recruiter/mentor introductions for startup-ready teams.
              </p>
            </div>

          </div>

          {/* The Hackathon Track */}
          <div className={styles.hackathonBand}>
            <h3>After 10 Builds: The Offline Hackathon</h3>
            <p>
              When BuildX completes 10 monthly cycles, TSS runs its first offline hackathon — larger problems, real judges from our recruiter and mentor network, and 90-day dedicated follow-up support and resources for the strongest teams. That's your incubator runway.
            </p>
          </div>

          {/* The Non-Negotiable Callout */}
          <div className={styles.glowCallout}>
            <h3>TSS never takes equity in what you build.</h3>
            <p>
              Your idea. Your product. Your company. We give you the community, the mentors, and the visibility. The rest is yours.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/register" className={styles.btnPrimary}>
              Register for BuildX <ArrowRight size={16} />
            </Link>
            <div className={styles.pricingDesc} style={{ marginTop: '0.75rem' }}>
              * Must be a verified TSS member to participate
            </div>
          </div>

        </div>
      </section>

      {/* 3D. PROGRAM 3 — RESUME STUDIO */}
      <section id="resume-studio" className={styles.programSection}>
        <div className={styles.container}>
          <div className={styles.splitGrid} style={{ alignItems: 'flex-start' }}>
            
            {/* Left Column: Context */}
            <div className={styles.textCol}>
              <span className={`${styles.tagPill} ${styles.tagPillGreen}`}>FREE FOR ALL VERIFIED MEMBERS</span>
              <h2 className={styles.subHeading} style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif', marginTop: '0.5rem' }}>
                Your Resume, FAANG-Style. Free. In 5 Minutes.
              </h2>
              <h3 className={styles.bodyText} style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                The resume format that actually gets shortlisted.
              </h3>
              
              <div className={styles.bodyText}>
                <p>
                  Most Indian student resumes have the same problems: too much filler, too little achievement, three different fonts, and a "Career Objective" paragraph that nobody reads.
                </p>
                <p>
                  Resume Studio fixes all of that. We built a builder around the formats that top companies want — clean, structured, achievement-first, ATS-friendly. No clutter. No drag-and-drop confusion. No subscription to download what's already yours.
                </p>
                <p>
                  The Resume Studio format is also the TSS Talent Network format — when you apply to jobs through TSS, this is the resume that reaches our recruiter partners. Consistency creates credibility.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2.5rem' }}>
                <Link href="/resume-studio" className={styles.btnPrimary} style={{ background: 'linear-gradient(110deg,#059669,#10B981)', boxShadow: '0 4px 15px rgba(5,150,105,0.3)', alignSelf: 'flex-start' }}>
                  Build My Resume <ArrowRight size={16} />
                </Link>
                <span className={styles.ctaNote}>Available immediately after your Member ID is approved. Free forever.</span>
              </div>
            </div>

            {/* Right Column: Steps & Features */}
            <div className={styles.textCol} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.5rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>How It Works</h3>
              
              <div className={styles.featureList} style={{ margin: 0 }}>
                <div className={`${styles.featureRow} ${styles.featureRowGreen}`}>
                  <div className={styles.featureIcon}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div className={styles.featureContent}>
                    <h4>Step 1: Get Verified</h4>
                    <p>Register to verify your candidate profile. Your TSS Member ID is Step 0.</p>
                  </div>
                </div>

                <div className={`${styles.featureRow} ${styles.featureRowGreen}`}>
                  <div className={styles.featureIcon}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div className={styles.featureContent}>
                    <h4>Step 2: Fill Details</h4>
                    <p>Provide your education, experiences, and project history. Automatically pre-populated from registration where possible.</p>
                  </div>
                </div>

                <div className={`${styles.featureRow} ${styles.featureRowGreen}`}>
                  <div className={styles.featureIcon}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div className={styles.featureContent}>
                    <h4>Step 3: Preview & Download</h4>
                    <p>Pick a template style, watch it render live, and download a print-ready A4 PDF with one click.</p>
                  </div>
                </div>
              </div>

              <div className={styles.thinDivider} style={{ margin: '2rem 0' }}></div>

              <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>TSS EXCLUSIVE ADVANTAGES</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}><Check size={14} style={{ color: 'var(--green-light)', flexShrink: 0 }} /> Achievement-first bullet suggestions</li>
                <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}><Check size={14} style={{ color: 'var(--green-light)', flexShrink: 0 }} /> Strictly ATS-friendly single-column layout</li>
                <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}><Check size={14} style={{ color: 'var(--green-light)', flexShrink: 0 }} /> Permanent QR code & Member ID integration</li>
                <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}><Check size={14} style={{ color: 'var(--green-light)', flexShrink: 0 }} /> 100% PDF downloads without hidden paywalls</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
