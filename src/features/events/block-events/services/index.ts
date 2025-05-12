import { EventType } from '@prisma/client';
import prisma from '@/config/db';
import { NotFoundError } from '@/errors/classes';
import { blockEventToBlockEventDTO } from '@/features/events/block-events/services/mappers';
import {
  BlockEventDTO,
  BlockEventMutateDTO,
} from '@/features/events/block-events/types';
import { DbClient, TransactionClient } from '@/types/db';
import { ApiResponse } from '@/types/express';

/**
 * @desc    Retrieves a single block event by ID
 * @param   {string} id - ID of the block event to retrieve
 * @param   {string} organizationId - Organization ID the event belongs to
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<BlockEventDTO>>} Promise resolving to API response with block event data
 * @throws  {NotFoundError} If block event is not found
 */
export const getBlockEvent = async (
  id: string,
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<BlockEventDTO>> => {
  const blockEvent = await client.blockEvent.findUnique({
    where: {
      eventId: id,
      event: {
        organizationId,
        type: EventType.BLOCK,
      },
    },
    include: {
      event: true,
    },
  });

  if (!blockEvent) {
    throw new NotFoundError('Event not found.');
  }

  return {
    data: blockEventToBlockEventDTO(blockEvent),
  };
};

/**
 * @desc    Creates a new block event in the database
 * @param   {BlockEventMutateDTO} data - Block event creation data
 * @param   {string} organizationId - ID of the organization the event belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<BlockEventDTO>>} Promise resolving to API response with created event data
 */
export const createBlockEvent = async (
  data: BlockEventMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<BlockEventDTO>> => {
  const blockEvent = await tx.blockEvent.create({
    data: {
      description: data.description,
      isFullDay: data.isFullDay,
      event: {
        create: {
          title: data.title,
          colour: data.colour,
          start: new Date(data.start),
          end: new Date(data.end),
          type: EventType.BLOCK,
          organizationId,
        },
      },
    },
    include: {
      event: true,
    },
  });

  return {
    data: blockEventToBlockEventDTO(blockEvent),
  };
};

/**
 * @desc    Updates an existing block event in the database
 * @param   {string} id - ID of the block event to update
 * @param   {BlockEventMutateDTO} data - Block event update data
 * @param   {string} organizationId - ID of the organization the event belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<BlockEventDTO>>} Promise resolving to API response with updated block event data
 */
export const updateBlockEvent = async (
  id: string,
  data: BlockEventMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<BlockEventDTO>> => {
  const blockEvent = await tx.blockEvent.update({
    where: {
      eventId: id,
      event: {
        organizationId,
        type: EventType.BLOCK,
      },
    },
    data: {
      description: data.description,
      isFullDay: data.isFullDay,
      event: {
        update: {
          title: data.title,
          colour: data.colour,
          start: new Date(data.start),
          end: new Date(data.end),
        },
      },
    },
    include: {
      event: true,
    },
  });

  return {
    data: blockEventToBlockEventDTO(blockEvent),
  };
};

/**
 * @desc    Deletes a block event from the database
 * @param   {string} id - ID of the block event to delete
 * @param   {string} organizationId - ID of the organization the event belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 */
export const deleteBlockEvent = async (
  id: string,
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  await tx.event.delete({
    where: {
      id,
      organizationId,
      type: EventType.BLOCK,
    },
  });
};
