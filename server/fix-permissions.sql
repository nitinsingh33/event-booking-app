-- Fix permissions for college_app_user
-- Run this in pgAdmin as postgres user

-- Grant all privileges on existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO college_app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO college_app_user;

-- Ensure future tables have correct permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO college_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO college_app_user;

-- Test the permissions
SELECT 'Permissions updated successfully!' as status;
