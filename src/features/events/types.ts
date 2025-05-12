import { EventType } from '@prisma/client';
import { z } from 'zod';
import { BlockEventDTO } from '@/features/events/block-events/types';
import { ClassEventDTO } from '@/features/events/class-events/types';
import { BaseDTO } from '@/types/dto';

export interface EventDTO extends BaseDTO {
  title: string;
  start: Date;
  colour: string;
  end: Date;
  type: EventType;
}

export type EventMutateDTO = z.infer<typeof eventMutateValidationSchema>;

export const eventMutateValidationSchema = z
  .object({
    title: z
      .string({ required_error: 'Title is required.' })
      .min(1, 'Title cannot be empty.'),
    colour: z
      .string()
      .regex(/^#([0-9A-F]{6})$/i, 'Colour must be a valid hex code.')
      .default('#000000'),
    start: z
      .string({ required_error: 'Start date/time is required.' })
      .datetime('Start date/time must be in ISO format.'),
    end: z
      .string({ required_error: 'End date/time is required.' })
      .datetime('End date/time must be in ISO format.'),
  })
  .strict({ message: 'Request contains unexpected fields.' });

export type EventDTOUnion = BlockEventDTO | ClassEventDTO;
