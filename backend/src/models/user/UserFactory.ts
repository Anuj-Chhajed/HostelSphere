import { User } from './User';
import { Student } from './Student';
import { Warden } from './Warden';
import { Accountant } from './Accountant';
import { Admin } from './Admin';
import { UserRole } from '../../interfaces/enums';
import { AppError } from '../../middleware/errorHandler';

// Factory Pattern to instantiate the correct User subclass
export class UserFactory {
  /**
   * Creates a concrete User object based on the role.
   * @param role The role of the user
   * @param data The user data (including related tables like student/warden)
   * @returns User
   */
  static createUser(role: string, data: any): User {
    switch (role) {
      case UserRole.STUDENT:
        return new Student(data);
      case UserRole.WARDEN:
        return new Warden(data);
      case UserRole.ACCOUNTANT:
        return new Accountant(data);
      case UserRole.ADMIN:
        return new Admin(data);
      default:
        throw new AppError(`Cannot create user with unknown role: ${role}`, 500);
    }
  }
}
