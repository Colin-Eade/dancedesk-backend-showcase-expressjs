import { MemberRole } from '@prisma/client';
import { z } from 'zod';
import {
  MemberDTO,
  memberMutateValidationSchema,
} from '@/features/members/types';
import { AuthRequest } from '@/types/express';

export interface DancerDTO extends MemberDTO {
  dateOfBirth: string; // YYYY-MM-DD
  role: typeof MemberRole.DANCER;
}

export type DancerMutateDTO = z.infer<typeof dancerMutateValidationSchema>;

export const dancerMutateValidationSchema = memberMutateValidationSchema.extend(
  {
    dateOfBirth: z
      .string({ required_error: 'Date of birth is required.' })
      .date('Date of birth must be a valid date in YYYY-MM-DD format.'),
  },
);

export interface DancerMutateRequest extends AuthRequest {
  body: DancerMutateDTO;
}
