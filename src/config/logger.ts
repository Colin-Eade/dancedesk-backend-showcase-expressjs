import pino from 'pino';
import { IS_DEV } from '@/config/constants';

const logger = pino(
  IS_DEV
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }
    : {},
);

export default logger;
