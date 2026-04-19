import { AllocationValidator, RoomRequestDto, ValidationResult } from './AllocationValidator';
import Database from '../../../config/db';
import { AllocationStatus } from '../../../interfaces/enums';

export class DuplicateAllocationValidator extends AllocationValidator {
  private prisma = Database.getInstance().getClient();

  protected async doValidate(request: RoomRequestDto): Promise<ValidationResult> {
    // Check if the student already has an active allocation (Requested, Approved, Occupied)
    const activeAllocation = await this.prisma.roomAllocation.findFirst({
      where: {
        studentId: request.studentId,
        status: {
          in: [AllocationStatus.REQUESTED, AllocationStatus.APPROVED, AllocationStatus.OCCUPIED]
        }
      }
    });

    if (activeAllocation) {
      return { 
        isValid: false, 
        message: `Student already has an active allocation (Status: ${activeAllocation.status}).` 
      };
    }

    return { isValid: true };
  }
}
