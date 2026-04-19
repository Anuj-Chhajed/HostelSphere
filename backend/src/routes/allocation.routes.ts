import { Router } from 'express';
import { RoomAllocationController } from '../controllers/RoomAllocationController';
import { authenticateToken, requireRoles } from '../middleware/authMiddleware';
import { UserRole } from '../interfaces/enums';
// import { requireRoles } from '../middleware/roleMiddleware';
const { requireRoles: rolesMiddleware } = require('../middleware/roleMiddleware');

const router = Router();
const allocationController = new RoomAllocationController();

// Use authentication for all routes
router.use(authenticateToken);

// Student routes
router.post('/request', rolesMiddleware([UserRole.STUDENT]), allocationController.requestAllocation);

// Warden/Admin routes
router.get('/', rolesMiddleware([UserRole.WARDEN, UserRole.ADMIN]), allocationController.getAllocations);
router.post('/:id/approve', rolesMiddleware([UserRole.WARDEN, UserRole.ADMIN]), allocationController.approveAllocation);

// Typically students confirm they occupied it, or a warden confirms it
router.post('/:id/occupy', rolesMiddleware([UserRole.STUDENT, UserRole.WARDEN]), allocationController.occupyRoom);

export default router;
