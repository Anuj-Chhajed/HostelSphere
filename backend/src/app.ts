// Express app setup
// This file configures middleware and routes — does NOT start the server

import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  // Middleware that runs on every request
  private setupMiddleware(): void {
    this.app.use(cors());                    // Allow frontend requests
    this.app.use(express.json());            // Parse JSON body
  }

  // All route modules will be registered here
  private setupRoutes(): void {
    // Health check route — to test if server is running
    this.app.get('/api/health', (req, res) => {
      res.json({ success: true, message: 'SmartHostel API is running 🏠' });
    });

    // Register API routes
    this.app.use('/api/v1', apiRoutes);
  }

  // Error handler must be LAST middleware
  private setupErrorHandler(): void {
    this.app.use(errorHandler);
  }
}

export default new App().app;
