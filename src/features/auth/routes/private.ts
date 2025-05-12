import { Router } from 'express';
import { signOut } from '@/features/auth/controllers';

const router = Router();

router
  .route('/signout')
  /**
   * @route   POST /api/auth/signout
   * @desc    Invalidate user tokens
   * @access  Private
   */
  .post(signOut);

export default router;
