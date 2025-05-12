import * as seasonService from '@/features/seasons/services';
import { SeasonMutateRequest } from '@/features/seasons/types';
import { asyncHandler, txHandler } from '@/middleware/routeHandlers';
import { AuthRequest } from '@/types/express';

/**
 * @desc    Fetches all seasons from the database
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends seasons array with 200 status
 */
export const getAllSeasons = txHandler(async (req: AuthRequest, res, tx) => {
  const { organizationId } = req.user;

  const result = await seasonService.getAllSeasons(organizationId, tx);

  res.status(200).json(result);
});

/**
 * @desc    Fetches a single season by ID
 * @param   {AuthRequest} req - Express request object,
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends season object or 404 if not found
 */
export const getSeason = asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  const result = await seasonService.getSeason(id, organizationId);

  res.status(200).json(result);
});

/**
 * @desc    Creates a new season in the database
 * @param   {SeasonMutateRequest} req - Express request object, with season data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends created season with 201 status
 */
export const createSeason = txHandler(
  async (req: SeasonMutateRequest, res, tx) => {
    const data = req.body;
    const { organizationId } = req.user;

    const result = await seasonService.createSeason(data, organizationId, tx);

    res.status(201).json(result);
  },
);

/**
 * @desc    Updates an existing season by ID
 * @param   {SeasonMutateRequest} req - Express request object, with the season ID in req.params and updated data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends updated season or 404 if not found
 */
export const updateSeason = txHandler(
  async (req: SeasonMutateRequest, res, tx) => {
    const { id } = req.params;
    const data = req.body;
    const { organizationId } = req.user;

    await seasonService.getSeason(id, organizationId, tx);

    const result = await seasonService.updateSeason(
      id,
      data,
      organizationId,
      tx,
    );

    res.status(200).json(result);
  },
);

/**
 * @desc    Deletes a season by ID
 * @param   {AuthRequest} req - Express request object, with the season ID in req.params
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends success message or 404 if not found
 */
export const deleteSeason = txHandler(async (req: AuthRequest, res, tx) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  await seasonService.getSeason(id, organizationId, tx);

  await seasonService.deleteSeason(id, organizationId, tx);

  res.status(204).send();
});
