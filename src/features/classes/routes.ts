import { Router } from 'express';
import {
  getAllClasses,
  createClass,
  getClass,
  updateClass,
  deleteClass,
  checkClass,
} from '@/features/classes/controllers';
import { validateMutateClass } from '@/features/classes/middleware';

const router = Router();

router
  .route('/')
  /**
   * @route   GET /api/classes
   * @desc    Get all classes
   * @access  Private
   */
  .get(getAllClasses)

  /**
   * @route   POST /api/classes
   * @desc    Create a class
   * @access  Private
   */
  .post(validateMutateClass, createClass);

router
  .route('/check/:id?')
  /**
   * @route   POST /api/classes/check
   * @desc    Check for related resource conflicts
   * @access  Private
   */
  .post(validateMutateClass, checkClass);

router
  .route('/:id')
  /**
   * @route   GET /api/classes/:id
   * @desc    Get a class by ID
   * @access  Private
   */
  .get(getClass)

  /**
   * @route   PUT /api/classes/:id
   * @desc    Update a class by ID
   * @access  Private
   */
  .put(validateMutateClass, updateClass)

  /**
   * @route   DELETE /api/classes/:id
   * @desc    Delete a class by ID
   * @access  Private
   */
  .delete(deleteClass);

export default router;
