import { IAllocationState } from './states/IAllocationState';
import { RequestedState } from './states/RequestedState';
import { ApprovedState } from './states/ApprovedState';
import { OccupiedState } from './states/OccupiedState';
import { VacatedState } from './states/VacatedState';
import { AllocationStatus, RoomType } from '../../interfaces/enums';

// The Context class for the State Pattern
export class RoomAllocationContext {
  private id: string;
  private studentId: string;
  private roomId: string | null;
  private preferredType: RoomType | null;
  private state: IAllocationState;
  
  private requestDate: Date;
  private approvalDate: Date | null = null;
  private occupiedDate: Date | null = null;
  private vacatedDate: Date | null = null;
  private approvedBy: string | null = null;
  private remarks: string | null = null;

  // We add this to track terminal REJECTED status which doesn't need a full state class
  private isRejected: boolean = false;

  constructor(data: any) {
    this.id = data.id;
    this.studentId = data.studentId;
    this.roomId = data.roomId || null;
    this.preferredType = data.preferredType || null;
    this.requestDate = data.requestDate || new Date();
    this.approvalDate = data.approvalDate || null;
    this.occupiedDate = data.occupiedDate || null;
    this.vacatedDate = data.vacatedDate || null;
    this.approvedBy = data.approvedBy || null;
    this.remarks = data.remarks || null;

    // Initialize state based on DB status
    switch (data.status) {
      case AllocationStatus.APPROVED:
        this.state = new ApprovedState();
        break;
      case AllocationStatus.OCCUPIED:
        this.state = new OccupiedState();
        break;
      case AllocationStatus.VACATED:
        this.state = new VacatedState();
        break;
      case AllocationStatus.REJECTED:
        this.isRejected = true;
        this.state = new RequestedState(); // Doesn't matter, it's rejected
        break;
      case AllocationStatus.REQUESTED:
      default:
        this.state = new RequestedState();
        break;
    }
  }

  // --- State Transitions (delegated to current state) ---
  public approve(wardenId: string): void {
    if (this.isRejected) throw new Error('Cannot modify a rejected allocation');
    this.state.approve(this, wardenId);
  }

  public reject(reason: string): void {
    if (this.isRejected) throw new Error('Allocation is already rejected');
    this.state.reject(this, reason);
  }

  public occupy(): void {
    if (this.isRejected) throw new Error('Cannot occupy a rejected allocation');
    this.state.occupy(this);
  }

  public vacate(): void {
    if (this.isRejected) throw new Error('Cannot vacate a rejected allocation');
    this.state.vacate(this);
  }

  // --- State Callbacks (used by State classes) ---
  public setState(newState: IAllocationState): void {
    this.state = newState;
  }

  public markAsRejected(): void {
    this.isRejected = true;
  }

  public setApprovedBy(wardenId: string): void { this.approvedBy = wardenId; }
  public setApprovalDate(date: Date): void { this.approvalDate = date; }
  public setOccupiedDate(date: Date): void { this.occupiedDate = date; }
  public setVacatedDate(date: Date): void { this.vacatedDate = date; }
  public setRemarks(remarks: string): void { this.remarks = remarks; }
  public setRoomId(roomId: string): void { this.roomId = roomId; }

  // --- Getters to extract data for saving to DB ---
  public getStatus(): AllocationStatus {
    if (this.isRejected) return AllocationStatus.REJECTED;
    return this.state.getStatus();
  }

  public toJSON(): object {
    return {
      id: this.id,
      studentId: this.studentId,
      roomId: this.roomId,
      preferredType: this.preferredType,
      status: this.getStatus(),
      requestDate: this.requestDate,
      approvalDate: this.approvalDate,
      occupiedDate: this.occupiedDate,
      vacatedDate: this.vacatedDate,
      approvedBy: this.approvedBy,
      remarks: this.remarks
    };
  }
}
