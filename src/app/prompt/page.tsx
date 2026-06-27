'use client';

import { useState } from "react";

// ── ALL PROMPT SECTIONS ────────────────────────────────────────
const DESIGN = `## DESIGN SYSTEM & GLOBAL RULES

Build the entire website using this exact design system. Every page inherits these rules.

### Visual Identity
This website is for THE STUDENT SPOT (TSS) — India's verified student-to-founder ecosystem.
Tone: Dark, premium, founder-focused. Think: the aesthetic confidence of a Y Combinator landing page mixed with the warmth and relatability of an Indian startup that genuinely cares about students.
NOT generic edtech. NOT bright SaaS blue. NOT motivational-poster yellow.
This is a platform for ambitious people who are tired of being spoken down to.

### Color Palette (exact hex values — use nothing outside this palette)
  --bg-void:       #050810    /* page background */
  --bg-card:       #0D1120    /* card backgrounds */
  --bg-card-2:     #111827    /* secondary card / input bg */
  --border:        #1B2240    /* all card and input borders */
  --border-glow:   #6D28D945  /* glow-state borders */
  --primary:       #6D28D9    /* deep violet — TSS brand */
  --primary-mid:   #7C3AED
  --primary-light: #8B5CF6
  --primary-pale:  #A78BFA
  --accent:        #F59E0B    /* amber — warmth, India, trust */
  --accent-light:  #FCD34D
  --green:         #059669    /* placement, verified, success */
  --green-light:   #10B981
  --red:           #DC2626    /* errors only */
  --text-primary:  #E8ECFF    /* main body text */
  --text-secondary:#8895BB    /* subheadlines, captions */
  --text-muted:    #3D4A6E    /* placeholder, label text */

### Gradients
  Hero background:   linear-gradient(150deg, #08061A 0%, #050E20 55%, #0A0620 100%)
  CTA primary:       linear-gradient(110deg, #6D28D9, #8B5CF6)
  CTA accent:        linear-gradient(110deg, #F59E0B, #FCD34D)
  Headline text:     linear-gradient(100deg, #C4B5FD 0%, #F59E0B 100%)
  Card border glow:  linear-gradient(135deg, #6D28D940, #F59E0B30)
  Section dividers:  linear-gradient(90deg, transparent, #6D28D960, transparent)

### Typography (import both from Google Fonts)
  Display + Headings: "Syne" — weights 700, 800
  Body + UI:          "DM Sans" — weights 400, 500, 600
  Monospace (IDs):    "Space Mono" — weight 400, 700

  Type scale:
  --text-xs:   0.72rem / 1.4  (labels, badges)
  --text-sm:   0.82rem / 1.5  (captions, footnotes)
  --text-base: 0.95rem / 1.65 (body paragraphs)
  --text-lg:   1.15rem / 1.5  (card headings, intros)
  --text-xl:   1.4rem  / 1.3  (section headings)
  --text-2xl:  1.8rem  / 1.2  (page headings)
  --text-hero: clamp(2.2rem, 6vw, 4rem) / 1.05 (hero headlines only)

### Layout
  Max content width: 1160px, centered, padding 0 24px
  Section vertical padding: 96px desktop / 56px mobile
  Card border-radius: 14px
  Button border-radius: 10px
  Pill/badge border-radius: 999px
  Standard card padding: 28px
  Grid gap: 24px

### Signature Visual Element: THE MEMBER ID CARD
  This is the single most important visual on the entire website.
  Build a stylized TSS Member ID card that appears in the hero section.
  Style it like a dark glass physical card:
    - Dimensions: ~340px × 200px (portrait card on mobile, landscape on desktop)
    - Background: linear-gradient(135deg, #0D1120, #14183A)
    - Border: 1px solid rgba(109,40,217,0.4)
    - Box shadow: 0 0 40px rgba(109,40,217,0.3), 0 0 80px rgba(245,158,11,0.08)
    - Animated border: slow rotating gradient border (3-second loop)
    - Contents of the card:
        Top-left: "TSS ⚡" in Space Mono bold, #8B5CF6, 14px
        Top-right: "VERIFIED" badge — small, green, pill shape
        Center-large: "TSS-ST-260618001" in Space Mono 700, gradient text (#C4B5FD to #F59E0B), 22px
        Below ID: "The Student Spot" in DM Sans 500, --text-secondary, 11px
        Bottom-left: "Rajkamal Panthagani" in DM Sans 600, --text-primary, 13px
        Bottom-left below name: "Student · Software" in DM Sans 400, --text-secondary, 11px
        Bottom-right: TSS logo mark or ⚡ symbol in amber
  Animation: subtle floating (y: ±10px, 4-second ease-in-out loop), slight rotation (±1.5deg)
  On mobile: card scales to fit screen width, stays centered above the text

### Effects & Micro-interactions
  Scroll reveal: fade + translateY(20px) → 0 on all section entries, 0.4s ease
  Counter animations: count up from 0 on stats when scrolled into view (1.2s duration)
  Card hover: translateY(-4px) + box-shadow increase + border glow intensifies (0.25s ease)
  Button hover: scale(1.02) + brightness(1.1) (0.2s ease)
  Button active: scale(0.98) (0.1s ease)
  All input focus: border-color → --primary-light + box-shadow: 0 0 0 3px rgba(139,92,246,0.2)

### Navigation (sticky, appears on all pages)
  Default state: transparent background, blur(0)
  Scrolled (>60px): background: rgba(5,8,16,0.9), backdrop-filter: blur(20px), border-bottom: 1px solid --border
  Left: "TSS ⚡" logo in Syne 800, gradient text. Full text "The Student Spot" in DM Sans 400 next to it.
  Right links: Home · About · Programs · Contact · [Get Verified button]
  "Get Verified" button: accent gradient background, DM Sans 600, 14px, no outline style
  Mobile: hamburger icon → full-screen overlay nav, dark background, large links centered

### Footer (all pages)
  Background: #030509
  Top border: 1px solid --border
  Padding: 64px 24px 32px
  Four-column layout (collapses to 2 on tablet, 1 on mobile):
    Col 1: Logo, tagline "From Student to Founder", short description, social icon row
    Col 2: Navigate — Home, About, Programs, Get Verified, Contact
    Col 3: Programs — 100x Students, BuildX, Resume Studio
    Col 4: Community — WhatsApp Channel, LinkedIn, Instagram, Telegram, YouTube, X (Twitter)
  Bottom bar: "© 2026 The Student Spot" left, "Never pay to get a job. Genuine jobs are always free." right in amber small text
  Social links exact URLs:
    WhatsApp Channel: https://whatsapp.com/channel/0029Vb6ft6072WTxJ5eMKA2I
    WhatsApp Community: https://chat.whatsapp.com/LxA5xaAdlKp3nvZmIGxLcp
    LinkedIn: https://www.linkedin.com/company/thestudentspot/
    Instagram: https://www.instagram.com/the_studentspot
    Telegram: https://t.me/thestudentspot
    YouTube: https://youtube.com/@the.studentspot
    X/Twitter: https://x.com/the_studentspot`;

