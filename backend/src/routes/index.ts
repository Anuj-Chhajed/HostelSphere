import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import allocationRoutes from './allocation.routes';
import roomRoutes from './room.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/allocations', allocationRoutes);
router.use('/infrastructure', roomRoutes);

export default router;
