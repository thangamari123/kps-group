-- Optional Seed Data for Local Testing
-- 0002_seed.sql

-- Initial Admin (Password: "Admin@123456")
-- Hash generated with PBKDF2-SHA256 (100000 iterations)
INSERT OR IGNORE INTO admins (id, email, password_hash, name, role, created_at, updated_at)
VALUES (
  'admin-seed-001',
  'admin@kpsgroups.net',
  'pbkdf2_sha256$100000$a94f6c5f7c3272d1f93f6c8d76a59b20$40f3532c25d81b37b6c507c805a415fffa7d8ae4345cb571fa088ef391eb8f12',
  'KPS Super Admin',
  'admin',
  datetime('now'),
  datetime('now')
);

-- Seed Sample Active Career Job
INSERT OR IGNORE INTO jobs (id, title, slug, department, location, employment_type, experience, salary, description, responsibilities, requirements, benefits, deadline, status, created_at, updated_at)
VALUES (
  'job-seed-001',
  'Customs Documentation Executive',
  'customs-documentation-executive',
  'Customs Brokerage',
  'Chennai Head Office (Parrys)',
  'Full-time',
  '2 - 5 Years',
  '₹35,000 - ₹50,000 / month',
  'We are seeking an experienced Customs Documentation Executive to handle Bill of Entry & Shipping Bill clearance filings via ICEGATE, liaison with customs authorities at Chennai Port, and verify tariff HS codes for multinational cargo.',
  '["Prepare and file online Bills of Entry and Shipping Bills on ICEGATE portal.", "Classify imported goods in compliance with Indian Customs Tariff and HTS nomenclature.", "Coordinate with customs appraisers, examiners, and port CFS officials for smooth inspection.", "Resolve queries, bonding/ex-bonding procedures, and duty assessment documentation."]',
  '["Bachelor''s degree in Logistics, Commerce, or related discipline.", "Minimum 2 years direct experience in customs house agency (CHA) operations.", "Proficiency in ICEGATE, e-Sanchit, and customs documentation software.", "Solid understanding of DGFT policies, FTAs, and customs exemptions."]',
  '["Competitive performance incentives and annual increments.", "Comprehensive health insurance coverage for family.", "Professional certification assistance (Rule 6 Customs Exam support).", "Supportive work culture and healthy work-life integration."]',
  '2026-10-31',
  'published',
  datetime('now'),
  datetime('now')
);

-- Seed Second Sample Active Job
INSERT OR IGNORE INTO jobs (id, title, slug, department, location, employment_type, experience, salary, description, responsibilities, requirements, benefits, deadline, status, created_at, updated_at)
VALUES (
  'job-seed-002',
  'Freight Forwarding Operations Specialist',
  'freight-forwarding-operations-specialist',
  'Ocean & Air Freight',
  'Chennai Port Operations',
  'Full-time',
  '3 - 6 Years',
  'Competitive / Commensurate with experience',
  'Coordinate international sea and air freight movements, booking container slots with major ocean carriers, monitoring vessel schedules, and managing end-to-end multimodal transport chains.',
  '["Negotiate freight rates with ocean carriers and airlines for FCL/LCL shipments.", "Manage vessel bookings, MBL/HBL preparation, and tracking manifests.", "Coordinate with overseas agents and consignees for door-to-door delivery.", "Maintain real-time operational status dashboards and resolve transit bottlenecks."]',
  '["Proven track record in international freight forwarding operations.", "Strong relationship with shipping lines calling Chennai, Ennore, and Kattupalli ports.", "Excellent verbal and written communication skills.", "Ability to work proactively in fast-paced logistics environments."]',
  '["Attractive variable bonus and quarterly performance rewards.", "Corporate health benefits and executive travel allowance.", "Rapid leadership career progression opportunities."]',
  '2026-11-15',
  'published',
  datetime('now'),
  datetime('now')
);
