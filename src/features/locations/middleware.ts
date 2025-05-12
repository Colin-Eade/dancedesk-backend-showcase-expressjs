import {
  LocationMutateRequest,
  locationMutateValidationSchema,
} from '@/features/locations/types';
import { asyncHandler } from '@/middleware/routeHandlers';

/**
 * @desc    Validates location creation and update request body
 * @param   {LocationMutateRequest} req - Request with location data
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateMutateLocation = asyncHandler(
  async (req: LocationMutateRequest, _res, next) => {
    await locationMutateValidationSchema.parseAsync(req.body);
    next();
  },
);
