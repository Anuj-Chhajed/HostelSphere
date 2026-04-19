import { IFeeCalculationStrategy, FeeContext } from './IFeeCalculationStrategy';
import Database from '../../../config/db';
import { AllocationStatus } from '../../../interfaces/enums';

export class RegularFeeStrategy implements IFeeCalculationStrategy {
  private prisma = Database.getInstance().getClient();

  async calculateFee(context: FeeContext): Promise<number> {
    // Regular hostel fee is based on the room the student currently occupies
    const activeAllocation = await this.prisma.roomAllocation.findFirst({
      where: {
        studentId: context.student.id,
        status: AllocationStatus.OCCUPIED,
      },
      include: {
        room: true,
      }
    });

    if (!activeAllocation || !activeAllocation.room) {
      throw new Error(`Cannot calculate regular fee: Student ${context.student.id} does not occupy a room.`);
    }

    // Convert Prisma Decimal to number
    return Number(activeAllocation.room.pricePerMonth);
  }
}
