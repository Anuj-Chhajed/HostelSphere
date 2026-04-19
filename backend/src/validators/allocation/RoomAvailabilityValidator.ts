import { AllocationValidator, RoomRequestDto, ValidationResult } from './AllocationValidator';
import Database from '../../config/db';
import { RoomStatus } from '../../interfaces/enums';

export class RoomAvailabilityValidator extends AllocationValidator {
  private prisma = Database.getInstance().getClient();

  protected async doValidate(request: RoomRequestDto): Promise<ValidationResult> {
    // If a specific room is requested, check if it's available
    if (request.roomId) {
      const room = await this.prisma.room.findUnique({
        where: { id: request.roomId }
      });

      if (!room) {
        return { isValid: false, message: 'Requested room does not exist.' };
      }

      if (room.status === RoomStatus.FULL || room.status === RoomStatus.UNDER_MAINTENANCE) {
        return { isValid: false, message: `Room is currently ${room.status}.` };
      }

      if (room.currentOccupancy >= room.capacity) {
        return { isValid: false, message: 'Room is already at full capacity.' };
      }
    } 
    // Otherwise, if just a type is requested, check if we have ANY available rooms of that type
    else if (request.preferredType) {
      const candidateRooms = await this.prisma.room.findMany({
        where: {
          type: request.preferredType,
          status: {
            in: [RoomStatus.AVAILABLE, RoomStatus.OCCUPIED]
          }
        }
      });

      const availableRoomCount = candidateRooms.filter(r => r.currentOccupancy < r.capacity).length;

      if (availableRoomCount === 0) {
        return { isValid: false, message: `No available rooms of type ${request.preferredType}.` };
      }
    }

    return { isValid: true };
  }
}
