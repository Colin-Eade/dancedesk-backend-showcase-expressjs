import { Router } from 'express';
import {
  getAllRooms,
  getRoom,
  updateRoom,
  deleteRoom,
  createRoom,
} from '@/features/rooms/controllers';
import { validateMutateRoom } from '@/features/rooms/middleware';

const router = Router();

router
  .route('/')
  /**
   * @route   GET /api/rooms
   * @desc    Get all rooms
   * @access  Private
   */
  .get(getAllRooms)

  /**
   * @route   POST /api/rooms
   * @desc    Create a room
   * @access  Private
   */
  .post(validateMutateRoom, createRoom);

router
  .route('/:id')
  /**
   * @route   GET /api/rooms/:id
   * @desc    Get a room by ID
   * @access  Private
   */
  .get(getRoom)

  /**
   * @route   PUT /api/rooms/:id
   * @desc    Update a room by ID
   * @access  Private
   */
  .put(validateMutateRoom, updateRoom)

  /**
   * @route   DELETE /api/rooms/:id
   * @desc    Delete a room by ID
   * @access  Private
   */
  .delete(deleteRoom);

export default router;
