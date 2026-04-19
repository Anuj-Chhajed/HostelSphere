import Database from '../config/db';
import { RoomStatus, RoomType, MessPlanType, MealType } from '../interfaces/enums';

const db = Database.getInstance();
const prisma = db.getClient();

async function main() {
  console.log('🌱 Starting Database Seed...');

  // 1. Create Blocks
  console.log('🏗️  Creating Blocks...');
  const blockA = await prisma.block.upsert({
    where: { name: 'Alpha Tower' },
    update: {},
    create: {
      name: 'Alpha Tower',
      totalFloors: 3,
      totalRooms: 10
    }
  });

  const blockB = await prisma.block.upsert({
    where: { name: 'Beta Block' },
    update: {},
    create: {
      name: 'Beta Block',
      totalFloors: 2,
      totalRooms: 6
    }
  });

  // 2. Create Rooms for Alpha Tower
  console.log('🚪 Creating Rooms for Alpha Tower...');
  for (let i = 1; i <= 5; i++) {
    await prisma.room.upsert({
      where: { roomNumber: `A-10${i}` },
      update: {},
      create: {
        roomNumber: `A-10${i}`,
        blockId: blockA.id,
        floor: 1,
        type: RoomType.DOUBLE,
        capacity: 2,
        currentOccupancy: 0,
        status: RoomStatus.AVAILABLE,
        pricePerMonth: 600,
        amenities: 'AC, WiFi, Attached Bath'
      }
    });
  }

  for (let i = 1; i <= 5; i++) {
    await prisma.room.upsert({
      where: { roomNumber: `A-20${i}` },
      update: {},
      create: {
        roomNumber: `A-20${i}`,
        blockId: blockA.id,
        floor: 2,
        type: RoomType.SINGLE,
        capacity: 1,
        currentOccupancy: 0,
        status: RoomStatus.AVAILABLE,
        pricePerMonth: 1000,
        amenities: 'AC, WiFi, Attached Bath, Balcony'
      }
    });
  }

  // 3. Create Mess Plans
  console.log('🍛 Creating Mess Plans...');
  await prisma.messPlan.upsert({
    where: { name: 'Standard Vegetarian' },
    update: {},
    create: {
      name: 'Standard Vegetarian',
      type: MessPlanType.VEG,
      description: 'Breakfast, Lunch, and Dinner (100% Veg)',
      pricePerMonth: 120,
      isActive: true
    }
  });

  await prisma.messPlan.upsert({
    where: { name: 'Premium Non-Veg' },
    update: {},
    create: {
      name: 'Premium Non-Veg',
      type: MessPlanType.NON_VEG,
      description: 'Includes Chicken/Egg options during Lunch & Dinner',
      pricePerMonth: 150,
      isActive: true
    }
  });

  console.log('✨ Seed complete! You can now request rooms and mess packages.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
