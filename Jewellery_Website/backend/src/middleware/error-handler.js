import { env } from '../config/env.js';

export const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found'
    });
};

export const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Internal server error' : error.message,
        details: error.details || undefined,
        stack: env.nodeEnv === 'development' ? error.stack : undefined
    });
};
