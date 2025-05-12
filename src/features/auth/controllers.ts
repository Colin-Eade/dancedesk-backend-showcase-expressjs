import {
  AuthFlowType,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { MemberRole } from '@prisma/client';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { jwtDecode } from 'jwt-decode';
import cognito from '@/config/cognito';
import {
  ACCESS_TOKEN_MAX_AGE,
  API_ROOT,
  IS_DEV,
  REFRESH_TOKEN_MAX_AGE,
} from '@/config/constants';
import prisma from '@/config/db';
import { UnauthorizedError } from '@/errors/classes';
import {
  ResendConfirmAccountRequest,
  SignInRequest,
  SignUpRequest,
  ConfirmAccountRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/features/auth/types';
import { computeSecretHash } from '@/features/auth/utils';
import { asyncHandler, handler } from '@/middleware/routeHandlers';

/**
 * @desc    Creates a new organization and admin user account
 * @param   {SignUpRequest} req - Express request object with signup data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends created organization and user data with 204 status
 */
export const signUp = asyncHandler(async (req: SignUpRequest, res) => {
  const { organizationName, firstName, lastName, email, password } = req.body;

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: organizationName,
      },
    });

    const member = await tx.member.create({
      data: {
        firstName,
        lastName,
        role: MemberRole.ADMIN,
        organizationId: organization.id,
      },
    });

    await cognito.send(
      new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        SecretHash: computeSecretHash(email),
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'custom:memberId', Value: member.id },
          { Name: 'custom:organizationId', Value: organization.id },
          { Name: 'custom:role', Value: MemberRole.ADMIN },
        ],
      }),
    );

    return { organization, member };
  });

  res.status(201).json({ data: result });
});

/**
 * @desc    Verifies a user's email address with confirmation code
 * @param   {ConfirmAccountRequest} req - Express request object with email and code in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends 204 status on successful verification
 */
export const verifyEmail = asyncHandler(
  async (req: ConfirmAccountRequest, res) => {
    const { email, code } = req.body;

    await cognito.send(
      new ConfirmSignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        SecretHash: computeSecretHash(email),
        Username: email,
        ConfirmationCode: code,
      }),
    );

    res.status(204).send();
  },
);

/**
 * @desc    Resends the email verification code to user
 * @param   {ResendConfirmAccountRequest} req - Express request object with email in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends 204 status on successful code resend
 */
export const resendVerificationCode = asyncHandler(
  async (req: ResendConfirmAccountRequest, res) => {
    const { email } = req.body;

    await cognito.send(
      new ResendConfirmationCodeCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        SecretHash: computeSecretHash(email),
        Username: email,
      }),
    );

    res.status(204).send();
  },
);

/**
 * @desc    Authenticates user and sets auth cookies
 * @param   {SignInRequest} req - Express request object with credentials in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sets auth cookies and sends IdToken with 200 status
 */
export const signIn = asyncHandler(async (req: SignInRequest, res) => {
  const { email, password } = req.body;

  const { AuthenticationResult } = await cognito.send(
    new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: computeSecretHash(email),
      },
    }),
  );

  if (!AuthenticationResult) {
    throw new UnauthorizedError('Incorrect email address or password.');
  }

  const { IdToken, AccessToken, RefreshToken } = AuthenticationResult;

  const { email_verified, sub } = jwtDecode<CognitoIdTokenPayload>(
    String(IdToken),
  );

  if (!email_verified) {
    throw new UnauthorizedError(
      'Email not verified. Please check your email and verify your account before signing in.',
    );
  }

  res.cookie('accessToken', AccessToken, {
    httpOnly: true,
    secure: !IS_DEV,
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: '/',
  });

  res.cookie('refreshToken', RefreshToken, {
    httpOnly: true,
    secure: !IS_DEV,
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: `${API_ROOT}/auth/refresh`,
  });

  res.cookie('sub', sub, {
    httpOnly: true,
    secure: !IS_DEV,
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: `${API_ROOT}/auth/refresh`,
  });

  res.status(204).send();
});

/**
 * @desc    Refreshes access token using refresh token
 * @param   {Request} req - Express request object with refresh token in cookies
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sets new access token cookie and sends new IdToken
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken, sub } = req.cookies;

  if (!refreshToken || !sub) {
    throw new UnauthorizedError(
      'Authentication credentials missing. Please sign in again.',
    );
  }

  const { AuthenticationResult } = await cognito.send(
    new InitiateAuthCommand({
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: String(refreshToken),
        SECRET_HASH: computeSecretHash(String(sub)),
      },
    }),
  );

  if (!AuthenticationResult) {
    throw new UnauthorizedError('Invalid credentials. Please sign in again.');
  }

  const { AccessToken } = AuthenticationResult;

  res.cookie('accessToken', AccessToken, {
    httpOnly: true,
    secure: !IS_DEV,
    sameSite: 'strict',
    path: '/',
  });

  res.status(204).send();
});

/**
 * @desc    Initiates password reset by sending reset code
 * @param   {ForgotPasswordRequest} req - Express request object with email in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends 204 status on successful code send
 */
export const forgotPassword = asyncHandler(
  async (req: ForgotPasswordRequest, res) => {
    const { email } = req.body;

    await cognito.send(
      new ForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        SecretHash: computeSecretHash(email),
      }),
    );

    res.status(204).send();
  },
);

/**
 * @desc    Resets password using verification code
 * @param   {ResetPasswordRequest} req - Express request object with email, code and new password
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends 204 status on successful password reset
 */
export const resetPassword = asyncHandler(
  async (req: ResetPasswordRequest, res) => {
    const { email, code, password } = req.body;

    await cognito.send(
      new ConfirmForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: password,
        SecretHash: computeSecretHash(email),
      }),
    );

    res.status(204).send();
  },
);

/**
 * @desc    Signs out user by clearing auth cookies
 * @param   {Request} req - Express request object (unused)
 * @param   {Response} res - Express response object
 * @returns {void} Clears auth cookies and sends 204 status
 */
export const signOut = handler((_req, res) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: `${API_ROOT}/auth/refresh` });
  res.clearCookie('sub', { path: `${API_ROOT}/auth/refresh` });

  res.status(204).send();
});
