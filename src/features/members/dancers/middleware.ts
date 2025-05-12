import {
  DancerMutateRequest,
  dancerMutateValidationSchema,
} from '@/features/members/dancers/types';
import { asyncHandler } from '@/middleware/routeHandlers';

/**
 * @desc    Validates dancer creation and update request body
 * @param   {DancerMutateRequest} req - Request with dancer data
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateMutateDancer = asyncHandler(
  async (req: DancerMutateRequest, _res, next) => {
    await dancerMutateValidationSchema.parseAsync(req.body);
    next();
  },
);
