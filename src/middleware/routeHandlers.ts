import { Request, RequestHandler } from 'express';
import prisma from '@/config/db';
import { AsyncHandler, Handler, TxHandler } from '@/types/routeHandlers';

/**
 * @desc    Async middleware error handler wrapper
 * @param   {Function} fn - Async middleware function to wrap
 * @returns {RequestHandler} Express middleware function
 */
export const asyncHandler = <T extends Request>(
  fn: AsyncHandler<T>,
): RequestHandler => {
  return (req, res, next) => {
    void Promise.resolve(fn(req as T, res, next)).catch(next);
  };
};

/**
 * @desc    Middleware error handler wrapper
 * @param   {Function} fn - Middleware function to wrap
 * @returns {RequestHandler} Express middleware function
 */
export const handler = <T extends Request>(fn: Handler<T>): RequestHandler => {
  return (req, res, next) => {
    try {
      fn(req as T, res, next);
    } catch (err) {
      next(err);
    }
  };
};

/**
 * @desc    Transaction middleware error handler wrapper
 * @param   {Function} fn - Transaction middleware function to wrap
 * @returns {RequestHandler} Express middleware function with transaction support
 */
export const txHandler = <T extends Request>(
  fn: TxHandler<T>,
): RequestHandler => {
  return (req, res, next) => {
    void prisma
      .$transaction(async (tx) => {
        await fn(req as T, res, tx, next);
      })
      .catch(next);
  };
};
