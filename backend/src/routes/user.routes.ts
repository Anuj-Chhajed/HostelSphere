import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRoles } from '../middleware/roleMiddleware';
import { UserRole } from '../interfaces/enums';

const router = Router();
const userController = new UserController();

// All user routes require authentication
router.use(authenticateToken);

// Get current user profile
router.get('/me', userController.getMe);

// Update current user profile
router.patch('/me', userController.updateMe);

// Get role-specific dashboard data (Demonstrates template method/polymorphism)
router.get('/dashboard', userController.getDashboard);

// Admin only routes
router.get('/', requireRoles([UserRole.ADMIN]), userController.getAllUsers);

export default router;
