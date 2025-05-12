import * as eventService from '@/features/events/services';
import { asyncHandler, txHandler } from '@/middleware/routeHandlers';
import { AuthRequest } from '@/types/express';

/**
 * @desc    Fetches all events from the database, structured by type
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends events array with 200 status
 */
export const getAllEvents = txHandler(async (req: AuthRequest, res, tx) => {
  const { organizationId } = req.user;

  const result = await eventService.getAllEvents(organizationId, tx);

  res.status(200).json(result);
});

/**
 * @desc    Fetches a single event by ID with type-specific structure
 * @param   {AuthRequest} req - Express request object, with the event ID in req.params
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends event object or 404 if not found
 */
export const getEvent = asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  const result = await eventService.getEvent(id, organizationId);

  res.status(200).json(result);
});
