import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { 
  MessageSquare, 
  Send, 
  Globe 
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

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Social Links List matching the spec
  const socialLinks = {
    whatsappChannel: 'https://whatsapp.com/channel/0029Vb6ft6072WTxJ5eMKA2I',
    whatsappCommunity: 'https://chat.whatsapp.com/LxA5xaAdlKp3nvZmIGxLcp',
    linkedin: 'https://www.linkedin.com/company/thestudentspot/',
    instagram: 'https://www.instagram.com/the_studentspot',
    telegram: 'https://t.me/thestudentspot',
    youtube: 'https://youtube.com/@the.studentspot',
    twitter: 'https://x.com/the_studentspot'
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Col 1: Logo & Brand details */}
        <div className={styles.brandSection}>
          <div className={styles.logoContainer}>
            <img 
              src="/logo.png" 
              alt="TSS Logo" 
              className={styles.brandLogoImage} 
            />
            <div className={styles.logoTextContainer}>
              <span className={styles.logoText}>TSS ⚡</span>
              <span className={styles.logoSubtitle}>From Students to Founders Ecosystem</span>
            </div>
          </div>
          <p className={styles.brandDesc}>
            India's first verified student-to-founder network. 100+ campuses, monthly builds, and real job opportunities.
          </p>
          <div className={styles.socialRow}>
            <a href={socialLinks.whatsappChannel} target="_blank" rel="noopener noreferrer" className={styles.socialIconBtn} title="WhatsApp Channel">
              <MessageSquare size={16} />
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialIconBtn} title="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialIconBtn} title="Instagram">
              <InstagramIcon />
            </a>
            <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className={styles.socialIconBtn} title="Telegram">
              <Send size={16} />
            </a>
            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className={styles.socialIconBtn} title="YouTube">
              <YoutubeIcon />
            </a>
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialIconBtn} title="X (Twitter)">
              <Globe size={16} />
            </a>
          </div>
        </div>

        {/* Col 2: Navigate */}
        <div className={styles.linkGroup}>
          <h4 className={styles.groupTitle}>Navigate</h4>
          <div className={styles.linkList}>
            <Link href="/" className={styles.link}>Home</Link>
            <Link href="/about" className={styles.link}>About</Link>
            <Link href="/programs" className={styles.link}>Programs</Link>
            <Link href="/get-verified" className={styles.link}>Get Verified</Link>
            <Link href="/contact" className={styles.link}>Contact</Link>
          </div>
        </div>

        {/* Col 3: Programs */}
        <div className={styles.linkGroup}>
          <h4 className={styles.groupTitle}>Programs</h4>
          <div className={styles.linkList}>
            <Link href="/programs#100x-students" className={styles.link}>100x Students</Link>
            <Link href="/programs#buildx" className={styles.link}>BuildX Sandbox</Link>
            <Link href="/programs#resume-studio" className={styles.link}>Resume Studio</Link>
          </div>
        </div>

        {/* Col 4: Community */}
        <div className={styles.linkGroup}>
          <h4 className={styles.groupTitle}>Community</h4>
          <div className={styles.linkList}>
            <a href={socialLinks.whatsappChannel} target="_blank" rel="noopener noreferrer" className={styles.link}>WhatsApp Channel</a>
            <a href={socialLinks.whatsappCommunity} target="_blank" rel="noopener noreferrer" className={styles.link}>WhatsApp Community</a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>LinkedIn</a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.link}>Instagram</a>
            <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className={styles.link}>Telegram</a>
            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className={styles.link}>YouTube</a>
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.link}>X / Twitter</a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <span className={styles.copyright}>
            © {currentYear} The Student Spot. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
