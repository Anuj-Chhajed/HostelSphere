import Database from '../config/db';
import { PaymentStatus, PaymentType, PaymentMethod } from '../interfaces/enums';
import { AppError } from '../middleware/errorHandler';
import { IFeeCalculationStrategy, FeeContext } from '../models/payment/strategies/IFeeCalculationStrategy';
import { RegularFeeStrategy } from '../models/payment/strategies/RegularFeeStrategy';
import { MessBasedFeeStrategy } from '../models/payment/strategies/MessBasedFeeStrategy';
import { LatePenaltyFeeStrategy } from '../models/payment/strategies/LatePenaltyFeeStrategy';
import { Helpers } from '../utils/helpers';

export class PaymentService {
  private prisma = Database.getInstance().getClient();

  public async generateMonthlyBills(month: string, year: number): Promise<any[]> {
    const activeStudents = await this.prisma.student.findMany({
      where: { user: { isActive: true } },
      include: { 
        roomAllocations: true,
        messSubscriptions: true 
      }
    });

    const generatedPayments = [];

    for (const student of activeStudents) {
      const context: FeeContext = { student, month: `${month}-${year}` };

      // 1. Generate Hostel Fee Bill via RegularFeeStrategy
      try {
        const hostelStrategy = new RegularFeeStrategy();
        const hostelFee = await hostelStrategy.calculateFee(context);

        if (hostelFee > 0) {
          const hostelPayment = await this.prisma.payment.create({
            data: {
              studentId: student.id,
              type: PaymentType.HOSTEL_FEE,
              amount: hostelFee,
              totalAmount: hostelFee,
              dueDate: new Date(year, new Date(`${month} 1`).getMonth() + 1, 5), // 5th of next month
              status: PaymentStatus.PENDING,
              month,
              year
            }
          });
          generatedPayments.push(hostelPayment);
        }
      } catch (err) {
        // Soft fail if student doesn't have an active room (e.g. strategy throws)
      }

      // 2. Generate Mess Fee Bill via MessBasedFeeStrategy
      try {
        const messStrategy = new MessBasedFeeStrategy();
        const messFee = await messStrategy.calculateFee(context);

        if (messFee > 0) {
          const messPayment = await this.prisma.payment.create({
            data: {
              studentId: student.id,
              type: PaymentType.MESS_FEE,
              amount: messFee,
              totalAmount: messFee,
              dueDate: new Date(year, new Date(`${month} 1`).getMonth() + 1, 5),
              status: PaymentStatus.PENDING,
              month,
              year
            }
          });
          generatedPayments.push(messPayment);
        }
      } catch (err) {
        // student might not be subscribed
      }
    }

    return generatedPayments;
  }

  public async applyLatePenalties(): Promise<number> {
    const overduePayments = await this.prisma.payment.findMany({
      where: {
        status: { in: [PaymentStatus.PENDING, PaymentStatus.OVERDUE] },
        dueDate: { lt: new Date() } // Passed due date
      },
      include: {
        student: true
      }
    });

    const strategy = new LatePenaltyFeeStrategy();
    let updatedCount = 0;

    for (const payment of overduePayments) {
      // Calculate days late
      const msDiff = new Date().getTime() - payment.dueDate.getTime();
      const daysLate = Math.floor(msDiff / (1000 * 60 * 60 * 24));

      const context: FeeContext = { student: payment.student as any, payment, daysLate };
      const penaltyAmount = await strategy.calculateFee(context);

      if (penaltyAmount > Number(payment.penaltyAmount)) {
        const newTotal = Number(payment.amount) + penaltyAmount;
        
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            penaltyAmount,
            totalAmount: newTotal,
            status: PaymentStatus.OVERDUE
          }
        });
        updatedCount++;
      }
    }

    return updatedCount;
  }

  public async processPayment(paymentId: string, studentUserId: string, method: PaymentMethod): Promise<any> {
    const student = await this.prisma.student.findUnique({ where: { userId: studentUserId }});
    if (!student) throw new AppError('Student not found', 404);

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) throw new AppError('Payment not found', 404);
    if (payment.studentId !== student.id) throw new AppError('Unauthorized to pay this bill', 403);
    if (payment.status === PaymentStatus.PAID) throw new AppError('Payment already processed', 400);

    const receiptNumber = Helpers.generateReceiptNumber();

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.PAID,
        paidDate: new Date(),
        method,
        receiptNumber
      }
    });
  }

  public async getMyPayments(studentUserId: string): Promise<any[]> {
    const student = await this.prisma.student.findUnique({ where: { userId: studentUserId }});
    if (!student) throw new AppError('Student not found', 404);

    return this.prisma.payment.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' }
    });
  }
}
