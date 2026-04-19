import { IAllocationState } from './IAllocationState';
import { RoomAllocationContext } from '../RoomAllocationContext';
import { AllocationStatus } from '../../../interfaces/enums';
import { AppError } from '../../../middleware/errorHandler';
import { OccupiedState } from './OccupiedState';

export class ApprovedState implements IAllocationState {
  approve(context: RoomAllocationContext, wardenId: string): void {
    throw new AppError('Allocation is already approved.', 400);
  }

  reject(context: RoomAllocationContext, reason: string): void {
    throw new AppError('Cannot reject an allocation that has already been approved.', 400);
  }

  occupy(context: RoomAllocationContext): void {
    context.setOccupiedDate(new Date());
    context.setState(new OccupiedState());
  }

  vacate(context: RoomAllocationContext): void {
    throw new AppError('Cannot vacate a room before it is occupied.', 400);
  }

  getStatus(): AllocationStatus {
    return AllocationStatus.APPROVED;
  }
}
