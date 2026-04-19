import { IComplaintObserver, ComplaintEvent } from './IComplaintObserver';
import Database from '../../../config/db';
import { NotificationType, UserRole } from '../../../interfaces/enums';

export class WardenNotificationObserver implements IComplaintObserver {
  private prisma = Database.getInstance().getClient();

  async onComplaintUpdate(event: ComplaintEvent): Promise<void> {
    const { complaint, action } = event;

    // Notify wardens when a NEW complaint is created
    if (action === 'CREATED') {
      const title = `New Complaint Raised`;
      const message = `A new complaint "${complaint.title}" has been raised by a student.`;

      // In a real system, we might only notify the warden assigned to the block the student is in.
      // For now, notify all wardens.
      const wardens = await this.prisma.user.findMany({
        where: { role: UserRole.WARDEN }
      });

      const notifications = wardens.map(w => ({
        userId: w.id,
        type: NotificationType.COMPLAINT_UPDATE,
        title,
        message,
      }));

      if (notifications.length > 0) {
        await this.prisma.notification.createMany({ data: notifications });
      }
    }
  }
}
