// Entry point — starts the HTTP server
// This is the file that runs when you do "npm run dev"

import app from './app';
import Database from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to database and start server
async function startServer(): Promise<void> {
  try {
    // Connect to Supabase via Prisma
    const db = Database.getInstance();
    await db.connect();

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`🚀 SmartHostel server running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
