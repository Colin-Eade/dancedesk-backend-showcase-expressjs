import { Location, Room } from '@prisma/client';
import { RoomDTO } from '@/features/rooms/types';

/**
 * @desc    Converts a room with location to a RoomDTO
 * @param   {Room & { location: Location }} room - The room entity with its location data
 * @returns {RoomDTO} Room data transfer object with formatted properties
 */
export const toRoomDTO = (room: Room & { location: Location }): RoomDTO => ({
  id: room.id,
  organizationId: room.organizationId,
  name: room.name,
  location: room.location,
  createdAt: room.createdAt,
  updatedAt: room.updatedAt,
});
