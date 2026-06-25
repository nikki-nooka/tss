import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      {/* Background decorations for peaceful gradient */}
      <div className={styles.bgDecoration1}></div>
      <div className={styles.bgDecoration2}></div>
      <div className={styles.topDividerLine}></div>
      
      <div className={`${styles.container} container`}>
        {/* Brand Section */}
        <div className={styles.brandSection}>
          <div className={styles.logoContainer}>
            <img 
              src="/logo.png" 
              alt="TSS Logo" 
              className={styles.brandLogoImage} 
            />
            <div className={styles.logoTextContainer}>
              <span className={styles.logoText}>THE STUDENT SPOT</span>
              <span className={styles.logoSubtitle}>From Student To Founder: One National Ecosystem</span>
            </div>
          </div>
          
          <p className={styles.brandDesc}>
            India's premier verified network linking students, freshers, founders, and recruiters for high-trust professional growth.
          </p>
        </div>

        {/* Links Grid */}
        <div className={styles.linkGroup}>
          <h4 className={styles.groupTitle}>
            <span className={styles.titleBullet}>•</span> Platform
          </h4>
          <div className={styles.linkList}>
            <Link href="/" className={styles.link}>Home</Link>
            <Link href="/about" className={styles.link}>About Network</Link>
            <Link href="/register" className={styles.link}>Register</Link>
            <Link href="/status" className={styles.link}>Status Check</Link>
          </div>
        </div>

        <div className={styles.linkGroup}>
          <h4 className={styles.groupTitle}>
            <span className={styles.titleBullet}>•</span> Support
          </h4>
          <div className={styles.linkList}>
            <Link href="/contact" className={styles.link}>Contact Us</Link>
            <Link href="/contact" className={styles.link}>Submit Feedback</Link>
          </div>
        </div>

        <div className={styles.linkGroup}>
          <h4 className={styles.groupTitle}>
            <span className={styles.titleBullet}>•</span> Legal
          </h4>
          <div className={styles.linkList}>
            <Link href="#" className={styles.link}>Privacy Policy</Link>
            <Link href="#" className={styles.link}>Terms & Conditions</Link>
            <Link href="#" className={styles.link}>Disclaimer</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={`${styles.bottomContainer} container`}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} The Student Spot (TSS). All rights reserved.
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>Phase 1 Platform</span>
            <span className={styles.badge}>Secure Access</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
