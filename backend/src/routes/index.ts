import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import allocationRoutes from './allocation.routes';
import roomRoutes from './room.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/allocations', allocationRoutes);
router.use('/infrastructure', roomRoutes);
router.use('/payments', paymentRoutes);

export default router;