const HOME = `## PAGE 1: HOME  (route: /)

### 1A. HERO SECTION
Layout: Two-column on desktop (text left 55%, card right 45%), stacked on mobile (card first, text below)
Background: Hero gradient + subtle animated mesh/dot pattern (very low opacity, 3-4% grain)

Left column — text:
  Eyebrow badge: "⚡ 20,000+ Verified Members" — pill shape, amber background at 15% opacity, amber text, amber border
  
  Main headline (hero size, Syne 800, gradient text):
  "From Student
  to Founder —
  and Everything
  In Between."
  
  Subheadline (DM Sans 500, --text-secondary, text-lg):
  "India's first verified student-to-founder network.
  100+ campuses. Real jobs. Monthly builds.
  One Member ID that opens it all."
  
  Two CTA buttons side by side (stacked on mobile):
    Primary: "Get Your Member ID →" — accent gradient, Syne 700, padding 14px 28px
    Secondary: "Explore Programs" — transparent, border 1px solid --primary-light, --primary-pale text

  Below buttons — three trust signals inline:
    ✓ Free to join  ·  ✓ Verified in 24–48 hours  ·  ✓ Never pay to get a job
    (DM Sans 400, --text-muted, text-sm)

Right column — THE MEMBER ID CARD (see design system for full spec)
Beneath card, small centered text in Space Mono, --text-muted, 11px:
  "Your unique, permanent TSS identity"

### 1B. STATS BAR
Full-width band, bg: --bg-card, border-top and border-bottom 1px solid --border
Four stats, equal columns, center-aligned, counter animation on scroll:
  "20,000+"   "Community Members"
  "100+"      "Campuses Reached"
  "30+"       "Placements in 6 Months"
  "100+"      "Recruiter Connections"
Stats in Syne 800, text-2xl, gradient text
Labels in DM Sans 400, text-sm, --text-secondary

### 1C. WHAT IS TSS SECTION
Section label (eyebrow): "WHO WE ARE" — text-xs, Syne 700, letter-spacing 0.12em, --primary-pale
Heading (Syne 800, text-2xl, --text-primary):
  "Not Another Student Group.
  A System That Actually Moves You Forward."

Body (DM Sans 400, text-base, --text-secondary, max-width 620px):
  "We're not a LinkedIn group. We're not another student club. We don't host webinars nobody remembers or share job listings that expired last month.

  We built something different: a verified network where students, job-seekers, builders, and early-stage founders get real outcomes — not certificates.

  It started in 2024 as a single WhatsApp channel in Karimnagar, Telangana. One rule: only real, verified job opportunities. No spam. No fake listings. No company asking you to pay before your internship starts.

  The rule hasn't changed. And it's why 20,000 people chose to be here."

Layout: text left, right side shows a visual — stylized India map with dots spreading from Telangana outward to 100+ campuses, amber dots, subtle animation (dots appearing one by one in loop)

### 1D. PROGRAMS SECTION
Section label: "WHAT WE OFFER"
Heading (Syne 800, text-2xl):
  "Three Programs.
  One Direction."
Subheading (DM Sans 400, --text-secondary):
  "Whether you want to get hired, build something real, or craft the resume that actually gets read — there's a TSS program for exactly where you are."

Three cards, equal width (stacked on mobile):

  Card 1 — 100x Students:
    Top badge: "PREMIUM" pill in amber
    Icon area: ⭐ in amber, 32px
    Title (Syne 700, text-xl): "100x Students"
    Body (DM Sans 400, text-base, --text-secondary):
      "Live expert sessions. Resume reviews from people who actually hire. Job referrals before they're public. For students who aren't waiting for placement season."
    Bottom CTA: "Learn More →" in --primary-pale, no button style, hover underline
    Card left-border: 3px solid --accent
    On hover: amber glow at card border

  Card 2 — BuildX:
    Top badge: "MONTHLY · JULY LAUNCH" pill in primary
    Icon area: 🔧 icon in primary, 32px
    Title (Syne 700, text-xl): "BuildX"
    Body (DM Sans 400, text-base, --text-secondary):
      "Every month, your community posts real problems. We pick 3. You get 30 days to build the solution. Mentors check in weekly. Demo Day at month-end. We never ask for equity."
    Bottom CTA: "Learn More →" in --primary-pale
    Card left-border: 3px solid --primary-mid
    On hover: purple glow at card border

  Card 3 — Resume Studio:
    Top badge: "FREE" pill in green
    Icon area: 📄 icon in green, 32px
    Title (Syne 700, text-xl): "Resume Studio"
    Body (DM Sans 400, text-base, --text-secondary):
      "FAANG-style resumes that actually get shortlisted. Fill in your details. We format it properly. Download as PDF. Your TSS Member ID goes on every resume."
    Bottom CTA: "Learn More →" in --primary-pale
    Card left-border: 3px solid --green
    On hover: green glow at card border

### 1E. COMMUNITY PROOF SECTION
Section label: "THE NUMBERS"
Heading: "A Community That Ships, Not Just Scrolls."
Body: "Every number here is a real person — a student, a builder, a recruiter, a founder — who chose this instead of scrolling past it."

Platform grid (7 cards, 4 on first row + 3 on second, or equal responsive grid):
  WhatsApp Community — 2,000+ Members — bg: #075E5420
  WhatsApp Channel — 5,800+ Followers — bg: #25D36620
  LinkedIn — 4,200+ Followers — bg: #0A66C220
  Instagram — 880+ Followers — bg: #E1306C20
  Telegram — 200+ Members — bg: #2CA5E020
  YouTube — 50+ Subscribers — bg: #FF000020
  X / Twitter — 50+ Followers — bg: #FFFFFF10

Each card: platform icon, number in Syne 700 text-xl platform-color, label in DM Sans text-sm --text-secondary

Below grid, center-aligned highlighted quote (large, italic, DM Sans):
  "Most communities measure followers. We measure verified members. Those are very different things."
  Attribution: "— Rajkamal Panthagani, Founder"

### 1F. VERIFICATION CTA SECTION
Full-width section, bg: --bg-card, border-top border-bottom 1px solid --border
Show the Member ID card again (smaller, centered) with a "scan" animation
Heading (Syne 800, text-2xl, gradient text, centered): "Everything in TSS Starts With Your Member ID."
Body (DM Sans 400, --text-secondary, centered, max-width 560px):
  "When you verify with TSS, you don't just get a WhatsApp link. You get a permanent, tracked identity in the network — the thing that makes you real here.

  Your Member ID unlocks: the Talent Network, Resume Studio, BuildX participation, and every TSS opportunity that doesn't get posted publicly."

Large Member ID example centered:
  "TSS-ST-260618001" in Space Mono 700, gradient text, 28px

Large CTA button centered (accent gradient, full padding):
  "Get Verified Free — Takes 2 Minutes →"

Small text below: "All profiles reviewed manually within 24–48 hours. No payment required. Ever."

### 1G. FINAL SECTION
Background: subtle purple radial glow at center on dark bg
Heading (Syne 800, text-2xl): "Stop Waiting. Start Building."
Body: "20,000+ students already inside. Your Member ID is waiting."
Two buttons: "Get Verified" (accent) | "Contact Us" (outline)`;

