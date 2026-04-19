import { Router } from 'express';
import { MessController } from '../controllers/MessController';
import { authenticateToken } from '../middleware/authMiddleware';
const { requireRoles } = require('../middleware/roleMiddleware');
import { UserRole } from '../interfaces/enums';

const router = Router();
const messController = new MessController();

router.use(authenticateToken);

// Plans
router.get('/plans', messController.getAvailablePlans);
router.post('/plans', requireRoles([UserRole.ADMIN]), messController.createPlan);

// Subscriptions
router.get('/subscriptions/me', requireRoles([UserRole.STUDENT]), messController.getMySubscription);
router.post('/subscriptions', requireRoles([UserRole.STUDENT]), messController.subscribeToPlan);

// Menus
router.get('/menu', messController.getWeeklyMenu);
router.post('/menu', requireRoles([UserRole.ADMIN]), messController.setMenu);

export default router;
