import { Router } from 'express';
import dancersRoutes from '@/features/members/dancers/routes';
import teachersRoutes from '@/features/members/teachers/routes';

const router = Router();

router.use('/dancers', dancersRoutes);
router.use('/teachers', teachersRoutes);

export default router;
