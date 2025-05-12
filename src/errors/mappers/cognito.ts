import {
  CognitoIdentityProviderServiceException,
  ExpiredCodeException,
  NotAuthorizedException,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import logger from '@/config/logger';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  UnauthorizedError,
} from '@/errors/classes';
import { ValidationDetail } from '@/errors/types';

/**
 * @desc    Maps AWS Cognito UsernameExistsException to AppError format
 * @param   {UsernameExistsException} err - AWS Cognito username exists error
 * @returns {ConflictError} Returns ConflictError with message
 */
const usernameExistsMapper = (err: UsernameExistsException) => {
  return new ConflictError(
    'This email address is already in use',
    undefined,
    err,
  );
};

/**
 * @desc    Maps AWS Cognito ExpiredCodeException to AppError format
 * @param   {ExpiredCodeException} err - AWS Cognito expired code error
 * @returns {BadRequestError} Returns BadRequestError with code validation detail
 */
const expiredCodeMapper = (err: ExpiredCodeException) => {
  const details: ValidationDetail[] = [
    {
      field: 'code',
      message: err.message,
    },
  ];

  return new BadRequestError(null, details, err);
};

/**
 * @desc    Maps AWS Cognito Identity Provider Service errors to AppError format
 * @param   {CognitoIdentityProviderServiceException} err - AWS Cognito service error
 * @returns {AppError} Returns appropriate AppError type based on the specific Cognito error:
 *                     - UsernameExistsException -> BadRequestError
 *                     - ExpiredCodeException -> BadRequestError
 *                     - NotAuthorizedException -> UnauthorizedError
 *                     - Other Cognito errors -> InternalServerError
 */
const notAuthorizedMapper = (err: NotAuthorizedException) => {
  return new UnauthorizedError(err.message, err);
};

const cognitoMappers = (err: CognitoIdentityProviderServiceException) => {
  if (err instanceof UsernameExistsException) {
    return usernameExistsMapper(err);
  }
  if (err instanceof ExpiredCodeException) {
    return expiredCodeMapper(err);
  }
  if (err instanceof NotAuthorizedException) {
    return notAuthorizedMapper(err);
  }
  logger.error({ err });
  return new InternalServerError(
    err instanceof Error ? err.message : null,
    err instanceof Error ? err : undefined,
  );
};

export default cognitoMappers;
