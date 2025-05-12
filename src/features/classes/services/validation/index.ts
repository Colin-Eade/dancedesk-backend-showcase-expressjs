import { MemberRole } from '@prisma/client';
import { ConflictGroup, ConflictResource } from '@/errors/types';
import {
  validateDancers,
  validateRooms,
  validateRoutine,
  validateSeason,
  validateTeachers,
} from '@/features/classes/services/validation/rules';
import { ClassMutateDTO } from '@/features/classes/types';
import { TransactionClient } from '@/types/db';

/**
 * @desc    Performs validation of resouce existence for class data before creation or update
 * @param   {ClassMutateDTO} data - The class data to validate
 * @param   {string} organizationId - ID of the organization the class belongs to
 * @param   {TransactionClient} tx - Transaction client
 * @throws  {NotFoundError} If any referenced resources are not found
 * @throws  {ConflictError} If any business rules are violated
 * @returns {Promise<void>} Resolves if validation passes
 */
export const validateClass = async (
  data: ClassMutateDTO,
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  await validateRooms(data.classOccurrences, organizationId, tx);

  if (data.seasonId) {
    await validateSeason(data.seasonId, organizationId, tx);
  }
  if (data.routineId) {
    await validateRoutine(data.routineId, organizationId, tx);
  }
  if (data.dancers.length > 0) {
    await validateDancers(data.dancers, organizationId, tx);
  }
  if (data.teachers.length > 0) {
    await validateTeachers(data.teachers, organizationId, tx);
  }
};

/**
 * @desc    Checks for room scheduling conflicts
 * @param   {ClassMutateDTO} data - The class data to check
 * @param   {string} organizationId - ID of the organization
 * @param   {TransactionClient} tx - Transaction client
 * @param   {string} [id] - Optional ID of existing class (when updating)
 * @returns {Promise<ConflictGroup>} Conflict group with room resources and conflicts
 */
export const checkRoomConflicts = async (
  data: ClassMutateDTO,
  organizationId: string,
  tx: TransactionClient,
  id?: string,
): Promise<ConflictGroup> => {
  const roomResources: ConflictResource[] = [];

  for (const occurrence of data.classOccurrences) {
    const { roomId, weekday, startTime, endTime } = occurrence;

    const room = await tx.room.findUnique({
      where: { id: roomId, organizationId },
      select: { id: true, name: true },
    });

    if (!room) {
      continue;
    }

    const conflictingOccurrences = await tx.classOccurrence.findMany({
      where: {
        roomId,
        weekday,
        class: {
          id: { not: id },
          organizationId,
        },
      },
      include: {
        class: {
          select: { name: true },
        },
      },
    });

    const occurrenceStartTime = new Date(`1970-01-01T${startTime}Z`);
    const occurrenceEndTime = new Date(`1970-01-01T${endTime}Z`);

    const roomConflicts: string[] = [];

    for (const conflictingOccurrence of conflictingOccurrences) {
      const conflictStart = conflictingOccurrence.startTime;
      const conflictEnd = conflictingOccurrence.endTime;

      if (
        occurrenceStartTime < conflictEnd &&
        occurrenceEndTime > conflictStart
      ) {
        const conflictStartStr = conflictStart
          .toISOString()
          .split('T')[1]
          .split('.')[0];
        const conflictEndStr = conflictEnd
          .toISOString()
          .split('T')[1]
          .split('.')[0];

        const conflictMessage = `${conflictingOccurrence.class.name} uses this room on ${weekday} from ${conflictStartStr} to ${conflictEndStr} overlapping with your class from ${startTime} to ${endTime}`;

        roomConflicts.push(conflictMessage);
      }
    }

    if (roomConflicts.length > 0) {
      roomResources.push({
        id: room.id,
        name: room.name,
        conflicts: roomConflicts,
      });
    }
  }

  const reducedRoomResources = roomResources.reduce<ConflictResource[]>(
    (acc, resource) => {
      const existingIndex = acc.findIndex((r) => r.id === resource.id);
      if (existingIndex === -1) {
        acc.push(resource);
      } else {
        acc[existingIndex].conflicts = [
          ...acc[existingIndex].conflicts,
          ...resource.conflicts,
        ];
      }
      return acc;
    },
    [],
  );

  return {
    resourceType: 'Rooms',
    resources: reducedRoomResources,
  };
};

/**
 * @desc    Checks for dancer scheduling conflicts
 * @param   {ClassMutateDTO} data - The class data to check
 * @param   {string} organizationId - ID of the organization
 * @param   {TransactionClient} tx - Transaction client
 * @param   {string} [id] - Optional ID of existing class (when updating)
 * @returns {Promise<ConflictGroup>} Conflict group with dancer resources and conflicts
 */
