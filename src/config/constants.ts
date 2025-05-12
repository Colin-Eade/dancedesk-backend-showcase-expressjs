export const IS_DEV = process.env.NODE_ENV === 'development';
export const PORT = process.env.PORT ?? 3000;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') ?? [
  'http://localhost:5173',
];
export const API_ROOT = '/api';
export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 1000; // 60 minutes in ms
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
