import { Router } from 'express';
import {
  createBlockEvent,
  updateBlockEvent,
  deleteBlockEvent,
} from '@/features/events/block-events/controllers';
import { validateMutateBlockEvent } from '@/features/events/block-events/middleware';
import { getAllEvents, getEvent } from '@/features/events/controllers';

const router = Router();

router
  .route('/')
  /**
   * @route   GET /api/events
   * @desc    Get all events
   * @access  Private
   */
  .get(getAllEvents)

  /**
   * @route   POST /api/events
   * @desc    Create an event
   * @access  Private
   */
  .post(validateMutateBlockEvent, createBlockEvent);

router
  .route('/:id')
  /**
   * @route   GET /api/events/:id
   * @desc    Get an event by ID
   * @access  Private
   */
  .get(getEvent)

  /**
   * @route   PUT /api/events/:id
   * @desc    Update an event by ID
   * @access  Private
   */
  .put(validateMutateBlockEvent, updateBlockEvent)

  /**
   * @route   DELETE /api/events/:id
   * @desc    Delete an event by ID
   * @access  Private
   */
  .delete(deleteBlockEvent);

export default router;
