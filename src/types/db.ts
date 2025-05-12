import prisma from '@/config/db';

export type ExtendedPrismaClient = typeof prisma;

export type TransactionClient = Omit<
  ExtendedPrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export type DbClient = ExtendedPrismaClient | TransactionClient;
