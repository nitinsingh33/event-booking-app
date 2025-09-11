import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'college_events_db',
  user: 'college_app_user',
  password: 'nitinsingh',
});

async function checkConstraints() {
  try {
    console.log('🔍 Checking users table constraints...');
    
    const result = await pool.query(`
      SELECT tc.constraint_name, tc.constraint_type, cc.check_clause
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
      WHERE tc.table_name = 'users'
    `);
    
    console.log('📋 Table constraints:');
    result.rows.forEach(constraint => {
      console.log(`  - ${constraint.constraint_name}: ${constraint.constraint_type}`);
      if (constraint.check_clause) {
        console.log(`    Check: ${constraint.check_clause}`);
      }
    });
    
    // Also check what values exist currently
    const roles = await pool.query('SELECT DISTINCT role FROM users WHERE role IS NOT NULL');
    console.log('\n📊 Current role values:');
    roles.rows.forEach(row => {
      console.log(`  - ${row.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking constraints:', error.message);
  } finally {
    await pool.end();
  }
}

checkConstraints();
