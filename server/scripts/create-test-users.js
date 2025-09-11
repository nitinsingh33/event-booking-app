// Quick script to create test users for demonstration
import pkg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'college_events_db',
  user: 'college_app_user',
  password: 'nitinsingh',
});

async function createTestUsers() {
  try {
    console.log('🔄 Creating test users...');

    const testUsers = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@college.edu',
        password: 'password123',
        phone: '9876543210',
        college: 'ABC Engineering College',
        department: 'Computer Science',
        year: 3
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@college.edu', 
        password: 'password123',
        phone: '9876543211',
        college: 'ABC Engineering College',
        department: 'Information Technology',
        year: 2
      },
      {
        name: 'Arjun Singh',
        email: 'arjun.singh@college.edu',
        password: 'password123', 
        phone: '9876543212',
        college: 'ABC Engineering College',
        department: 'Mechanical Engineering',
        year: 4
      }
    ];

    for (const user of testUsers) {
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Check if user already exists
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [user.email]);
      
      if (existing.rows.length > 0) {
        console.log(`❌ User ${user.email} already exists, skipping...`);
        continue;
      }
      
      // Insert user with actual schema
      const result = await pool.query(`
        INSERT INTO users (name, email, password, phone, college, student_id, role, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, 'STUDENT', CURRENT_TIMESTAMP)
        RETURNING id, name, email
      `, [user.name, user.email, hashedPassword, user.phone, user.college, `${user.department}/${user.year}/2024`]);
      
      console.log(`✅ Created user: ${result.rows[0].name} (${result.rows[0].email})`);
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('\n📝 You can now login with:');
    console.log('Email: rahul.sharma@college.edu | Password: password123');
    console.log('Email: priya.patel@college.edu | Password: password123');
    console.log('Email: arjun.singh@college.edu | Password: password123');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await pool.end();
  }
}

createTestUsers();
