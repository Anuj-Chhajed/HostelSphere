import { User, DashboardData } from './User';
import { UserRole } from '../../interfaces/enums';

export class Student extends User {
  private enrollmentNumber: string;
  private department?: string;
  private year?: number;
  private emergencyContact?: string;

  constructor(data: any) {
    super(data);
    this.enrollmentNumber = data.student?.enrollmentNumber || data.enrollmentNumber;
    this.department = data.student?.department || data.department;
    this.year = data.student?.year || data.year;
    this.emergencyContact = data.student?.emergencyContact || data.emergencyContact;
  }

  public getEnrollmentNumber(): string { return this.enrollmentNumber; }
  public getDepartment(): string | undefined { return this.department; }
  public getYear(): number | undefined { return this.year; }
  public getEmergencyContact(): string | undefined { return this.emergencyContact; }

  async getDashboard(): Promise<DashboardData> {
    // In a real scenario, this would query the DB for student-specific stats
    return {
      title: 'Student Dashboard',
      stats: {
        pendingFees: 0,
        activeComplaints: 0,
        attendancePercentage: 100,
      },
      quickActions: ['Request Room', 'Pay Fees', 'Raise Complaint']
    };
  }

  getPermissions(): string[] {
    return [
      'REQUEST_ROOM',
      'MAKE_PAYMENT',
      'RAISE_COMPLAINT',
      'VIEW_ATTENDANCE',
      'SELECT_MESS_PLAN'
    ];
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      enrollmentNumber: this.enrollmentNumber,
      department: this.department,
      year: this.year,
      emergencyContact: this.emergencyContact,
    };
  }
}
