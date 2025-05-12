import * as organizationService from '@/features/organizations/services';
import { asyncHandler } from '@/middleware/routeHandlers';
import { AuthRequest } from '@/types/express';

/**
 * @desc    Fetches user organization from the database
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends rooms array with 200 status
 */
export const getOrganization = asyncHandler(async (req: AuthRequest, res) => {
  const { organizationId } = req.user;

  const result = await organizationService.getOrganization(organizationId);

  res.status(200).json(result);
});
