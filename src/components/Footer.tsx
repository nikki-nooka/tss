import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        {/* Brand Section */}
        <div className={styles.brandSection}>
          <Link href="/" className={styles.logo}>
            <img src="/logo.png" alt="TSS Logo" style={{ height: '32px', width: '32px', objectFit: 'contain', borderRadius: '4px' }} />
            <span className={styles.logoText}>THE STUDENT SPOT</span>
          </Link>
          <p className={styles.brandDesc}>
            India's premier verified network linking students, freshers, founders, and recruiters for high-trust professional growth.
          </p>
        </div>

        {/* Links Grid */}
        <div className={styles.linksGrid}>
          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Platform</h4>
            <Link href="/" className={styles.link}>Home</Link>
            <Link href="/about" className={styles.link}>About Network</Link>
            <Link href="/register" className={styles.link}>Register</Link>
            <Link href="/status" className={styles.link}>Status Check</Link>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Support</h4>
            <Link href="/contact" className={styles.link}>Contact Us</Link>
            <Link href="/contact" className={styles.link}>Submit Feedback</Link>
            <Link href="/admin" className={styles.link}>Admin Portal</Link>
          </div>

          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Legal</h4>
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
