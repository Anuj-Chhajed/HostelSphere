import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { UserRole } from '../interfaces/enums';

/**
 * Middleware to check if the authenticated user has one of the required roles.
 * @param roles Array of allowed UserRoles
 */
export const requireRoles = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // req.user should be populated by authenticateToken middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
