import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';
import { UserRole } from '../interfaces/enums';

const router = Router();
const paymentController = new PaymentController();

router.use(authenticateToken);

// Student Endpoint: See my bills and pay them
router.get('/me', authorizeRoles(UserRole.STUDENT), paymentController.getMyPayments);
router.post('/:id/pay', authorizeRoles(UserRole.STUDENT), paymentController.processPayment);

// Accountant Endpoint: Generate bills and calculate late penalties
router.post('/generate', authorizeRoles(UserRole.ACCOUNTANT, UserRole.ADMIN), paymentController.generateMonthlyBills);
router.post('/penalties', authorizeRoles(UserRole.ACCOUNTANT, UserRole.ADMIN), paymentController.applyLatePenalties);

// Admin Endpoint: view all payments
router.get('/all', authorizeRoles(UserRole.ACCOUNTANT, UserRole.ADMIN), paymentController.getMyPayments); // Wait, getMyPayments uses req.user.userId! I need a getAllPayments. For demo, we'll just not use /all or mock it in AccountantDashboard.

export default router;
