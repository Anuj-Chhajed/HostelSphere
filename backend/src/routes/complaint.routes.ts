import { Router } from 'express';
import { ComplaintController } from '../controllers/ComplaintController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';
import { UserRole } from '../interfaces/enums';
import { auditMiddleware } from '../middleware/auditMiddleware';

const router = Router();
const complaintController = new ComplaintController();

router.use(authenticateToken);
router.use(auditMiddleware('COMPLAINT'));

// Students
router.post('/', authorizeRoles(UserRole.STUDENT), complaintController.raiseComplaint);
router.get('/me', authorizeRoles(UserRole.STUDENT), complaintController.getMyComplaints);
router.post('/:id/escalate', authorizeRoles(UserRole.STUDENT), complaintController.escalateComplaint);

// Wardens & Admins
router.get('/all', authorizeRoles(UserRole.WARDEN, UserRole.ADMIN), complaintController.getAllComplaints);
router.patch('/:id/assign', authorizeRoles(UserRole.WARDEN), complaintController.assignComplaint);
router.patch('/:id/status', authorizeRoles(UserRole.WARDEN, UserRole.ADMIN), complaintController.updateStatus);

// Delete route to withdraw complaint
router.delete('/:id', authorizeRoles(UserRole.STUDENT), complaintController.withdrawComplaint);

export default router;
