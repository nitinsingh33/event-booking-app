import pkg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'college_events_db',
  user: 'college_app_user',
  password: 'nitinsingh',
});

async function runEnhancedSchema() {
  try {
    console.log('🔄 Running enhanced schema migration...');
    
    const schemaSQL = readFileSync(join(__dirname, '../database/enhanced-schema.sql'), 'utf8');
    
    // Execute the schema
    await pool.query(schemaSQL);
    
    console.log('✅ Enhanced schema migration completed successfully!');
    console.log('🏢 Created comprehensive user management system with:');
    console.log('   - Multi-college support');
    console.log('   - Department management');  
    console.log('   - Enhanced user profiles');
    console.log('   - Session tracking');
    console.log('   - Activity audit logs');
    console.log('   - User preferences');
    console.log('   - Professional event registration system');
    
  } catch (error) {
    console.error('❌ Error running enhanced schema:', error.message);
    
    // If there are constraint errors, try to handle them gracefully
    if (error.message.includes('already exists')) {
      console.log('⚠️  Some tables already exist. This is normal if running multiple times.');
    }
  } finally {
    await pool.end();
  }
}

runEnhancedSchema();
