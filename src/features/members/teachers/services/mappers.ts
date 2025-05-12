import { Member, MemberRole } from '@prisma/client';
import { TeacherDTO } from '@/features/members/teachers/types';

/**
 * @desc    Converts a Member entity to a TeacherDTO
 * @param   {Member} member - The teacher entity from the database
 * @returns {TeacherDTO} Teacher data transfer object with formatted properties
 */
export const toTeacherDTO = (member: Member): TeacherDTO => ({
  id: member.id,
  organizationId: member.organizationId,
  firstName: member.firstName,
  lastName: member.lastName,
  role: member.role as typeof MemberRole.TEACHER,
  createdAt: member.createdAt,
  updatedAt: member.updatedAt,
});
