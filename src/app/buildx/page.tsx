'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  Terminal, 
  HelpCircle, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Award, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function BuildX() {
  return (
    <div className={styles.buildxPage}>
      {/* Header Banner */}
      <section className={styles.header}>
        <div className="container">
          <span className={styles.categoryLabel}>Innovation Layer</span>
          <h1>BuildX Community</h1>
          <p className={styles.tagline}>
            A structured, fast-paced monthly problem-solving sandbox for India's top builders. 
            Form teams, create products, and pitch to startups.
          </p>
          <div className={styles.headerActions}>
            <Link href="/register" className="btn btn-secondary">
              Apply For BuildX <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Metrics */}
      <section className={styles.gridSection}>
        <div className="container">
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <h3>30 Days</h3>
              <p>To go from problem statement to fully functional production-ready MVP.</p>
            </div>
            <div className={styles.metricCard}>
              <h3>Top 3</h3>
              <p>Real-world problem submissions selected from the community pool every month.</p>
            </div>
            <div className={styles.metricCard}>
              <h3>Curated Support</h3>
              <p>Direct mentorship, recruiter vetting, and incubator startup backing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className={styles.whiteSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>How BuildX Works</h2>
            <div className={styles.line}></div>
          </div>

          <div className={styles.stepsTimeline}>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepInfo}>
                <h3>Submit Problems</h3>
                <p>Community members submit real-world industrial, social, or technical bottlenecks they want solved.</p>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepInfo}>
                <h3>Vetting & Selection</h3>
                <p>The TSS vetting team selects the top 3 problem statements and announces team registration slots.</p>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepInfo}>
                <h3>Form Teams & Build</h3>
                <p>Cross-functional teams are formed. Builders receive 30 days of direct sandbox environment support to create MVPs.</p>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>04</div>
              <div className={styles.stepInfo}>
                <h3>Demo & Vetting</h3>
                <p>Teams present their products. Startups, recruiters, and mentors review the code and credentials.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current and Upcoming Challenges */}
      <section className={styles.challengesSection}>
        <div className="container">
          <div className={styles.gridSplit}>
            
            {/* Current Active Challenges */}
            <div className={styles.columnBlock}>
              <div className={styles.blockTitle}>
                <Zap size={20} className={styles.activeIcon} />
                <h2>Current Active Challenges</h2>
              </div>
              <div className={styles.challengesList}>
                <div className={styles.challengeCard}>
                  <span className={styles.challengeBadge}>Active (Ends in 12 days)</span>
                  <h3>Vercel Serverless File Archiver</h3>
                  <p>Create a zero-dependency, base64 data-streaming parser to upload and index document structures in serverless environments.</p>
                  <div className={styles.challengeMeta}>
                    <span>Teams: 14 Registered</span>
                    <span>•</span>
                    <span>Mentor: Sr. Arch @ AWS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Pool */}
            <div className={styles.columnBlock}>
              <div className={styles.blockTitle}>
                <Calendar size={20} className={styles.upcomingIcon} />
                <h2>Upcoming Sandbox Pools</h2>
              </div>
              <div className={styles.challengesList}>
                <div className={styles.challengeCardOutline}>
                  <span className={styles.upcomingBadge}>Starts Next Month</span>
                  <h3>WhatsApp Client Identity API</h3>
                  <p>Implement an authenticated identity proxy layers system utilizing QR-code scanning structures for localized businesses.</p>
                </div>
                <div className={styles.challengeCardOutline}>
                  <span className={styles.upcomingBadge}>Planned</span>
                  <h3>Distributed Supabase Seeder Engine</h3>
                  <p>A self-healing, transaction-safe mock seeder generator that runs seed processes on fresh production schemas without data overlap.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Past Winners Block */}
      <section className={styles.whiteSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Past Sandbox Winners</h2>
            <p>High-quality MVPs built, deployed, and approved by recruiter networks during BuildX.</p>
          </div>

          <div className={styles.winnersGrid}>
            <div className={styles.winnerCard}>
              <div className={styles.winnerHeader}>
                <Award size={24} className={styles.awardIcon} />
                <div>
                  <h3>Team Alpha (BuildX-2403)</h3>
                  <span>Project: PDF-Signature Vetting Engine</span>
                </div>
              </div>
              <p>Created a digital signature parsing library validating credential PDFs for startup applications. Forwarded to 6 hiring partners.</p>
            </div>
            
            <div className={styles.winnerCard}>
              <div className={styles.winnerHeader}>
                <Award size={24} className={styles.awardIcon} />
                <div>
                  <h3>Team Lambda (BuildX-2405)</h3>
                  <span>Project: Supabase Audit Logger API</span>
                </div>
              </div>
              <p>Designed a self-contained activity-log pipeline that records recruiter candidate queries securely. Currently integrated inside the TSS Admin Portal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.bottomCta}>
        <div className="container">
          <h2>Bring your product ideas to life.</h2>
          <p>Get your TSS ID, join the TSS Network, and apply to participate in the next BuildX monthly cohort.</p>
          <Link href="/register" className="btn btn-secondary">
            Apply to BuildX Network <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
