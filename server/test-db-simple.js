// Simple test without Prisma to verify database connection
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'college_events_db',
  user: 'college_app_user',
  password: 'nitinsingh',
});

async function testDatabase() {
  try {
    console.log('🔗 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time, COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = $1', ['public']);
    console.log('📊 Database info:', result.rows[0]);
    
    // Check if our tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tables found:', tables.rows.map(row => row.table_name));
    
    // Test data
    const events = await client.query('SELECT COUNT(*) as event_count FROM events');
    const users = await client.query('SELECT COUNT(*) as user_count FROM users');
    
    console.log(`🎉 Events: ${events.rows[0].event_count}, Users: ${users.rows[0].user_count}`);
    console.log('✅ Database is working perfectly!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await client.end();
  }
}

testDatabase();
