import { Router } from 'express';
import { API_ROOT } from '@/config/constants';
import { authenticate } from '@/middleware/authHandlers';
import notFound from '@/router/notFound';
import privateRoutes from '@/router/privateRoutes';
import publicRoutes from '@/router/publicRoutes';

const router = Router();

router.use(API_ROOT, publicRoutes);
router.use(API_ROOT, authenticate, privateRoutes);
router.use(notFound);

export default router;
