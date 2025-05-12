import { IS_DEV } from '@/config/constants';
import {
  ConflictGroup,
  ERROR_STATUS_MAP,
  ErrorCode,
  StatusCode,
  ValidationDetail,
} from '@/errors/types';

/**
 * @class AppError
 * @desc  Abstract base error class that extends Error with standardized error codes and HTTP status codes
 */
export abstract class AppError extends Error {
  public readonly error: ErrorCode;
  public readonly statusCode: StatusCode;

  /**
   * @desc    Creates an instance of AppError
   * @param   {ErrorCode} error - Error code enum value
   * @param   {string} message - Error message
   * @param   {Error} [cause] - Original error to preserve stack trace
   */
  constructor(error: ErrorCode, message: string, cause?: Error) {
    super(message);
    this.error = error;
    this.statusCode = ERROR_STATUS_MAP[error];

    if (cause?.stack) {
      this.stack = cause.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * @desc    Serializes error for response
   * @returns {Object} Formatted error object
   */
  public serialize() {
    return {
      error: this.error,
      message: this.message,
      ...(IS_DEV && this.stack && { stack: this.stack }),
    };
  }
}

/**
 * @class BadRequestError
 * @desc  400 Bad Request Error with optional validation details
 */
export class BadRequestError extends AppError {
  public readonly details?: ValidationDetail[];

  /**
   * @desc    Creates an instance of BadRequestError
   * @param   {string | null} message - Error message
   * @param   {ValidationDetail[]} [details] - Array of validation errors
   * @param   {Error} [cause] - Original error to preserve stack trace
   */
  constructor(
    message: string | null = null,
    details?: ValidationDetail[],
    cause?: Error,
  ) {
    super(ErrorCode.BAD_REQUEST, message ?? 'Bad request data.', cause);
    this.details = details;
  }

  /**
   * @desc    Serializes error with validation details
   * @returns {Object} Formatted error object with optional details
   */
  public override serialize() {
    return {
      error: this.error,
      message: this.message,
      ...(this.details && { details: this.details }),
      ...(IS_DEV && this.stack && { stack: this.stack }),
    };
  }
}

/**
 * @class UnauthorizedError
 * @desc  401 Unauthorized Error for authentication failures
 */
export class UnauthorizedError extends AppError {
  /**
   * @desc    Creates an instance of UnauthorizedError
   * @param   {string | null} message - Error message
   * @param   {Error} [cause] - Original error to preserve stack trace
   */
  constructor(message: string | null = null, cause?: Error) {
    super(
      ErrorCode.UNAUTHORIZED,
      message ?? 'Authentication required. Please sign in.',
      cause,
    );
  }
}

/**
 * @class ForbiddenError
 * @desc  403 Forbidden Error for authorization failures
 */
export class ForbiddenError extends AppError {
  /**
   * @desc    Creates an instance of ForbiddenError
   * @param   {string | null} message - Error message
   * @param   {Error} [cause] - Original error to preserve stack trace
   */
  constructor(message: string | null = null, cause?: Error) {
    super(
      ErrorCode.FORBIDDEN,
      message ?? 'You do not have permission to perform this action.',
      cause,
    );
  }
}

/**
 * @class NotFoundError
 * @desc  404 Not Found Error for missing resources
 */
export class NotFoundError extends AppError {
  /**
   * @desc    Creates an instance of NotFoundError
   * @param   {string | null} message - Error message
   * @param   {Error} [cause] - Original error to preserve stack trace
   */
  constructor(message: string | null = null, cause?: Error) {
    super(ErrorCode.NOT_FOUND, message ?? 'Resource not found.', cause);
  }
}

/**
 * @class ConflictError
 * @desc  409 Conflict Error for business rule violations
 */
export class ConflictError extends AppError {
  public readonly conflicts?: ConflictGroup[];

  /**
   * @desc    Creates an instance of ConflictError
   * @param   {string | null} message - Error message
   * @param   {ConflictGroup[]} [conflicts] - Detailed conflict information by resource type
   * @param   {Error} [cause] - Original error to preserve stack trace
   */
  constructor(
    message: string | null = null,
    conflicts?: ConflictGroup[],
    cause?: Error,
  ) {
    super(
      ErrorCode.CONFLICT,
      message ?? 'Resource conflicts with existing data.',
      cause,
    );
    this.conflicts = conflicts;
  }

  /**
   * @desc    Serializes error with conflict details
   * @returns {Object} Formatted error object with optional details
   */
  public override serialize() {
    return {
      error: this.error,
      message: this.message,
      ...(this.conflicts && { conflicts: this.conflicts }),
      ...(IS_DEV && this.stack && { stack: this.stack }),
    };
  }
}

/**
 * @class InternalServerError
 * @desc  500 Internal Server Error for unexpected errors
 */
export class InternalServerError extends AppError {
  /**
   * @desc    Creates an instance of InternalServerError
   * @param   {string | null} message - Error message
   * @param   {Error} [cause] - Original error to preserve stack trace
   */
  constructor(message: string | null = null, cause?: Error) {
    super(
      ErrorCode.INTERNAL_SERVER_ERROR,
      message ?? 'Oops! Something went wrong.',
      cause,
    );
  }
}
