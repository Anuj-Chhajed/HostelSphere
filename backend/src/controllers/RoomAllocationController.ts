import { Request, Response, NextFunction } from 'express';
import { RoomAllocationService } from '../services/RoomAllocationService';
import { AppError } from '../middleware/errorHandler';

export class RoomAllocationController {
  private allocationService: RoomAllocationService;

  constructor() {
    this.allocationService = new RoomAllocationService();
  }

  public requestAllocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // In a real app, we extract studentId from req.user if they are a student
      const studentId = req.user?.userId;
      if (!studentId) throw new AppError('Not authenticated', 401);

      // Verify the user is actually a student
      const prisma = require('../config/db').default.getInstance().getClient();
      const student = await prisma.student.findUnique({ where: { userId: studentId }});
      
      if (!student) throw new AppError('Only students can request matching', 403);

      const requestDto = {
        studentId: student.id, // Using the internal student_id from students table
        preferredType: req.body.preferredType,
        roomId: req.body.roomId,
      };

      const result = await this.allocationService.requestAllocation(requestDto);

      res.status(201).json({
        success: true,
        message: 'Room requested successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  public approveAllocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const userId = req.user?.userId;
      if (!userId) throw new AppError('Not authenticated', 401);

      // Verify warden
      const prisma = require('../config/db').default.getInstance().getClient();
      const warden = await prisma.warden.findUnique({ where: { userId: userId }});
      
      if (!warden) throw new AppError('Only wardens can approve allocations', 403);

      const result = await this.allocationService.approveAllocation(id, warden.id);

      res.status(200).json({
        success: true,
        message: 'Allocation approved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  public occupyRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.allocationService.occupyRoom(id);

      res.status(200).json({
        success: true,
        message: 'Room marked as occupied successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.allocationService.getAllocations();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };
}
