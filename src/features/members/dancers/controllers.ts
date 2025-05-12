import * as dancerService from '@/features/members/dancers/services';
import { DancerMutateRequest } from '@/features/members/dancers/types';
import { asyncHandler, txHandler } from '@/middleware/routeHandlers';
import { AuthRequest } from '@/types/express';

/**
 * @desc    Fetches all dancers from the database
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends dancers array with 200 status
 */
export const getAllDancers = txHandler(async (req: AuthRequest, res, tx) => {
  const { organizationId } = req.user;

  const result = await dancerService.getAllDancers(organizationId, tx);

  res.status(200).json(result);
});

/**
 * @desc    Fetches a single dancer by ID
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends dancer object or 404 if not found
 */
export const getDancer = asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  const result = await dancerService.getDancer(id, organizationId);

  res.status(200).json(result);
});

/**
 * @desc    Creates a new dancer in the database
 * @param   {DancerMutateRequest} req - Express request object, with dancer data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends created member with 201 status
 */
export const createDancer = txHandler(
  async (req: DancerMutateRequest, res, tx) => {
    const data = req.body;
    const { organizationId } = req.user;

    const result = await dancerService.createDancer(data, organizationId, tx);

    res.status(201).json(result);
  },
);

/**
 * @desc    Updates an existing dancer by ID
 * @param   {DancerMutateRequest} req - Express request object, with the dancer ID in req.params and updated data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends updated dancer or 404 if not found
 */
export const updateDancer = txHandler(
  async (req: DancerMutateRequest, res, tx) => {
    const { id } = req.params;
    const data = req.body;
    const { organizationId } = req.user;

    await dancerService.getDancer(id, organizationId, tx);

    const result = await dancerService.updateDancer(
      id,
      data,
      organizationId,
      tx,
    );

    res.status(200).json(result);
  },
);

/**
 * @desc    Deletes a dancer by ID
 * @param   {AuthRequest} req - Express request object, with the dancer ID in req.params
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends success message or 404 if not found
 */
export const deleteDancer = txHandler(async (req: AuthRequest, res, tx) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  await dancerService.getDancer(id, organizationId, tx);

  await dancerService.deleteDancer(id, organizationId, tx);

  res.status(204).send();
});
