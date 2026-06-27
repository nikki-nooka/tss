'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { ShieldCheck, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Helper to determine if link is active
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'BuildX', path: '/buildx' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Resume Studio', path: '/resume-studio' },
    { name: 'Contact', path: '/contact' },
    { name: 'Register', path: '/register' }
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <div className={`${styles.navContainer} container`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <img src="/logo.png" alt="TSS Logo" style={{ height: '36px', width: '36px', objectFit: 'contain', borderRadius: '4px' }} />
          <span className={styles.logoText}>THE STUDENT SPOT</span>
          <span className={styles.logoBadge}>NETWORK</span>
        </Link>

        {/* Desktop Navigation */}
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
          </nav>
        </div>
      )}
    </header>
  );
};
