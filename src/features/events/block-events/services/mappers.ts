import { BlockEvent, Event, EventType } from '@prisma/client';
import { InternalServerError } from '@/errors/classes';
import { BlockEventDTO } from '@/features/events/block-events/types';

/**
 * @desc    Converts an BlockEvent entity with included Event to a BlockEventDTO
 * @param   {BlockEvent & { event: Event }} blockEvent - The blockEvent entity with included event
 * @returns {BlockEventDTO} BlockEvent data transfer object
 */
export const blockEventToBlockEventDTO = (
  blockEvent: BlockEvent & { event: Event },
): BlockEventDTO => ({
  id: blockEvent.event.id,
  organizationId: blockEvent.event.organizationId,
  title: blockEvent.event.title,
  description: blockEvent.description ?? undefined,
  colour: blockEvent.event.colour,
  type: blockEvent.event.type as typeof EventType.BLOCK,
  start: blockEvent.event.start,
  end: blockEvent.event.end,
  isFullDay: blockEvent.isFullDay,
  createdAt: blockEvent.event.createdAt,
  updatedAt: blockEvent.event.updatedAt,
});

/**
 * @desc    Converts an Event entity with BlockEvent to a BlockEventDTO
 * @param   {Event & { blockEvent: BlockEvent | null }} event - The event entity with included blockEvent
 * @returns {BlockEventDTO} BlockEvent data transfer object
 * @throws  {InternalServerError} If blockEvent is not included with the event
 */
export const eventToBlockEventDTO = (
  event: Event & { blockEvent: BlockEvent | null },
): BlockEventDTO => {
  if (!event.blockEvent) {
    throw new InternalServerError();
  }

  return {
    id: event.id,
    organizationId: event.organizationId,
    title: event.title,
    colour: event.colour,
    description: event.blockEvent.description ?? undefined,
    type: event.type as typeof EventType.BLOCK,
    start: event.start,
    end: event.end,
    isFullDay: event.blockEvent.isFullDay,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
};
