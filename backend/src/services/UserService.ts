import Database from '../config/db';
import { AppError } from '../middleware/errorHandler';
import { UserRole } from '../interfaces/enums';
import { UserFactory } from '../models/user/UserFactory';
import { User, DashboardData } from '../models/user/User';

export class UserService {
  private prisma = Database.getInstance().getClient();

  public async getProfile(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        warden: true,
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async updateProfile(userId: string, data: any): Promise<any> {
    // Prevent updating critical fields through this endpoint
    const { email, role, id, ...updatableData } = data;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updatableData,
      include: {
        student: true,
        warden: true,
      }
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async getAllUsers(): Promise<any[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      }
    });
    return users;
  }

  // Demonstration of Polymorphism and Abstract Classes
  public async getDashboardData(userId: string): Promise<DashboardData> {
    const userRecord = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        warden: true,
      }
    });

    if (!userRecord) {
      throw new AppError('User not found', 404);
    }

    // Factory creates the specific instance (Student, Warden, etc.) based on role
    const userInstance: User = UserFactory.createUser(userRecord.role, userRecord);
    
    // Polymorphic call: Will execute the subclass's implementation
    return await userInstance.getDashboard();
  }
}
