import prisma from '../lib/prisma.js';
import { generateTicketCode } from '../utils/ticketGenerator.js';

export class EventService {
  // Get all active events
  static async getAllEvents() {
    return await prisma.event.findMany({
      where: { isActive: true },
      include: {
        timeSlots: true,
        _count: {
          select: {
            eventRegistrations: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
  }

  // Get event by ID
  static async getEventById(id) {
    return await prisma.event.findUnique({
      where: { id },
      include: {
        timeSlots: true,
        eventRegistrations: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
  }

  // Create new event
  static async createEvent(eventData) {
    const { timeSlots, ...eventInfo } = eventData;
    
    return await prisma.event.create({
      data: {
        ...eventInfo,
        timeSlots: timeSlots ? {
          create: timeSlots
        } : undefined
      },
      include: {
        timeSlots: true
      }
    });
  }

  // Register for event
  static async registerForEvent(registrationData) {
    const { eventId, timeSlotId, seats, ...userData } = registrationData;
    
    // Check if event exists and has available seats
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    if (event.availableSeats < seats) {
      throw new Error('Not enough seats available');
    }

    // Generate unique ticket code
    const ticketCode = generateTicketCode();
    
    // Create registration and update available seats in transaction
    return await prisma.$transaction(async (tx) => {
      // Create registration
      const registration = await tx.eventRegistration.create({
        data: {
          ...userData,
          eventId,
          timeSlotId,
          seats,
          ticketCode
        },
        include: {
          event: true,
          timeSlot: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      // Update available seats
      await tx.event.update({
        where: { id: eventId },
        data: {
          availableSeats: {
            decrement: seats
          }
        }
      });

      // Update time slot capacity if applicable
      if (timeSlotId) {
        await tx.timeSlot.update({
          where: { id: timeSlotId },
          data: {
            currentCount: {
              increment: seats
            }
          }
        });
      }

      return registration;
    });
  }

  // Get registration by ticket code
  static async getRegistrationByTicket(ticketCode) {
    return await prisma.eventRegistration.findUnique({
      where: { ticketCode },
      include: {
        event: true,
        timeSlot: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  }

  // Cancel registration
  static async cancelRegistration(registrationId) {
    return await prisma.$transaction(async (tx) => {
      const registration = await tx.eventRegistration.findUnique({
        where: { id: registrationId }
      });

      if (!registration) {
        throw new Error('Registration not found');
      }

      // Update registration status
      const cancelledRegistration = await tx.eventRegistration.update({
        where: { id: registrationId },
        data: { status: 'CANCELLED' }
      });

      // Restore available seats
      await tx.event.update({
        where: { id: registration.eventId },
        data: {
          availableSeats: {
            increment: registration.seats
          }
        }
      });

      // Update time slot capacity if applicable
      if (registration.timeSlotId) {
        await tx.timeSlot.update({
          where: { id: registration.timeSlotId },
          data: {
            currentCount: {
              decrement: registration.seats
            }
          }
        });
      }

      return cancelledRegistration;
    });
  }

  // Get events by type
  static async getEventsByType(eventType) {
    return await prisma.event.findMany({
      where: { 
        eventType,
        isActive: true 
      },
      include: {
        timeSlots: true,
        _count: {
          select: {
            eventRegistrations: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
  }

  // Search events
  static async searchEvents(searchTerm) {
    return await prisma.event.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
              { location: { contains: searchTerm, mode: 'insensitive' } }
            ]
          }
        ]
      },
      include: {
        timeSlots: true,
        _count: {
          select: {
            eventRegistrations: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
  }
}
