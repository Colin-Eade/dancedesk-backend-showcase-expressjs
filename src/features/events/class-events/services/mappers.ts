import {
  Class,
  ClassEvent,
  ClassOccurrence,
  Dancer,
  Event,
  EventType,
  Location,
  Member,
  Room,
  Routine,
  Season,
} from '@prisma/client';
import { addDays, addWeeks, format } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { InternalServerError } from '@/errors/classes';
import {
  toClassDTO,
  weekdayEnumToWeekdayNumber,
} from '@/features/classes/services/mappers';
import { ClassDTO } from '@/features/classes/types';
import {
  ClassEventDTO,
  ClassEventMutateDTO,
} from '@/features/events/class-events/types';

/**
 * @desc    Converts an Event entity to a ClassEventDTO
 * @param   {Event & {
 *            classEvent: ClassEvent & {
 *              class: Class & {
 *                classOccurrences: (ClassOccurrence & { room: Room & { location: Location } })[];
 *                dancers: { dancer: Dancer & { member: Member } }[];
 *                teachers: { member: Member }[];
 *                season: Season | null;
 *                routine: Routine | null;
 *              };
 *            } | null;
 *          }} event - The event entity with related class data
 * @returns {ClassEventDTO} ClassEvent data transfer object
 * @throws  {InternalServerError} If classEvent data is missing (business logic should prevent this,
 *          but type safety requires this check due to the optional relationship in the database model)
 */
export const eventToClassEventDTO = (
  event: Event & {
    classEvent:
      | (ClassEvent & {
          class: Class & {
            classOccurrences: (ClassOccurrence & {
              room: Room & {
                location: Location;
              };
            })[];
            dancers: {
              dancer: Dancer & {
                member: Member;
              };
            }[];
            teachers: {
              member: Member;
            }[];
            season: Season | null;
            routine: Routine | null;
          };
        })
      | null;
  },
): ClassEventDTO => {
  if (!event.classEvent) {
    throw new InternalServerError();
  }

  return {
    id: event.id,
    organizationId: event.organizationId,
    title: event.title,
    colour: event.colour,
    type: event.type as typeof EventType.CLASS,
    start: event.start,
    end: event.end,
    class: toClassDTO(event.classEvent.class),
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
};

/**
 * @desc    Converts a ClassEvent entity to a ClassEventDTO
 * @param   {ClassEvent & {
 *            event: Event;
 *            class: Class & {
 *              classOccurrences: (ClassOccurrence & { room: Room & { location: Location } })[];
 *              dancers: { dancer: Dancer & { member: Member } }[];
 *              teachers: { member: Member }[];
 *              season: Season | null;
 *              routine: Routine | null;
 *            };
 *          }} classEvent - The classEvent entity with related event and class data
 * @returns {ClassEventDTO} ClassEvent data transfer object
 */
export const classEventToClassEventDTO = (
  classEvent: ClassEvent & {
    event: Event;
    class: Class & {
      classOccurrences: (ClassOccurrence & {
        room: Room & {
          location: Location;
        };
      })[];
      dancers: {
        dancer: Dancer & {
          member: Member;
        };
      }[];
      teachers: {
        member: Member;
      }[];
      season: Season | null;
      routine: Routine | null;
    };
  },
): ClassEventDTO => {
  return {
    id: classEvent.event.id,
    organizationId: classEvent.event.organizationId,
    title: classEvent.event.title,
    colour: classEvent.event.colour,
    type: classEvent.event.type as typeof EventType.CLASS,
    start: classEvent.event.start,
    end: classEvent.event.end,
    class: toClassDTO(classEvent.class),
    createdAt: classEvent.event.createdAt,
    updatedAt: classEvent.event.updatedAt,
  };
};

/**
 * @desc    Converts a ClassDTO to an array of ClassEventMutateDTO objects
 * @param   {ClassDTO} classDTO - The class data transfer object
 * @param   {string} timezone - The timezone to use for date calculations (default: 'America/Toronto')
 * @returns {ClassEventMutateDTO[]} Array of class event mutation DTOs
 */
export const classDTOToClassEventMutateDTOArray = (
  classDTO: ClassDTO,
  timezone: string,
): ClassEventMutateDTO[] => {
  const classEventMutateDTOs: ClassEventMutateDTO[] = [];

  const startDate = new Date(classDTO.startDate);
  startDate.setUTCHours(12, 0, 0, 0);

  const endDate = new Date(classDTO.endDate);
  endDate.setUTCHours(12, 0, 0, 0);

  classDTO.classOccurrences.forEach((occurrence) => {
    const targetWeekday = weekdayEnumToWeekdayNumber(occurrence.weekday);
    const currentWeekday = startDate.getDay();

    const daysToAdd = (targetWeekday - currentWeekday + 7) % 7;

    let currentDate = addDays(startDate, daysToAdd);

    while (currentDate <= endDate) {
      const datePart = format(currentDate, 'yyyy-MM-dd');

      const localStartDateTimeStr = `${datePart}T${occurrence.startTime}`;
      const localEndDateTimeStr = `${datePart}T${occurrence.endTime}`;

      const utcStartDateTime = fromZonedTime(
        localStartDateTimeStr,
        timezone,
      ).toISOString();
      const utcEndDateTime = fromZonedTime(
        localEndDateTimeStr,
        timezone,
      ).toISOString();

      classEventMutateDTOs.push({
        title: classDTO.name,
        colour: classDTO.colour,
        start: utcStartDateTime,
        end: utcEndDateTime,
        classId: classDTO.id,
        roomId: occurrence.room.id,
      });
      currentDate = addWeeks(currentDate, 1);
    }
  });
  return classEventMutateDTOs;
};
