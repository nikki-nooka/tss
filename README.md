# The Student Spot (TSS) — Phase 1 Verified Talent Network

A modern, mobile-first, high-trust network connecting verified Students, Freshers, Professionals, Founders, Freelancers, Recruiters, and Mentors. Built with a focus on credential truthfulness, security, and simplicity.

---

## 🚀 Key Features

### 1. Candidate Portal
* **Interactive Landing Page**: Sleek dark-mode header, dynamic counter metrics, "Why Join" card layout, and an onboarding roadmap.
* **Vetted Community Unlock**: Official communication groups (WhatsApp, LinkedIn, Instagram) are locked by default and automatically unlock once a candidate enters their verified TSS Member ID.
* **Multi-Step Registration**: A secure 5-step stepper form collecting personal, educational, professional, and social credentials:
  * **OTP Verification**: Indian format phone and email fields validated via inline Mock OTPs (displayed on-screen for testing).
  * **File Scan**: Rejects non-PDF resume uploads and enforces a strict 5MB size limit.
  * **Duplicate Prevention**: Prevents registrations with duplicate email addresses or mobile numbers.
* **Status Vetting Lookup**: Candidates can search by email or mobile to track validation queues (**Pending** ➔ **Under Review** ➔ **Verified** / **Rejected**).
* **Virtual Member ID Card**: Verified candidates generate a print-optimized virtual ID card (format: `TSSYYMMDDXXX`) that can be printed or saved locally.

### 2. Admin & HR Dashboard
* **Metrics Board**: Total registrations, pending reviews, verified members, rejections, daily processing numbers, and a 7-day registration timeline graph.
* **Vetting Ledger**: Candidate list supporting keyword searches and filters (by status, college, experience, role, skills). Supports exporting candidate records to an Excel-ready **CSV spreadsheet**.
* **Administrative Control**: HR admins can assess profiles, review resumes securely, update administrative notes, approve candidates (which generates their Member ID), or reject profiles.
* **Recruiter Referral System**: Forward candidate credentials and resume parameters directly to recruiter email channels and track feedback/status histories.
* **Audit Ledger**: Logs all administrative updates, approvals, rejections, and settings modifications.
* **Site Controls**: Edit public homepage stats counters directly from the admin panel.

---

## 🛠️ Technology Stack
* **Frontend/Backend**: Next.js 16 (App Router) & TypeScript
* **Styling**: Vanilla CSS Modules (No Tailwind)
* **Database**: Supabase PostgreSQL Client
* **Icons**: Lucide React

---

## 📦 Directory Structure
```
/
├── supabase_schema.sql      # Database initialization DDL script
├── public/                  # Static assets and images
├── uploads/resumes/         # Secure folder for uploaded resumes
├── src/
│   ├── app/                 # Next.js App Router Pages & API routes
│   │   ├── page.tsx         # Homepage
│   │   ├── about/           # About Network page
│   │   ├── contact/         # Spam-protected contact page
│   │   ├── register/        # Multi-step registration page
│   │   ├── status/          # Candidate vetting check page
│   │   ├── admin/           # Vetting dashboard & logins
│   │   └── api/             # Backend API router endpoints
│   ├── components/          # Global UI elements (Navbar, Footer, Toasts)
│   ├── lib/
│   │   ├── db.ts            # Supabase database client and CRUD helpers
│   │   └── auth.ts          # Session validator and role checking
│   └── styles/
│       └── globals.css      # Custom global CSS variables
```

---

## ⚙️ Local Setup Instructions

### 1. Database Configuration
1. Log in to your **[Supabase Dashboard](https://supabase.com)**.
2. Open your project's **SQL Editor**.
3. Copy the entire contents of the `supabase_schema.sql` file in this repository, paste it into the editor, and click **Run**. This will create the required tables and disable Row-Level Security (RLS) for Phase 1.

### 2. Environment Setup
Create a `.env.local` file in the root of the project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-anon-key
```

### 3. Launch Development Server
Install dependencies and run the server locally:
```bash
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 HR Admin Credentials (Predefined)
* **Administrator Role**: `admin@thestudentspot.com` | Password: `TssAdmin2026!`
* **HR Representative Role**: `hr@thestudentspot.com` | Password: `TssHr2026!`

---

## 🚀 Vercel Deployment Instructions
1. Import this repository on **Vercel**.
2. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` variables in Vercel's **Environment Variables** settings.
3. Click **Deploy**.
