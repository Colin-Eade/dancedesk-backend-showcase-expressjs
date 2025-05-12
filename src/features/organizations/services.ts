import prisma from '@/config/db';
import { NotFoundError } from '@/errors/classes';
import { OrganizationDTO } from '@/features/organizations/types';
import { DbClient } from '@/types/db';
import { ApiResponse } from '@/types/express';

/**
 * @desc    Retrieves a user's organization by ID
 * @param   {string} organizationId - The ID of the organization to retrieve
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<OrganizationDTO>>} Promise resolving to API response with organization data
 * @throws  {NotFoundError} If organization is not found
 */
export const getOrganization = async (
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<OrganizationDTO>> => {
  const organization = await client.organization.findUnique({
    where: {
      id: organizationId,
    },
  });

  if (!organization) {
    throw new NotFoundError('Organization not found.');
  }

  return {
    data: organization,
  };
};
