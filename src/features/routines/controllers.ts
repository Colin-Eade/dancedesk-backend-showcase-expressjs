import * as routineService from '@/features/routines/services';
import { RoutineMutateRequest } from '@/features/routines/types';
import { asyncHandler, txHandler } from '@/middleware/routeHandlers';
import { AuthRequest } from '@/types/express';

/**
 * @desc    Fetches all routines from the database
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends routines array with 200 status
 */
export const getAllRoutines = txHandler(async (req: AuthRequest, res, tx) => {
  const { organizationId } = req.user;

  const result = await routineService.getAllRoutines(organizationId, tx);

  res.status(200).json(result);
});

/**
 * @desc    Fetches a single routine by ID
 * @param   {AuthRequest} req - Express request object,
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends routine object or 404 if not found
 */
export const getRoutine = asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  const result = await routineService.getRoutine(id, organizationId);

  res.status(200).json(result);
});

/**
 * @desc    Creates a new routine in the database
 * @param   {RoutineMutateRequest} req - Express request object, with routine data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends created routine with 201 status
 */
export const createRoutine = txHandler(
  async (req: RoutineMutateRequest, res, tx) => {
    const data = req.body;
    const { organizationId } = req.user;

    const result = await routineService.createRoutine(data, organizationId, tx);

    res.status(201).json(result);
  },
);

/**
 * @desc    Updates an existing routine by ID
 * @param   {RoutineMutateRequest} req - Express request object, with the routine ID in req.params and updated data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends updated routine or 404 if not found
 */
export const updateRoutine = txHandler(
  async (req: RoutineMutateRequest, res, tx) => {
    const { id } = req.params;
    const data = req.body;
    const { organizationId } = req.user;

    await routineService.getRoutine(id, organizationId, tx);

    const result = await routineService.updateRoutine(
      id,
      data,
      organizationId,
      tx,
    );

    res.status(200).json(result);
  },
);

/**
 * @desc    Deletes a routine by ID
 * @param   {AuthRequest} req - Express request object, with the routine ID in req.params
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends success message or 404 if not found
 */
export const deleteRoutine = txHandler(async (req: AuthRequest, res, tx) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  await routineService.getRoutine(id, organizationId, tx);

  await routineService.deleteRoutine(id, organizationId, tx);

  res.status(204).send();
});
