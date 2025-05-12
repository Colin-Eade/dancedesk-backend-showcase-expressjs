import prisma from '@/config/db';
import { NotFoundError } from '@/errors/classes';
import { LocationDTO, LocationMutateDTO } from '@/features/locations/types';
import { DbClient, TransactionClient } from '@/types/db';
import { ApiResponse } from '@/types/express';

/**
 * @desc    Retrieves all locations for a specific organization
 * @param   {string} organizationId - The ID of the organization to get locations for
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<LocationDTO[]>>} Promise resolving to an API response containing location data and count
 */
export const getAllLocations = async (
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<LocationDTO[]>> => {
  const [locations, count] = await client.location.findManyAndCount({
    where: {
      organizationId,
    },
  });

  return {
    data: locations,
    meta: {
      count,
    },
  };
};

/**
 * @desc    Retrieves a single location by ID
 * @param   {string} id - ID of the location to retrieve
 * @param   {string} organizationId - Organization ID the location belongs to
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<LocationDTO>>} Promise resolving to API response with location data
 * @throws  {NotFoundError} If location is not found
 */
export const getLocation = async (
  id: string,
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<LocationDTO>> => {
  const location = await client.location.findUnique({
    where: {
      id,
      organizationId,
    },
  });

  if (!location) {
    throw new NotFoundError('Location not found.');
  }

  return {
    data: location,
  };
};

/**
 * @desc    Creates a new location in the database
 * @param   {LocationMutateDTO} data - Location creation data
 * @param   {string} organizationId - ID of the organization the location belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<LocationDTO>>} Promise resolving to API response with created location data
 */
export const createLocation = async (
  data: LocationMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<LocationDTO>> => {
  const location = await tx.location.create({
    data: {
      name: data.name,
      address: data.address,
      city: data.city,
      province: data.province,
      country: data.country,
      organizationId,
    },
  });

  return {
    data: location,
  };
};

/**
 * @desc    Updates an existing location in the database
 * @param   {string} id - ID of the location to update
 * @param   {LocationMutateDTO} data - Location update data
 * @param   {string} organizationId - ID of the organization the location belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<LocationDTO>>} Promise resolving to API response with updated location data
 */
export const updateLocation = async (
  id: string,
  data: LocationMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<LocationDTO>> => {
  const updatedLocation = await tx.location.update({
    where: {
      id,
      organizationId,
    },
    data: {
      name: data.name,
      address: data.address,
      city: data.city,
      province: data.province,
      country: data.country,
    },
  });

  return {
    data: updatedLocation,
  };
};

/**
 * @desc    Deletes a location from the database
 * @param   {string} id - ID of the location to delete
 * @param   {string} organizationId - ID of the organization the location belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 */
export const deleteLocation = async (
  id: string,
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  await tx.location.delete({
    where: {
      id,
      organizationId,
    },
  });
};
