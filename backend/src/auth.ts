import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWTPayload } from './types';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production_12345';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE } as any);
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
