import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Send 
} from 'lucide-react';

// Custom inline SVG icons for brand profiles to prevent version incompatibility
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    width="16" 
    height="16" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    width="16" 
    height="16" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    width="16" 
    height="16" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    width="16" 
    height="16" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
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
              <span className={styles.logoText}>The Student Spot</span>
              <span className={styles.logoSubtitle}>From Student To Founder: One National Ecosystem</span>
            </div>
          </div>
          
          <p className={styles.brandDesc}>
            Connecting students, colleges, companies, startups, recruiters, and incubators to create real career and startup outcomes across India.
          </p>

          <div>
            <h4 className={styles.getInTouchTitle}>Get In Touch</h4>
            <div className={styles.contactLine}>
              <Mail className={styles.contactIcon} size={16} />
              <a href="mailto:contact.thestudentspot@gmail.com" className={styles.contactLink}>
                contact.thestudentspot@gmail.com
              </a>
            </div>
            <div className={styles.contactLine}>
              <Phone className={styles.contactIcon} size={16} />
              <a href="tel:+919581929676" className={styles.contactLink}>
                +91 9581929676
              </a>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className={styles.linkGroup}>
          <h4 className={styles.groupTitle}>
            <span className={styles.titleBullet}>•</span> Platform
          </h4>
          <div className={styles.linkList}>
            <Link href="/register" className={styles.link}>For Students</Link>
            <Link href="/register" className={styles.link}>For Colleges</Link>
            <Link href="/register" className={styles.link}>For Companies, Recruiters & Startups</Link>
            <Link href="/register" className={styles.link}>For Coaching Institutes</Link>
            <Link href="/register" className={styles.link}>For Incubators</Link>
            <Link href="/register" className={styles.link}>For Mentors & Speakers</Link>
          </div>
        </div>

        <div className={styles.linkGroup}>
          <h4 className={styles.groupTitle}>
            <span className={styles.titleBullet}>•</span> Company
          </h4>
          <div className={styles.linkList}>
            <Link href="/about" className={styles.link}>About Us</Link>
            <Link href="/contact" className={styles.link}>Contact Us</Link>
            <Link href="#" className={styles.link}>Privacy Policy</Link>
            <Link href="#" className={styles.link}>Terms of Service</Link>
          </div>
        </div>

        <div className={styles.linkGroup}>
          <h4 className={styles.groupTitle}>
            <span className={styles.titleBullet}>•</span> Follow Us
          </h4>
          <div className={styles.linkList}>
            <a 
              href="https://www.whatsapp.com/channel/0029Vb6ft6072WTxJ5eMKA2I" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.link}
            >
              <MessageSquare className={styles.socialIcon} size={16} /> WhatsApp Channel
            </a>
            <a 
              href="https://www.instagram.com/the_studentspot" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.link}
            >
              <InstagramIcon className={styles.socialIcon} /> Instagram
            </a>
            <a 
              href="https://www.linkedin.com/company/thestudentspot/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.link}
            >
              <LinkedInIcon className={styles.socialIcon} /> LinkedIn Page
            </a>
            <a 
              href="https://x.com/the_studentspot" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.link}
            >
              <TwitterIcon className={styles.socialIcon} /> X (Twitter)
            </a>
            <a href="#" className={styles.link}>
              <YouTubeIcon className={styles.socialIcon} /> YouTube
            </a>
            <a href="#" className={styles.link}>
              <Send className={styles.socialIcon} size={16} /> Telegram
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={`${styles.bottomContainer} container`}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} The Student Spot (TSS). All rights reserved.
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>One National Ecosystem</span>
            <span className={styles.badge}>Phase 1 Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
