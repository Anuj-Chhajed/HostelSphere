import { Router } from 'express';
import { AttendanceController } from '../controllers/AttendanceController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';
import { UserRole } from '../interfaces/enums';

const router = Router();
const attendanceController = new AttendanceController();

router.use(authenticateToken);

// Students
router.get('/me', authorizeRoles(UserRole.STUDENT), attendanceController.getMyAttendance);

// Wardens (and Admins fallback)
router.post('/mark', authorizeRoles(UserRole.WARDEN, UserRole.ADMIN), attendanceController.markAttendance);
router.post('/gate/exit', authorizeRoles(UserRole.WARDEN, UserRole.ADMIN), attendanceController.logExit);
router.post('/gate/entry', authorizeRoles(UserRole.WARDEN, UserRole.ADMIN), attendanceController.logEntry);

export default router;
