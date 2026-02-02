import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        // Log unexpected errors for debugging (server-side only)
        console.error(err);
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};
