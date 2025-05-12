import {
  BlockEventMutateRequest,
  blockEventMutateValidationSchema,
} from '@/features/events/block-events/types';
import { asyncHandler } from '@/middleware/routeHandlers';

/**
 * @desc    Validates block event creation and update request body
 * @param   {BlockEventMutateRequest} req - Request with event data
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateMutateBlockEvent = asyncHandler(
  async (req: BlockEventMutateRequest, _res, next) => {
    await blockEventMutateValidationSchema.parseAsync(req.body);
    next();
  },
);
