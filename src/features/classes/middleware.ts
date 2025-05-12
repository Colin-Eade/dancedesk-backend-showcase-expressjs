import {
  classMutateHeadersValidationSchema,
  ClassMutateRequest,
  classMutateValidationSchema,
} from '@/features/classes/types';
import { asyncHandler } from '@/middleware/routeHandlers';

/**
 * @desc    Validates class creation and update request body
 * @param   {ClassMutateRequest} req - Request with class data
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateMutateClass = asyncHandler(
  async (req: ClassMutateRequest, _res, next) => {
    await Promise.all([
      classMutateValidationSchema.parseAsync(req.body),
      classMutateHeadersValidationSchema.parseAsync(req.headers),
    ]);
    next();
  },
);
