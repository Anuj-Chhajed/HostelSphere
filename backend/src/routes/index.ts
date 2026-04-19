import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import allocationRoutes from './allocation.routes';
import roomRoutes from './room.routes';
import paymentRoutes from './payment.routes';
import complaintRoutes from './complaint.routes';
import attendanceRoutes from './attendance.routes';
import messRoutes from './mess.routes';
import notificationRoutes from './notification.routes';
import auditRoutes from './audit.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/allocations', allocationRoutes);
router.use('/infrastructure', roomRoutes);
router.use('/payments', paymentRoutes);
router.use('/complaints', complaintRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/mess', messRoutes);
router.use('/notifications', notificationRoutes);
router.use('/audit', auditRoutes);

export default router;
