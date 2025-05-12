import verifier from '@/config/verifier';
import { UnauthorizedError } from '@/errors/classes';
import { asyncHandler } from '@/middleware/routeHandlers';
import { CustomAccessTokenPayload } from '@/types/cognito';
import { AuthRequest } from '@/types/express';

/**
 * @desc    Authentication middleware that verifies access tokens and sets user information
 * @param   {AuthRequest} req - Express request object with auth-specific types
 * @param   {Response} _res - Express response object (unused)
 * @param   {NextFunction} next - Express next function
 * @throws  {UnauthorizedError} When access token is missing or invalid
 * @returns {Promise<void>} Attaches verified user data to request object
 */
export const authenticate = asyncHandler(
  async (req: AuthRequest, _res, next) => {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw new UnauthorizedError();
    }

    const payload = (await verifier.verify(
      String(accessToken),
    )) as CustomAccessTokenPayload;

    const { memberId: id, organizationId, role } = payload;

    req.user = { id, organizationId, role };

    next();
  },
);
