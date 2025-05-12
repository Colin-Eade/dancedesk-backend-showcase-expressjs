import { Prisma } from '@prisma/client';

/**
 * @desc    Extends Prisma client with a findManyAndCount method for all models
 * @param   {Prisma.Client} client - The Prisma client instance to extend
 * @returns {Prisma.Client} Extended Prisma client with findManyAndCount method
 */
export const findManyAndCountExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'findManyAndCount',
    model: {
      $allModels: {
        async findManyAndCount<Model, Args>(
          this: Model,
          args: Prisma.Exact<Args, Prisma.Args<Model, 'findMany'>>,
        ): Promise<[Prisma.Result<Model, Args, 'findMany'>, number]> {
          return await Promise.all([
            // Force type cast required due to Prisma extension API limitations
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            (this as any).findMany(args),
            // Type assertion needed to access count and extract where clause
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            (this as any).count({ where: (args as any).where }),
          ]);
        },
      },
    },
  });
});
