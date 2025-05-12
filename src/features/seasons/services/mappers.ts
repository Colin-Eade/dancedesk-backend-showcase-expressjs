import { Season } from '@prisma/client';
import { SeasonDTO } from '@/features/seasons/types';

/**
 * @desc    Converts a Season entity to a SeasonDTO
 * @param   {Season} season - The season entity
 * @returns {SeasonDTO} Season data transfer object with formatted date properties
 */
export const toSeasonDTO = (season: Season): SeasonDTO => ({
  id: season.id,
  name: season.name,
  organizationId: season.organizationId,
  startDate: season.startDate.toISOString().split('T')[0],
  endDate: season.endDate.toISOString().split('T')[0],
  createdAt: season.createdAt,
  updatedAt: season.updatedAt,
});
