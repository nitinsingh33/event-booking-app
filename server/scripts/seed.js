import pkg from 'pg';
const { Pool } = pkg;

// Database connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'college_events_db',
  user: 'college_app_user',
  password: 'nitinsingh',
});

// Sample data for testing
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Create sample users (with hashed passwords)
    const hashedPassword = '$2b$10$rQk5FQQqI7yI0WUyQZ5QYO3vQ3EqXJ5QwqJ4gQyJ7QqJ5QwqJ6QqJ7'; // "password123"
    
    console.log('👥 Creating sample users...');
    await pool.query(`
      INSERT INTO users (name, email, password, college, student_id, phone, role) 
      VALUES 
        ('John Doe', 'john.doe@college.edu', $1, 'ABC College', 'CS2021001', '+1234567890', 'STUDENT'),
        ('Jane Smith', 'jane.smith@college.edu', $1, 'ABC College', 'CS2021002', '+1234567891', 'STUDENT'),
        ('Admin User', 'admin@college.edu', $1, 'ABC College', NULL, NULL, 'ADMIN')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);

    console.log('🎉 Creating sample events...');
    await pool.query(`
      INSERT INTO events (name, description, event_type, date, start_time, end_time, location, max_seats, available_seats, registration_fee, organizer_name, organizer_contact, requirements) 
      VALUES 
        ('Tech Symposium 2025', 'Annual technology symposium featuring latest innovations in AI and Machine Learning', 'TECHNICAL', '2025-10-15', '2025-10-15 09:00:00', '2025-10-15 17:00:00', 'Main Auditorium', 200, 200, 0, 'Computer Science Department', 'cs@college.edu', 'Basic knowledge of programming'),
        ('Cultural Festival', 'Celebrate diversity with music, dance, and art from around the world', 'CULTURAL', '2025-11-01', '2025-11-01 18:00:00', '2025-11-01 22:00:00', 'Campus Grounds', 500, 500, 10, 'Student Council', 'council@college.edu', NULL),
        ('Career Workshop', 'Resume building and interview preparation workshop', 'WORKSHOP', '2025-09-25', '2025-09-25 14:00:00', '2025-09-25 16:00:00', 'Conference Room A', 50, 50, 0, 'Career Services', 'careers@college.edu', NULL),
        ('Sports Meet 2025', 'Annual inter-college sports competition', 'SPORTS', '2025-12-05', '2025-12-05 08:00:00', '2025-12-05 18:00:00', 'Sports Complex', 1000, 1000, 0, 'Sports Department', 'sports@college.edu', 'Physical fitness required'),
        ('Startup Pitch Competition', 'Pitch your startup ideas to industry experts', 'CONFERENCE', '2025-11-15', '2025-11-15 10:00:00', '2025-11-15 16:00:00', 'Innovation Center', 100, 100, 50, 'Entrepreneurship Cell', 'ecell@college.edu', 'Must have a startup idea')
      ON CONFLICT DO NOTHING
    `);

    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const eventCount = await pool.query('SELECT COUNT(*) FROM events');

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Total users: ${userCount.rows[0].count}, Total events: ${eventCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
