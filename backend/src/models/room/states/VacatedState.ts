import { IAllocationState } from './IAllocationState';
import { RoomAllocationContext } from '../RoomAllocationContext';
import { AllocationStatus } from '../../../interfaces/enums';
import { AppError } from '../../../middleware/errorHandler';

export class VacatedState implements IAllocationState {
  approve(context: RoomAllocationContext, wardenId: string): void {
    throw new AppError('Cannot approve a vacated allocation.', 400);
  }

  reject(context: RoomAllocationContext, reason: string): void {
    throw new AppError('Cannot reject a vacated allocation.', 400);
  }

  occupy(context: RoomAllocationContext): void {
    throw new AppError('Cannot occupy a vacated allocation. Create a new request.', 400);
  }

  vacate(context: RoomAllocationContext): void {
    throw new AppError('Allocation is already vacated.', 400);
  }

  getStatus(): AllocationStatus {
    return AllocationStatus.VACATED;
  }
}
