import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/AttendanceService';
import { AttendanceStatus } from '../interfaces/enums';

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  public markAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { studentUserId, date, status } = req.body;
      const wardenUserId = req.user!.userId;

      const record = await this.attendanceService.markAttendance(
        studentUserId, 
        date, 
        status as AttendanceStatus, 
        wardenUserId
      );

      res.status(200).json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  };

  public getMyAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentUserId = req.user!.userId;
      const month = Number(req.query.month) || new Date().getMonth() + 1;
      const year = Number(req.query.year) || new Date().getFullYear();

      const records = await this.attendanceService.getMyAttendance(studentUserId, month, year);

      res.status(200).json({ success: true, data: records });
    } catch (error) {
      next(error);
    }
  };

  public logExit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { studentUserId, gate } = req.body;
      const wardenUserId = req.user!.userId;

      const log = await this.attendanceService.logExit(studentUserId, gate, wardenUserId);
      res.status(201).json({ success: true, data: log });
    } catch (error) {
      next(error);
    }
  };

  public logEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { studentUserId } = req.body;
      const wardenUserId = req.user!.userId;

      const log = await this.attendanceService.logEntry(studentUserId, wardenUserId);
      res.status(200).json({ success: true, data: log });
    } catch (error) {
      next(error);
    }
  };
}
