import { Router } from 'express';
import {
  getAllTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  createTeacher,
} from '@/features/members/teachers/controllers';
import { validateMutateTeacher } from '@/features/members/teachers/middleware';

const router = Router();

router
  .route('/')
  /**
   * @route   GET /api/members/teachers
   * @desc    Get all teachers
   * @access  Private
   */
  .get(getAllTeachers)

  /**
   * @route   POST /api/members/teachers
   * @desc    Create a teacher
   * @access  Private
   */
  .post(validateMutateTeacher, createTeacher);

router
  .route('/:id')
  /**
   * @route   GET /api/members/teachers/:id
   * @desc    Get a teacher by ID
   * @access  Private
   */
  .get(getTeacher)

  /**
   * @route   PUT /api/members/teachers/:id
   * @desc    Update a teacher by ID
   * @access  Private
   */
  .put(validateMutateTeacher, updateTeacher)

  /**
   * @route   DELETE /api/members/teachers/:id
   * @desc    Delete a teacher by ID
   * @access  Private
   */
  .delete(deleteTeacher);

export default router;
