import { User, DashboardData } from './User';
import { UserRole } from '../../interfaces/enums';

export class Warden extends User {
  private assignedBlockId?: string;
  private assignedFloor?: number;

  constructor(data: any) {
    super(data);
    this.assignedBlockId = data.warden?.assignedBlockId || data.assignedBlockId;
    this.assignedFloor = data.warden?.assignedFloor || data.assignedFloor;
  }

  public getAssignedBlockId(): string | undefined { return this.assignedBlockId; }
  public getAssignedFloor(): number | undefined { return this.assignedFloor; }

  async getDashboard(): Promise<DashboardData> {
    return {
      title: 'Warden Dashboard',
      stats: {
        pendingAllocations: 0,
        openComplaints: 0,
        absentStudentsToday: 0,
      },
      quickActions: ['Approve Allocations', 'Manage Complaints', 'Mark Attendance']
    };
  }

  getPermissions(): string[] {
    return [
      'APPROVE_ALLOCATION',
      'MANAGE_COMPLAINT',
      'MARK_ATTENDANCE',
      'LOG_ENTRY_EXIT',
      'GET_ATTENDANCE_REPORT'
    ];
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      assignedBlockId: this.assignedBlockId,
      assignedFloor: this.assignedFloor,
    };
  }
}
