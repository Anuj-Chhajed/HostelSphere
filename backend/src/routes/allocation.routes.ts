import { Router } from 'express';
import { RoomAllocationController } from '../controllers/RoomAllocationController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';
import { UserRole } from '../interfaces/enums';

const router = Router();
const allocationController = new RoomAllocationController();

// Use authentication for all routes
router.use(authenticateToken);

// Student routes
router.post('/request', authorizeRoles(UserRole.STUDENT), allocationController.requestAllocation);
// Get own allocations (needed by frontend)
router.get('/me', authorizeRoles(UserRole.STUDENT), allocationController.getAllocations);

// Warden/Admin routes
router.get('/all', authorizeRoles(UserRole.WARDEN, UserRole.ADMIN), allocationController.getAllocations);
router.post('/:id/status', authorizeRoles(UserRole.WARDEN, UserRole.ADMIN), allocationController.approveAllocation);

// Typically students confirm they occupied it, or a warden confirms it
router.post('/:id/occupy', authorizeRoles(UserRole.STUDENT, UserRole.WARDEN), allocationController.occupyRoom);

export default router;
