import * as locationService from '@/features/locations/services';
import * as roomService from '@/features/rooms/services';
import { RoomMutateRequest } from '@/features/rooms/types';
import { asyncHandler, txHandler } from '@/middleware/routeHandlers';
import { AuthRequest } from '@/types/express';

/**
 * @desc    Fetches all rooms from the database
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends rooms array with 200 status
 */
export const getAllRooms = txHandler(async (req: AuthRequest, res, tx) => {
  const { organizationId } = req.user;

  const result = await roomService.getAllRooms(organizationId, tx);

  res.status(200).json(result);
});

/**
 * @desc    Fetches a single room by ID
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends room object or 404 if not found
 */
export const getRoom = asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  const result = await roomService.getRoom(id, organizationId);

  res.status(200).json(result);
});

/**
 * @desc    Creates a new room in the database
 * @param   {RoomMutateRequest} req - Express request object, with room data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends created room with 201 status
 */
export const createRoom = txHandler(async (req: RoomMutateRequest, res, tx) => {
  const data = req.body;
  const { organizationId } = req.user;

  await locationService.getLocation(data.locationId, organizationId, tx);

  const result = await roomService.createRoom(data, organizationId, tx);

  res.status(201).json(result);
});

/**
 * @desc    Updates an existing room by ID
 * @param   {RoomMutateRequest} req - Express request object, with the room ID in req.params and updated data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends updated room or 404 if not found
 */
export const updateRoom = txHandler(async (req: RoomMutateRequest, res, tx) => {
  const { id } = req.params;
  const data = req.body;
  const { organizationId } = req.user;

  await roomService.getRoom(id, organizationId, tx);

  await locationService.getLocation(data.locationId, organizationId, tx);

  const result = await roomService.updateRoom(id, data, organizationId, tx);

  res.status(200).json(result);
});

/**
 * @desc    Deletes a room by ID
 * @param   {AuthRequest} req - Express request object, with the room ID in req.params
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends success message or 404 if not found
 */
export const deleteRoom = txHandler(async (req: AuthRequest, res, tx) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  await roomService.getRoom(id, organizationId, tx);

  await roomService.deleteRoom(id, organizationId, tx);

  res.status(204).send();
});
