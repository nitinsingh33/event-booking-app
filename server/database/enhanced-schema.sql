-- Enhanced User Management Schema for College Event Booking System
-- Designed for enterprise-level adoption and scalability

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_activity_logs CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS college_departments CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;

-- Create Colleges table for multi-college support
CREATE TABLE colleges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL, -- e.g., 'ABCEC', 'XYZIT'
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),
    phone VARCHAR(15),
    email VARCHAR(255),
    website VARCHAR(255),
    established_year INTEGER,
    accreditation VARCHAR(100), -- NAAC, NBA, etc.
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    subscription_plan VARCHAR(50) DEFAULT 'basic', -- basic, premium, enterprise
    subscription_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Departments table
CREATE TABLE college_departments (
    id SERIAL PRIMARY KEY,
    college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL, -- CSE, IT, ME, etc.
    head_of_department VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(15),
    established_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(college_id, code)
);

-- Enhanced Users table
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    
    -- Contact Information
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15),
    alternate_phone VARCHAR(15),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    
    -- Academic Information
    college_id INTEGER REFERENCES colleges(id),
    department_id INTEGER REFERENCES college_departments(id),
    roll_number VARCHAR(50),
    registration_number VARCHAR(50),
    admission_year INTEGER,
    current_year INTEGER CHECK (current_year BETWEEN 1 AND 6),
    current_semester INTEGER CHECK (current_semester BETWEEN 1 AND 12),
    cgpa DECIMAL(3,2),
    graduation_year INTEGER,
    
    -- Account Information
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) DEFAULT 'student' CHECK (user_type IN ('student', 'faculty', 'admin', 'super_admin')),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    
    -- Parent/Guardian Information (for minors)
    parent_name VARCHAR(255),
    parent_phone VARCHAR(15),
    parent_email VARCHAR(255),
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(15),
    emergency_contact_relation VARCHAR(50),
    
    -- Profile
    profile_picture_url VARCHAR(500),
    bio TEXT,
    interests TEXT[], -- Array of interests
    skills TEXT[], -- Array of skills
    
    -- Privacy & Preferences
    profile_visibility VARCHAR(20) DEFAULT 'college' CHECK (profile_visibility IN ('public', 'college', 'private')),
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    
    -- Tracking & Analytics
    last_login_at TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_locked_until TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP -- Soft delete
);

-- User Sessions table for security tracking
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB, -- Browser, OS, etc.
    ip_address INET,
    location_data JSONB, -- City, country based on IP
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Activity Logs for audit trail
CREATE TABLE user_activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    activity_type VARCHAR(50) NOT NULL, -- login, logout, register_event, etc.
    activity_description TEXT,
    entity_type VARCHAR(50), -- event, user, etc.
    entity_id INTEGER,
    old_values JSONB, -- For update operations
    new_values JSONB, -- For update operations
    ip_address INET,
    user_agent TEXT,
    session_id UUID REFERENCES user_sessions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Preferences table
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    category VARCHAR(50), -- notification, privacy, ui, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, preference_key)
);

-- Enhanced Event Registrations table
DROP TABLE IF EXISTS event_registrations CASCADE;
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    time_slot_id INTEGER REFERENCES time_slots(id),
    
    -- Registration Details
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registration_status VARCHAR(20) DEFAULT 'confirmed' CHECK (
        registration_status IN ('pending', 'confirmed', 'cancelled', 'waitlisted', 'attended', 'no_show')
    ),
    
    -- Payment Information
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'paid', 'failed', 'refunded', 'waived')
    ),
    payment_method VARCHAR(50), -- cash, upi, card, bank_transfer
    payment_reference VARCHAR(100),
    amount_paid DECIMAL(10,2) DEFAULT 0,
    
    -- Ticket Information
    ticket_code VARCHAR(50) UNIQUE NOT NULL,
    qr_code_url VARCHAR(500),
    
    -- Attendance Tracking
    checked_in_at TIMESTAMP,
    checked_out_at TIMESTAMP,
    attendance_marked_by INTEGER REFERENCES users(id),
    
    -- Feedback
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    feedback_submitted_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(event_id, user_id) -- One registration per user per event
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_college_dept ON users(college_id, department_id);
CREATE INDEX idx_users_roll_number ON users(college_id, roll_number);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login_at);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

CREATE INDEX idx_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_activity_type ON user_activity_logs(activity_type);
CREATE INDEX idx_activity_logs_created_at ON user_activity_logs(created_at);

CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(registration_status);
CREATE INDEX idx_event_registrations_ticket ON event_registrations(ticket_code);

-- Insert sample colleges
INSERT INTO colleges (name, code, city, state, phone, email) VALUES
('ABC Engineering College', 'ABCEC', 'Mumbai', 'Maharashtra', '022-12345678', 'info@abcec.edu.in'),
('XYZ Institute of Technology', 'XYZIT', 'Pune', 'Maharashtra', '020-87654321', 'admin@xyzit.edu.in'),
('PQR University', 'PQRU', 'Bangalore', 'Karnataka', '080-11223344', 'contact@pqru.edu.in');

-- Insert sample departments for ABC Engineering College
INSERT INTO college_departments (college_id, name, code, head_of_department) VALUES
(1, 'Computer Science Engineering', 'CSE', 'Dr. Rajesh Kumar'),
(1, 'Information Technology', 'IT', 'Dr. Priya Sharma'),
(1, 'Mechanical Engineering', 'ME', 'Dr. Amit Patel'),
(1, 'Electronics & Communication', 'ECE', 'Dr. Sunita Singh'),
(1, 'Civil Engineering', 'CE', 'Dr. Ravi Gupta');

-- Insert sample departments for XYZ Institute of Technology
INSERT INTO college_departments (college_id, name, code, head_of_department) VALUES
(2, 'Computer Science Engineering', 'CSE', 'Dr. Neha Agarwal'),
(2, 'Information Technology', 'IT', 'Dr. Vikash Jain'),
(2, 'Electrical Engineering', 'EE', 'Dr. Kavita Rao');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
