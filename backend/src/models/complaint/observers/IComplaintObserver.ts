import { Complaint, ComplaintStatus } from '../../../generated/prisma';

export interface ComplaintEvent {
  complaint: Complaint;
  previousStatus?: ComplaintStatus;
  newStatus?: ComplaintStatus;
  action: 'CREATED' | 'STATUS_CHANGED' | 'ASSIGNED' | 'ESCALATED';
}

export interface IComplaintObserver {
  onComplaintUpdate(event: ComplaintEvent): Promise<void>;
}