const ABOUT = `## PAGE 2: ABOUT  (route: /about)

### 2A. HERO
Background: same hero gradient
Section label: "OUR STORY"
Heading (Syne 800, text-hero, --text-primary):
  "Built Because the System Wasn't Working."
Body (DM Sans 400, text-lg, --text-secondary, max-width 680px):
  "Indian students are brilliant. The system built around them, less so. College placements are a lottery. LinkedIn is too noisy. Job portals go stale. And the word 'networking' sounds like something that happens in hotel lobbies between people who already have jobs.

  We got tired of watching talented students get left behind by a system that wasn't designed for them. So we built a better one."

### 2B. ORIGIN STORY
Two-column layout: text left, visual right (timeline or illustration)
Heading: "How TSS Started"
Body:
  "The Student Spot started in 2024 as one WhatsApp channel in Karimnagar, Telangana.

  One rule from day one: only real, verified job opportunities. No spam. No fake listings. No company asking you to pay for a 'training certificate' before your internship.

  It grew because it was honest. Students shared it because it actually worked. Within months, one channel became a movement — 100+ campuses, thousands of students, and a growing network of 100+ HR professionals and recruiters who began to trust the quality of candidates coming from TSS.

  We've never run paid ads. Every member is organic. Every recruiter relationship is earned. And the number we care most about isn't followers — it's verified members, because that's who actually shows up."

Right side visual: vertical timeline with 3 milestones:
  2024 — "One WhatsApp channel. One rule. Karimnagar, Telangana."
  2025 — "10,000 members. 50+ campuses. First Talent Network placements."
  2026 — "20,000+ members. 100+ campuses. TSS ID system. Verified infrastructure."
Timeline style: vertical purple line with amber dots at milestones

### 2C. MISSION & VISION
Two cards side by side (stacked on mobile):

  Mission card (left border --primary-mid):
    Label: "MISSION"
    Heading: "What We're Here to Do"
    Body: "To build India's most trusted student-to-founder ecosystem — where every student gets verified, every builder gets recognised, and every founder gets connected."

  Vision card (left border --accent):
    Label: "VISION"
    Heading: "Where We're Going"
    Body: "A future where where you studied matters less than what you built, who you know, and how you show up. TSS is the infrastructure for that future — starting in Telangana, scaling across India."

### 2D. WHAT TSS IS AND ISN'T
Heading: "What TSS Is. And What It Isn't."
Two columns side by side:

Left column — What it IS (green checkmark icons):
  ✓ A verified network where every person has a real, unique Member ID
  ✓ A talent platform actively used by 100+ recruiters to source candidates
  ✓ A monthly builder program where real problems become real products
  ✓ A career ecosystem with mentors, experts, and practitioners
  ✓ Permanently free to join

Right column — What it IS NOT (amber X icons):
  ✗ A job board where listings expire and nobody responds
  ✗ An edtech platform selling courses you'll finish 20% of
  ✗ A community that asks you to pay to apply for an internship
  ✗ A platform that takes equity from what you build
  ✗ A WhatsApp group where "opportunities" are MLM schemes

Full-width highlighted quote below:
  "Genuine jobs are always free. That rule hasn't changed since Day 1 — and it never will."
  Style: large italic DM Sans, gradient left-border, dark card bg

### 2E. FOUNDER SECTION
Section label: "THE TEAM"
Heading: "The People Building TSS"

Featured founder card (larger, distinguished):
  Photo placeholder: stylized avatar or initials "RP" in purple circle
  Name (Syne 700, text-xl): "Rajkamal Panthagani"
  Role (DM Sans 500, --primary-pale): "Founder & CEO"
  Body (DM Sans 400, text-base, --text-secondary):
    "Former Accounts Manager at Way2News. Mentor at Wadhwani Foundation. Started TSS in Karimnagar in 2024 with a WhatsApp channel and a refusal to accept that talented students don't get the opportunities they deserve.

    Building this full-time."
  Links: LinkedIn icon → linkedin.com/in/rajkamalprls | Instagram → instagram.com/rajkamalpanthagani

Three team member cards (standard size):
  Card 1:
    Name: "Prathima Panthagani"
    Role: "Co-Operations Lead & Community Builder"
    Body: "Keeps the community running with the kind of consistent care that numbers rarely capture."

  Card 2 & 3: "You?" cards
    Title: "This seat is open."
    Body: "We're building the team that builds the future of TSS. If this resonates — apply below."
    CTA button: "Apply for Core Squad" → https://forms.gle/DyfMSzGJdQMVBbqRA

### 2F. STATS (context-rich version)
Heading: "The Numbers That Matter"
Five stat cards in a grid:
  "20,000+"  "Community members" "Across 7 platforms in 2 years of building"
  "100+"     "Campuses"          "Organic. No paid campaigns. No ads."
  "30+"      "Placements"        "In the last 6 months via the Talent Network"
  "100+"     "Recruiter network" "HR professionals who actively source from TSS"
  "₹0"       "Charged to apply"  "For any job or internship. Always. Non-negotiable."

Each card: big number in Syne 800 gradient text, label below in DM Sans 600, description below that in DM Sans 400 --text-muted`;

