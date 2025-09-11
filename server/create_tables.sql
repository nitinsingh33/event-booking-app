-- Manual SQL script to create tables for College Event Booking App
-- Run this in pgAdmin Query Tool

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    college VARCHAR(255),
    student_id VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN', 'ORGANIZER')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('WORKSHOP', 'SEMINAR', 'CULTURAL', 'SPORTS', 'TECHNICAL', 'MEETUP', 'CONFERENCE', 'OTHER')),
    date DATE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    max_seats INTEGER DEFAULT 100,
    available_seats INTEGER DEFAULT 100,
    registration_fee DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    organizer_name VARCHAR(255) NOT NULL,
    organizer_contact VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Time Slots table
CREATE TABLE IF NOT EXISTS time_slots (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    max_capacity INTEGER DEFAULT 50,
    current_count INTEGER DEFAULT 0
);

-- Create Event Registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    time_slot_id INTEGER REFERENCES time_slots(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    college VARCHAR(255) NOT NULL,
    seats INTEGER DEFAULT 1,
    comments TEXT,
    status VARCHAR(20) DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'ATTENDED')),
    ticket_code VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket ON event_registrations(ticket_code);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON event_registrations(email);

-- Insert sample data
INSERT INTO users (name, email, password, college, student_id, phone, role) VALUES
('John Doe', 'john.doe@college.edu', '$2b$10$rQk5FQQqI7yI0WUyQZ5QYO3vQ3EqXJ5QwqJ4gQyJ7QqJ5QwqJ6QqJ7', 'ABC College', 'CS2021001', '+1234567890', 'STUDENT'),
('Admin User', 'admin@college.edu', '$2b$10$rQk5FQQqI7yI0WUyQZ5QYO3vQ3EqXJ5QwqJ4gQyJ7QqJ5QwqJ6QqJ7', 'ABC College', NULL, NULL, 'ADMIN')
ON CONFLICT (email) DO NOTHING;

INSERT INTO events (name, description, event_type, date, start_time, end_time, location, max_seats, available_seats, registration_fee, organizer_name, organizer_contact, requirements) VALUES
('Tech Symposium 2025', 'Annual technology symposium featuring latest innovations in AI and Machine Learning', 'TECHNICAL', '2025-10-15', '2025-10-15 09:00:00', '2025-10-15 17:00:00', 'Main Auditorium', 200, 200, 0, 'Computer Science Department', 'cs@college.edu', 'Basic knowledge of programming'),
('Cultural Festival', 'Celebrate diversity with music, dance, and art from around the world', 'CULTURAL', '2025-11-01', '2025-11-01 18:00:00', '2025-11-01 22:00:00', 'Campus Grounds', 500, 500, 10, 'Student Council', 'council@college.edu', NULL),
('Career Workshop', 'Resume building and interview preparation workshop', 'WORKSHOP', '2025-09-25', '2025-09-25 14:00:00', '2025-09-25 16:00:00', 'Conference Room A', 50, 50, 0, 'Career Services', 'careers@college.edu', NULL)
ON CONFLICT DO NOTHING;

SELECT 'Database tables created successfully!' as status;
