import { JwtBaseError } from 'aws-jwt-verify/error';
import { UnauthorizedError } from '@/errors/classes';

/**
 * @desc    Maps JWT errors to AppError format
 * @param   {JwtInvalidError} err - JWT invalid error
 * @returns {UnauthorizedError} Returns UnauthorizedError with error message
 */
const jwtBaseErrorMapper = (err: JwtBaseError) => {
  return new UnauthorizedError(err.message, err);
};

export default jwtBaseErrorMapper;