const PROGRAMS = `## PAGE 3: PROGRAMS  (route: /programs)

### 3A. PAGE HEADER
Label: "WHAT WE OFFER"
Heading (Syne 800, text-hero): "Three Programs. One Direction."
Body: "Whether you're figuring out your career, building your first product, or upgrading your resume — TSS has a program built for exactly where you are right now."

Jump nav (anchor links): [100x Students] [BuildX] [Resume Studio]
Style: pill buttons, outlined, in a horizontal row

Thin gradient divider before first program section

---
### 3B. PROGRAM 1 — 100x STUDENTS  (anchor: #100x-students)

Section layout: Two column — text left, visual right

Visual right: Stylized card stack showing "session cards" — cards fanned out like upcoming events:
  Card 1: "Expert Session · Tech" with avatar placeholder, purple border
  Card 2: "Resume Review · 1:1" with checkmark icon, amber border
  Card 3: "Job Referral · Exclusive" with lock-open icon, green border
Cards are stacked at slight angles, hover reveals them fanning out

Text left:
  Label: "PREMIUM MEMBERSHIP"
  Tag pill: "₹499/month" in amber
  Heading (Syne 800, text-2xl): "The Career Accelerator for Students Who Mean Business."
  Subhead (DM Sans 500, --text-secondary): "Not another course. Not a subscription to watch videos you forget."
  Body:
    "100x Students is the premium layer of TSS — a live, expert-led community for students who want more than tips. They want results.

    Resume reviews. Monthly sessions with people who actually hire. Referrals for jobs before they're posted publicly. First access to every TSS opportunity.

    This is for the students who aren't waiting for placement season to decide their future."

What you get — 5 feature rows (icon + title + body):
  ⭐ Expert Sessions
     "Monthly live sessions with professionals who have 10+ years of experience. Tech, marketing, HR, sales, design, startups. Not lectures. Real conversations."
  
  📝 Resume Reviews
     "Your resume reviewed in FAANG and McKinsey format — structured, achievement-first, ATS-ready. No more generic formats that look like everyone else's."
  
  🎯 Priority Job Referrals
     "Jobs that never get posted publicly — shared first with 100x members because our recruiters trust the quality of students who come through here."
  
  🔒 Exclusive 100x Community
     "Private WhatsApp group for 100x members only. Invitation-only. High signal, no noise. The people here are serious."
  
  ⚡ First Access to Everything
     "Workshops, BuildX spots, campus events, partnership opportunities — announced to 100x members before anyone else."

Who it's for (list):
  → Final year students preparing for campus placements
  → Recent graduates looking to break into their first role
  → Ambitious 2nd and 3rd year students who don't want to wait
  → Domains: Software / Tech, Marketing, Sales, HR, Design, Finance, Startups

Pricing card (centered, prominent):
  Background: --bg-card, border: gradient border
  "₹499 / month" in Syne 800, text-2xl, amber
  "or ₹2,999 / year" below in DM Sans 500, --text-secondary
  "(save ₹989)" in small green text
  CTA button (amber gradient, full width of card): "Join 100x Students →"
  Below: "Founding member pricing · Limited seats at this rate"

---
### 3C. PROGRAM 2 — BUILDX  (anchor: #buildx)

Full-width section, slightly different bg tone (--bg-card at 50% overlay)

Label: "MONTHLY BUILDER PROGRAM"
Badge pill: "🚀 Launching July 2026" in purple

Heading (Syne 800, text-hero, gradient text): "30 Days. 1 Real Problem. 1 Product."
Subheading: "This is not a hackathon for certificates. This is not content for TSS to post and forget. This is how founders actually get built."

Body:
  "Every month, TSS opens the floor to our entire community: what problem in your daily life is genuinely broken and genuinely fixable?

  We collect them all. We screen them honestly. We pick 3.

  Then you have 30 days to build the solution — with mentors checking in every week, your community watching, and TSS amplifying your work at every step of the way."

The 30-Day Cycle — 4 phase cards in a horizontal row (stacked on mobile):
  Each card has: phase number, phase label, day range tag, body text

  Phase 1 · INTAKE · Days 1–5:
    "Post your real problem in the BuildX group — not a business idea, a genuine daily-life frustration that you know others face too. We also run a Google Form so nothing gets lost in the chat."

  Phase 2 · SELECTION · Days 6–7:
    "We screen every submission against 3 filters: Is it real? Is it buildable solo or in a small team in 30 days? Does it fit TSS's strongest domains? We publish our final 3 picks publicly — with the reasons."

  Phase 3 · BUILD · Days 8–28:
    "You own the build. Pull in any TSS member to help. Every Sunday: 20-minute Google Meet check-in per problem — progress, blockers, mentor input. Midpoint update goes out to the whole community."

  Phase 4 · DEMO DAY · Days 29–30:
    "Live demo on Google Meet. Even rough builds get shown — effort and learning are the bar in early cycles, not polish. Every builder gets TSS recognition, a LinkedIn feature, and — for builds with real startup potential — direct intros to mentors and recruiters."

The Hackathon Track (separate highlighted band below the cycle):
  "After 10 Builds: The Offline Hackathon"
  Body: "When BuildX completes 10 monthly cycles, TSS runs its first offline hackathon — larger problems, real judges from our recruiter and mentor network, and 90-day dedicated follow-up support for the strongest teams. That's the incubator runway."
  Style: dark card with amber left-border, subtle amber background

The Non-Negotiable (full-width centered, large text):
  "TSS never takes equity in what you build.
  Your idea. Your product. Your company.
  We give you the community, the mentors, and the visibility.
  The rest is yours."
  Style: Syne 800, text-xl, --text-primary, centered, surrounded by faint glow

CTA: "Register for BuildX →" — links to /get-verified
Note: "Must be a verified TSS member to participate"

---
### 3D. PROGRAM 3 — RESUME STUDIO  (anchor: #resume-studio)

Label: "FREE FOR ALL VERIFIED MEMBERS"
Heading (Syne 800, text-2xl): "Your Resume, FAANG-Style. Free. In 5 Minutes."
Subheading (--text-secondary): "The resume format that actually gets shortlisted."

Body (two paragraphs):
  "Most Indian student resumes have the same problems: too much filler, too little achievement, three different fonts, and a 'Career Objective' paragraph that nobody reads.

  Resume Studio fixes all of that. We built a builder around the formats that top companies want — clean, structured, achievement-first, ATS-friendly. No clutter. No drag-and-drop confusion. No subscription to download what's already yours."

  "The Resume Studio format is also the TSS Talent Network format — when you apply to jobs through TSS, this is the resume that reaches our recruiter partners. Consistency creates credibility."

How it works — 3 steps horizontal:
  Step 1: Register and get verified (your Member ID is Step 0)
  Step 2: Fill in your details — pre-populated from your registration where possible
  Step 3: Preview your resume → Download as PDF

What makes it different — 4 feature items:
  "Achievement-first formatting — not 'responsible for' but 'built, led, grew, shipped, closed, saved'"
  "ATS-optimized — no tables, no graphics, no formatting that breaks in a recruiter's inbox"
  "Your TSS Member ID on every resume — the verified badge that makes your application traceable"
  "PDF-only download — keeps formatting consistent from your screen to every recruiter's screen"

CTA: "Build My Resume →" links to /get-verified
Note: "Available immediately after your Member ID is approved. Free forever."`;

