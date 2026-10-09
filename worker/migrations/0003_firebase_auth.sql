-- Cloudflare D1 Migration for Firebase Authentication
-- 0003_firebase_auth.sql

-- Add firebase_uid column to admins table for Firebase Authentication allowlist
ALTER TABLE admins ADD COLUMN firebase_uid TEXT;

-- Create unique index on firebase_uid
CREATE UNIQUE INDEX IF NOT EXISTS idx_admins_firebase_uid ON admins(firebase_uid);
