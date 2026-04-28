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
router.get('/me', authorizeRoles(UserRole.STUDENT), allocationController.getMyAllocations);

// Warden/Admin routes
router.get('/all', authorizeRoles(UserRole.WARDEN, UserRole.ADMIN), allocationController.getAllocations);
router.post('/:id/status', authorizeRoles(UserRole.WARDEN, UserRole.ADMIN), allocationController.updateAllocationStatus);

// Typically students confirm they occupied it, or a warden confirms it
router.post('/:id/occupy', authorizeRoles(UserRole.STUDENT, UserRole.WARDEN), allocationController.occupyRoom);

// Unallocate / vacate
router.post('/:id/vacate', authorizeRoles(UserRole.ADMIN, UserRole.WARDEN), allocationController.vacateRoom);

// Delete route to withdraw allocation
router.delete('/:id', authorizeRoles(UserRole.STUDENT), allocationController.withdrawAllocation);

export default router;
