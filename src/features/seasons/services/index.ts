import prisma from '@/config/db';
import { NotFoundError } from '@/errors/classes';
import { toSeasonDTO } from '@/features/seasons/services/mappers';
import { SeasonDTO, SeasonMutateDTO } from '@/features/seasons/types';
import { DbClient, TransactionClient } from '@/types/db';
import { ApiResponse } from '@/types/express';

/**
 * @desc    Retrieves all seasons for a specific organization
 * @param   {string} organizationId - The ID of the organization to get seasons for
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<SeasonDTO[]>>} Promise resolving to an API response containing season data and count
 */
export const getAllSeasons = async (
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<SeasonDTO[]>> => {
  const [seasons, count] = await client.season.findManyAndCount({
    where: {
      organizationId,
    },
  });

  return {
    data: seasons.map(toSeasonDTO),
    meta: {
      count,
    },
  };
};

/**
 * @desc    Retrieves a single season by ID
 * @param   {string} id - ID of the season to retrieve
 * @param   {string} organizationId - Organization ID the season belongs to
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<SeasonDTO>>} Promise resolving to API response with season data
 * @throws  {NotFoundError} If season is not found
 */
export const getSeason = async (
  id: string,
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<SeasonDTO>> => {
  const season = await client.season.findUnique({
    where: {
      id,
      organizationId,
    },
  });

  if (!season) {
    throw new NotFoundError('Season not found.');
  }

  return {
    data: toSeasonDTO(season),
  };
};

/**
 * @desc    Creates a new season in the database
 * @param   {SeasonMutateDTO} data - Season creation data
 * @param   {string} organizationId - ID of the organization the season belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<SeasonDTO>>} Promise resolving to API response with created season data
 */
export const createSeason = async (
  data: SeasonMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<SeasonDTO>> => {
  const season = await tx.season.create({
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      organizationId,
    },
  });

  return {
    data: toSeasonDTO(season),
  };
};

/**
 * @desc    Updates an existing season in the database
 * @param   {string} id - ID of the season to update
 * @param   {SeasonMutateDTO} data - Season update data
 * @param   {string} organizationId - ID of the organization the season belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<SeasonDTO>>} Promise resolving to API response with updated season data
 */
export const updateSeason = async (
  id: string,
  data: SeasonMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<SeasonDTO>> => {
  const updatedSeason = await tx.season.update({
    where: {
      id,
      organizationId,
    },
    data: {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });

  return {
    data: toSeasonDTO(updatedSeason),
  };
};

/**
 * @desc    Deletes a season from the database
 * @param   {string} id - ID of the season to delete
 * @param   {string} organizationId - ID of the organization the season belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 */
export const deleteSeason = async (
  id: string,
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  await tx.season.delete({
    where: {
      id,
      organizationId,
    },
  });
};
