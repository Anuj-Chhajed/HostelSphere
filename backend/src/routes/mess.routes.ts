import { Router } from 'express';
import { MessController } from '../controllers/MessController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';
import { UserRole } from '../interfaces/enums';

const router = Router();
const messController = new MessController();

router.use(authenticateToken);

// Plans
router.get('/plans', messController.getAvailablePlans);
router.post('/plans', authorizeRoles(UserRole.ADMIN), messController.createPlan);

// Subscriptions
router.get('/subscriptions/me', authorizeRoles(UserRole.STUDENT), messController.getMySubscription);
router.post('/subscriptions', authorizeRoles(UserRole.STUDENT), messController.subscribeToPlan);

// Menus
router.get('/menu', messController.getWeeklyMenu);
router.post('/menu', authorizeRoles(UserRole.ADMIN), messController.setMenu);

export default router;
