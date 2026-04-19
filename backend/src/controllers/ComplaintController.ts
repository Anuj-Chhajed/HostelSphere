import { Request, Response, NextFunction } from 'express';
import { ComplaintService } from '../services/ComplaintService';
import { ComplaintStatus } from '../interfaces/enums';

export class ComplaintController {
  private complaintService: ComplaintService;

  constructor() {
    this.complaintService = new ComplaintService();
  }

  public raiseComplaint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentUserId = req.user!.userId;
      const complaint = await this.complaintService.raiseComplaint(studentUserId, req.body);
      
      res.status(201).json({
        success: true,
        message: 'Complaint raised successfully',
        data: complaint
      });
    } catch (error) {
      next(error);
    }
  };

  public assignComplaint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const wardenUserId = req.user!.userId;

      const complaint = await this.complaintService.assignComplaint(id, wardenUserId);
      
      res.status(200).json({
        success: true,
        message: 'Complaint assigned to you',
        data: complaint
      });
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const status = req.body.status as ComplaintStatus;

      const complaint = await this.complaintService.updateStatus(id, status);
      
      res.status(200).json({
        success: true,
        message: 'Complaint status updated',
        data: complaint
      });
    } catch (error) {
      next(error);
    }
  };

  public escalateComplaint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const complaint = await this.complaintService.escalateComplaint(id);
      
      res.status(200).json({
        success: true,
        message: 'Complaint escalated to admin',
        data: complaint
      });
    } catch (error) {
      next(error);
    }
  };

  public getMyComplaints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentUserId = req.user!.userId;
      const complaints = await this.complaintService.getComplaintsForStudent(studentUserId);
      
      res.status(200).json({
        success: true,
        data: complaints
      });
    } catch (error) {
      next(error);
    }
  };

  public withdrawComplaint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const studentUserId = req.user!.userId;
      await this.complaintService.withdrawComplaint(id, studentUserId);
      res.status(200).json({ success: true, message: 'Complaint successfully withdrawn' });
    } catch (error) {
      next(error);
    }
  };

  public getAllComplaints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const complaints = await this.complaintService.getAllComplaints();
      
      res.status(200).json({
        success: true,
        data: complaints
      });
    } catch (error) {
      next(error);
    }
  };
}
