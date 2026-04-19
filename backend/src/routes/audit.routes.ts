import { Router } from 'express';
import { AuditController } from '../controllers/AuditController';
import { authenticateToken } from '../middleware/authMiddleware';
const { requireRoles } = require('../middleware/roleMiddleware');
import { UserRole } from '../interfaces/enums';

const router = Router();
const auditController = new AuditController();

router.use(authenticateToken);
router.use(requireRoles([UserRole.ADMIN]));

router.get('/', auditController.getLogs);

export default router;
