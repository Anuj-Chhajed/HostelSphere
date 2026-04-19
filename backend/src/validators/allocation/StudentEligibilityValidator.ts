import { AllocationValidator, RoomRequestDto, ValidationResult } from './AllocationValidator';
import Database from '../../config/db';

export class StudentEligibilityValidator extends AllocationValidator {
  private prisma = Database.getInstance().getClient();

  protected async doValidate(request: RoomRequestDto): Promise<ValidationResult> {
    const student = await this.prisma.student.findUnique({
      where: { id: request.studentId },
      include: { user: true }
    });

    if (!student) {
      return { isValid: false, message: 'Student does not exist.' };
    }

    if (!student.user.isActive) {
      return { isValid: false, message: 'Student account is not active.' };
    }

    return { isValid: true };
  }
}
