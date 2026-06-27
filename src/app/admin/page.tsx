'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function AdminLogin() {
  const toast = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    // We can do a quick check to see if the session cookie exists, 
    // or call the dashboard stats API. If it works, we redirect.
    fetch('/api/admin/stats')
      .then((res) => {
        if (res.ok) {
          router.push('/admin/dashboard');
        }
      })
      .catch((err) => console.log('Not logged in.'));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Logged in as ${data.user.role}! Redirecting...`);
        router.push('/admin/dashboard');
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <div className={styles.logoHeader}>
          <img src="/logo.png" alt="TSS Logo" style={{ height: '64px', width: '64px', objectFit: 'contain', borderRadius: '8px', marginBottom: '1rem' }} />
          <h2>TSS Admin Portal</h2>
          <p>Phase 1 Verification & Candidate Management</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={18} />
              <input
                type="email"
                placeholder="contact.thestudentspot@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Security Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.roleTip}>
            <span>Available Roles for evaluation:</span>
            <ul>
              <li><strong>Admin:</strong> contact.thestudentspot@gmail.com / TssAdmin2026!</li>
              <li><strong>HR:</strong> hr@thestudentspot.com / TssHr2026!</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '1.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 className={styles.spinner} size={16} /> Authenticating...
              </>
            ) : (
              'Secure Log In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
