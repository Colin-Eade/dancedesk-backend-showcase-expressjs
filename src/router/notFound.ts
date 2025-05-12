import { Router } from 'express';
import { NotFoundError } from '@/errors/classes';

const router = Router();

router.all('*', (_req, _res, next) => {
  next(new NotFoundError());
});

export default router;
