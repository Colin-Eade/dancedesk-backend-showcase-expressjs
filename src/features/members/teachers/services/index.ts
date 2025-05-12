import { MemberRole } from '@prisma/client';
import prisma from '@/config/db';
import { NotFoundError } from '@/errors/classes';
import { toTeacherDTO } from '@/features/members/teachers/services/mappers';
import {
  TeacherDTO,
  TeacherMutateDTO,
} from '@/features/members/teachers/types';
import { DbClient, TransactionClient } from '@/types/db';
import { ApiResponse } from '@/types/express';

/**
 * @desc    Retrieves all teachers for a specific organization
 * @param   {string} organizationId - The ID of the organization to get teachers for
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<TeacherDTO[]>>} Promise resolving to an API response containing teacher data and count
 */
export const getAllTeachers = async (
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<TeacherDTO[]>> => {
  const [teachers, count] = await client.member.findManyAndCount({
    where: {
      organizationId,
      role: MemberRole.TEACHER,
    },
  });

  return {
    data: teachers.map(toTeacherDTO),
    meta: {
      count,
    },
  };
};

/**
 * @desc    Retrieves a single teacher by ID
 * @param   {string} id - ID of the teacher to retrieve
 * @param   {string} organizationId - Organization ID the teacher belongs to
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<TeacherDTO>>} Promise resolving to API response with teacher data
 * @throws  {NotFoundError} If teacher is not found
 */
export const getTeacher = async (
  id: string,
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<TeacherDTO>> => {
  const teacher = await client.member.findUnique({
    where: {
      id,
      organizationId,
      role: MemberRole.TEACHER,
    },
  });

  if (!teacher) {
    throw new NotFoundError('Teacher not found.');
  }

  return {
    data: toTeacherDTO(teacher),
  };
};

/**
 * @desc    Creates a new teacher in the database
 * @param   {TeacherMutateDTO} data - Teacher creation data
 * @param   {string} organizationId - ID of the organization the teacher belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<TeacherDTO>>} Promise resolving to API response with created teacher data
 */
export const createTeacher = async (
  data: TeacherMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<TeacherDTO>> => {
  const teacher = await tx.member.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      role: MemberRole.TEACHER,
      organizationId,
    },
  });

  return {
    data: toTeacherDTO(teacher),
  };
};

/**
 * @desc    Updates an existing teacher in the database
 * @param   {string} id - ID of the teacher to update
 * @param   {TeacherMutateDTO} data - Teacher update data
 * @param   {string} organizationId - ID of the organization the teacher belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<TeacherDTO>>} Promise resolving to API response with updated teacher data
 */
export const updateTeacher = async (
  id: string,
  data: TeacherMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<TeacherDTO>> => {
  const updatedTeacher = await tx.member.update({
    where: {
      id,
      organizationId,
      role: MemberRole.TEACHER,
    },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
    },
  });

  return {
    data: toTeacherDTO(updatedTeacher),
  };
};

/**
 * @desc    Deletes a teacher from the database
 * @param   {string} id - ID of the teacher to delete
 * @param   {string} organizationId - ID of the organization the teacher belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 */
export const deleteTeacher = async (
  id: string,
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  await tx.member.delete({
    where: {
      id,
      organizationId,
      role: MemberRole.TEACHER,
    },
  });
};
