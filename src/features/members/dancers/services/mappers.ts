import { Dancer, Member, MemberRole } from '@prisma/client';
import { DancerDTO } from '@/features/members/dancers/types';

/**
 * @desc    Converts a Dancer entity with member to a DancerDTO
 * @param   {Dancer & { member: Member }} dancer - The dancer entity with member data
 * @returns {DancerDTO} Dancer data transfer object with formatted properties
 */
export const toDancerDTO = (
  dancer: Dancer & { member: Member },
): DancerDTO => ({
  id: dancer.member.id,
  organizationId: dancer.member.organizationId,
  firstName: dancer.member.firstName,
  lastName: dancer.member.lastName,
  role: dancer.member.role as typeof MemberRole.DANCER,
  dateOfBirth: dancer.dateOfBirth.toISOString().split('T')[0],
  createdAt: dancer.member.createdAt,
  updatedAt: dancer.member.updatedAt,
});
