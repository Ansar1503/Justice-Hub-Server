"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpSuccess = void 0;
class HttpSuccess {
    success_200(data) {
        return {
            statusCode: 200,
            body: data,
        };
    }
    success_201(data) {
        return {
            statusCode: 201,
            body: data,
        };
    }
}
exports.HttpSuccess = HttpSuccess;
