import { z } from 'zod';
import { BaseDTO } from '@/types/dto';
import { AuthRequest } from '@/types/express';

export interface LocationDTO extends BaseDTO {
  name: string;
  address: string;
  city: string;
  province: string;
  country: string;
}

export type LocationMutateDTO = z.infer<typeof locationMutateValidationSchema>;

export const locationMutateValidationSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required.' })
      .min(1, 'Name cannot be empty.'),
    address: z
      .string({ required_error: 'Address is required.' })
      .min(1, 'Address cannot be empty.'),
    city: z
      .string({ required_error: 'City is required.' })
      .min(1, 'City cannot be empty.'),
    province: z
      .string({ required_error: 'Province is required.' })
      .min(1, 'Province cannot be empty.'),
    country: z
      .string({ required_error: 'Country is required.' })
      .min(1, 'Country cannot be empty.'),
  })
  .strict({ message: 'Request contains unexpected fields.' });

export interface LocationMutateRequest extends AuthRequest {
  body: LocationMutateDTO;
}
