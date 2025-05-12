import { Router } from 'express';
import { getApiHealth } from '@/features/api-health/controllers';

const router = Router();

router
  .route('/')
  /**
   * @route   GET /api/api-health
   * @desc    API health check
   * @access  Public
   */
  .get(getApiHealth);

export default router;