export const checkDancerConflicts = async (
  data: ClassMutateDTO,
  organizationId: string,
  tx: TransactionClient,
  id?: string,
): Promise<ConflictGroup> => {
  const dancerResources: ConflictResource[] = [];

  for (const dancerId of data.dancers) {
    const dancer = await tx.dancer.findFirst({
      where: {
        memberId: dancerId,
        member: {
          organizationId,
          role: MemberRole.DANCER,
        },
      },
      include: { member: true },
    });

    if (!dancer) {
      continue;
    }

    const dancerConflicts: string[] = [];

    for (const occurrence of data.classOccurrences) {
      const { weekday, startTime, endTime } = occurrence;

      const conflictingClasses = await tx.class.findMany({
        where: {
          id: { not: id },
          organizationId,
          dancers: {
            some: {
              memberId: dancerId,
            },
          },
          classOccurrences: {
            some: {
              weekday,
            },
          },
        },
        include: {
          classOccurrences: {
            where: {
              weekday,
            },
          },
        },
      });

      const occurrenceStartTime = new Date(`1970-01-01T${startTime}Z`);
      const occurrenceEndTime = new Date(`1970-01-01T${endTime}Z`);

      for (const cls of conflictingClasses) {
        for (const clsOccurrence of cls.classOccurrences) {
          const conflictStart = clsOccurrence.startTime;
          const conflictEnd = clsOccurrence.endTime;

          if (
            occurrenceStartTime < conflictEnd &&
            occurrenceEndTime > conflictStart
          ) {
            const conflictStartStr = conflictStart
              .toISOString()
              .split('T')[1]
              .split('.')[0];
            const conflictEndStr = conflictEnd
              .toISOString()
              .split('T')[1]
              .split('.')[0];

            const conflictMessage = `Already enrolled in ${cls.name} on ${weekday} from ${conflictStartStr} to ${conflictEndStr} overlapping with your class from ${startTime} to ${endTime}`;

            dancerConflicts.push(conflictMessage);
          }
        }
      }
    }

    if (dancerConflicts.length > 0) {
      dancerResources.push({
        id: dancer.memberId,
        name: `${dancer.member.firstName} ${dancer.member.lastName}`,
        conflicts: dancerConflicts,
      });
    }
  }

  return {
    resourceType: 'Dancers',
    resources: dancerResources,
  };
};

/**
 * @desc    Checks for teacher scheduling conflicts
 * @param   {ClassMutateDTO} data - The class data to check
 * @param   {string} organizationId - ID of the organization
 * @param   {TransactionClient} tx - Transaction client
 * @param   {string} [id] - Optional ID of existing class (when updating)
 * @returns {Promise<ConflictGroup>} Conflict group with teacher resources and conflicts
 */
export const checkTeacherConflicts = async (
  data: ClassMutateDTO,
  organizationId: string,
  tx: TransactionClient,
  id?: string,
): Promise<ConflictGroup> => {
  const teacherResources: ConflictResource[] = [];

  for (const teacherId of data.teachers) {
    const teacher = await tx.member.findUnique({
      where: {
        id: teacherId,
        organizationId,
        role: MemberRole.TEACHER,
      },
    });

    if (!teacher) {
      continue;
    }

    const teacherConflicts: string[] = [];

    for (const occurrence of data.classOccurrences) {
      const { weekday, startTime, endTime } = occurrence;

      const conflictingClasses = await tx.class.findMany({
        where: {
          id: { not: id },
          organizationId,
          teachers: {
            some: {
              memberId: teacherId,
            },
          },
          classOccurrences: {
            some: {
              weekday,
            },
          },
        },
        include: {
          classOccurrences: {
            where: {
              weekday,
            },
          },
        },
      });

      const occurrenceStartTime = new Date(`1970-01-01T${startTime}Z`);
      const occurrenceEndTime = new Date(`1970-01-01T${endTime}Z`);

      for (const cls of conflictingClasses) {
        for (const clsOccurrence of cls.classOccurrences) {
          const conflictStart = clsOccurrence.startTime;
          const conflictEnd = clsOccurrence.endTime;

          if (
            occurrenceStartTime < conflictEnd &&
            occurrenceEndTime > conflictStart
          ) {
            const conflictStartStr = conflictStart
              .toISOString()
              .split('T')[1]
              .split('.')[0];
            const conflictEndStr = conflictEnd
              .toISOString()
              .split('T')[1]
              .split('.')[0];

            const conflictMessage = `Already teaching ${cls.name} on ${weekday} from ${conflictStartStr} to ${conflictEndStr} overlapping with your class from ${startTime} to ${endTime}`;

            teacherConflicts.push(conflictMessage);
          }
        }
      }
    }

    if (teacherConflicts.length > 0) {
      teacherResources.push({
        id: teacher.id,
        name: `${teacher.firstName} ${teacher.lastName}`,
        conflicts: teacherConflicts,
      });
    }
  }

  return {
    resourceType: 'Teachers',
    resources: teacherResources,
  };
};

/**
 * @desc    Checks if routine is already associated with other classes
 * @param   {ClassMutateDTO} data - The class data to check
 * @param   {string} organizationId - ID of the organization
 * @param   {TransactionClient} tx - Transaction client
 * @param   {string} [id] - Optional ID of existing class (when updating)
 * @returns {Promise<ConflictGroup>} Conflict group with routine resources and conflicts
 */
export const checkRoutineConflicts = async (
  data: ClassMutateDTO,
  organizationId: string,
  tx: TransactionClient,
  id?: string,
): Promise<ConflictGroup> => {
  const routineResources: ConflictResource[] = [];

  if (!data.routineId) {
    return { resourceType: 'Routines', resources: [] };
  }

  const routine = await tx.routine.findUnique({
    where: {
      id: data.routineId,
      organizationId,
    },
    select: {
      id: true,
      name: true,
      type: true,
      style: true,
      song: true,
    },
  });

  if (!routine) {
    return { resourceType: 'Routines', resources: [] };
  }

  const existingClasses = await tx.class.findMany({
    where: {
      id: { not: id },
      routineId: data.routineId,
      organizationId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (existingClasses.length > 0) {
    const routineConflicts: string[] = [];

    for (const existingClass of existingClasses) {
      const conflictMessage = `Already assigned to class "${existingClass.name}"`;
      routineConflicts.push(conflictMessage);
    }

    routineResources.push({
      id: routine.id,
      name: `${routine.name} | ${routine.type} - ${routine.style} | "${routine.song}"`,
      conflicts: routineConflicts,
    });
  }

  return {
    resourceType: 'Routines',
    resources: routineResources,
  };
};
