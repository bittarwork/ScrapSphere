class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Capture the stack trace (this is useful for debugging)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorResponse;
