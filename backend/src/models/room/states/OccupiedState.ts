import { IAllocationState } from './IAllocationState';
import { RoomAllocationContext } from '../RoomAllocationContext';
import { AllocationStatus } from '../../../interfaces/enums';
import { AppError } from '../../../middleware/errorHandler';
import { VacatedState } from './VacatedState';

export class OccupiedState implements IAllocationState {
  approve(context: RoomAllocationContext, wardenId: string): void {
    throw new AppError('Allocation is already approved and occupied.', 400);
  }

  reject(context: RoomAllocationContext, reason: string): void {
    throw new AppError('Cannot reject an allocation that is currently occupied.', 400);
  }

  occupy(context: RoomAllocationContext): void {
    throw new AppError('Room is already occupied by the student.', 400);
  }

  vacate(context: RoomAllocationContext): void {
    context.setVacatedDate(new Date());
    context.setState(new VacatedState());
  }

  getStatus(): AllocationStatus {
    return AllocationStatus.OCCUPIED;
  }
}
