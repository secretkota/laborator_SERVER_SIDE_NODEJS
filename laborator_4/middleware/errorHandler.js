import logger from "../utils/logger.js"

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode
    const message = err.message

    logger.error(`${req.method} ${req.originalUrl} - ${message}`, { stack: err.stack })
   
    if (err.details) {
        return res.status(statusCode).json({
            status: "error",
            message,
            errors: err.details
        });
    }

    res.status(statusCode).json({
        error: statusCode,
        message
    });
}