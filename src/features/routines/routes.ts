import { Router } from 'express';
import {
  getAllRoutines,
  getRoutine,
  updateRoutine,
  deleteRoutine,
  createRoutine,
} from '@/features/routines/controllers';
import { validateMutateRoutine } from '@/features/routines/middleware';

const router = Router();

router
  .route('/')
  /**
   * @route   GET /api/routines
   * @desc    Get all routines
   * @access  Private
   */
  .get(getAllRoutines)

  /**
   * @route   POST /api/routines
   * @desc    Create a routine
   * @access  Private
   */
  .post(validateMutateRoutine, createRoutine);

router
  .route('/:id')
  /**
   * @route   GET /api/routines/:id
   * @desc    Get a routine by ID
   * @access  Private
   */
  .get(getRoutine)

  /**
   * @route   PUT /api/routines/:id
   * @desc    Update a routine by ID
   * @access  Private
   */
  .put(validateMutateRoutine, updateRoutine)

  /**
   * @route   DELETE /api/routines/:id
   * @desc    Delete a routine by ID
   * @access  Private
   */
  .delete(deleteRoutine);

export default router;
