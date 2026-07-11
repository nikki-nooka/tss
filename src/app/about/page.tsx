'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { 
  Target, 
  Eye, 
  CheckCircle2, 
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Globe,
  Heart,
  BookOpen,
  Users,
  Award,
  Shield,
  Lightbulb,
  Hammer
} from 'lucide-react';
import { ScrollReveal, CountUp } from '@/components/AnimatedReveal';

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function About() {
  const coreValues = [
    { title: "Results First", description: "We focus on real outcomes: careers, skills, and startups.", icon: Target },
    { title: "Access for All", description: "Opportunity should never depend on background or connections.", icon: Globe },
    { title: "Community Power", description: "We grow together students, founders, mentors, and recruiters.", icon: Heart },
    { title: "Continuous Learning", description: "Lifelong skill development and curiosity drive success.", icon: BookOpen },
    { title: "Collaboration", description: "Shared knowledge creates a bigger impact.", icon: Users },
    { title: "Excellence", description: "We aim beyond average and build systems that scale.", icon: Award },
    { title: "Integrity", description: "Transparency, responsibility, and trust guide our work.", icon: Shield },
    { title: "Innovation", description: "We encourage new ideas, experimentation, and bold thinking.", icon: Lightbulb },
    { title: "Builder Mindset", description: "Take ownership. Execute. Create opportunities.", icon: Hammer }
  ];

  const connections = [
    "Students", "Colleges", "Companies", "Startups", "Recruiters", "Incubators", "Mentors & Speakers"
  ];

  return (
    <div className={styles.aboutPage}>
      
      {/* SECTION 1: HERO */}
      <section className={styles.aboutHeader}>
        <div className={styles.container}>
          <ScrollReveal direction="pop" delay={0}>
            <div className={styles.eyebrowBadge} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(247, 127, 0, 0.08)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              <Sparkles size={14} style={{ fill: 'currentColor' }} />
              <span>From Student to Founder</span>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={150}>
            <h1 className={styles.heading}>
              Building India’s Largest <br />
              <span className={styles.highlightText}>Student-to-Founder Ecosystem</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <p className={styles.description}>
              The Student Spot is a Pan-India Student-to-Founder Ecosystem built to solve one clear problem:
              Students don’t fail because they lack talent. They fail because they lack clarity, access, and structured direction.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={450}>
            <p className={styles.description} style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              We are building the missing bridge between campuses and real-world outcomes.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 2: WHO WE ARE */}
      <section className={styles.originSection}>
        <div className={styles.container} style={{ maxWidth: '800px', textAlign: 'center' }}>
          <ScrollReveal direction="up" delay={0}>
            <h2 className={styles.subHeading} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Who We Are</h2>
          </ScrollReveal>
          
          <ScrollReveal direction="pop" delay={150}>
            <div className={styles.whoWeAreBox} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2.5rem 2rem', boxShadow: 'var(--shadow-sm)' }}>
              <p className={styles.description} style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                The Student Spot connects:
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                {connections.map((item, idx) => (
                  <span key={idx} style={{ backgroundColor: 'rgba(247, 127, 0, 0.08)', color: 'var(--primary)', padding: '0.6rem 1.2rem', borderRadius: '9999px', fontWeight: 600, fontSize: '0.9rem' }}>
                    {item}
                  </span>
                ))}
              </div>

              <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                Into one structured ecosystem focused on execution, not just engagement.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-muted)' }}>
                <p>We don’t just host events.</p>
                <p>We don’t just share opportunities.</p>
                <p style={{ fontWeight: 700, color: 'var(--primary)', marginTop: '0.5rem', fontSize: '1.15rem' }}>We build pathways.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 3: MISSION & VISION */}
      <section className={styles.mvSection}>
        <div className={styles.container}>
          <div className={styles.mvGrid}>
            
            {/* Mission */}
            <ScrollReveal direction="left" delay={0} className={`${styles.mvCard} ${styles.mvCardPrimary}`}>
              <div className={styles.cardIconWrapper} style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: 'rgba(247, 127, 0, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Target size={28} />
              </div>
              <span className={styles.mvLabel}>MISSION</span>
              <h3>Our Mission</h3>
              <p>
                To provide every student with clarity, skills, confidence, and real opportunities through structured guidance, hands-on experience, and ecosystem access.
              </p>
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.5rem', paddingTop: '1rem' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>We don’t just motivate.</p>
                <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem', marginTop: '0.25rem' }}>We enable action.</p>
              </div>
            </ScrollReveal>

            {/* Vision */}
            <ScrollReveal direction="right" delay={150} className={`${styles.mvCard} ${styles.mvCardAccent}`} style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: '#ffffff', border: 'none' }}>
              <div className={styles.cardIconWrapper} style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Eye size={28} />
              </div>
              <span className={styles.mvLabel} style={{ color: 'rgba(255, 255, 255, 0.85)' }}>VISION</span>
              <h3 style={{ color: '#ffffff' }}>Our Vision</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                To build India’s largest student infrastructure connecting education, industry, and innovation.
              </p>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', marginTop: '1.5rem', paddingTop: '1rem' }}>
                <p style={{ fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>A future where:</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }}></div>
                    Every student has access to opportunities
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }}></div>
                    Every campus has startup exposure
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }}></div>
                    Every company finds job-ready talent
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }}></div>
                    Every founder gets ecosystem support
                  </li>
                </ul>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>


      {/* SECTION 5: MEET OUR FOUNDER */}
      <section className={styles.teamSection} style={{ backgroundColor: 'var(--bg-card-2)' }}>
        <div className={styles.container}>
          <div className={styles.teamHeadingBlock}>
            <ScrollReveal direction="up" delay={0}>
              <span className={styles.label}>FOUNDER</span>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={100}>
              <h2>Meet Our Founder</h2>
            </ScrollReveal>
          </div>

          {/* Card 1: Founder */}
          <ScrollReveal direction="pop" delay={200} className={styles.founderFeaturedCard}>
            {/* Translucent quote mark overlay */}
            <div className={styles.quoteIconWrapper}>
              <span className={styles.quoteMark}>””</span>
            </div>

            <div className={styles.founderAvatarCol}>
              <div className={styles.photoContainer}>
                <img src="/founder.png" alt="Rajkamal Panthagani - Founder of The Student Spot" className={styles.founderPhoto} />
                <div className={styles.floatingSocials}>
                  <a href="https://www.linkedin.com/in/rajkamalprls" target="_blank" rel="noopener noreferrer" className={styles.floatingSocialBtn} title="LinkedIn">
                    <LinkedInIcon style={{ width: '16px', height: '16px' }} />
                  </a>
                  <a href="https://instagram.com/rajkamalpanthagani" target="_blank" rel="noopener noreferrer" className={styles.floatingSocialBtn} title="Instagram">
                    <InstagramIcon style={{ width: '16px', height: '16px' }} />
                  </a>
                </div>
              </div>
              <div className={styles.founderMeta}>
                <h3>Rajkamal Panthagani</h3>
                <span>Founder, The Student Spot</span>
              </div>
            </div>
            <div className={styles.founderDesc}>
              <p className={styles.founderBio}>
                The Student Spot was founded by <strong>Rajkamal Panthagani</strong>, an MBA graduate who personally experienced job rejections, introversion, and the absence of structured guidance during his student journey.
              </p>
              <p className={styles.founderBio}>
                Instead of waiting for change, he built what he wished existed during his college days: a platform where students don’t struggle alone, don’t guess their path, and don’t miss opportunities due to lack of access.
              </p>
              <p className={styles.founderBio} style={{ fontStyle: 'italic', color: '#64748b' }}>
                Today, The Student Spot empowers thousands of students across India with real exposure, structured growth, and outcome-driven opportunities.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 6: CORE VALUES */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.teamHeadingBlock}>
            <ScrollReveal direction="up" delay={0}>
              <span className={styles.label}>PRINCIPLES</span>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={100}>
              <h2>Our Core Values</h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <p className={styles.description} style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Everything we do is guided by these principles.
              </p>
            </ScrollReveal>
          </div>

          <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem' }}>
            {coreValues.map((value, idx) => {
              const IconComponent = value.icon;
              return (
                <ScrollReveal key={idx} direction="pop" delay={idx * 80} className={styles.statCard}>
                  <div className={styles.iconWrapper}>
                    <IconComponent size={22} />
                  </div>
                  <h3 className={styles.statLabel}>
                    {value.title}
                  </h3>
                  <p className={styles.statDesc}>
                    {value.description}
                  </p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: ECOSYSTEM CTA */}
      <section className={styles.mvSection} style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className={styles.container} style={{ maxWidth: '750px' }}>
          <ScrollReveal direction="up" delay={0}>
            <h2 className={styles.heading} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              Ready to Be Part of the <span className={styles.highlightText}>Ecosystem?</span>
            </h2>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={150}>
            <p className={styles.description} style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              Join India’s fast-growing student-to-founder movement.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginBottom: '2.5rem', fontSize: '1.05rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} /> Build skills.
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} /> Build networks.
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} /> Build proof.
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} /> Build your future.
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="pop" delay={450}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link href="/get-verified" className={styles.btnJoinNow} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '1rem 2rem' }}>
                Get Verified <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
