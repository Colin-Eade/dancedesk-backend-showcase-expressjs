import '@/config/environment';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';
import { PORT, ALLOWED_ORIGINS } from '@/config/constants';
import logger from '@/config/logger';
import errorHandler from '@/middleware/errorHandler';
import router from '@/router';

const app = express();

app.disable('x-powered-by');
app.use(pinoHttp({ logger }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`[server]: Server is running on port ${String(PORT)}`);
  logger.info(
    `[cors]: Allowing origins: ${Array.isArray(ALLOWED_ORIGINS) ? ALLOWED_ORIGINS.join(', ') : ALLOWED_ORIGINS}`,
  );
});

export default app;
