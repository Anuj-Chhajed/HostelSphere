import Database from '../config/db';
import { AppError } from '../middleware/errorHandler';
import { RoomAllocationContext } from '../models/room/RoomAllocationContext';
import { AllocationStatus, RoomStatus } from '../interfaces/enums';
import { RoomRequestDto } from '../validators/allocation/AllocationValidator';
import { StudentEligibilityValidator } from '../validators/allocation/StudentEligibilityValidator';
import { DuplicateAllocationValidator } from '../validators/allocation/DuplicateAllocationValidator';
import { RoomAvailabilityValidator } from '../validators/allocation/RoomAvailabilityValidator';

export class RoomAllocationService {
  private prisma = Database.getInstance().getClient();

  public async requestAllocation(request: RoomRequestDto): Promise<any> {
    // 1. Setup the Validation Chain (Chain of Responsibility Pattern)
    const eligibilityValidator = new StudentEligibilityValidator();
    const duplicateValidator = new DuplicateAllocationValidator();
    const availabilityValidator = new RoomAvailabilityValidator();

    eligibilityValidator.setNext(duplicateValidator).setNext(availabilityValidator);

    // 2. Run validations
    const validationResult = await eligibilityValidator.validate(request);
    if (!validationResult.isValid) {
      throw new AppError(validationResult.message || 'Validation failed', 400);
    }

    // 3. Create the request in database (State: REQUESTED)
    const newAllocation = await this.prisma.roomAllocation.create({
      data: {
        studentId: request.studentId,
        preferredType: request.preferredType,
        roomId: request.roomId || null,
        status: AllocationStatus.REQUESTED
      }
    });

    return newAllocation;
  }

  public async approveAllocation(allocationId: string, wardenId: string, roomId?: string): Promise<any> {
    const allocation = await this.prisma.roomAllocation.findUnique({
      where: { id: allocationId }
    });

    if (!allocation) throw new AppError('Allocation not found', 404);

    // 1. Initialize the Context for State Pattern
    const context = new RoomAllocationContext(allocation);

    // 2. Perform the state transition
    context.approve(wardenId);

    // 3. Determine which room to assign
    let assignedRoomId = roomId || allocation.roomId;

    // If no room specified, auto-find one that matches the student's preferred type
    if (!assignedRoomId && allocation.preferredType) {
      // Fetch rooms with capacity, then pick one that has space
      const candidateRooms = await this.prisma.room.findMany({
        where: {
          type: allocation.preferredType,
          status: { in: [RoomStatus.AVAILABLE, RoomStatus.OCCUPIED] }
        },
        orderBy: { currentOccupancy: 'asc' }
      });

      const availableRoom = candidateRooms.find(r => r.currentOccupancy < r.capacity);

      if (!availableRoom) throw new AppError(`No available ${allocation.preferredType} rooms to assign`, 400);
      assignedRoomId = availableRoom.id;
    }

    if (!assignedRoomId) throw new AppError('No room could be determined for this allocation', 400);

    // 4. Save the new state + room assignment back to the DB
    const updatedAllocation = await this.prisma.roomAllocation.update({
      where: { id: allocationId },
      data: {
        status: context.getStatus(),
        roomId: assignedRoomId,
        approvedBy: wardenId,
        approvalDate: new Date()
      },
      include: {
        room: { include: { block: true } },
        student: { include: { user: true } }
      }
    });

    return updatedAllocation;
  }

  public async rejectAllocation(allocationId: string, wardenId: string, reason: string): Promise<any> {
    const allocation = await this.prisma.roomAllocation.findUnique({
      where: { id: allocationId }
    });

    if (!allocation) throw new AppError('Allocation not found', 404);

    const context = new RoomAllocationContext(allocation);
    context.reject(reason);

    const updatedAllocation = await this.prisma.roomAllocation.update({
      where: { id: allocationId },
      data: {
        status: context.getStatus(),
        approvedBy: wardenId,
        remarks: reason
      }
    });

    return updatedAllocation;
  }

  public async occupyRoom(allocationId: string): Promise<any> {
    const allocation = await this.prisma.roomAllocation.findUnique({
      where: { id: allocationId }
    });

    if (!allocation) throw new AppError('Allocation not found', 404);

    if (!allocation.roomId) {
      throw new AppError('Cannot occupy a request without assigned room ID', 400);
    }

    // 1. Initialize State Context
    const context = new RoomAllocationContext(allocation);

    // 2. State transition
    context.occupy();

    // 3. Update DB in a transaction (Atomicity)
    return await this.prisma.$transaction(async (tx) => {
      // Update allocation state
      const updatedAllocation = await tx.roomAllocation.update({
        where: { id: allocationId },
        data: {
          status: context.getStatus(),
          occupiedDate: new Date()
        }
      });

      // Update Room occupancy
      const room = await tx.room.findUnique({ where: { id: allocation.roomId! } });
      if (room) {
        const newOccupancy = room.currentOccupancy + 1;
        await tx.room.update({
          where: { id: room.id },
          data: {
            currentOccupancy: newOccupancy,
            status: newOccupancy >= room.capacity ? RoomStatus.FULL : RoomStatus.OCCUPIED
          }
        });
      }

      return updatedAllocation;
    });
  }

  public async withdrawAllocation(allocationId: string, studentUserId: string): Promise<void> {
    const allocation = await this.prisma.roomAllocation.findUnique({
      where: { id: allocationId },
      include: { student: true }
    });

    if (!allocation) throw new AppError('Allocation not found', 404);
    if (allocation.student.userId !== studentUserId) throw new AppError('Unauthorized access', 403);
    
    if (allocation.status !== AllocationStatus.REQUESTED) {
      throw new AppError('Cannot withdraw an allocation that is already processed', 400);
    }

    await this.prisma.roomAllocation.delete({ where: { id: allocationId } });
  }

  public async getMyAllocations(studentUserId: string): Promise<any[]> {
    const student = await this.prisma.student.findUnique({ where: { userId: studentUserId }});
    if (!student) return [];

    return this.prisma.roomAllocation.findMany({
      where: { studentId: student.id },
      include: {
        student: {
          include: { 
            user: true,
            attendanceRecords: true
          }
        },
        room: { include: { block: true } },
      }
    });
  }

  public async getAllocations(): Promise<any[]> {
    return this.prisma.roomAllocation.findMany({
      include: {
        student: {
          include: { 
            user: true,
            attendanceRecords: true
          }
        },
        room: { include: { block: true } },
      }
    });
  }
}
