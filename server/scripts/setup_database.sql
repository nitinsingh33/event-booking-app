-- College Event Booking App - Database Setup Script
-- Run this after installing PostgreSQL

-- Connect as postgres user first, then run these commands:

-- 1. Create database
CREATE DATABASE college_events_db;

-- 2. Create application user
CREATE USER college_app_user WITH PASSWORD 'College123!';

-- 3. Grant privileges
GRANT ALL PRIVILEGES ON DATABASE college_events_db TO college_app_user;

-- 4. Connect to the new database
\c college_events_db;

-- 5. Grant schema privileges
GRANT ALL ON SCHEMA public TO college_app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO college_app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO college_app_user;

-- 6. Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO college_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO college_app_user;

-- Verify setup
SELECT current_database(), current_user;

-- List databases
\l

-- Exit
\q
