'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { ShieldCheck, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('tss_candidate_session');
      setIsLoggedIn(!!session);
    }
  }, [pathname]);

  // Helper to determine if link is active
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Contact', path: '/contact' }
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <div className={`${styles.navContainer} container`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <img src="/logo-old.png" alt="TSS Logo" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
          <span className={styles.logoText} style={{ color: '#0f172a', fontWeight: 700, fontSize: '1.45rem', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
            The Student Spot
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNavWrapper}>
          <nav className={styles.desktopNav}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`${styles.navLink} ${isActive(link.path) ? styles.activeLink : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className={styles.desktopNav} style={{ gap: '1.25rem' }}>
            <Link href="/dashboard" className={styles.navLink} style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {isLoggedIn ? 'Dashboard' : 'Sign In'}
            </Link>
            <Link href="/get-verified" className={styles.getVerifiedBtn}>
              Get Verified
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className={styles.mobileNavOverlay} onClick={closeMenu}>
          <nav className={styles.mobileNav} onClick={(e) => e.stopPropagation()}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`${styles.mobileNavLink} ${isActive(link.path) ? styles.activeMobileLink : ''}`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
            
            <Link 
              href="/dashboard" 
              className={styles.mobileNavLink}
              style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.5rem' }}
              onClick={closeMenu}
            >
              {isLoggedIn ? 'Dashboard' : 'Sign In'}
            </Link>
            <Link 
              href="/get-verified" 
              className={styles.getVerifiedBtn} 
              style={{ marginTop: '1rem', justifyContent: 'center' }}
              onClick={closeMenu}
            >
              Get Verified
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
