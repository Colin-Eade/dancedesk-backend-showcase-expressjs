import prisma from '@/config/db';
import { NotFoundError } from '@/errors/classes';
import { RoutineDTO, RoutineMutateDTO } from '@/features/routines/types';
import { DbClient, TransactionClient } from '@/types/db';
import { ApiResponse } from '@/types/express';

/**
 * @desc    Retrieves all routines for a specific organization
 * @param   {string} organizationId - The ID of the organization to get routines for
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<RoutineDTO[]>>} Promise resolving to an API response containing routine data and count
 */
export const getAllRoutines = async (
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<RoutineDTO[]>> => {
  const [routines, count] = await client.routine.findManyAndCount({
    where: {
      organizationId,
    },
  });

  return {
    data: routines,
    meta: {
      count,
    },
  };
};

/**
 * @desc    Retrieves a single routine by ID
 * @param   {string} id - ID of the routine to retrieve
 * @param   {string} organizationId - Organization ID the routine belongs to
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<RoutineDTO>>} Promise resolving to API response with routine data
 * @throws  {NotFoundError} If routine is not found
 */
export const getRoutine = async (
  id: string,
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<RoutineDTO>> => {
  const routine = await client.routine.findUnique({
    where: {
      id,
      organizationId,
    },
  });

  if (!routine) {
    throw new NotFoundError('Routine not found.');
  }

  return {
    data: routine,
  };
};

/**
 * @desc    Creates a new routine in the database
 * @param   {RoutineMutateDTO} data - Routine creation data
 * @param   {string} organizationId - ID of the organization the routine belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<RoutineDTO>>} Promise resolving to API response with created routine data
 */
export const createRoutine = async (
  data: RoutineMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<RoutineDTO>> => {
  const routine = await tx.routine.create({
    data: {
      name: data.name,
      type: data.type,
      style: data.style,
      song: data.song,
      choreoHours: data.choreoHours,
      organizationId,
    },
  });

  return {
    data: routine,
  };
};

/**
 * @desc    Updates an existing routine in the database
 * @param   {string} id - ID of the routine to update
 * @param   {RoutineMutateDTO} data - Routine update data
 * @param   {string} organizationId - ID of the organization the routine belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<RoutineDTO>>} Promise resolving to API response with updated routine data
 */
export const updateRoutine = async (
  id: string,
  data: RoutineMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<RoutineDTO>> => {
  const updatedRoutine = await tx.routine.update({
    where: {
      id,
      organizationId,
    },
    data: {
      name: data.name,
      type: data.type,
      style: data.style,
      song: data.song,
      choreoHours: data.choreoHours,
    },
  });

  return {
    data: updatedRoutine,
  };
};

/**
 * @desc    Deletes a routine from the database
 * @param   {string} id - ID of the routine to delete
 * @param   {string} organizationId - ID of the organization the routine belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 */
export const deleteRoutine = async (
  id: string,
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  await tx.routine.delete({
    where: {
      id,
      organizationId,
    },
  });
};
