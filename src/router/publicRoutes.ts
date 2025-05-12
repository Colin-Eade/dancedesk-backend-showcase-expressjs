import { Router } from 'express';
import apiHealthRoutes from '@/features/api-health/routes';
import authRoutes from '@/features/auth/routes/public';

const router = Router();

router.use('/api-health', apiHealthRoutes);
router.use('/auth', authRoutes);

export default router;
