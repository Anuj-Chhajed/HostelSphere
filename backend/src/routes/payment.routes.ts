import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authenticateToken } from '../middleware/authMiddleware';
const { requireRoles } = require('../middleware/roleMiddleware');
import { UserRole } from '../interfaces/enums';

const router = Router();
const paymentController = new PaymentController();

router.use(authenticateToken);

// Student Endpoint: See my bills and pay them
router.get('/me', requireRoles([UserRole.STUDENT]), paymentController.getMyPayments);
router.post('/:id/pay', requireRoles([UserRole.STUDENT]), paymentController.processPayment);

// Accountant Endpoint: Generate bills and calculate late penalties
router.post('/generate', requireRoles([UserRole.ACCOUNTANT, UserRole.ADMIN]), paymentController.generateMonthlyBills);
router.post('/penalties', requireRoles([UserRole.ACCOUNTANT, UserRole.ADMIN]), paymentController.applyLatePenalties);

export default router;
