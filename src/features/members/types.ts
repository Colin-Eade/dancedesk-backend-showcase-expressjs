import { MemberRole } from '@prisma/client';
import { z } from 'zod';
import { BaseDTO } from '@/types/dto';

export interface MemberDTO extends BaseDTO {
  firstName: string;
  lastName: string;
  role: MemberRole;
}

export type MemberMutateDTO = z.infer<typeof memberMutateValidationSchema>;

export const memberMutateValidationSchema = z
  .object({
    firstName: z
      .string({ required_error: 'First name is required.' })
      .min(1, 'First name cannot be empty.'),
    lastName: z
      .string({ required_error: 'Last name is required.' })
      .min(1, 'Last name cannot be empty.'),
  })
  .strict({ message: 'Request contains unexpected fields.' });
