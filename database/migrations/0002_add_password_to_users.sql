-- Migration number: 0002 	 2026-09-03T00:00:00.000Z
-- Add password_hash to users table

ALTER TABLE users ADD COLUMN password_hash TEXT;
