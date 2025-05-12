import { ZodError } from 'zod';
import { BadRequestError } from '@/errors/classes';
import { ValidationDetail } from '@/errors/types';

/**
 * @desc    Maps Zod validation errors to AppError format
 * @param   {ZodError} err - Zod validation error object
 * @returns {BadRequestError} Returns BadRequestError with validation details
 */
const zodMapper = (err: ZodError) => {
  const details: ValidationDetail[] = err.issues.map((issue) => ({
    field: String(issue.path[0]),
    message: issue.message,
  }));

  return new BadRequestError(null, details, err);
};

export default zodMapper;
