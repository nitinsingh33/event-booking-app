import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'college_events_db',
  user: 'college_app_user',
  password: 'nitinsingh',
});

async function enhanceUserSystem() {
  try {
    console.log('🔄 Enhancing user system for professional use...');
    
    // Add professional columns to existing users table
    console.log('📝 Adding professional user tracking columns...');
    
    const alterUserQueries = [
      // Add professional tracking columns
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100)`, 
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS college VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS year INTEGER`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS roll_number VARCHAR(50)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(15)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(500)`,
      
      // Account management
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP`,
      
      // Preferences
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT false`,
      
      // Timestamps
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
    ];

    for (const query of alterUserQueries) {
      try {
        await pool.query(query);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.log(`⚠️  Query failed: ${error.message}`);
        }
      }
    }

    // Create user activity logs table
    console.log('📊 Creating user activity tracking...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        activity_type VARCHAR(50) NOT NULL,
        activity_description TEXT,
        entity_type VARCHAR(50),
        entity_id INTEGER,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user sessions table for security
    console.log('🔐 Creating secure session management...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        device_info TEXT,
        ip_address VARCHAR(45),
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Enhance event registrations table
    console.log('🎟️ Enhancing event registration tracking...');
    const enhanceRegistrationQueries = [
      `ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS registration_status VARCHAR(20) DEFAULT 'confirmed'`,
      `ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending'`,
      `ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50)`,
      `ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100)`,
      `ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT 0`,
      `ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMP`,
      `ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS checked_out_at TIMESTAMP`,
      `ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS rating INTEGER`,
      `ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS feedback TEXT`,
      `ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS feedback_submitted_at TIMESTAMP`,
      `ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS qr_code_url VARCHAR(500)`,
      `ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
    ];

    for (const query of enhanceRegistrationQueries) {
      try {
        await pool.query(query);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.log(`⚠️  Query failed: ${error.message}`);
        }
      }
    }

    // Create indexes for performance
    console.log('⚡ Creating performance indexes...');
    const indexQueries = [
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
      `CREATE INDEX IF NOT EXISTS idx_users_college ON users(college)`,
      `CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at)`,
      `CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON user_activity_logs(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON user_activity_logs(activity_type)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at)`,
      `CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON event_registrations(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_registrations_status ON event_registrations(registration_status)`
    ];

    for (const query of indexQueries) {
      try {
        await pool.query(query);
      } catch (error) {
        console.log(`⚠️  Index creation: ${error.message}`);
      }
    }

    // Update existing events to have better professional structure
    console.log('🎯 Enhancing events table...');
    const enhanceEventsQueries = [
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS event_category VARCHAR(50)`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS target_audience VARCHAR(100)`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS prerequisites TEXT`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS learning_outcomes TEXT`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255)`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255)`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(15)`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS banner_image_url VARCHAR(500)`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMP`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS cancellation_policy TEXT`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS refund_policy TEXT`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS tags TEXT[]`,
      `ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
    ];

    for (const query of enhanceEventsQueries) {
      try {
        await pool.query(query);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.log(`⚠️  Events enhancement: ${error.message}`);
        }
      }
    }

    console.log('✅ Professional user system enhancement completed!');
    console.log('🏢 Your system now includes:');
    console.log('   ✓ Comprehensive user profiles');
    console.log('   ✓ Activity audit logging');
    console.log('   ✓ Secure session management');
    console.log('   ✓ Enhanced event registration tracking');
    console.log('   ✓ Payment status tracking');
    console.log('   ✓ Attendance management');
    console.log('   ✓ User feedback system');
    console.log('   ✓ Performance optimized indexes');
    console.log('   ✓ Professional event metadata');
    console.log('');
    console.log('🚀 Your system is now ready for college-level adoption!');

  } catch (error) {
    console.error('❌ Error enhancing user system:', error.message);
  } finally {
    await pool.end();
  }
}

enhanceUserSystem();
