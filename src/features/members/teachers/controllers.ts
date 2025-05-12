import * as teacherService from '@/features/members/teachers/services';
import { TeacherMutateRequest } from '@/features/members/teachers/types';
import { asyncHandler, txHandler } from '@/middleware/routeHandlers';
import { AuthRequest } from '@/types/express';

/**
 * @desc    Fetches all teachers from the database
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends teachers array with 200 status
 */
export const getAllTeachers = txHandler(async (req: AuthRequest, res, tx) => {
  const { organizationId } = req.user;

  const result = await teacherService.getAllTeachers(organizationId, tx);

  res.status(200).json(result);
});

/**
 * @desc    Fetches a single teacher by ID
 * @param   {AuthRequest} req - Express request object
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends teacher object or 404 if not found
 */
export const getTeacher = asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  const result = await teacherService.getTeacher(id, organizationId);

  res.status(200).json(result);
});

/**
 * @desc    Creates a new teacher in the database
 * @param   {TeacherMutateRequest} req - Express request object, with teacher data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends created teacher with 201 status
 */
export const createTeacher = txHandler(
  async (req: TeacherMutateRequest, res, tx) => {
    const data = req.body;
    const { organizationId } = req.user;

    const result = await teacherService.createTeacher(data, organizationId, tx);

    res.status(201).json(result);
  },
);

/**
 * @desc    Updates an existing teacher by ID
 * @param   {TeacherMutateRequest} req - Express request object, with the teacher ID in req.params and updated data in req.body
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends updated teacher or 404 if not found
 */
export const updateTeacher = txHandler(
  async (req: TeacherMutateRequest, res, tx) => {
    const { id } = req.params;
    const data = req.body;
    const { organizationId } = req.user;

    await teacherService.getTeacher(id, organizationId, tx);

    const result = await teacherService.updateTeacher(
      id,
      data,
      organizationId,
      tx,
    );

    res.status(200).json(result);
  },
);

/**
 * @desc    Deletes a teacher by ID
 * @param   {TeacherMutateRequest} req - Express request object, with the teacher ID in req.params
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends success message or 404 if not found
 */
export const deleteTeacher = txHandler(
  async (req: TeacherMutateRequest, res, tx) => {
    const { id } = req.params;
    const { organizationId } = req.user;

    await teacherService.getTeacher(id, organizationId, tx);

    await teacherService.deleteTeacher(id, organizationId, tx);

    res.status(204).send();
  },
);
