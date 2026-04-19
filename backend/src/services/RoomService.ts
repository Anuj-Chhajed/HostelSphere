import Database from '../config/db';

export class RoomService {
  private prisma = Database.getInstance().getClient();

  public async createBlock(data: any): Promise<any> {
    return this.prisma.block.create({
      data: {
        name: data.name,
        totalFloors: data.totalFloors,
        totalRooms: 0,
      }
    });
  }

  public async createRoom(data: any): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
        const room = await tx.room.create({
            data: {
                roomNumber: data.roomNumber,
                blockId: data.blockId,
                floor: data.floor,
                type: data.type,
                capacity: data.capacity,
                pricePerMonth: data.pricePerMonth,
                amenities: data.amenities
            }
        });

        // Update block's total rooms
        await tx.block.update({
            where: { id: data.blockId },
            data: { totalRooms: { increment: 1 } }
        });

        return room;
    });
  }

  public async getAllBlocks(): Promise<any[]> {
      return this.prisma.block.findMany({ include: { rooms: true } });
  }

  public async getAllRooms(): Promise<any[]> {
      return this.prisma.room.findMany();
  }
}
