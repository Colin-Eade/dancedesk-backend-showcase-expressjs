import { CognitoIdentityProviderServiceException } from '@aws-sdk/client-cognito-identity-provider';
import { JwtBaseError } from 'aws-jwt-verify/error';
import { ZodError } from 'zod';
import logger from '@/config/logger';
import { AppError, InternalServerError } from '@/errors/classes';
import cognitoMappers from '@/errors/mappers/cognito';
import jwtBaseErrorMapper from '@/errors/mappers/jwtVerifier';
import zodMapper from '@/errors/mappers/zod';

/**
 * @desc    Maps various error types to standardized AppError format
 * @param   {unknown} err - Error to be mapped, can be any error type
 * @returns {AppError} Returns appropriate AppError based on the input error type:
 *                     - AppError -> returns as is
 *                     - ZodError -> mapped to BadRequestError with validation details
 *                     - CognitoIdentityProviderServiceException -> mapped to appropriate
 *                       AppError based on specific Cognito error
 *                     - JwtBaseError -> mapped to UnauthorizedError
 *                     - Unknown errors -> mapped to InternalServerError
 */
const mapError = (err: unknown): AppError => {
  if (err instanceof AppError) {
    return err;
  }
  if (err instanceof ZodError) {
    return zodMapper(err);
  }
  if (err instanceof CognitoIdentityProviderServiceException) {
    return cognitoMappers(err);
  }
  if (err instanceof JwtBaseError) {
    return jwtBaseErrorMapper(err);
  }
  logger.error({ err });
  return new InternalServerError(
    err instanceof Error ? err.message : null,
    err instanceof Error ? err : undefined,
  );
};

export default mapError;
