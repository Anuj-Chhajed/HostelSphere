import { IFeeCalculationStrategy, FeeContext } from './IFeeCalculationStrategy';
import Database from '../../../config/db';

export class MessBasedFeeStrategy implements IFeeCalculationStrategy {
  private prisma = Database.getInstance().getClient();

  async calculateFee(context: FeeContext): Promise<number> {
    // Mess fee relies on the student's active mess subscription
    const activeSubscription = await this.prisma.messSubscription.findFirst({
      where: {
        studentId: context.student.id,
        isActive: true
      },
      include: {
        plan: true
      }
    });

    if (!activeSubscription) {
      return 0; // If they don't subscribe to mess, fee is 0
    }

    return Number(activeSubscription.plan.pricePerMonth);
  }
}
