import Database from '../config/db';
import { AppError } from '../middleware/errorHandler';
import { AttendanceStatus } from '../interfaces/enums';

export class AttendanceService {
  private prisma = Database.getInstance().getClient();

  public async markAttendance(studentUserId: string, dateStr: string, status: AttendanceStatus, wardenUserId: string): Promise<any> {
    const student = await this.prisma.student.findUnique({ where: { userId: studentUserId }});
    if (!student) throw new AppError('Student not found', 404);

    const warden = await this.prisma.warden.findUnique({ where: { userId: wardenUserId }});
    if (!warden) throw new AppError('Warden not found', 404);

    const date = new Date(dateStr);

    // Upsert since you can only have 1 record per student per day
    return this.prisma.attendanceRecord.upsert({
      where: {
        studentId_date: { studentId: student.id, date }
      },
      update: {
        status,
        markedBy: warden.id
      },
      create: {
        studentId: student.id,
        date,
        status,
        markedBy: warden.id
      }
    });
  }

  public async getMyAttendance(studentUserId: string, month: number, year: number): Promise<any[]> {
    const student = await this.prisma.student.findUnique({ where: { userId: studentUserId }});
    if (!student) throw new AppError('Student not found', 404);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month

    return this.prisma.attendanceRecord.findMany({
      where: {
        studentId: student.id,
        date: { gte: startDate, lte: endDate }
      },
      orderBy: { date: 'asc' }
    });
  }

  public async logExit(studentUserId: string, gate: string, wardenUserId: string): Promise<any> {
    const student = await this.prisma.student.findUnique({ where: { userId: studentUserId }});
    if (!student) throw new AppError('Student not found', 404);

    const warden = await this.prisma.warden.findUnique({ where: { userId: wardenUserId }});
    if (!warden) throw new AppError('Warden not found', 404);

    // Create a new log with just exit time
    return this.prisma.entryExitLog.create({
      data: {
        studentId: student.id,
        gate,
        exitTime: new Date(),
        loggedBy: warden.id
      }
    });
  }

  public async logEntry(studentUserId: string, wardenUserId: string): Promise<any> {
    const student = await this.prisma.student.findUnique({ where: { userId: studentUserId }});
    if (!student) throw new AppError('Student not found', 404);

    // Find the latest open exit log for this student
    const openLog = await this.prisma.entryExitLog.findFirst({
      where: {
        studentId: student.id,
        entryTime: null // Hasn't entered yet
      },
      orderBy: { exitTime: 'desc' }
    });

    if (!openLog) throw new AppError('No open exit pass found for student', 400);

    return this.prisma.entryExitLog.update({
      where: { id: openLog.id },
      data: {
        entryTime: new Date()
      }
    });
  }
}
