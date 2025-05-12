import { Router } from 'express';
import {
  getAllLocations,
  getLocation,
  updateLocation,
  deleteLocation,
  createLocation,
} from '@/features/locations/controllers';
import { validateMutateLocation } from '@/features/locations/middleware';

const router = Router();

router
  .route('/')
  /**
   * @route   GET /api/locations
   * @desc    Get all locations
   * @access  Private
   */
  .get(getAllLocations)

  /**
   * @route   POST /api/locations
   * @desc    Create a location
   * @access  Private
   */
  .post(validateMutateLocation, createLocation);

router
  .route('/:id')
  /**
   * @route   GET /api/locations/:id
   * @desc    Get a location by ID
   * @access  Private
   */
  .get(getLocation)

  /**
   * @route   PUT /api/locations/:id
   * @desc    Update a location by ID
   * @access  Private
   */
  .put(validateMutateLocation, updateLocation)

  /**
   * @route   DELETE /api/locations/:id
   * @desc    Delete a location by ID
   * @access  Private
   */
  .delete(deleteLocation);

export default router;
