import {
  BlockEvent,
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
import { eventToBlockEventDTO } from '@/features/events/block-events/services/mappers';
import { eventToClassEventDTO } from '@/features/events/class-events/services/mappers';
import { EventDTOUnion } from '@/features/events/types';

/**
 * @desc    Transforms a single database event object into appropriate DTO format
 * @param   {Event & {
 *            blockEvent: BlockEvent | null;
 *            classEvent: (ClassEvent & {
 *              class: Class & {
 *                classOccurrences: (ClassOccurrence & { room: Room & { location: Location } })[];
 *                dancers: { dancer: Dancer & { member: Member } }[] | null;
 *                teachers: { member: Member }[] | null;
 *                season: Season | null;
 *                routine: Routine | null;
 *              };
 *            }) | null;
 *          }} event - Event object from the database with all related data
 * @returns {EventDTOUnion} Transformed event DTO
 */
export const toEventDTOUnion = (
  event: Event & {
    blockEvent: BlockEvent | null;
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
): EventDTOUnion => {
  if (event.type === EventType.CLASS) {
    return eventToClassEventDTO(event);
  } else {
    return eventToBlockEventDTO(event);
  }
};
