import { Router } from 'express';
import authRoutes from '@/features/auth/routes/private';
import classesRoutes from '@/features/classes/routes';
import eventsRoutes from '@/features/events/routes';
import locationsRoutes from '@/features/locations/routes';
import membersRoutes from '@/features/members/routes';
import organizationsRoutes from '@/features/organizations/routes';
import roomsRoutes from '@/features/rooms/routes';
import routinesRoutes from '@/features/routines/routes';
import seasonsRoutes from '@/features/seasons/routes';
import usersRoutes from '@/features/users/routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/classes', classesRoutes);
router.use('/events', eventsRoutes);
router.use('/locations', locationsRoutes);
router.use('/members', membersRoutes);
router.use('/organizations', organizationsRoutes);
router.use('/rooms', roomsRoutes);
router.use('/routines', routinesRoutes);
router.use('/seasons', seasonsRoutes);
router.use('/users', usersRoutes);

export default router;