const GETVERIFIED = `## PAGE 4: GET VERIFIED  (route: /get-verified)

### 4A. PAGE HEADER
Background: same hero gradient
Heading (Syne 800, text-hero, gradient text): "Your Member ID. Your Place in the TSS Network."
Body:
  "When you verify with TSS, you don't just get a WhatsApp link. You get a unique, tracked Member ID — your permanent, verified identity across the entire TSS ecosystem.

  It's the key to the Talent Network, Resume Studio, BuildX, and 100x Students."

Member ID example (centered, Space Mono 700, gradient text, 32px):
  "TSS-ST-260618001"
Caption below: "That's what yours will look like. 9 digits. Yours for life." in DM Sans 400 --text-muted

Four-step process bar (horizontal on desktop, vertical on mobile):
  Step 1: Fill the form (2 minutes)
  Step 2: Admin reviews your profile
  Step 3: You receive your Member ID by email
  Step 4: Email includes WhatsApp + Instagram + LinkedIn links — you're in

Note pill: "All profiles manually verified within 24–48 hours — to keep quality high, for you as much as for us."

---
### 4B. REGISTRATION FORM
Single-page form, card background, all validations active, no section collapses.
Show all sections simultaneously, with labeled section headers.

FORM TITLE: "Create Your TSS Profile"
FORM SUBTITLE: "All fields marked * are required. Takes about 2 minutes."

--- SECTION 1: PERSONAL DETAILS ---

Full Name *
  Type: text input
  Placeholder: "Your full name (first + last)"
  Validation: minimum 2 words, maximum 100 characters, letters and spaces only
  Error: "Please enter your full name (first and last name)"

Email Address *
  Type: email input
  Placeholder: "youremail@example.com"
  Validation: valid email format, unique (check against existing registrations if possible)
  Error: "Please enter a valid email address"

Phone Number *
  Type: tel input, shows +91 prefix locked
  Placeholder: "10-digit mobile number"
  Validation: exactly 10 digits, Indian mobile format
  Error: "Please enter a valid 10-digit Indian mobile number"

Date of Birth *
  Type: date picker
  Validation: must be at least 16 years old from today's date
  Error: "You must be at least 16 years old to register"

Gender
  Type: radio buttons (optional)
  Options: Male · Female · Non-binary · Prefer not to say
  Note: "(Optional)" shown beside label

City *
  Type: text input
  Placeholder: "Your city"

State *
  Type: dropdown, all Indian states and UTs alphabetically
  Default selected: Telangana

--- SECTION 2: WHO ARE YOU ---

I am a * (large card-style selector, one selection only, prominent):
  Card options with icons:
    🎓 Student — "Currently enrolled in a college or university"
    💼 Working Professional — "Currently employed, looking to grow"
    🏢 HR / Recruiter — "I hire talent or manage recruitment"
    💡 Mentor / Expert — "I have expertise I want to share"
    🚀 Founder / Entrepreneur — "Building something of my own"

Current College / Company *
  Type: text input
  Placeholder: If Student → "Your college name" | Others → "Your company name"
  Label changes dynamically based on role selection above

Year of Study (show ONLY if Student selected):
  Type: dropdown
  Options: 1st Year, 2nd Year, 3rd Year, 4th Year, 5th Year, Pursuing PG / Masters, PhD / Research
  Validation: required if Student

Year of Graduation (show ONLY if Student selected):
  Type: year dropdown (current year to +5 years)

Work Experience (show ONLY if NOT Student):
  Type: radio
  Options: Fresher (0 years), Less than 1 year, 1–3 years, 3–5 years, 5+ years

Degree / Highest Qualification *
  Type: text input
  Placeholder: "e.g. B.Tech, MBA, BCA, B.Com, B.Sc, BBA, MCA"

Field / Specialization *
  Type: text input
  Placeholder: "e.g. Computer Science, Marketing, Finance, Mechanical Engineering"

--- SECTION 3: WHAT YOU DO ---

Primary Domains of Interest * (multiselect — choose up to 3):
  Checkbox cards with icons:
  💻 Software / Tech
  📣 Marketing
  💰 Sales
  👥 HR / Recruitment
  🎨 Design / UI-UX
  📊 Finance
  ⚙️ Operations
  📝 Content & Media
  🚀 Startups & Entrepreneurship
  🔬 Other (text field appears if selected)
  Validation: minimum 1, maximum 3 selections
  Error: "Please select 1 to 3 domains"

What do you want from TSS? * (multiselect, choose all that apply):
  ☐ Job opportunities
  ☐ Internship opportunities
  ☐ Build a product (BuildX)
  ☐ Find co-founders
  ☐ Mentorship
  ☐ Networking with peers
  ☐ 100x Students premium access
  ☐ Resume building
  Validation: at least 1 selection required

--- SECTION 4: YOUR ONLINE PRESENCE ---

LinkedIn Profile URL *
  Type: url input
  Placeholder: "https://linkedin.com/in/yourname"
  Validation: must be a valid URL containing "linkedin.com/in/"
  Error: "Please enter a valid LinkedIn profile URL (linkedin.com/in/...)"

Instagram Handle (Optional)
  Type: text input with @ prefix locked
  Placeholder: "yourhandle"

GitHub or Portfolio URL (Optional)
  Type: url input
  Placeholder: "https://github.com/username or https://yoursite.com"
  Validation: valid URL format if filled

--- SECTION 5: FINAL QUESTIONS ---

How did you hear about TSS? *
  Type: dropdown
  Options: WhatsApp, Instagram, LinkedIn, Referral from a friend, College notice, Campus Representative, Google search, Other

Referral Member ID (Optional)
  Type: text input
  Placeholder: "TSS-ST-XXXXXXXXX"
  Hint: "If a TSS member referred you, enter their Member ID here"
  Validation: format TSS-[ST/HR/MN]-XXXXXXXXX if filled

--- SECTION 6: CONFIRMATION ---

Three required checkboxes (all must be checked to submit):

☐ I confirm I am a real person and all the information I have provided above is accurate and up to date. *

☐ I agree to the TSS Community Guidelines and have read the Privacy Policy. * 
  (inline links: "Community Guidelines" and "Privacy Policy" open in modal)

☐ I understand that submitting this form does not guarantee immediate access — my profile will be reviewed by the TSS admin team within 24–48 hours, after which I will receive my Member ID by email. *

--- SUBMIT BUTTON ---

Full-width button, amber gradient, Syne 700, 18px, 18px padding vertical:
  "Submit for Verification →"

Disabled state (if any required field empty or checkbox unchecked): grey, reduced opacity, cursor: not-allowed

Loading state: spinner + "Submitting your profile..." text

--- SUCCESS STATE (replaces form on successful submission) ---
  Large checkmark icon (green, animated circle-draw)
  Heading (Syne 800, text-xl): "You're Submitted! 🎉"
  Body:
    "Your profile is under review. The TSS admin team manually reviews every submission.

    Expect your Member ID in your inbox within 24–48 hours.

    While you wait — follow us so you don't miss the confirmation:"
  
  Three social buttons:
    "Follow on Instagram" → https://www.instagram.com/the_studentspot
    "Follow on LinkedIn" → https://www.linkedin.com/company/thestudentspot/
    "Join the Channel" → https://whatsapp.com/channel/0029Vb6ft6072WTxJ5eMKA2I`;

