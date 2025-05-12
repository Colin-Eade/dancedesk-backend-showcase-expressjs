import { Weekday } from '@prisma/client';
import { z } from 'zod';
import { DancerDTO } from '@/features/members/dancers/types';
import { TeacherDTO } from '@/features/members/teachers/types';
import { RoomDTO } from '@/features/rooms/types';
import { RoutineDTO } from '@/features/routines/types';
import { SeasonDTO } from '@/features/seasons/types';
import { BaseDTO } from '@/types/dto';
import { AuthRequest } from '@/types/express';

export interface ClassOccurrenceDTO extends Omit<BaseDTO, 'organizationId'> {
  weekday: Weekday;
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
  room: RoomDTO;
}

export interface ClassDTO extends BaseDTO {
  name: string;
  colour: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  season?: SeasonDTO;
  routine?: RoutineDTO;
  dancers: DancerDTO[]; // 0..*
  teachers: TeacherDTO[]; // 0..*
  classOccurrences: ClassOccurrenceDTO[]; // 1..*
}

export type ClassMutateDTO = z.infer<typeof classMutateValidationSchema>;

export type ClassOccurrenceMutateDTO = z.infer<
  typeof classOccurrenceMutateValidationSchema
>;

export type ClassMutateHeaders = z.infer<
  typeof classMutateHeadersValidationSchema
>;

const classOccurrenceMutateValidationSchema = z
  .object({
    roomId: z
      .string({ required_error: 'Room is required.' })
      .uuid('Room ID must be a valid UUID.'),
    weekday: z.nativeEnum(Weekday, {
      required_error: 'Weekday is required.',
      invalid_type_error: 'Weekday must be a valid day of the week.',
    }),
    startTime: z
      .string({ required_error: 'Start time is required.' })
      .time('Start time must be a valid time in HH:MM:SS format.'),
    endTime: z
      .string({ required_error: 'End time is required.' })
      .time('End time must be a valid time in HH:MM:SS format.'),
  })
  .strict({ message: 'Class occurrence contains unexpected fields.' })
  .refine(
    (data) =>
      new Date(`1970-01-01T${data.startTime}Z`) <
      new Date(`1970-01-01T${data.endTime}Z`),
    {
      message: 'End time must be after start time.',
      path: ['endTime'],
    },
  );

export const classMutateValidationSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required.' })
      .min(1, 'Name cannot be empty.'),
    colour: z
      .string()
      .regex(/^#([0-9A-F]{6})$/i, 'Colour must be a valid hex code.')
      .default('#000000'),
    startDate: z
      .string({ required_error: 'Start date is required.' })
      .date('Start date must be a valid date in YYYY-MM-DD format.'),
    endDate: z
      .string({ required_error: 'End date is required.' })
      .date('End date must be a valid date in YYYY-MM-DD format.'),
    classOccurrences: z
      .array(classOccurrenceMutateValidationSchema, {
        required_error: 'Class occurrences are required.',
      })
      .min(1, 'At least one class occurrence is required.'),
    seasonId: z.string().uuid('Season ID must be a valid UUID.').optional(),
    routineId: z.string().uuid('Routine ID must be a valid UUID.').optional(),
    dancers: z
      .array(z.string().uuid('Dancer IDs must be valid UUIDs.'))
      .default([])
      .refine((array) => new Set(array).size === array.length, {
        message: 'Duplicate dancers are not allowed.',
      }),
    teachers: z
      .array(z.string().uuid('Teacher IDs must be valid UUIDs.'))
      .default([])
      .refine((array) => new Set(array).size === array.length, {
        message: 'Duplicate teachers are not allowed.',
      }),
  })
  .strict({ message: 'Request contains unexpected fields.' })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date.',
    path: ['endDate'],
  });

export const classMutateHeadersValidationSchema = z.object({
  'x-timezone': z
    .string({ required_error: 'X-Timezone header is required.' })
    .min(1, 'X-Timezone header cannot be empty.')
    .refine(
      (timezone) => Intl.supportedValuesOf('timeZone').includes(timezone),
      { message: 'X-Timezone must be a valid IANA timezone identifier.' },
    ),
});

export interface ClassMutateRequest extends AuthRequest {
  headers: ClassMutateHeaders;
  body: ClassMutateDTO;
}
