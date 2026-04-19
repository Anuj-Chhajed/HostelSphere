import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Database from '../config/db';
import { UserRole } from '../interfaces/enums';
import { AppError } from '../middleware/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

export class AuthService {
  private prisma = Database.getInstance().getClient();

  public async register(data: any): Promise<any> {
    const { email, password, name, phone, role } = data;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('Email is already registered', 400);
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Prepare common user data
    const userData = {
      email,
      passwordHash,
      name,
      phone,
      role: role as UserRole,
    };

    let result;

    // Based on the role, create the user and their specific sub-table record in a transaction
    result = await this.prisma.$transaction(async (tx) => {
      // 1. Create the base user
      const user = await tx.user.create({ data: userData });

      // 2. Create the role-specific details
      switch (role) {
        case UserRole.STUDENT:
          if (!data.enrollmentNumber) throw new AppError('Enrollment number is required for students', 400);
          await tx.student.create({
            data: {
              userId: user.id,
              enrollmentNumber: data.enrollmentNumber,
              department: data.department,
              year: data.year ? parseInt(data.year) : null,
              emergencyContact: data.emergencyContact,
            }
          });
          break;

        case UserRole.WARDEN:
          await tx.warden.create({
            data: {
              userId: user.id,
              assignedBlockId: data.assignedBlockId || null,
              assignedFloor: data.assignedFloor ? parseInt(data.assignedFloor) : null,
            }
          });
          break;

        case UserRole.ACCOUNTANT:
        case UserRole.ADMIN:
          // No separate sub-tables for these currently, just the user record is enough
          break;

        default:
          throw new AppError('Invalid user role provided', 400);
      }

      return user;
    });

    const { passwordHash: _, ...userWithoutPassword } = result;
    return userWithoutPassword;
  }

  public async login(data: any): Promise<{ token: string; user: any }> {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        warden: true,
      }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', 403);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
}
