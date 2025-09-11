import prisma from '../lib/prisma.js';

// Seed data for testing
const sampleEvents = [
  {
    name: "Tech Symposium 2025",
    description: "Annual technology symposium featuring latest innovations in AI and Machine Learning",
    eventType: "TECHNICAL",
    date: new Date("2025-10-15"),
    startTime: new Date("2025-10-15T09:00:00"),
    endTime: new Date("2025-10-15T17:00:00"),
    location: "Main Auditorium",
    maxSeats: 200,
    availableSeats: 200,
    registrationFee: 0,
    organizerName: "Computer Science Department",
    organizerContact: "cs@college.edu",
    requirements: "Basic knowledge of programming"
  },
  {
    name: "Cultural Festival",
    description: "Celebrate diversity with music, dance, and art from around the world",
    eventType: "CULTURAL",
    date: new Date("2025-11-01"),
    startTime: new Date("2025-11-01T18:00:00"),
    endTime: new Date("2025-11-01T22:00:00"),
    location: "Campus Grounds",
    maxSeats: 500,
    availableSeats: 500,
    registrationFee: 10,
    organizerName: "Student Council",
    organizerContact: "council@college.edu"
  },
  {
    name: "Career Workshop",
    description: "Resume building and interview preparation workshop",
    eventType: "WORKSHOP",
    date: new Date("2025-09-25"),
    startTime: new Date("2025-09-25T14:00:00"),
    endTime: new Date("2025-09-25T16:00:00"),
    location: "Conference Room A",
    maxSeats: 50,
    availableSeats: 50,
    registrationFee: 0,
    organizerName: "Career Services",
    organizerContact: "careers@college.edu"
  }
];

const sampleUsers = [
  {
    name: "John Doe",
    email: "john.doe@college.edu",
    password: "$2b$10$rQk5FQQqI7yI0WUyQZ5QYO3vQ3EqXJ5QwqJ4gQyJ7QqJ5QwqJ6QqJ7", // "password123"
    college: "ABC College",
    studentId: "CS2021001",
    phone: "+1234567890",
    role: "STUDENT"
  },
  {
    name: "Admin User",
    email: "admin@college.edu", 
    password: "$2b$10$rQk5FQQqI7yI0WUyQZ5QYO3vQ3EqXJ5QwqJ4gQyJ7QqJ5QwqJ6QqJ7", // "password123"
    college: "ABC College",
    role: "ADMIN"
  }
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // Create users
    console.log("👥 Creating sample users...");
    for (const userData of sampleUsers) {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      });
    }

    // Create events
    console.log("🎉 Creating sample events...");
    for (const eventData of sampleEvents) {
      await prisma.event.upsert({
        where: { name: eventData.name },
        update: {},
        create: eventData
      });
    }

    console.log("✅ Database seeded successfully!");
    console.log(`📊 Created ${sampleUsers.length} users and ${sampleEvents.length} events`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
