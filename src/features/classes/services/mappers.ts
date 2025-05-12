import {
  Class,
  ClassOccurrence,
  Dancer,
  Location,
  Member,
  Room,
  Routine,
  Season,
  Weekday,
} from '@prisma/client';
import { ClassDTO, ClassOccurrenceDTO } from '@/features/classes/types';
import { toDancerDTO } from '@/features/members/dancers/services/mappers';
import { toTeacherDTO } from '@/features/members/teachers/services/mappers';
import { toRoomDTO } from '@/features/rooms/services/mappers';
import { toSeasonDTO } from '@/features/seasons/services/mappers';

/**
 * @desc    Converts a ClassOccurrence entity with room to a ClassOccurrenceDTO
 * @param   {ClassOccurrence & {
 *            room: Room & {
 *              location: Location
 *            }
 *          }} classOccurrence - The class occurrence entity with room and location data
 * @returns {ClassOccurrenceDTO} ClassOccurrence data transfer object with formatted properties
 */
export const toClassOccurrenceDTO = (
  classOccurrence: ClassOccurrence & {
    room: Room & {
      location: Location;
    };
  },
): ClassOccurrenceDTO => ({
  id: classOccurrence.id,
  weekday: classOccurrence.weekday,
  startTime: classOccurrence.startTime
    .toISOString()
    .split('T')[1]
    .split('.')[0],
  endTime: classOccurrence.endTime.toISOString().split('T')[1].split('.')[0],
  room: toRoomDTO(classOccurrence.room),
  createdAt: classOccurrence.createdAt,
  updatedAt: classOccurrence.updatedAt,
});

/**
 * @desc    Converts a Class entity with related data to a ClassDTO
 * @param   {Class & {
 *            season: Season | null,
 *            routine: Routine | null,
 *            dancers: { dancer: Dancer & { member: Member } }[],
 *            teachers: { member: Member }[],
 *            classOccurrences: (ClassOccurrence & { room: Room & { location: Location } })[]
 *          }} classObject - The class entity with all related data
 * @returns {ClassDTO} Class data transfer object with formatted properties and related data
 */
export const toClassDTO = (
  classObject: Class & {
    season: Season | null;
    routine: Routine | null;
    dancers: {
      dancer: Dancer & {
        member: Member;
      };
    }[];
    teachers: {
      member: Member;
    }[];
    classOccurrences: (ClassOccurrence & {
      room: Room & {
        location: Location;
      };
    })[];
  },
): ClassDTO => ({
  id: classObject.id,
  organizationId: classObject.organizationId,
  name: classObject.name,
  colour: classObject.colour,
  startDate: classObject.startDate.toISOString().split('T')[0],
  endDate: classObject.endDate.toISOString().split('T')[0],
  season: classObject.season ? toSeasonDTO(classObject.season) : undefined,
  routine: classObject.routine ?? undefined,
  dancers: classObject.dancers.map((dancer) => toDancerDTO(dancer.dancer)),
  teachers: classObject.teachers.map((teacher) => toTeacherDTO(teacher.member)),
  classOccurrences: classObject.classOccurrences.map(toClassOccurrenceDTO),
  createdAt: classObject.createdAt,
  updatedAt: classObject.updatedAt,
});

/**
 * @desc    Converts a Weekday enum value to its corresponding numeric weekday index
 * @param   {Weekday} weekday - The Weekday enum value of a class occurrence
 * @returns {number} The numeric weekday index (0 for Sunday, 1 for Monday, etc.)
 */
export const weekdayEnumToWeekdayNumber = (weekday: Weekday): number => {
  return [
    Weekday.SUNDAY,
    Weekday.MONDAY,
    Weekday.TUESDAY,
    Weekday.WEDNESDAY,
    Weekday.THURSDAY,
    Weekday.FRIDAY,
    Weekday.SATURDAY,
  ].indexOf(weekday);
};
