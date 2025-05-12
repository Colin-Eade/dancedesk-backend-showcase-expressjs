import { MemberRole } from '@prisma/client';
import { z } from 'zod';
import {
  MemberDTO,
  memberMutateValidationSchema,
} from '@/features/members/types';
import { AuthRequest } from '@/types/express';

export interface TeacherDTO extends MemberDTO {
  role: typeof MemberRole.TEACHER;
}

export type TeacherMutateDTO = z.infer<typeof teacherMutateValidationSchema>;

export const teacherMutateValidationSchema = memberMutateValidationSchema;

export interface TeacherMutateRequest extends AuthRequest {
  body: TeacherMutateDTO;
}
