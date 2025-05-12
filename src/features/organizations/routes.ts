import { Router } from 'express';
import { getOrganization } from '@/features/organizations/controllers';

const router = Router();

router
  .route('/')
  /**
   * @route   GET /api/organizations
   * @desc    Get organization for user
   * @access  Private
   */
  .get(getOrganization);

export default router;
