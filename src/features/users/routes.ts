import { Router } from 'express';
import { getMe } from '@/features/users/controllers';

const router = Router();

router
  .route('/me')
  /**
   * @route   POST /api/auth/users/me
   * @desc    Get user profile
   * @access  Private
   */
  .get(getMe);

export default router;
