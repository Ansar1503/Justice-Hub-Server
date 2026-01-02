"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpErrors = void 0;
class HttpErrors {
    error_422(message = "Unprocessable Entity") {
        return {
            statusCode: 422,
            body: { error: message },
        };
    }
    error_400(message = "Bad Request") {
        return {
            statusCode: 400,
            body: { error: message },
        };
    }
    error_404(message = "Not Found") {
        return {
            statusCode: 404,
            body: { error: message },
        };
    }
    error_500(message = "Internal Error") {
        return {
            statusCode: 500,
            body: { error: message },
        };
    }
    error_403(message = "Forbidden") {
        return {
            statusCode: 403,
            body: { error: message },
        };
    }
}
exports.HttpErrors = HttpErrors;
