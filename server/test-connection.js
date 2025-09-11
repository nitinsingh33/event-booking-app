import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('🔗 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as pg_version`;
    console.log('📊 Database info:', result[0]);
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.message.includes('does not exist')) {
      console.log('\n💡 Suggestion: Make sure the database "college_events_db" exists in pgAdmin');
    }
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Suggestion: Check username/password in .env file');
    }
    if (error.message.includes('Connection refused')) {
      console.log('\n💡 Suggestion: Make sure PostgreSQL service is running');
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
