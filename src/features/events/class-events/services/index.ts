import { EventType } from '@prisma/client';
import { classEventToClassEventDTO } from '@/features/events/class-events/services/mappers';
import {
  ClassEventDTO,
  ClassEventMutateDTO,
} from '@/features/events/class-events/types';
import { TransactionClient } from '@/types/db';
import { ApiResponse } from '@/types/express';

/**
 * @desc    Creates multiple class events in the database
 * @param   {ClassEventMutateDTO[]} data - Array of class event creation data
 * @param   {string} organizationId - ID of the organization the events belong to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<ClassEventDTO[]>>} Promise resolving to API response with created class events and count
 */
export const createManyClassEvents = async (
  data: ClassEventMutateDTO[],
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<ClassEventDTO[]>> => {
  const events = await tx.event.createManyAndReturn({
    data: data.map((dto) => ({
      title: dto.title,
      colour: dto.colour,
      start: dto.start,
      end: dto.end,
      type: EventType.CLASS,
      organizationId,
    })),
  });

  await tx.classEvent.createMany({
    data: events.map((event, index) => ({
      eventId: event.id,
      classId: data[index].classId,
      roomId: data[index].roomId,
    })),
  });

  const [classEvents, count] = await tx.classEvent.findManyAndCount({
    where: {
      eventId: {
        in: events.map((event) => event.id),
      },
    },
    include: {
      event: true,
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
  });

  return {
    data: classEvents.map(classEventToClassEventDTO),
    meta: {
      count,
    },
  };
};

/**
 * @desc    Updates all class events associated with a specific class
 * @param   {string} classId - ID of the class whose events need to be updated
 * @param   {ClassEventMutateDTO[]} data - Array of class event update data
 * @param   {string} organizationId - ID of the organization the events belong to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<ClassEventDTO[]>>} Promise resolving to API response with updated class events and count
 */
export const updateClassEventsForClass = async (
  classId: string,
  data: ClassEventMutateDTO[],
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<ClassEventDTO[]>> => {
  await tx.event.deleteMany({
    where: {
      organizationId,
      classEvent: {
        classId,
      },
    },
  });

  const events = await tx.event.createManyAndReturn({
    data: data.map((dto) => ({
      title: dto.title,
      colour: dto.colour,
      start: dto.start,
      end: dto.end,
      type: EventType.CLASS,
      organizationId,
    })),
  });
  await tx.classEvent.createMany({
    data: events.map((event, index) => ({
      eventId: event.id,
      classId: data[index].classId,
      roomId: data[index].roomId,
    })),
  });
  const [classEvents, count] = await tx.classEvent.findManyAndCount({
    where: {
      eventId: {
        in: events.map((event) => event.id),
      },
    },
    include: {
      event: true,
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
  });

  return {
    data: classEvents.map(classEventToClassEventDTO),
    meta: {
      count,
    },
  };
};

/**
 * @desc    Deletes all class events associated with a specific class
 * @param   {string} classId - ID of the class to delete events for
 * @param   {string} organizationId - ID of the organization
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<number>} Number of events deleted
 */
export const deleteClassEventsForClass = async (
  classId: string,
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  await tx.event.deleteMany({
    where: {
      organizationId,
      classEvent: {
        classId,
      },
    },
  });
};
