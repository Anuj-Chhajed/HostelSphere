import { RoomType } from '../../interfaces/enums';

// The DTO data required for validation
export interface RoomRequestDto {
  studentId: string;
  preferredType?: RoomType;
  roomId?: string; // Optional if requesting a specific room
}

// The result of a validation chain
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Chain of Responsibility Base Class
export abstract class AllocationValidator {
  protected nextValidator: AllocationValidator | null = null;

  public setNext(validator: AllocationValidator): AllocationValidator {
    this.nextValidator = validator;
    // Returning validator allows chaining: v1.setNext(v2).setNext(v3)
    return validator;
  }

  public async validate(request: RoomRequestDto): Promise<ValidationResult> {
    const result = await this.doValidate(request);
    
    // If validation fails, break the chain and return the failure
    if (!result.isValid) {
      return result;
    }

    // If validation passes, pass to the next validator in the chain
    if (this.nextValidator) {
      return await this.nextValidator.validate(request);
    }

    // If we've reached the end of the chain, validation passes
    return { isValid: true };
  }

  // The actual validation logic implemented by subclasses
  protected abstract doValidate(request: RoomRequestDto): Promise<ValidationResult>;
}
