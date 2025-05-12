import { handler } from '@/middleware/routeHandlers';

/**
 * @desc    Checks the database connection and confirms API is running
 * @param   {Request} _req - Express request object (unused)
 * @param   {Response} res - Express response object
 * @returns {Promise<void>} Sends a 200 status and a simple JSON message indicating API health
 */
export const getApiHealth = handler((_req, res) => {
  res.status(200).json({ message: 'API is running...' });
});
