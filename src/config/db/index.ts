import { PrismaClient } from '@prisma/client';
import { IS_DEV } from '@/config/constants';
import { findManyAndCountExtension } from '@/config/db/extensions';

const prisma = new PrismaClient({
  log: IS_DEV ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
}).$extends(findManyAndCountExtension);

export default prisma;
