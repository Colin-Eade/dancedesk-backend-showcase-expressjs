import prisma from '@/config/db';
import { ConflictError, NotFoundError } from '@/errors/classes';
import { ConflictGroup } from '@/errors/types';
import { toClassDTO } from '@/features/classes/services/mappers';
import {
  checkDancerConflicts,
  checkRoomConflicts,
  checkRoutineConflicts,
  checkTeacherConflicts,
  validateClass,
} from '@/features/classes/services/validation';
import { ClassDTO, ClassMutateDTO } from '@/features/classes/types';
import { DbClient, TransactionClient } from '@/types/db';
import { ApiResponse } from '@/types/express';

/**
 * @desc    Retrieves all classes for a specific organization
 * @param   {string} organizationId - The ID of the organization to get classes for
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<ClassDTO[]>>} Promise resolving to an API response containing class data and count
 */
export const getAllClasses = async (
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<ClassDTO[]>> => {
  const [classes, count] = await client.class.findManyAndCount({
    where: {
      organizationId,
    },
    include: {
      classOccurrences: {
        include: {
          room: {
            include: {
              location: true,
            },
          },
        },
      },
      dancers: {
        include: {
          dancer: {
            include: {
              member: true,
            },
          },
        },
      },
      teachers: {
        include: {
          member: true,
        },
      },
      season: true,
      routine: true,
    },
  });

  return {
    data: classes.map(toClassDTO),
    meta: {
      count,
    },
  };
};

/**
 * @desc    Retrieves a single class by ID
 * @param   {string} id - ID of the class to retrieve
 * @param   {string} organizationId - Organization ID the class belongs to
 * @param   {DbClient} [client=prisma] - Database client to use (regular or transaction)
 * @returns {Promise<ApiResponse<ClassDTO>>} Promise resolving to API response with class data
 * @throws  {NotFoundError} If class is not found
 */
export const getClass = async (
  id: string,
  organizationId: string,
  client: DbClient = prisma,
): Promise<ApiResponse<ClassDTO>> => {
  const classObject = await client.class.findUnique({
    where: {
      id,
      organizationId,
    },
    include: {
      classOccurrences: {
        include: {
          room: {
            include: {
              location: true,
            },
          },
        },
      },
      dancers: {
        include: {
          dancer: {
            include: {
              member: true,
            },
          },
        },
      },
      teachers: {
        include: {
          member: true,
        },
      },
      season: true,
      routine: true,
    },
  });

  if (!classObject) {
    throw new NotFoundError('Class not found.');
  }

  return {
    data: toClassDTO(classObject),
  };
};

/**
 * @desc    Checks a class for conflicts before creation or update
 * @param   {ClassMutateDTO} data - The class data to check
 * @param   {string} organizationId - ID of the organization the class belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @param   {string} [id] - Optional ID of existing class (when updating)
 * @throws  {ConflictError} If any scheduling conflicts are detected
 * @returns {Promise<void>} Resolves if no conflicts are found
 */
export const checkClass = async (
  data: ClassMutateDTO,
  organizationId: string,
  tx: TransactionClient,
  id?: string,
): Promise<void> => {
  await validateClass(data, organizationId, tx);

  const conflicts: ConflictGroup[] = [];

  const roomConflicts = await checkRoomConflicts(data, organizationId, tx, id);
  if (roomConflicts.resources.length > 0) {
    conflicts.push(roomConflicts);
  }

  const dancerConflicts = await checkDancerConflicts(
    data,
    organizationId,
    tx,
    id,
  );
  if (dancerConflicts.resources.length > 0) {
    conflicts.push(dancerConflicts);
  }

  const teacherConflicts = await checkTeacherConflicts(
    data,
    organizationId,
    tx,
    id,
  );
  if (teacherConflicts.resources.length > 0) {
    conflicts.push(teacherConflicts);
  }

  const routineConflicts = await checkRoutineConflicts(
    data,
    organizationId,
    tx,
    id,
  );
  if (routineConflicts.resources.length > 0) {
    conflicts.push(routineConflicts);
  }

  if (conflicts.length > 0) {
    throw new ConflictError('Scheduling conflicts detected.', conflicts);
  }
};

/**
 * @desc    Creates a new class in the database
 * @param   {ClassMutateDTO} data - Class creation data
 * @param   {string} organizationId - ID of the organization the class belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<ClassDTO>>} Promise resolving to API response with created class data
 */
export const createClass = async (
  data: ClassMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<ClassDTO>> => {
  await validateClass(data, organizationId, tx);

  const newClass = await tx.class.create({
    data: {
      name: data.name,
      colour: data.colour,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      organizationId,
      seasonId: data.seasonId,
      routineId: data.routineId,
      classOccurrences: {
        createMany: {
          data: data.classOccurrences.map((occurrence) => ({
            roomId: occurrence.roomId,
            weekday: occurrence.weekday,
            startTime: new Date(`1970-01-01T${occurrence.startTime}Z`),
            endTime: new Date(`1970-01-01T${occurrence.endTime}Z`),
          })),
        },
      },
      dancers: {
        createMany: {
          data: data.dancers.map((memberId) => ({
            memberId,
          })),
        },
      },
      teachers: {
        createMany: {
          data: data.teachers.map((memberId) => ({
            memberId,
          })),
        },
      },
    },
    include: {
      classOccurrences: {
        include: {
          room: {
            include: {
              location: true,
            },
          },
        },
      },
      dancers: {
        include: {
          dancer: {
            include: {
              member: true,
            },
          },
        },
      },
      teachers: {
        include: {
          member: true,
        },
      },
      season: true,
      routine: true,
    },
  });

  return {
    data: toClassDTO(newClass),
  };
};

/**
 * @desc    Creates a new class in the database
 * @param   {string} id - ID of the class to update
 * @param   {ClassMutateDTO} data - Class update data
 * @param   {string} organizationId - ID of the organization the class belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<ApiResponse<ClassDTO>>} Promise resolving to API response with updated class data
 */
export const updateClass = async (
  id: string,
  data: ClassMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<ApiResponse<ClassDTO>> => {
  await validateClass(data, organizationId, tx);

  const updatedClass = await tx.class.update({
    where: {
      id,
      organizationId,
    },
    data: {
      name: data.name,
      colour: data.colour,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      seasonId: data.seasonId ?? null,
      routineId: data.routineId ?? null,
      classOccurrences: {
        deleteMany: {
          classId: id,
        },
        createMany: {
          data: data.classOccurrences.map((occurrence) => ({
            roomId: occurrence.roomId,
            weekday: occurrence.weekday,
            startTime: new Date(`1970-01-01T${occurrence.startTime}Z`),
            endTime: new Date(`1970-01-01T${occurrence.endTime}Z`),
          })),
        },
      },
      dancers: {
        deleteMany: {
          classId: id,
        },
        createMany: {
          data: data.dancers.map((memberId) => ({
            memberId,
          })),
        },
      },
      teachers: {
        deleteMany: {
          classId: id,
        },
        createMany: {
          data: data.teachers.map((memberId) => ({
            memberId,
          })),
        },
      },
    },
    include: {
      classOccurrences: {
        include: {
          room: {
            include: {
              location: true,
            },
          },
        },
      },
      dancers: {
        include: {
          dancer: {
            include: {
              member: true,
            },
          },
        },
      },
      teachers: {
        include: {
          member: true,
        },
      },
      season: true,
      routine: true,
    },
  });

  return {
    data: toClassDTO(updatedClass),
  };
};

/**
 * @desc    Deletes a class and all associated data from the database
 * @param   {string} id - ID of the class to delete
 * @param   {string} organizationId - ID of the organization the class belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 */
export const deleteClass = async (
  id: string,
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  await tx.class.delete({
    where: {
      id,
      organizationId,
    },
  });
};
