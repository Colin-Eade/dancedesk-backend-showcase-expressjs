import prisma from '@/config/db';
import { NotFoundError } from '@/errors/classes';
import { toEventDTOUnion } from '@/features/events/services/mappers';
import { EventDTOUnion } from '@/features/events/types';
import { DbClient } from '@/types/db';
import { ApiResponse } from '@/types/express';

/**
 * @desc    Retrieves all events for a specific organization
 * @param   {string} organizationId - The ID of the organization to get events for
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<EventDTOUnion[]>>} Promise resolving to an API response containing event data and count
 */
export const getAllEvents = async (
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<EventDTOUnion[]>> => {
  const [events, count] = await client.event.findManyAndCount({
    where: {
      organizationId,
    },
    include: {
      blockEvent: true,
      classEvent: {
        include: {
          class: {
            include: {
              classOccurrences: {
                include: {
                  room: {
                    include: {
                      location: true,
                    },
                  },
                },
              },
              dancers: {
                include: {
                  dancer: {
                    include: {
                      member: true,
                    },
                  },
                },
              },
              teachers: {
                include: {
                  member: true,
                },
              },
              season: true,
              routine: true,
            },
          },
        },
      },
    },
  });

  return {
    data: events.map(toEventDTOUnion),
    meta: {
      count,
    },
  };
};

/**
 * @desc    Retrieves a single event by ID for a specific organization
 * @param   {string} id - The ID of the event to retrieve
 * @param   {string} organizationId - The ID of the organization the event belongs to
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<EventDTOUnion>>} Promise resolving to an API response containing the event data
 * @throws  {NotFoundError} If the event is not found
 */
export const getEvent = async (
  id: string,
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<EventDTOUnion>> => {
  const event = await client.event.findUnique({
    where: {
      id,
      organizationId,
    },
    include: {
      blockEvent: true,
      classEvent: {
        include: {
          class: {
            include: {
              classOccurrences: {
                include: {
                  room: {
                    include: {
                      location: true,
                    },
                  },
                },
              },
              dancers: {
                include: {
                  dancer: {
                    include: {
                      member: true,
                    },
                  },
                },
              },
              teachers: {
                include: {
                  member: true,
                },
              },
              season: true,
              routine: true,
            },
          },
        },
      },
    },
  });

  if (!event) {
    throw new NotFoundError('Event not found.');
  }

  return {
    data: toEventDTOUnion(event),
  };
};
