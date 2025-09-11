-- Simple step-by-step table creation
-- Run each command separately in pgAdmin

-- Step 1: Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    college VARCHAR(255),
    student_id VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Verify users table created
SELECT 'Users table created' as status;
SELECT * FROM users LIMIT 1;
