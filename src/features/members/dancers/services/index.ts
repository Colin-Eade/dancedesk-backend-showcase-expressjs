import { MemberRole } from '@prisma/client';
import prisma from '@/config/db';
import { NotFoundError } from '@/errors/classes';
import { toDancerDTO } from '@/features/members/dancers/services/mappers';
import { DancerDTO, DancerMutateDTO } from '@/features/members/dancers/types';
import { DbClient, TransactionClient } from '@/types/db';
import { ApiResponse } from '@/types/express';

/**
 * @desc    Retrieves all dancers for a specific organization
 * @param   {string} organizationId - The ID of the organization to get dancers for
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<DancerDTO[]>>} Promise resolving to an API response containing dancer data and count
 */
export const getAllDancers = async (
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<DancerDTO[]>> => {
  const [dancers, count] = await client.dancer.findManyAndCount({
    where: {
      member: {
        organizationId,
        role: MemberRole.DANCER,
      },
    },
    include: {
      member: true,
    },
  });

  return {
    data: dancers.map(toDancerDTO),
    meta: {
      count,
    },
  };
};

/**
 * @desc    Retrieves a single dancer by ID
 * @param   {string} id - ID of the dancer to retrieve
 * @param   {string} organizationId - Organization ID the dancer belongs to
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<DancerDTO>>} Promise resolving to API response with dancer data
 * @throws  {NotFoundError} If dancer is not found
 */
export const getDancer = async (
  id: string,
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<DancerDTO>> => {
  const dancer = await client.dancer.findUnique({
    where: {
      memberId: id,
      member: {
        organizationId,
        role: MemberRole.DANCER,
      },
    },
    include: {
      member: true,
    },
  });

  if (!dancer) {
    throw new NotFoundError('Dancer not found.');
  }

  return {
    data: toDancerDTO(dancer),
  };
};

/**
 * @desc    Creates a new dancer in the database
 * @param   {DancerMutateDTO} data - Dancer creation data
 * @param   {string} organizationId - ID of the organization the dancer belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<DancerDTO>>} Promise resolving to API response with created dancer data
 */
export const createDancer = async (
  data: DancerMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<DancerDTO>> => {
  const dancer = await tx.dancer.create({
    data: {
      dateOfBirth: new Date(data.dateOfBirth),
      member: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          role: MemberRole.DANCER,
          organizationId,
        },
      },
    },
    include: {
      member: true,
    },
  });

  return {
    data: toDancerDTO(dancer),
  };
};

/**
 * @desc    Updates an existing dancer in the database
 * @param   {string} id - ID of the dancer to update
 * @param   {DancerMutateDTO} data - Dancer update data
 * @param   {string} organizationId - ID of the organization the dancer belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<DancerDTO>>} Promise resolving to API response with updated dancer data
 */
export const updateDancer = async (
  id: string,
  data: DancerMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<DancerDTO>> => {
  const dancer = await tx.dancer.update({
    where: {
      memberId: id,
      member: {
        organizationId,
        role: MemberRole.DANCER,
      },
    },
    data: {
      dateOfBirth: new Date(data.dateOfBirth),
      member: {
        update: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      },
    },
    include: {
      member: true,
    },
  });

  return {
    data: toDancerDTO(dancer),
  };
};

/**
 * @desc    Deletes a dancer from the database
 * @param   {string} id - ID of the dancer to delete
 * @param   {string} organizationId - ID of the organization the dancer belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 */
export const deleteDancer = async (
  id: string,
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  await tx.member.delete({
    where: {
      id,
      organizationId,
      role: MemberRole.DANCER,
    },
  });
};
