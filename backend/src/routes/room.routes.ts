import { Router } from 'express';
import { RoomController } from '../controllers/RoomController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';
import { UserRole } from '../interfaces/enums';

const router = Router();
const roomController = new RoomController();

router.use(authenticateToken);

// Admin-only endpoints for setting up the hostel infrastructure
router.post('/blocks', authorizeRoles(UserRole.ADMIN), roomController.createBlock);
router.post('/rooms', authorizeRoles(UserRole.ADMIN), roomController.createRoom);

// Accessible by everyone (needed to see what rooms exist)
router.get('/blocks', roomController.getBlocks);
router.get('/rooms', roomController.getRooms);

router.delete('/blocks/:id', authorizeRoles(UserRole.ADMIN), roomController.deleteBlock);
router.delete('/rooms/:id', authorizeRoles(UserRole.ADMIN), roomController.deleteRoom);

export default router;
