import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/AuditService';

export class AuditController {
  private auditService: AuditService;

  constructor() {
    this.auditService = new AuditService();
  }

  public getLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = Number(req.query.limit) || 100;
      const logs = await this.auditService.getLogs(limit);
      
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  };
}
