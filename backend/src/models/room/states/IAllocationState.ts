import { AllocationStatus } from '../../../interfaces/enums';
import { RoomAllocationContext } from '../RoomAllocationContext';

export interface IAllocationState {
  approve(context: RoomAllocationContext, wardenId: string): void;
  reject(context: RoomAllocationContext, reason: string): void;
  occupy(context: RoomAllocationContext): void;
  vacate(context: RoomAllocationContext): void;
  getStatus(): AllocationStatus;
}