const CONTACT = `## PAGE 5: CONTACT  (route: /contact)

### 5A. PAGE HEADER
Heading (Syne 800, text-2xl): "Let's Talk. We Read Everything."
Body:
  "Whether you're a recruiter looking to hire from our network, a brand that wants to partner with TSS, a college that wants to bring TSS to campus, or just a student with a question — we're genuinely accessible. Drop us a message below."

### 5B. CONTACT CHANNELS
Three prominent contact cards:

  Card 1 — General Inquiries:
    Icon: 📧 in --primary-pale
    Label: "General"
    Email: hello@thestudentspot.in
    Body: "For anything that doesn't fit the boxes below — students, questions, ideas, feedback."

  Card 2 — Jobs & Talent Network:
    Icon: 💼 in green
    Label: "Talent Network"
    Email: jobs@thestudentspot.in
    Body: "For recruiters posting jobs, companies interested in sourcing candidates, and all talent-network related conversations."

  Card 3 — Partnerships & Collabs:
    Icon: 🤝 in amber
    Label: "Partnerships"
    Email: partners@thestudentspot.in
    Body: "For brands, edtech platforms, campus programs, sponsorships, co-hosted events, and media collaborations."

### 5C. SOCIAL LINKS
Heading: "Find Us Everywhere."
Body: "We're active across 7 platforms. Pick whichever feels most natural."

Platform cards in a grid (3 or 4 per row):
  WhatsApp Channel     5,800+ followers   → https://whatsapp.com/channel/0029Vb6ft6072WTxJ5eMKA2I
  WhatsApp Community   2,000+ members     → https://chat.whatsapp.com/LxA5xaAdlKp3nvZmIGxLcp
  LinkedIn             4,200+ followers   → https://www.linkedin.com/company/thestudentspot/
  Instagram            880+ followers     → https://www.instagram.com/the_studentspot
  Telegram             200+ members       → https://t.me/thestudentspot
  YouTube              50+ subscribers    → https://youtube.com/@the.studentspot
  X / Twitter          50+ followers      → https://x.com/the_studentspot

Each platform card: logo icon in platform color, platform name, follower count, "Follow →" link

### 5D. QUICK FORMS SECTION
Heading: "Want to Be More Involved?"
Body: "Every role at TSS is open — from campus rep to core team to event volunteer."

Five cards in a grid:
  🧠 Core Squad Application
     "Join the team building TSS."
     → https://forms.gle/DyfMSzGJdQMVBbqRA

  🏫 Campus Representative
     "Represent TSS at your college."
     → https://forms.gle/GGGKNDZYFXBgqsqw8

  🤝 Collab / Partnership
     "Propose a collaboration."
     → https://forms.gle/ZjNXgeujjKk46D72A

  🎙️ Mentor / Speaker
     "Apply to mentor or speak."
     → https://forms.gle/buTfbTq9pE1mAGTo9

  🙋 Event Volunteer
     "Volunteer at TSS events."
     → https://forms.gle/BQThbSQ9NGzLHJ9i8

### 5E. CONTACT FORM
Simple, clean. For people who don't want to email directly.
Fields:
  Full Name * (text)
  Email Address * (email)
  Topic * (dropdown): General Question / Partnership / Talent Network & Jobs / Campus / Media / Other
  Message * (textarea, min 20 chars, max 1000 chars)
  Submit: "Send Message →" in primary gradient

On submit: success state with checkmark and "Message sent! We'll reply within 1–2 business days."

### 5F. LOCATION
Small block at page bottom:
  "📍 Based in Karimnagar, Telangana, India 🇮🇳"
  "Operating across 100+ campuses nationally."`;

