import { Response, NextFunction } from 'express';
import { AuthRequest } from './types';
import { verifyToken } from './auth';

/**
 * Middleware to verify JWT token
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }

  req.user = {
    id: decoded.id,
    email: decoded.email,
    roleId: decoded.roleId,
  };

  next();
};

/**
 * Middleware to verify customer role
 */
export const requireCustomerRole = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  // Assuming roleId 3 is Customer (based on your insert: Admin=1, Staff=2, Customer=3)
  if (req.user.roleId !== 3) {
    return res.status(403).json({ success: false, message: 'Only customers can access this resource' });
  }

  next();
};

/**
 * Middleware to verify staff role
 */
export const requireStaffRole = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  // Admin=1, Staff=2
  if (req.user.roleId !== 1 && req.user.roleId !== 2) {
    return res.status(403).json({ success: false, message: 'Only staff can access this resource' });
  }

  next();
};

/**
 * Middleware to verify admin role
 */
export const requireAdminRole = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  // Admin=1
  if (req.user.roleId !== 1) {
    return res.status(403).json({ success: false, message: 'Only admins can access this resource' });
  }

  next();
};
