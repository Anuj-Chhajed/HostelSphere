import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import dotenv from 'dotenv';
import { UserRole } from '../interfaces/enums';

dotenv.config();

// Extend the Express Request object to include our user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  // Token is typically sent as: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('No token provided, authorization denied', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: UserRole };
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    next(new AppError('Token is invalid or expired', 403));
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