const ADMIN = `## ADMIN PANEL  (route: /admin — password-protected, not publicly linked)

### ACCESS
Login: email + password authentication
Access for: Rajkamal Panthagani + up to 2 additional admin accounts
No "Create account" flow — accounts created directly in database
Redirect unauthorized access to /admin/login

### DASHBOARD (admin home)
Stat cards at top:
  Total Registrations (all time)
  Registrations Today
  Registrations This Week
  Pending Verification (most important — highlighted in amber if > 0)
  Total Approved Members
  Total Students / Recruiters / Mentors / Founders breakdown

Below stats: Quick action buttons:
  "Review Pending (N)" — goes to pending list
  "Export CSV" — exports all approved members to CSV
  "View All Members"

### PENDING VERIFICATIONS TAB
Table view, sorted by submission date (newest first):
Columns: Submitted At, Full Name, Email, Phone, Role, College/Company, City/State, Domain, Actions

Each row expands (accordion or modal) to show ALL form fields:
  Personal details
  Academic/professional details
  Domain interests
  Goals
  LinkedIn URL (clickable)
  How they heard about TSS
  Referral Member ID if provided

Action buttons per row:
  ✅ APPROVE
    → System generates Member ID: TSS-[ROLE]-[YYMMDDXXX] format
    → ROLE: ST for Student/Professional, HR for Recruiter, MN for Mentor, FN for Founder
    → YYMMDD: today's date, XXX: auto-incrementing sequence for that day starting at 001
    → System sends automated email to member:
        Subject: "You're in! Your TSS Member ID: [GENERATED_ID]"
        Body: 
          "Hi [Name],
          
          Welcome to The Student Spot. Your profile has been verified.
          
          Your Member ID: [ID] (keep this — you'll need it for every TSS application)
          
          You're now part of a verified network of [total_members]+ people building their future.
          
          Here's everything that's now unlocked for you:
          
          → WhatsApp Community (2,000+ members): https://chat.whatsapp.com/LxA5xaAdlKp3nvZmIGxLcp
          → WhatsApp Channel (5,800+ followers): https://whatsapp.com/channel/0029Vb6ft6072WTxJ5eMKA2I
          → Instagram: https://www.instagram.com/the_studentspot
          → LinkedIn: https://www.linkedin.com/company/thestudentspot/
          
          When you apply for any TSS job opportunity, use this format in your email subject:
          [Your Member ID] | [Job ID]  ← example: TSS-ST-260618001 | JOB-260618-01
          
          Welcome to the network.
          — Team TSS, The Student Spot"
    → Status in admin: changes to "Approved" with green badge
    → Member ID locked permanently to that record

  ✏️ REQUEST MORE INFO
    → Admin types a short message
    → Email sent to registrant asking for additional information with a reply-to or form link

  ❌ REJECT
    → Admin types reason (required field)
    → Email sent:
        Subject: "Your TSS registration — next steps"
        Body: "Hi [Name], thank you for registering. After reviewing your profile, we need [reason]. You're welcome to reapply at the-student-spot.vercel.app/get-verified. — Team TSS"
    → Status changes to "Rejected" with red badge

### MEMBER DATABASE TAB
Full searchable, filterable table of all members:
Columns: Member ID, Name, Role, Email, Phone, College/Company, Domain, State, Registration Date, Status

Filters:
  Role: All / Student / Recruiter / Mentor / Founder
  Domain: All / Software / Marketing / Sales / HR / Design / Finance / Other
  State: All Indian states dropdown
  Status: All / Approved / Pending / Rejected
  Date range: from / to date pickers

Search bar: search by name, email, phone, Member ID, college, company

Row actions: View full profile | Edit | Change status

Export button: Download as CSV (all columns, all current filter results)

### MESSAGES TAB
Contact form submissions from the Contact page
Columns: Date, Name, Email, Topic, Message preview, Status (New/Read/Replied)
Mark as read / Reply (opens email client with prefilled to/subject)`;

