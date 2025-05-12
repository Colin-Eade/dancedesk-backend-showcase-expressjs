import { z } from 'zod';
import { BaseDTO } from '@/types/dto';
import { AuthRequest } from '@/types/express';

export interface SeasonDTO extends BaseDTO {
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export type SeasonMutateDTO = z.infer<typeof seasonMutateValidationSchema>;

export const seasonMutateValidationSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required.' })
      .min(1, 'Name cannot be empty.'),
    startDate: z
      .string({ required_error: 'Start date is required.' })
      .date('Start date must be a valid date in YYYY-MM-DD format.'),
    endDate: z
      .string({ required_error: 'End date is required.' })
      .date('End date must be a valid date in YYYY-MM-DD format.'),
  })
  .strict({ message: 'Request contains unexpected fields.' })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: 'End date must be after start date.',
    path: ['endDate'],
  });

export interface SeasonMutateRequest extends AuthRequest {
  body: SeasonMutateDTO;
}
