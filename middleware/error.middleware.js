import { ENV } from "../server/src/config/env.js"
import { logger } from "../server/src/config/logger.js";

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") {
        error = handleCastErrorDB(error)
    };

    if (err.code === 11000) {
        error = handleDuplicateFieldsDB(err)
    };

    if (err.name === 11000) {
        error = handleValidationErrorDB(err)
    };

    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    };

    logger.error("Error: ", err);
    return res.status(500).json({
        status: "error",
        message: "Something went wrong"
    });
};

export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";

    if (ENV.NODE_ENV === "development") {
        return sendErrorDev(err, res)
    };

    if (ENV.NODE_ENV === "production") {
        return sendErrorProd(err, res)
    };
    
    return sendErrorDev(err, res)
};