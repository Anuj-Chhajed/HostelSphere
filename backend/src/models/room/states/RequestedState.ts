import { IAllocationState } from './IAllocationState';
import { RoomAllocationContext } from '../RoomAllocationContext';
import { AllocationStatus } from '../../../interfaces/enums';
import { AppError } from '../../../middleware/errorHandler';
import { ApprovedState } from './ApprovedState';

export class RequestedState implements IAllocationState {
  approve(context: RoomAllocationContext, wardenId: string): void {
    context.setApprovedBy(wardenId);
    context.setApprovalDate(new Date());
    context.setState(new ApprovedState());
  }

  reject(context: RoomAllocationContext, reason: string): void {
    context.setRemarks(reason);
    // In our system, rejecting means it goes to REJECTED status (which would be a terminal state)
    // We could make a RejectedState, but let's assume it just stops the flow and marks it rejected in DB via Context
    context.markAsRejected();
  }

  occupy(context: RoomAllocationContext): void {
    throw new AppError('Cannot occupy a room before it is approved.', 400);
  }

  vacate(context: RoomAllocationContext): void {
    throw new AppError('Cannot vacate a room that is only requested.', 400);
  }

  getStatus(): AllocationStatus {
    return AllocationStatus.REQUESTED;
  }
}
