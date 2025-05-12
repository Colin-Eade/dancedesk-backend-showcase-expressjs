import { config } from 'dotenv-safe';

export const load = () => {
  if (process.env.NODE_ENV === 'development') {
    config({
      path: '.env',
      example: '.env.example',
    });
  }
};

load();
