import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'college_events_db',
  user: 'college_app_user',
  password: 'nitinsingh',
});

async function checkUserTableSchema() {
  try {
    console.log('🔍 Checking users table schema...');
    
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Current users table columns:');
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULL)'}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  } finally {
    await pool.end();
  }
}

checkUserTableSchema();
