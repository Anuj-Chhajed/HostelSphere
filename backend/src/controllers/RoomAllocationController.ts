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

  public updateAllocationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, remarks, roomId } = req.body;
      const userId = req.user?.userId;
      
      if (!userId) throw new AppError('Not authenticated', 401);

      // Verify warden
      const prisma = require('../config/db').default.getInstance().getClient();
      const warden = await prisma.warden.findUnique({ where: { userId: userId }});
      
      if (!warden) throw new AppError('Only wardens can approve or reject allocations', 403);

      let result;
      if (status === 'APPROVED') {
        result = await this.allocationService.approveAllocation(id as string, warden.id, roomId);
      } else if (status === 'REJECTED') {
        result = await this.allocationService.rejectAllocation(id as string, warden.id, remarks || 'Rejected by Warden');
      } else {
        throw new AppError('Invalid status. Only APPROVED or REJECTED allowed via this endpoint', 400);
      }

      res.status(200).json({
        success: true,
        message: `Allocation ${status.toLowerCase()} successfully`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  public occupyRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.allocationService.occupyRoom(id as string);

      res.status(200).json({
        success: true,
        message: 'Room marked as occupied successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  public vacateRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.allocationService.vacateRoom(id as string);

      res.status(200).json({
        success: true,
        message: 'Resident successfully vacated from the room',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  public withdrawAllocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const studentUserId = req.user!.userId;
      await this.allocationService.withdrawAllocation(id, studentUserId);
      res.status(200).json({ success: true, message: 'Allocation successfully withdrawn' });
    } catch (error) {
      next(error);
    }
  };

  public getMyAllocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentUserId = req.user!.userId;
      const data = await this.allocationService.getMyAllocations(studentUserId);
      res.status(200).json({ success: true, data });
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
