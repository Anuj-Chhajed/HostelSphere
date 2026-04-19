import { Request, Response, NextFunction } from 'express';
import { MessService } from '../services/MessService';
import { MessPlanType } from '../interfaces/enums';

export class MessController {
  private messService: MessService;

  constructor() {
    this.messService = new MessService();
  }

  public getAvailablePlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const plans = await this.messService.getAvailablePlans();
      res.status(200).json({ success: true, data: plans });
    } catch (error) {
      next(error);
    }
  };

  public createPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const plan = await this.messService.createPlan(req.body);
      res.status(201).json({ success: true, data: plan });
    } catch (error) {
      next(error);
    }
  };

  public subscribeToPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentUserId = req.user!.userId;
      const { planId } = req.body;
      const sub = await this.messService.subscribeToPlan(studentUserId, planId);
      res.status(200).json({ success: true, message: 'Subscribed to mess plan', data: sub });
    } catch (error) {
      next(error);
    }
  };

  public getMySubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentUserId = req.user!.userId;
      const sub = await this.messService.getMySubscription(studentUserId);
      res.status(200).json({ success: true, data: sub });
    } catch (error) {
      next(error);
    }
  };

  public setMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const menu = await this.messService.setMenu(req.body);
      res.status(200).json({ success: true, data: menu });
    } catch (error) {
      next(error);
    }
  };

  public getWeeklyMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const planType = req.query.planType as MessPlanType;
      const menu = await this.messService.getWeeklyMenu(planType);
      res.status(200).json({ success: true, data: menu });
    } catch (error) {
      next(error);
    }
  };
}
