import Database from '../config/db';
import { AppError } from '../middleware/errorHandler';

export class NotificationService {
  private prisma = Database.getInstance().getClient();

  public async getMyNotifications(userId: string, unreadOnly: boolean = false): Promise<any[]> {
    const filter: any = { userId };
    
    if (unreadOnly) {
      filter.isRead = false;
    }

    return this.prisma.notification.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });
  }

  public async markAsRead(notificationId: string, userId: string): Promise<any> {
    const notification = await this.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification) throw new AppError('Notification not found', 404);
    if (notification.userId !== userId) throw new AppError('Unauthorized', 403);

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }

  public async markAllAsRead(userId: string): Promise<any> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });

    return { updatedCount: result.count };
  }
}
