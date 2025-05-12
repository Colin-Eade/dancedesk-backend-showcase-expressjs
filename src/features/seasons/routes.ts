import { Router } from 'express';
import {
  getAllSeasons,
  getSeason,
  updateSeason,
  deleteSeason,
  createSeason,
} from '@/features/seasons/controllers';
import { validateMutateSeason } from '@/features/seasons/middleware';

const router = Router();

router
  .route('/')
  /**
   * @route   GET /api/seasons
   * @desc    Get all seasons
   * @access  Private
   */
  .get(getAllSeasons)

  /**
   * @route   POST /api/seasons
   * @desc    Create a season
   * @access  Private
   */
  .post(validateMutateSeason, createSeason);

router
  .route('/:id')
  /**
   * @route   GET /api/seasons/:id
   * @desc    Get a season by ID
   * @access  Private
   */
  .get(getSeason)

  /**
   * @route   PUT /api/seasons/:id
   * @desc    Update a season by ID
   * @access  Private
   */
  .put(validateMutateSeason, updateSeason)

  /**
   * @route   DELETE /api/seasons/:id
   * @desc    Delete a season by ID
   * @access  Private
   */
  .delete(deleteSeason);

export default router;
