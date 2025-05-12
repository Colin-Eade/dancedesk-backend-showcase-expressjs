import { z } from 'zod';
import { LocationDTO } from '@/features/locations/types';
import { BaseDTO } from '@/types/dto';
import { AuthRequest } from '@/types/express';

export interface RoomDTO extends BaseDTO {
  name: string;
  location: LocationDTO;
}

export type RoomMutateDTO = z.infer<typeof roomMutateValidationSchema>;

export const roomMutateValidationSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required.' })
      .min(1, 'Name cannot be empty.'),
    locationId: z
      .string({ required_error: 'Location is required.' })
      .uuid('Location ID must be a valid UUID.'),
  })
  .strict({ message: 'Request contains unexpected fields.' });

export interface RoomMutateRequest extends AuthRequest {
  body: RoomMutateDTO;
}
