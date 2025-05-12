import * as classService from '@/features/classes/services';
import { ClassMutateRequest } from '@/features/classes/types';
import * as classEventService from '@/features/events/class-events/services';
import * as classEventMapperService from '@/features/events/class-events/services/mappers';
import { asyncHandler, txHandler } from '@/middleware/routeHandlers';
import { AuthRequest } from '@/types/express';

/**
 * @desc    Fetches all classes from the database
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends classes array with 200 status
 */
export const getAllClasses = txHandler(async (req: AuthRequest, res, tx) => {
  const { organizationId } = req.user;

  const result = await classService.getAllClasses(organizationId, tx);

  res.status(200).json(result);
});

/**
 * @desc    Fetches a single class by ID
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends class object or 404 if not found
 */
export const getClass = asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  const result = await classService.getClass(id, organizationId);

  res.status(200).json(result);
});

/**
 * @desc    Checks a class for scheduling conflicts before creation or update
 * @param   {ClassMutateRequest} req - Express request object with class data in body, optionally class ID in params
 * @param   {Response} res - Express response object
 * @param   {TransactionClient} tx - Transaction client
 * @returns {Promise<void>} Sends 204 status if no conflicts, or throws error with conflict details
 */
export const checkClass = txHandler(
  async (req: ClassMutateRequest, res, tx) => {
    const { id } = req.params;
    const data = req.body;
    const { organizationId } = req.user;

    await classService.checkClass(data, organizationId, tx, id);

    res.status(204).send();
  },
);

/**
 * @desc    Creates a new class in the database and automatically generates associated class events
 * @param   {ClassMutateRequest} req - Express request object, with class data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends created class with 201 status, after creating associated class events
 */
export const createClass = txHandler(
  async (req: ClassMutateRequest, res, tx) => {
    const data = req.body;
    const { organizationId } = req.user;
    const timezone = req.headers['x-timezone'];

    const result = await classService.createClass(data, organizationId, tx);

    const classEventDTOs =
      classEventMapperService.classDTOToClassEventMutateDTOArray(
        result.data,
        timezone,
      );

    await classEventService.createManyClassEvents(
      classEventDTOs,
      organizationId,
      tx,
    );

    res.status(201).json(result);
  },
);

/**
 * @desc    Updates an existing class in the database
 * @param   {ClassMutateRequest} req - Express request object, with class data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends updated class with 200 status
 */
export const updateClass = txHandler(
  async (req: ClassMutateRequest, res, tx) => {
    const { id } = req.params;
    const data = req.body;
    const { organizationId } = req.user;
    const timezone = req.headers['x-timezone'];

    await classService.getClass(id, organizationId, tx);

    const result = await classService.updateClass(id, data, organizationId, tx);

    const classEventDTOs =
      classEventMapperService.classDTOToClassEventMutateDTOArray(
        result.data,
        timezone,
      );

    await classEventService.updateClassEventsForClass(
      id,
      classEventDTOs,
      organizationId,
      tx,
    );

    res.status(201).json(result);
  },
);

/**
 * @desc    Deletes a class by ID and all associated events
 * @param   {AuthRequest} req - Express request object, with the class ID in req.params
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends 204 status or 404 if not found
 */
export const deleteClass = txHandler(async (req: AuthRequest, res, tx) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  await classService.getClass(id, organizationId, tx);

  await classEventService.deleteClassEventsForClass(id, organizationId, tx);

  await classService.deleteClass(id, organizationId, tx);

  res.status(204).send();
});
