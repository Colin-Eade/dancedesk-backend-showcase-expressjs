import { z } from 'zod';
import { BaseDTO } from '@/types/dto';
import { AuthRequest } from '@/types/express';

export interface RoutineDTO extends BaseDTO {
  name: string;
  type: string;
  style: string;
  song: string;
  choreoHours: number;
}

export type RoutineMutateDTO = z.infer<typeof routineMutateValidationSchema>;

export const routineMutateValidationSchema = z
  .object({
    name: z
      .string({ required_error: 'Routine name is required.' })
      .min(1, 'Routine name cannot be empty.'),
    type: z
      .string({ required_error: 'Routine type is required.' })
      .min(1, 'Routine type cannot be empty.'),
    style: z
      .string({ required_error: 'Dance style is required.' })
      .min(1, 'Dance style cannot be empty.'),
    song: z
      .string({ required_error: 'Song name is required.' })
      .min(1, 'Song name cannot be empty.'),
    choreoHours: z
      .number({ required_error: 'Choreography hours are required.' })
      .int('Choreography hours must be a whole number.')
      .positive('Choreography hours must be greater than zero.'),
  })
  .strict({ message: 'Request contains unexpected fields.' });

export interface RoutineMutateRequest extends AuthRequest {
  body: RoutineMutateDTO;
}
