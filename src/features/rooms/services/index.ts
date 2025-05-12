import prisma from '@/config/db';
import { NotFoundError } from '@/errors/classes';
import { toRoomDTO } from '@/features/rooms/services/mappers';
import { RoomDTO, RoomMutateDTO } from '@/features/rooms/types';
import { DbClient, TransactionClient } from '@/types/db';
import { ApiResponse } from '@/types/express';

/**
 * @desc    Retrieves all rooms for a specific organization
 * @param   {string} organizationId - The ID of the organization to get rooms for
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<RoomDTO[]>>} Promise resolving to an API response containing room data and count
 */
export const getAllRooms = async (
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<RoomDTO[]>> => {
  const [rooms, count] = await client.room.findManyAndCount({
    where: {
      organizationId,
    },
    include: {
      location: true,
    },
  });

  return {
    data: rooms.map(toRoomDTO),
    meta: {
      count,
    },
  };
};

/**
 * @desc    Retrieves a single room by ID
 * @param   {string} id - ID of the room to retrieve
 * @param   {string} organizationId - Organization ID the room belongs to
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<RoomDTO>>} Promise resolving to API response with room data
 * @throws  {NotFoundError} If room is not found
 */
export const getRoom = async (
  id: string,
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<RoomDTO>> => {
  const room = await client.room.findUnique({
    where: { id, organizationId },
    include: { location: true },
  });

  if (!room) {
    throw new NotFoundError('Room not found.');
  }

  return {
    data: toRoomDTO(room),
  };
};

/**
 * @desc    Creates a new room in the database
 * @param   {RoomMutateDTO} data - Room creation data
 * @param   {string} organizationId - ID of the organization the room belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<RoomDTO>>} Promise resolving to API response with created room data
 */
export const createRoom = async (
  data: RoomMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<RoomDTO>> => {
  const room = await tx.room.create({
    data: {
      name: data.name,
      locationId: data.locationId,
      organizationId,
    },
    include: {
      location: true,
    },
  });

  return {
    data: toRoomDTO(room),
  };
};

/**
 * @desc    Updates an existing room in the database
 * @param   {string} id - ID of the room to update
 * @param   {RoomMutateDTO} data - Room update data
 * @param   {string} organizationId - ID of the organization the room belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<RoomDTO>>} Promise resolving to API response with updated room data
 */
export const updateRoom = async (
  id: string,
  data: RoomMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<RoomDTO>> => {
  const updatedRoom = await tx.room.update({
    where: {
      id,
      organizationId,
    },
    data: {
      name: data.name,
      locationId: data.locationId,
    },
    include: {
      location: true,
    },
  });

  return {
    data: toRoomDTO(updatedRoom),
  };
};

/**
 * @desc    Deletes a room from the database
 * @param   {string} id - ID of the room to delete
 * @param   {string} organizationId - ID of the organization the room belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 */
export const deleteRoom = async (
  id: string,
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  await tx.room.delete({
    where: {
      id,
      organizationId,
    },
  });
};
