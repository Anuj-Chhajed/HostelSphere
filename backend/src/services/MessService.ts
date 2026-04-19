import Database from '../config/db';
import { AppError } from '../middleware/errorHandler';
import { MessPlanType, MealType } from '../interfaces/enums';

export class MessService {
  private prisma = Database.getInstance().getClient();

  public async getAvailablePlans(): Promise<any[]> {
    return this.prisma.messPlan.findMany({
      where: { isActive: true }
    });
  }

  public async createPlan(data: any): Promise<any> {
    return this.prisma.messPlan.create({
      data: {
        name: data.name,
        type: data.type as MessPlanType,
        description: data.description,
        pricePerMonth: data.pricePerMonth,
      }
    });
  }

  public async subscribeToPlan(studentUserId: string, planId: string): Promise<any> {
    const student = await this.prisma.student.findUnique({ where: { userId: studentUserId }});
    if (!student) throw new AppError('Student not found', 404);

    const plan = await this.prisma.messPlan.findUnique({ where: { id: planId }});
    if (!plan || !plan.isActive) throw new AppError('Plan not found or inactive', 404);

    // End existing active subscriptions
    await this.prisma.messSubscription.updateMany({
      where: { studentId: student.id, isActive: true },
      data: { isActive: false, endDate: new Date() }
    });

    // Create new subscription
    return this.prisma.messSubscription.create({
      data: {
        studentId: student.id,
        planId: plan.id,
        startDate: new Date(),
        isActive: true
      }
    });
  }

  public async getMySubscription(studentUserId: string): Promise<any> {
    const student = await this.prisma.student.findUnique({ where: { userId: studentUserId }});
    if (!student) throw new AppError('Student not found', 404);

    return this.prisma.messSubscription.findFirst({
      where: { studentId: student.id, isActive: true },
      include: { plan: true }
    });
  }

  public async setMenu(data: any): Promise<any> {
    // Simple create/upsert logic for menus
    // Ensure we don't have duplicates for the same plan, day and meal type
    const existing = await this.prisma.messMenu.findFirst({
        where: {
            dayOfWeek: data.dayOfWeek,
            mealType: data.mealType as MealType,
            planType: data.planType as MessPlanType
        }
    });

    if (existing) {
        return this.prisma.messMenu.update({
            where: { id: existing.id },
            data: { items: data.items }
        });
    }

    return this.prisma.messMenu.create({
        data: {
            dayOfWeek: data.dayOfWeek,
            mealType: data.mealType as MealType,
            items: data.items,
            planType: data.planType as MessPlanType
        }
    });
  }

  public async getWeeklyMenu(planType: MessPlanType): Promise<any[]> {
    return this.prisma.messMenu.findMany({
        where: { planType }
    });
  }
}
