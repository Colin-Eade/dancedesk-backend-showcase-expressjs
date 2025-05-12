import { Request, Response, NextFunction } from 'express';
import { TransactionClient } from '@/types/db';

export type AsyncHandler<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export type Handler<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction,
) => void;

export type TxHandler<T extends Request = Request> = (
  req: T,
  res: Response,
  tx: TransactionClient,
  next: NextFunction,
) => Promise<void>;
