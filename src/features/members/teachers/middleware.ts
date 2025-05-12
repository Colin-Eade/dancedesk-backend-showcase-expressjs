import {
  TeacherMutateRequest,
  teacherMutateValidationSchema,
} from '@/features/members/teachers/types';
import { asyncHandler } from '@/middleware/routeHandlers';

/**
 * @desc    Validates teacher creation and update request body
 * @param   {TeacherMutateRequest} req - Request with teacher data
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateMutateTeacher = asyncHandler(
  async (req: TeacherMutateRequest, _res, next) => {
    await teacherMutateValidationSchema.parseAsync(req.body);
    next();
  },
);
