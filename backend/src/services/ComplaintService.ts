import Database from '../config/db';
import { AppError } from '../middleware/errorHandler';
import { ComplaintStatus, ComplaintPriority, ComplaintCategory } from '../interfaces/enums';
import { IComplaintObserver, ComplaintEvent } from '../models/complaint/observers/IComplaintObserver';
import { StudentNotificationObserver } from '../models/complaint/observers/StudentNotificationObserver';
import { WardenNotificationObserver } from '../models/complaint/observers/WardenNotificationObserver';
import { AdminEscalationObserver } from '../models/complaint/observers/AdminEscalationObserver';

export class ComplaintService {
  private prisma = Database.getInstance().getClient();
  private observers: IComplaintObserver[] = [];

  constructor() {
    // Register the standard observers
    this.subscribe(new StudentNotificationObserver());
    this.subscribe(new WardenNotificationObserver());
    this.subscribe(new AdminEscalationObserver());
  }

  // Implementation of the Subject -> Observer subscription
  public subscribe(observer: IComplaintObserver): void {
    this.observers.push(observer);
  }

  // Broadcast events to all observers
  private async notifyObservers(event: ComplaintEvent): Promise<void> {
    const promises = this.observers.map(observer => observer.onComplaintUpdate(event));
    await Promise.all(promises);
  }

  public async raiseComplaint(studentUserId: string, data: any): Promise<any> {
    const student = await this.prisma.student.findUnique({ where: { userId: studentUserId }});
    if (!student) throw new AppError('Only students can raise complaints', 403);

    const complaint = await this.prisma.complaint.create({
      data: {
        studentId: student.id,
        category: data.category as ComplaintCategory,
        title: data.title,
        description: data.description,
        priority: (data.priority as ComplaintPriority) || ComplaintPriority.LOW,
        status: ComplaintStatus.OPEN,
      }
    });

    // Notify observers about creation
    await this.notifyObservers({
      complaint,
      action: 'CREATED',
      newStatus: ComplaintStatus.OPEN
    });

    return complaint;
  }

  public async assignComplaint(complaintId: string, wardenUserId: string): Promise<any> {
    const warden = await this.prisma.warden.findUnique({ where: { userId: wardenUserId }});
    if (!warden) throw new AppError('Only wardens can be assigned to complaints', 403);

    const previousComplaint = await this.prisma.complaint.findUnique({ where: { id: complaintId }});
    if (!previousComplaint) throw new AppError('Complaint not found', 404);

    const complaint = await this.prisma.complaint.update({
      where: { id: complaintId },
      data: {
        assignedTo: warden.id,
        status: ComplaintStatus.ASSIGNED,
        updatedAt: new Date()
      }
    });

    await this.notifyObservers({
      complaint,
      previousStatus: previousComplaint.status as ComplaintStatus,
      newStatus: ComplaintStatus.ASSIGNED,
      action: 'ASSIGNED'
    });

    return complaint;
  }

  public async updateStatus(complaintId: string, status: ComplaintStatus): Promise<any> {
    const previousComplaint = await this.prisma.complaint.findUnique({ where: { id: complaintId }});
    if (!previousComplaint) throw new AppError('Complaint not found', 404);

    const dataToUpdate: any = { status, updatedAt: new Date() };

    // If it's being resolved or closed, keep track of when
    if (status === ComplaintStatus.RESOLVED || status === ComplaintStatus.CLOSED) {
        dataToUpdate.resolvedAt = new Date();
    }

    const complaint = await this.prisma.complaint.update({
      where: { id: complaintId },
      data: dataToUpdate
    });

    await this.notifyObservers({
      complaint,
      previousStatus: previousComplaint.status as ComplaintStatus,
      newStatus: status,
      action: 'STATUS_CHANGED'
    });

    return complaint;
  }

  public async escalateComplaint(complaintId: string): Promise<any> {
    const previousComplaint = await this.prisma.complaint.findUnique({ where: { id: complaintId }});
    if (!previousComplaint) throw new AppError('Complaint not found', 404);

    const complaint = await this.prisma.complaint.update({
      where: { id: complaintId },
      data: {
        priority: ComplaintPriority.URGENT,
        updatedAt: new Date()
      }
    });

    await this.notifyObservers({
      complaint,
      action: 'ESCALATED'
    });

    return complaint;
  }

  public async getComplaintsForStudent(studentUserId: string): Promise<any[]> {
    const student = await this.prisma.student.findUnique({ where: { userId: studentUserId }});
    if (!student) throw new AppError('Student not found', 404);

    return this.prisma.complaint.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' }
    });
  }

  public async getAllComplaints(): Promise<any[]> {
    return this.prisma.complaint.findMany({
      include: {
        student: { select: { user: { select: { name: true, email: true } } } },
        warden: { select: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
