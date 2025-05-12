import { NextFunction, Request, Response } from 'express';
import mapError from '@/errors/mappers';

/**
 * @desc    Global error handler.
 * @param   {unknown} err - Error object
 * @param   {Request} _req - Express request object (unused)
 * @param   {Response} res - Express response object
 * @param   {NextFunction} _next - Express next function (unused)
 * @returns {void} Returns JSON response with error details and appropriate status code
 */
const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error = mapError(err);
  res.status(error.statusCode).json(error.serialize());
};

export default errorHandler;
