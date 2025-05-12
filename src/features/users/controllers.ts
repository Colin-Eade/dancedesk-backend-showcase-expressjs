import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import cognito from '@/config/cognito';
import prisma from '@/config/db';
import { NotFoundError } from '@/errors/classes';
import { asyncHandler } from '@/middleware/routeHandlers';
import { AuthRequest } from '@/types/express';

/**
 * @desc    Gets the authenticated user's profile data
 * @param   {AuthRequest} req - Express request object with user data from auth middleware
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends user profile data with 200 status
 */
export const getMe = asyncHandler(async (req: AuthRequest, res) => {
  const { id, organizationId } = req.user;
  const { accessToken } = req.cookies;

  const [member, cognitoUser] = await Promise.all([
    prisma.member.findUnique({ where: { id, organizationId } }),

    cognito.send(new GetUserCommand({ AccessToken: accessToken })),
  ]);

  if (!member || !cognitoUser.UserAttributes) {
    throw new NotFoundError();
  }

  const { email, email_verified } = Object.fromEntries(
    cognitoUser.UserAttributes.filter(
      (attr): attr is { Name: string; Value: string } =>
        Boolean(attr.Name && attr.Value),
    ).map(({ Name, Value }) => [Name, Value]),
  );

  const user = {
    ...member,
    email,
    emailVerified: email_verified === 'true',
  };

  res.status(200).json({ data: user });
});
