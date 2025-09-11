import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';

export class UserService {
  // Create new user
  static async createUser(userData) {
    const { name, email, password, college, studentId, phone } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        college,
        studentId,
        phone
      },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        studentId: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });
  }

  // Find user by email
  static async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        eventRegistrations: {
          include: {
            event: true
          }
        }
      }
    });
  }

  // Find user by ID
  static async findUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        studentId: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });
  }

  // Update user profile
  static async updateUser(id, updateData) {
    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        studentId: true,
        phone: true,
        role: true,
        updatedAt: true
      }
    });
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get user's event registrations
  static async getUserRegistrations(userId) {
    return await prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: true,
        timeSlot: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
