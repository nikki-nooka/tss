import React from 'react';
import styles from './page.module.css';
import { Target, Eye, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function About() {
  const eligibleMembers = [
    { name: 'Students', desc: 'Active college students seeking high-growth internship pipelines, workshops, and verified credentials.' },
    { name: 'Freshers', desc: 'Recent graduates entering the industry looking to connect with startups and escape the entry-level resume pile.' },
    { name: 'Professionals', desc: 'Industry engineers, designers, marketers, and operators seeking peer networks and career advancement.' },
    { name: 'Founders', desc: 'Startup builders seeking verified technical co-founders, early-stage talent, and peer networks.' },
    { name: 'Freelancers', desc: 'Independent contractors and agencies seeking verified client introductions and project opportunities.' },
    { name: 'Recruiters', desc: 'HR teams and hiring managers looking for high-quality, pre-screened, and authenticated candidate feeds.' },
    { name: 'Mentors', desc: 'Industry veterans and leaders looking to give back, advise startups, and guide the next generation.' }
  ];

  return (
    <div className={styles.aboutPage}>
      {/* Header Banner */}
      <section className={styles.aboutHeader}>
        <div className="container">
          <span className={styles.subTitle}>Know More About Us</span>
          <h1>Empowering High-Trust Networks</h1>
          <p className={styles.tagline}>
            The Student Spot (TSS) is not a generic job board. It is an exclusive, manual-verified professional ecosystem bridging talent and industry.
          </p>
        </div>
      </section>

      {/* What is TSS Section */}
      <section className={styles.introSection}>
        <div className={`${styles.introContainer} container`}>
          <div className={styles.introContent}>
            <h2>What is The Student Spot?</h2>
            <p>
              Founded on the principles of <strong>trust, transparency, and credential quality</strong>, The Student Spot (TSS) was created to solve the massive spam problem in modern job hunting and hiring.
            </p>
            <p>
              In a world flooded by automated resumes, AI-generated applications, and phantom job postings, TSS stands as a curated oasis. Every candidate profile is reviewed manually, every social profile is checked, and resumes are verified for truthfulness. 
            </p>
            <p>
              Once approved, members receive their unique <strong>TSS Member ID</strong>. Recruiters hire with confidence, founders team up with verified builders, and students get the fast-tracked career starts they deserve.
            </p>
          </div>
          <div className={styles.introVisual}>
            <div className={styles.shieldBox}>
              <ShieldCheck size={64} className={styles.shieldIcon} />
              <h3>Vetted Vouching</h3>
              <p>Manual validation of education status, links, and portfolio credibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.missionVision}>
        <div className={`${styles.mvContainer} container`}>
          <div className={`${styles.mvCard} premium-card`}>
            <div className={styles.iconBg}><Target size={28} /></div>
            <h2>Our Mission</h2>
            <p>
              To construct India's most credible, spam-free talent network. We seek to eradicate candidate misrepresentation and recruiting inefficiency by placing verified, pre-screened profiles directly in front of active decision-makers.
            </p>
          </div>

          <div className={`${styles.mvCard} premium-card`}>
            <div className={styles.iconBg}><Eye size={28} /></div>
            <h2>Our Vision</h2>
            <p>
              To establish a professional ecosystem where a member's credentials speak for themselves. We envision a future where having a verified TSS Member ID unlocks career opportunities globally, bypasses redundant screening tests, and ensures immediate, high-trust interviews.
            </p>
          </div>
        </div>
      </section>

      {/* Who Can Join Section */}
      <section className={styles.membersSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSub}>Eligibility Criteria</span>
            <h2>Who Can Join the TSS Network?</h2>
            <p>
              We welcome individuals at all stages of the professional ladder, provided they are committed to data integrity and verified growth.
            </p>
          </div>

          <div className={styles.membersGrid}>
            {eligibleMembers.map((member, index) => (
              <div key={index} className={`${styles.memberCard} premium-card`}>
                <div className={styles.memberCardHeader}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <h3>{member.name}</h3>
                </div>
                <p>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
