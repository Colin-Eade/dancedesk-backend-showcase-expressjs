import { MemberRole } from '@prisma/client';
import { NotFoundError, ConflictError } from '@/errors/classes';
import { ClassOccurrenceMutateDTO } from '@/features/classes/types';
import { TransactionClient } from '@/types/db';

/**
 * @desc    Validates that all rooms in class occurrences exist and belong to the organization
 * @param   {ClassOccurrenceMutateDTO[]} classOccurrences - Array of class occurrence data
 * @param   {string} organizationId - ID of the organization
 * @param   {TransactionClient} tx - Transaction client
 * @throws  {NotFoundError} If any room is not found
 * @returns {Promise<void>} Resolves if all rooms are valid
 */
export const validateRooms = async (
  classOccurrences: ClassOccurrenceMutateDTO[],
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  const roomIds = classOccurrences.map((occurrence) => occurrence.roomId);
  const uniqueRoomIds = [...new Set(roomIds)];
  const rooms = await tx.room.findMany({
    where: {
      id: { in: uniqueRoomIds },
      organizationId,
    },
  });

  if (rooms.length !== uniqueRoomIds.length) {
    throw new NotFoundError('One or more rooms not found.');
  }
};

/**
 * @desc    Validates that a season exists and belongs to the organization
 * @param   {string} seasonId - ID of the season to validate
 * @param   {string} organizationId - ID of the organization
 * @param   {TransactionClient} tx - Transaction client
 * @throws  {NotFoundError} If the season is not found
 * @returns {Promise<void>} Resolves if the season is valid
 */
export const validateSeason = async (
  seasonId: string,
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  const season = await tx.season.findUnique({
    where: {
      id: seasonId,
      organizationId,
    },
  });

  if (!season) {
    throw new NotFoundError('Season not found.');
  }
};

/**
 * @desc    Validates that a routine exists and belongs to the organization
 * @param   {string} routineId - ID of the routine to validate
 * @param   {string} organizationId - ID of the organization
 * @param   {TransactionClient} tx - Transaction client
 * @throws  {NotFoundError} If the routine is not found
 * @returns {Promise<void>} Resolves if the routine is valid
 */
export const validateRoutine = async (
  routineId: string,
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  const routine = await tx.routine.findUnique({
    where: {
      id: routineId,
      organizationId,
    },
  });

  if (!routine) {
    throw new NotFoundError('Routine not found.');
  }
};

/**
 * @desc    Validates that all dancers exist, belong to the organization, and have the DANCER role
 * @param   {string[]} dancerIds - Array of dancer member IDs
 * @param   {string} organizationId - ID of the organization
 * @param   {TransactionClient} tx - Transaction client
 * @throws  {NotFoundError} If any dancer is not found
 * @throws  {ConflictError} If any member doesn't have the DANCER role
 * @returns {Promise<void>} Resolves if all dancers are valid
 */
export const validateDancers = async (
  dancerIds: string[],
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  const dancers = await tx.member.findMany({
    where: {
      id: { in: dancerIds },
      organizationId,
    },
  });

  if (dancers.length !== dancerIds.length) {
    throw new NotFoundError('One or more dancers not found.');
  }

  const nonDancers = dancers.filter(
    (member) => member.role !== MemberRole.DANCER,
  );

  if (nonDancers.length > 0) {
    throw new ConflictError('Some dancers do not have the DANCER role.');
  }
};

/**
 * @desc    Validates that all teachers exist, belong to the organization, and have the TEACHER role
 * @param   {string[]} teacherIds - Array of teacher member IDs
 * @param   {string} organizationId - ID of the organization
 * @param   {TransactionClient} tx - Transaction client
 * @throws  {NotFoundError} If any teacher is not found
 * @throws  {ConflictError} If any member doesn't have the TEACHER role
 * @returns {Promise<void>} Resolves if all teachers are valid
 */
export const validateTeachers = async (
  teacherIds: string[],
  organizationId: string,
  tx: TransactionClient,
): Promise<void> => {
  const teachers = await tx.member.findMany({
    where: {
      id: { in: teacherIds },
      organizationId,
    },
  });

  if (teachers.length !== teacherIds.length) {
    throw new NotFoundError('One or more teachers not found.');
  }

  const nonTeachers = teachers.filter(
    (member) => member.role !== MemberRole.TEACHER,
  );

  if (nonTeachers.length > 0) {
    throw new ConflictError('Some teachers do not have the TEACHER role.');
  }
};
