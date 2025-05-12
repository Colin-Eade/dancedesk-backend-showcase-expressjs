import { EventType } from '@prisma/client';
import { z } from 'zod';
import { EventDTO, eventMutateValidationSchema } from '@/features/events/types';
import { AuthRequest } from '@/types/express';

export interface BlockEventDTO extends EventDTO {
  description?: string;
  isFullDay: boolean;
  type: typeof EventType.BLOCK;
}

export type BlockEventMutateDTO = z.infer<
  typeof blockEventMutateValidationSchema
>;

export const blockEventMutateValidationSchema = eventMutateValidationSchema
  .extend({
    description: z.string().optional(),
    isFullDay: z.boolean().default(false),
  })
  .refine((data) => new Date(data.end) > new Date(data.start), {
    message: 'End date/time must be after start date/time.',
    path: ['end'],
  });

export interface BlockEventMutateRequest extends AuthRequest {
  body: BlockEventMutateDTO;
}
