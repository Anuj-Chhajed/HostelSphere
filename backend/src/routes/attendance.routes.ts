import { Router } from 'express';
import { AttendanceController } from '../controllers/AttendanceController';
import { authenticateToken } from '../middleware/authMiddleware';
const { requireRoles } = require('../middleware/roleMiddleware');
import { UserRole } from '../interfaces/enums';

const router = Router();
const attendanceController = new AttendanceController();

router.use(authenticateToken);

// Students
router.get('/me', requireRoles([UserRole.STUDENT]), attendanceController.getMyAttendance);

// Wardens (and Admins fallback)
router.post('/mark', requireRoles([UserRole.WARDEN, UserRole.ADMIN]), attendanceController.markAttendance);
router.post('/gate/exit', requireRoles([UserRole.WARDEN, UserRole.ADMIN]), attendanceController.logExit);
router.post('/gate/entry', requireRoles([UserRole.WARDEN, UserRole.ADMIN]), attendanceController.logEntry);

export default router;
