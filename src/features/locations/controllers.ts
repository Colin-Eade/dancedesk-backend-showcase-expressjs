import * as locationService from '@/features/locations/services';
import { LocationMutateRequest } from '@/features/locations/types';
import { asyncHandler, txHandler } from '@/middleware/routeHandlers';
import { AuthRequest } from '@/types/express';

/**
 * @desc    Fetches all locations from the database
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends locations array with 200 status
 */
export const getAllLocations = txHandler(async (req: AuthRequest, res, tx) => {
  const { organizationId } = req.user;

  const result = await locationService.getAllLocations(organizationId, tx);

  res.status(200).json(result);
});

/**
 * @desc    Fetches a single location by ID
 * @param   {AuthRequest} req - Express request object,
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends location object or 404 if not found
 */
export const getLocation = asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  const result = await locationService.getLocation(id, organizationId);

  res.status(200).json(result);
});

/**
 * @desc    Creates a new location in the database
 * @param   {LocationMutateRequest} req - Express request object, with location data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends created location with 201 status
 */
export const createLocation = txHandler(
  async (req: LocationMutateRequest, res, tx) => {
    const data = req.body;
    const { organizationId } = req.user;

    const result = await locationService.createLocation(
      data,
      organizationId,
      tx,
    );

    res.status(201).json(result);
  },
);

/**
 * @desc    Updates an existing location by ID
 * @param   {LocationMutateRequest} req - Express request object, with the location ID in req.params and updated data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends updated location or 404 if not found
 */
export const updateLocation = txHandler(
  async (req: LocationMutateRequest, res, tx) => {
    const { id } = req.params;
    const data = req.body;
    const { organizationId } = req.user;

    await locationService.getLocation(id, organizationId, tx);

    const result = await locationService.updateLocation(
      id,
      data,
      organizationId,
      tx,
    );

    res.status(200).json(result);
  },
);

/**
 * @desc    Deletes a location by ID
 * @param   {LocationMutateRequest} req - Express request object, with the location ID in req.params
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends success message or 404 if not found
 */
export const deleteLocation = txHandler(
  async (req: LocationMutateRequest, res, tx) => {
    const { id } = req.params;
    const { organizationId } = req.user;

    await locationService.getLocation(id, organizationId, tx);

    await locationService.deleteLocation(id, organizationId, tx);

    res.status(204).send();
  },
);
