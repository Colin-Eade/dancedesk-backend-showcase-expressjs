import { Router } from 'express';
import {
  getAllDancers,
  getDancer,
  updateDancer,
  deleteDancer,
  createDancer,
} from '@/features/members/dancers/controllers';
import { validateMutateDancer } from '@/features/members/dancers/middleware';

const router = Router();

router
  .route('/')
  /**
   * @route   GET /api/members/dancers
   * @desc    Get all dancers
   * @access  Private
   */
  .get(getAllDancers)

  /**
   * @route   POST /api/members/dancers
   * @desc    Create a dancer
   * @access  Private
   */
  .post(validateMutateDancer, createDancer);

router
  .route('/:id')
  /**
   * @route   GET /api/members/dancers/:id
   * @desc    Get a dancer by ID
   * @access  Private
   */
  .get(getDancer)

  /**
   * @route   PUT /api/members/dancers/:id
   * @desc    Update a dancer by ID
   * @access  Private
   */
  .put(validateMutateDancer, updateDancer)

  /**
   * @route   DELETE /api/members/dancers/:id
   * @desc    Delete a dancer by ID
   * @access  Private
   */
  .delete(deleteDancer);

export default router;
