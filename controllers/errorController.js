const AppError = require('../utils/appError')

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`

    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.message.match(/(["'])(?:\\.|[^\\])*?\1/)[0]

    /**
     * TODO: For many fields duplicate
     * const value = Object.entries(err.keyValue)
     *  .map(field => field.join(': '))
     *  .join(', ')
     *
     * if you use this logic for many fields, you must remove
     * string 'value' from message
     */

    const message = `Duplicate field value ${value}. Please use another value.`

    return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)

    const message = `Invalid input data. ${errors.join('. ')}`

    return new AppError(message, 400)
}

const handleJWTError = () =>
    new AppError('Invalid token, please login again.', 401)

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    })
}

const handleTokenExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401)

const sendErrorProd = (err, res) => {
    // Operational, trusted error send message
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }
    // Programming or other unknown error: don't leak error details
    else {
        // 1) Log error details
        console.error('ERROR 😓', err)

        // 2) send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong',
            err,
        })
    }
}

module.exports = (err, req, res, next) => {
    // console.log(err.stack) hien loi trong console

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') sendErrorDev(err, res)
    else if (process.env.NODE_ENV === 'production') {
        /**
         * ? NOTICE
         * * let error = { ...err } chỉ tạo obj mới, chứ không phải tạo Error obj mới
         * * toán tử spread ... chỉ copy các thuộc tính liệt kê được cung cấp
         * * (own enumerable properties)
         *
         * * To clone any javascript class instance with a perfect copy of properties,
         * * methods, getters/setters, non-enumerable properties, etc, ina a
         * * generic code is almost impossible. You may create your own copy/clone code
         * * for your particular case, with a combination of
         * * Object.assign() / Object.getPrototype() and custom tuning for
         * * inherited properties and internal classes.
         */
        let error = Object.assign(err, {})

        if (error.name === 'CastError') error = handleCastErrorDB(error)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error)
        if (error.name === 'JsonWebTokenError') error = handleJWTError()
        if (error.name === 'TokenExpiredError')
            error = handleTokenExpiredError()

        sendErrorProd(error, res)
    }
}
