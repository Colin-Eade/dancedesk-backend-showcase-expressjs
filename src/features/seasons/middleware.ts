import {
  SeasonMutateRequest,
  seasonMutateValidationSchema,
} from '@/features/seasons/types';
import { asyncHandler } from '@/middleware/routeHandlers';

/**
 * @desc    Validates season creation and update request body
 * @param   {SeasonMutateRequest} req - Request with season data
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateMutateSeason = asyncHandler(
  async (req: SeasonMutateRequest, _res, next) => {
    await seasonMutateValidationSchema.parseAsync(req.body);
    next();
  },
);
