import { EventType } from '@prisma/client';
import { z } from 'zod';
import { ClassDTO } from '@/features/classes/types';
import { EventDTO, eventMutateValidationSchema } from '@/features/events/types';

export interface ClassEventDTO extends EventDTO {
  type: typeof EventType.CLASS;
  class: ClassDTO;
}

export type ClassEventMutateDTO = z.infer<
  typeof classEventMutateValidationSchema
>;

export const classEventMutateValidationSchema = eventMutateValidationSchema
  .extend({
    classId: z
      .string({ required_error: 'Class is required.' })
      .uuid('Class ID must be a valid UUID.'),
    roomId: z
      .string({ required_error: 'Room is required.' })
      .uuid('Room ID must be a valid UUID.'),
  })
  .refine((data) => new Date(data.end) > new Date(data.start), {
    message: 'End date/time must be after start date/time.',
    path: ['end'],
  });
