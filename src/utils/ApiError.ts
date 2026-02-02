export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;

        // Capture stack trace but don't expose it in response as per requirements
        Error.captureStackTrace(this, this.constructor);
    }
}
