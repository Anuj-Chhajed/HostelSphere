import { IFeeCalculationStrategy, FeeContext } from './IFeeCalculationStrategy';
import { AppError } from '../../../middleware/errorHandler';

export class LatePenaltyFeeStrategy implements IFeeCalculationStrategy {
  // Configurable rules
  private penaltyRatePerDay: number = 50; // $50/Rs.50 per day late
  private gracePeriodDays: number = 5;

  async calculateFee(context: FeeContext): Promise<number> {
    if (!context.payment) {
      throw new AppError('Payment record is required to calculate late penalty', 400);
    }

    if (!context.daysLate || context.daysLate <= this.gracePeriodDays) {
      return 0; // No penalty if within grace period or not late
    }

    const chargeableDays = context.daysLate - this.gracePeriodDays;
    return chargeableDays * this.penaltyRatePerDay;
  }
}
