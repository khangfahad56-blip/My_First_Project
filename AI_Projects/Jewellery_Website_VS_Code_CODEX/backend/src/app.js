import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { apiLimiter, securityMiddleware } from './middleware/security.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { router } from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

export const app = express();

app.use(securityMiddleware);
app.use(apiLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.resolve(projectRoot, env.uploadDir)));
app.use('/admin', express.static(path.join(projectRoot, 'admin')));
app.use(express.static(path.join(projectRoot, 'Jewellery_Website')));

app.use('/api', router);
app.use(notFound);
app.use(errorHandler);
