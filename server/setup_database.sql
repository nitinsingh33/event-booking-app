-- Create database and user for College Event Booking App
-- Run this script after installing PostgreSQL

-- Connect to default postgres database first
-- Then run these commands:

-- Create the application database
CREATE DATABASE college_events_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create application user
CREATE USER college_app_user WITH
    LOGIN
    NOSUPERUSER
    INHERIT
    CREATEDB
    CREATEROLE
    NOREPLICATION
    PASSWORD 'nitinsingh';

-- Grant privileges to the application user
GRANT ALL PRIVILEGES ON DATABASE college_events_db TO college_app_user;

-- Connect to the new database
\c college_events_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO college_app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO college_app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO college_app_user;

-- Display confirmation
SELECT 'Database setup completed successfully!' as status;
