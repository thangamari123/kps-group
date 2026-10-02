-- Cloudflare D1 Initial Migration for KPS Worldwide Logistics
-- 0001_initial_schema.sql

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- 3. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  department TEXT,
  location TEXT NOT NULL,
  employment_type TEXT NOT NULL,
  experience TEXT,
  salary TEXT,
  description TEXT NOT NULL,
  responsibilities TEXT,
  requirements TEXT,
  benefits TEXT,
  deadline TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'closed'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 4. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  job_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  experience TEXT,
  current_company TEXT,
  cover_letter TEXT,
  resume_key TEXT NOT NULL,
  resume_name TEXT NOT NULL,
  resume_size INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
);

-- 5. Quote Requests Table
CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  cargo_weight TEXT,
  cargo_details TEXT,
  status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'In Progress', 'Quoted', 'Closed'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 6. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  service_required TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Read', 'Replied', 'Closed'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Indexes for fast lookups and high throughput
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_sessions_admin_id ON sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);

CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
