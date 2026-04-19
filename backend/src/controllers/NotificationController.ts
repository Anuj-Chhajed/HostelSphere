import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/NotificationService';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public getMyNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const unreadOnly = req.query.unreadOnly === 'true';

      const notifications = await this.notificationService.getMyNotifications(userId, unreadOnly);
      
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  };

  public markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const userId = req.user!.userId;

      await this.notificationService.markAsRead(id, userId);
      
      res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  };

  public markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;

      const result = await this.notificationService.markAllAsRead(userId);
      
      res.status(200).json({ success: true, message: `Marked ${result.updatedCount} notifications as read` });
    } catch (error) {
      next(error);
    }
  };
}
