import { IComplaintObserver, ComplaintEvent } from './IComplaintObserver';
import Database from '../../../config/db';
import { NotificationType, UserRole, ComplaintPriority } from '../../../interfaces/enums';

export class AdminEscalationObserver implements IComplaintObserver {
  private prisma = Database.getInstance().getClient();

  async onComplaintUpdate(event: ComplaintEvent): Promise<void> {
    const { complaint, action } = event;

    // Escalate to admin if explicitly escalated or created with URGENT priority
    if (action === 'ESCALATED' || (action === 'CREATED' && complaint.priority === ComplaintPriority.URGENT)) {
      const title = `Complaint Escalation Alert`;
      const message = `URGENT Complaint "${complaint.title}" requires administrative attention.`;

      const admins = await this.prisma.user.findMany({
        where: { role: UserRole.ADMIN }
      });

      const notifications = admins.map(a => ({
        userId: a.id,
        type: NotificationType.SYSTEM_ANNOUNCEMENT,
        title,
        message,
      }));

      if (notifications.length > 0) {
        await this.prisma.notification.createMany({ data: notifications });
      }
    }
  }
}
