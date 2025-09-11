import crypto from 'crypto';

// Generate unique ticket code for event registrations
export function generateTicketCode() {
  const timestamp = Date.now().toString(36);
  const randomBytes = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `TICKET-${timestamp}-${randomBytes}`;
}

// Generate QR code data
export function generateQRData(registration) {
  return JSON.stringify({
    ticketCode: registration.ticketCode,
    eventName: registration.event.name,
    attendeeName: registration.fullName,
    eventDate: registration.event.date,
    seats: registration.seats,
    verificationHash: crypto
      .createHash('sha256')
      .update(`${registration.ticketCode}-${registration.eventId}-${registration.id}`)
      .digest('hex')
      .substring(0, 16)
  });
}

// Verify QR code integrity
export function verifyQRData(qrData, registration) {
  try {
    const data = JSON.parse(qrData);
    const expectedHash = crypto
      .createHash('sha256')
      .update(`${registration.ticketCode}-${registration.eventId}-${registration.id}`)
      .digest('hex')
      .substring(0, 16);
    
    return data.verificationHash === expectedHash;
  } catch (error) {
    return false;
  }
}
