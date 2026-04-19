import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/PaymentService';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  public generateMonthlyBills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { month, year } = req.body;
      const bills = await this.paymentService.generateMonthlyBills(month, Number(year));
      
      res.status(201).json({
        success: true,
        message: `Generated bills for ${month} ${year}`,
        data: bills
      });
    } catch (error) {
      next(error);
    }
  };

  public applyLatePenalties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedCount = await this.paymentService.applyLatePenalties();
      
      res.status(200).json({
        success: true,
        message: `Applied penalties to ${updatedCount} overdue accounts.`
      });
    } catch (error) {
      next(error);
    }
  };

  public processPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const method = req.body.method as any; // Cast to avoid TS overload confusion
      
      const userId = req.user!.userId;

      const result = await this.paymentService.processPayment(id, userId, method);
      
      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  public getMyPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const data = await this.paymentService.getMyPayments(userId);
      
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.paymentService.getAllPayments();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}
