import {
  RoutineMutateRequest,
  routineMutateValidationSchema,
} from '@/features/routines/types';
import { asyncHandler } from '@/middleware/routeHandlers';

/**
 * @desc    Validates routine creation and update request body
 * @param   {RoutineMutateRequest} req - Request with routine data
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateMutateRoutine = asyncHandler(
  async (req: RoutineMutateRequest, _res, next) => {
    await routineMutateValidationSchema.parseAsync(req.body);
    next();
  },
);
