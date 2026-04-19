import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const notificationController = new NotificationController();

// Accessible by any authenticated user
router.use(authenticateToken);

router.get('/me', notificationController.getMyNotifications);
router.patch('/me/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);

export default router;
