-- TSS (The Student Spot) Supabase Database Initializer SQL Schema
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com)

-- =========================================================================
-- MIGRATION SCRIPT (For existing databases - run this if table already exists)
-- =========================================================================
-- ALTER TABLE candidates ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'Student';
-- ALTER TABLE candidates ADD COLUMN IF NOT EXISTS "roleDetails" JSONB;
-- ALTER TABLE candidates ADD COLUMN IF NOT EXISTS "photoPath" TEXT;
-- ALTER TABLE candidates ADD COLUMN IF NOT EXISTS "photoName" TEXT;
-- ALTER TABLE candidates ALTER COLUMN "highestQualification" DROP NOT NULL;
-- ALTER TABLE candidates ALTER COLUMN "currentStatus" DROP NOT NULL;
-- ALTER TABLE candidates ALTER COLUMN "graduationYear" DROP NOT NULL;
-- ALTER TABLE candidates ALTER COLUMN "currentRole" DROP NOT NULL;
-- ALTER TABLE candidates ALTER COLUMN "preferredRoles" DROP NOT NULL;
-- ALTER TABLE candidates ALTER COLUMN "skills" DROP NOT NULL;
-- ALTER TABLE candidates ALTER COLUMN "experienceLevel" DROP NOT NULL;
-- ALTER TABLE candidates ALTER COLUMN "resumePath" DROP NOT NULL;
-- ALTER TABLE candidates ALTER COLUMN "resumeName" DROP NOT NULL;
-- =========================================================================

-- 1. Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'Student',
  "fullName" TEXT NOT NULL,
  gender TEXT NOT NULL,
  dob TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  
  -- Student specific fields (now nullable)
  "highestQualification" TEXT,
  "currentStatus" TEXT,
  college TEXT,
  "graduationYear" INTEGER,
  "currentRole" TEXT,
  "preferredRoles" JSONB,
  skills JSONB,
  "experienceLevel" TEXT,
  "resumePath" TEXT,
  "resumeName" TEXT,
  
  -- Photo upload
  "photoPath" TEXT,
  "photoName" TEXT,
  
  -- Role details for Founder, Recruiter, Mentor, Investor, Professional
  "roleDetails" JSONB,
  
  linkedin TEXT NOT NULL,
  github TEXT,
  portfolio TEXT,
  instagram TEXT,
  "xTwitter" TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  "memberId" TEXT,
  notes TEXT,
  "registrationDate" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 2. Contact Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  "submittedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 3. Admin Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  "adminUser" TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 4. Recruiter Forwards Table
CREATE TABLE IF NOT EXISTS forwards (
  id TEXT PRIMARY KEY,
  "candidateId" TEXT NOT NULL,
  "recruiterName" TEXT NOT NULL,
  "recruiterEmail" TEXT NOT NULL,
  "sentDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  feedback TEXT
);

-- 5. System Settings Table (Homepage Stats)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  "communityMembers" INTEGER NOT NULL,
  "recruiterNetwork" INTEGER NOT NULL,
  "opportunitiesShared" INTEGER NOT NULL,
  "eventsConducted" INTEGER NOT NULL
);

-- Insert Default Settings counters
INSERT INTO settings (id, "communityMembers", "recruiterNetwork", "opportunitiesShared", "eventsConducted")
VALUES ('homepage_stats', 12500, 350, 850, 45)
ON CONFLICT (id) DO NOTHING;

-- Disable Row Level Security (RLS) to allow anon client queries to read/write in Phase 1
ALTER TABLE candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE forwards DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
