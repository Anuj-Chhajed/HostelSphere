import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/AuditService';

const auditService = new AuditService();

export const auditMiddleware = (entityType: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // We only want to log after the request has finished so we don't block the actual intent
    res.on('finish', () => {
      // Don't log if it was a generic GET request or an error response
      if (req.method === 'GET' && res.statusCode < 400) return;
      if (res.statusCode >= 400) return; // Only log successful mutating actions

      const userId = req.user?.userId || null;
      let action = 'UNKNOWN';

      if (req.method === 'POST') action = 'CREATE';
      if (req.method === 'PUT' || req.method === 'PATCH') action = 'UPDATE';
      if (req.method === 'DELETE') action = 'DELETE';

      // Attempt to extract entityId from params or body if possible
      const entityId = req.params.id || req.body.id || null;
      
      const details = {
        method: req.method,
        path: req.path,
        body: Object.keys(req.body).length > 0 ? 'HIDDEN_FOR_SECURITY' : null, 
      };

      const ip = req.ip || req.connection.remoteAddress || null;

      // Send to background service
      auditService.logAction(userId, action, entityType, entityId, details, ip);
    });

    next();
  };
};
