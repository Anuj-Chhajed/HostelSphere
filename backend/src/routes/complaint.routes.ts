import { Router } from 'express';
import { ComplaintController } from '../controllers/ComplaintController';
import { authenticateToken } from '../middleware/authMiddleware';
const { requireRoles } = require('../middleware/roleMiddleware');
import { UserRole } from '../interfaces/enums';
import { auditMiddleware } from '../middleware/auditMiddleware';

const router = Router();
const complaintController = new ComplaintController();

router.use(authenticateToken);
router.use(auditMiddleware('COMPLAINT'));

// Students
router.post('/', requireRoles([UserRole.STUDENT]), complaintController.raiseComplaint);
router.get('/me', requireRoles([UserRole.STUDENT]), complaintController.getMyComplaints);
router.post('/:id/escalate', requireRoles([UserRole.STUDENT]), complaintController.escalateComplaint);

// Wardens & Admins
router.get('/', requireRoles([UserRole.WARDEN, UserRole.ADMIN]), complaintController.getAllComplaints);
router.patch('/:id/assign', requireRoles([UserRole.WARDEN]), complaintController.assignComplaint);
router.patch('/:id/status', requireRoles([UserRole.WARDEN, UserRole.ADMIN]), complaintController.updateStatus);

export default router;
