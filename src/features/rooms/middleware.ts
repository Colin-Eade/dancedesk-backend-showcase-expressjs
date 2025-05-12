import {
  RoomMutateRequest,
  roomMutateValidationSchema,
} from '@/features/rooms/types';
import { asyncHandler } from '@/middleware/routeHandlers';

/**
 * @desc    Validates room creation and update request body
 * @param   {RoomMutateRequest} req - Request with room data
 * @param   {Response} res - Response object
 * @param   {NextFunction} next - Next middleware function
 * @returns {void} Calls next() if validation passes
 */
export const validateMutateRoom = asyncHandler(
  async (req: RoomMutateRequest, _res, next) => {
    await roomMutateValidationSchema.parseAsync(req.body);
    next();
  },
);
