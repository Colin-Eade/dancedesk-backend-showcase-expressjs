import * as blockEventService from '@/features/events/block-events/services';
import { BlockEventMutateRequest } from '@/features/events/block-events/types';
import { txHandler } from '@/middleware/routeHandlers';

/**
 * @desc    Creates a new block event in the database
 * @param   {BlockEventMutateRequest} req - Express request object, with block event data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends created event with 201 status
 */
export const createBlockEvent = txHandler(
  async (req: BlockEventMutateRequest, res, tx) => {
    const data = req.body;
    const { organizationId } = req.user;

    const result = await blockEventService.createBlockEvent(
      data,
      organizationId,
      tx,
    );

    res.status(201).json(result);
  },
);

/**
 * @desc    Updates an existing block event by ID
 * @param   {BlockEventMutateRequest} req - Express request object, with the block event ID in req.params and updated data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends updated event or 404 if not found
 */
export const updateBlockEvent = txHandler(
  async (req: BlockEventMutateRequest, res, tx) => {
    const { id } = req.params;
    const data = req.body;
    const { organizationId } = req.user;

    // Temp fix for expo
    if (!data.colour || data.colour === '#F9CA62') {
      data.colour = data.isFullDay ? '#F76A69' : '#F9CA62';
    }

    await blockEventService.getBlockEvent(id, organizationId, tx);

    const result = await blockEventService.updateBlockEvent(
      id,
      data,
      organizationId,
      tx,
    );

    res.status(200).json(result);
  },
);

/**
 * @desc    Deletes a block event by ID
 * @param   {BlockEventMutateRequest} req - Express request object, with the block event ID in req.params
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends success message or 404 if not found
 */
export const deleteBlockEvent = txHandler(
  async (req: BlockEventMutateRequest, res, tx) => {
    const { id } = req.params;
    const { organizationId } = req.user;

    await blockEventService.getBlockEvent(id, organizationId, tx);

    await blockEventService.deleteBlockEvent(id, organizationId, tx);

    res.status(204).send();
  },
);
