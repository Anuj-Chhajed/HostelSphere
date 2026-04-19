import { Router } from 'express';
import { RoomController } from '../controllers/RoomController';
import { authenticateToken } from '../middleware/authMiddleware';
const { requireRoles } = require('../middleware/roleMiddleware');
import { UserRole } from '../interfaces/enums';

const router = Router();
const roomController = new RoomController();

router.use(authenticateToken);

// Admin-only endpoints for setting up the hostel infrastructure
router.post('/blocks', requireRoles([UserRole.ADMIN]), roomController.createBlock);
router.post('/rooms', requireRoles([UserRole.ADMIN]), roomController.createRoom);

// Accessible by everyone (needed to see what rooms exist)
router.get('/blocks', roomController.getBlocks);
router.get('/rooms', roomController.getRooms);

export default router;