// ── FULL PROMPT ASSEMBLED ──────────────────────────────────────
const FULL_PROMPT = `# THE STUDENT SPOT — PHASE 1 WEBSITE BUILD PROMPT
# Platform: Antigravity
# Brand: The Student Spot (TSS)
# Tagline: From Student to Founder
# Website: the-student-spot.vercel.app
# Founder: Rajkamal Panthagani

---

\${DESIGN}

---

\${HOME}

---

\${ABOUT}

---

\${PROGRAMS}

---

\${GETVERIFIED}

---

\${CONTACT}

---

\${ADMIN}`;

// ── COMPONENT ─────────────────────────────────────────────────
export default function TSSWebPrompt() {
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const sections = [
    { label: "Design System", icon: "🎨", content: DESIGN, key: "design" },
    { label: "Home", icon: "🏠", content: HOME, key: "home" },
    { label: "About", icon: "💡", content: ABOUT, key: "about" },
    { label: "Programs", icon: "🚀", content: PROGRAMS, key: "programs" },
    { label: "Get Verified", icon: "🪪", content: GETVERIFIED, key: "verify" },
    { label: "Contact", icon: "📞", content: CONTACT, key: "contact" },
    { label: "Admin Panel", icon: "⚙️", content: ADMIN, key: "admin" },
  ];

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2500);
    });
  };

  const C = {
    bg: "#050810", card: "#0D1120", dark: "#080A14",
    border: "#1A2040", pri: "#E8ECFF", mut: "#7480A0", dim: "#2E3A5A",
    purple: "#7C3AED", purpleL: "#A78BFA",
    amber: "#F59E0B", green: "#10B981",
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.pri, fontFamily: "system-ui,-apple-system,sans-serif", paddingBottom: "3rem" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(150deg,#0C0A22,#07101E)", padding: "1.2rem 1rem 0.9rem", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
          {["⚡ TSS", "Phase 1", "Antigravity Prompt"].map((b, i) => (
            <span key={i} style={{ background: [C.purple, C.amber, C.green][i] + "18", border: `1px solid ${[C.purple, C.amber, C.green][i]}38`, color: [C.purple, C.amber, C.green][i], borderRadius: "999px", padding: "0.15rem 0.55rem", fontSize: "0.62rem", fontWeight: 700 }}>{b}</span>
          ))}
        </div>
        <div style={{ fontSize: "1.3rem", fontWeight: 900, background: "linear-gradient(100deg,#C4B5FD,#F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "0.15rem" }}>
          TSS Website — Full Build Prompt
        </div>
        <div style={{ color: C.mut, fontSize: "0.7rem", marginBottom: "0.75rem" }}>5 pages · Design system · Registration form · Admin panel · All content included</div>

        {/* Copy Full Prompt button */}
        <button
          onClick={() => copy(FULL_PROMPT, "all")}
          style={{ background: copied === "all" ? C.green : `linear-gradient(110deg,${C.purple},${C.purpleL})`, color: "#fff", border: "none", borderRadius: "10px", padding: "0.55rem 1.1rem", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", width: "100%", transition: "background 0.2s" }}
        >
          {copied === "all" ? "✅ Full Prompt Copied — Paste into Antigravity" : "📋 Copy Full Prompt (Everything)"}
        </button>
        <div style={{ fontSize: "0.62rem", color: C.dim, marginTop: "0.3rem", textAlign: "center" }}>
          Or use the tabs below to read + copy each section individually
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#090B18", borderBottom: `1px solid ${C.border}`, overflowX: "auto", scrollbarWidth: "none" }}>
        {sections.map((s, i) => (
          <div key={i} onClick={() => setTab(i)} style={{ padding: "0.55rem 0.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.12rem", cursor: "pointer", borderBottom: tab === i ? `2px solid ${C.purpleL}` : "2px solid transparent", color: tab === i ? C.purpleL : C.dim, fontSize: "0.56rem", fontWeight: tab === i ? 700 : 400, minWidth: "54px", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: "0.95rem" }}>{s.icon}</span>
            {s.label}
          </div>
        ))}
      </div>

      {/* Section content */}
      <div style={{ padding: "0.85rem" }}>
        {/* Section copy button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
          <div style={{ fontSize: "0.7rem", color: C.mut }}>{sections[tab].icon} {sections[tab].label} section</div>
          <button
            onClick={() => copy(sections[tab].content, sections[tab].key)}
            style={{ background: copied === sections[tab].key ? C.green : C.card, color: copied === sections[tab].key ? "#fff" : C.purpleL, border: `1px solid ${copied === sections[tab].key ? C.green : C.border}`, borderRadius: "8px", padding: "0.3rem 0.65rem", fontSize: "0.68rem", fontWeight: 700, cursor: "pointer" }}
          >
            {copied === sections[tab].key ? "✅ Copied!" : "Copy This Section"}
          </button>
        </div>

        {/* Prompt text */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "1rem", fontFamily: "ui-monospace,monospace", fontSize: "0.71rem", color: "#C5D0F0", lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "auto", maxHeight: "60vh", overflowY: "auto" }}>
          {sections[tab].content}
        </div>

        {/* Bottom copy nudge */}
        <div style={{ background: "#6D28D912", border: `1px solid ${C.purple}30`, borderRadius: "10px", padding: "0.7rem", marginTop: "0.75rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: C.purpleL, fontWeight: 700, marginBottom: "0.2rem" }}>How to Use This</div>
          <div style={{ fontSize: "0.68rem", color: C.mut, lineHeight: 1.6 }}>
            Tap <strong style={{ color: C.pri }}>"Copy Full Prompt"</strong> at the top → Paste everything into Antigravity in one go. The builder will read the sections in order.<br />
            Or copy section by section if your builder prefers smaller inputs.
          </div>
        </div>
      </div>
    </div>
  );
}
