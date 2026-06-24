'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function Contact() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    captchaInput: ''
  });
  
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate simple security math captcha on mount
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({
      num1,
      num2,
      answer: num1 + num2
    });
    setFormData(prev => ({ ...prev, captchaInput: '' }));
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation
    if (formData.name.trim().length < 3) {
      toast.error('Name must be at least 3 characters');
      return;
    }
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (formData.phone.replace(/\D/g, '').length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }
    if (formData.message.trim().length < 10) {
      toast.error('Message must be at least 10 characters long');
      return;
    }

    // 2. Math Captcha Security check
    if (parseInt(formData.captchaInput, 10) !== captcha.answer) {
      toast.error('Security verification failed. Please check your math answer.');
      generateCaptcha();
      return;
    }

    // 3. API Submission
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Message submitted successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          captchaInput: ''
        });
        generateCaptcha();
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server connection failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      {/* Header */}
      <section className={styles.contactHeader}>
        <div className="container">
          <span className={styles.subTitle}>Contact Support</span>
          <h1>Get In Touch With TSS</h1>
          <p className={styles.tagline}>
            Have questions about the network, verification processes, or recruiting partnerships? Send us a message and our team will get back to you.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className={styles.contactContent}>
        <div className={`${styles.contactContainer} container`}>
          {/* Info Card */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <h2>Contact Information</h2>
              <p className={styles.infoDesc}>
                Reach out to us directly or fill out the form. All messages are securely routed to our HR and admin queues.
              </p>

              <div className={styles.infoLines}>
                <div className={styles.infoLine}>
                  <Mail className={styles.infoIcon} size={20} />
                  <div>
                    <h4>Email Address</h4>
                    <p>support@thestudentspot.com</p>
                  </div>
                </div>

                <div className={styles.infoLine}>
                  <Phone className={styles.infoIcon} size={20} />
                  <div>
                    <h4>Helpline & Collaboration</h4>
                    <p>+91 95819 29676 (10 AM - 6 PM)</p>
                  </div>
                </div>

                <div className={styles.infoLine}>
                  <MapPin className={styles.infoIcon} size={20} />
                  <div>
                    <h4>Office</h4>
                    <p>Vetted Hub, T-Hub Phase 2, Madhapur, Hyderabad, India</p>
                  </div>
                </div>
              </div>

              <div className={styles.trustBanner}>
                <HelpCircle size={18} className={styles.trustIcon} />
                <span>Verification issues? Make sure your LinkedIn profile matches your uploaded resume before registering.</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className={styles.formCol}>
            <div className={`${styles.formCard} premium-card`}>
              <h2>Send a Message</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="form-input"
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we assist you?"
                    rows={4}
                    className="form-textarea"
                    required
                  />
                </div>

                {/* Math Captcha Security Protection */}
                <div className={styles.captchaGroup}>
                  <label htmlFor="captchaInput" className="form-label">
                    Security Verification <span className="required">*</span>
                  </label>
                  <div className={styles.captchaBox}>
                    <span className={styles.captchaMath}>
                      Solve: {captcha.num1} + {captcha.num2} =
                    </span>
                    <input
                      type="number"
                      id="captchaInput"
                      name="captchaInput"
                      value={formData.captchaInput}
                      onChange={handleChange}
                      placeholder="?"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'} <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
