const AppError = require('./../utils/appError')

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    console.log("errStack:>>", err.stack);
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        // Programming or other unknown error: do not leak error details
    } else {
        // 1) Log the error
        console.error('ERROR 💥', err)

        // 2) Send generic message
        res.status(500).json({
            status: "Error",
            message: "Something went very wrong!!!"
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        // console.log("DEVELOPMENT GİRDİ");
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        console.log("err------>>", err.name);
        // let error = { ...err };
        // console.log("errorrrrrrr------->>>", error.name);
        // error = err;
        // send message for db CastError
        if (err.name === 'CastError') err = handleCastErrorDB(err);

        // send message for db duplicate error
        if (err.code === 11000) err = handleDuplicateFieldsDB(err);

        // send message mongoose validation error
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
        sendErrorProd(err, res)
    }
}