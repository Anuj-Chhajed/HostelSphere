import { IComplaintObserver, ComplaintEvent } from './IComplaintObserver';
import Database from '../../../config/db';
import { NotificationType } from '../../../interfaces/enums';

export class StudentNotificationObserver implements IComplaintObserver {
  private prisma = Database.getInstance().getClient();

  async onComplaintUpdate(event: ComplaintEvent): Promise<void> {
    const { complaint, action, newStatus } = event;

    // We only want to notify the student if the complaint was assigned, resolved, or closed.
    if (action === 'STATUS_CHANGED' || action === 'ASSIGNED') {
      const student = await this.prisma.student.findUnique({ where: { id: complaint.studentId } });
      if (!student) return;

      const title = `Complaint Status Updated`;
      const message = `Your complaint "${complaint.title}" is now ${newStatus}.`;

      await this.prisma.notification.create({
        data: {
          userId: student.userId, // Sending to base User
          type: NotificationType.COMPLAINT_UPDATE,
          title,
          message,
        }
      });
    }
  }
}
