// Singleton Pattern — Prisma Database Connection
// Only ONE instance of PrismaClient is created and shared across the entire app

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

class Database {
  // The single instance (stored privately)
  private static instance: Database;

  // The Prisma client
  private prisma: PrismaClient;

  // Private constructor — no one can call "new Database()" from outside
  private constructor() {
    // Create a pg Pool for the Prisma adapter
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Create the Prisma adapter using the pg Pool
    const adapter = new PrismaPg(pool);

    // Create PrismaClient with the adapter (Prisma 7 requirement)
    this.prisma = new PrismaClient({ adapter });
    console.log('📦 Prisma client initialized');
  }

  // The only way to get the Database instance
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Get the Prisma client to run queries
  public getClient(): PrismaClient {
    return this.prisma;
  }

  // Connect to database
  public async connect(): Promise<void> {
    await this.prisma.$connect();
    console.log('✅ Connected to Supabase database');
  }

  // Disconnect from database
  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    console.log('📦 Database connection closed');
  }
}

export default Database;
