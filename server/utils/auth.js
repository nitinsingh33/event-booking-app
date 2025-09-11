import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService.js';

// Generate JWT token
export function generateToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// Middleware to authenticate requests
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await UserService.findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// Middleware to check if user is admin
export function requireAdmin(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// Middleware to check if user is admin or organizer
export function requireOrganizer(req, res, next) {
  if (!['ADMIN', 'ORGANIZER'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Organizer access required' });
  }
  next();
}
