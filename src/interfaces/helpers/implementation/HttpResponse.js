"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponse = void 0;
class HttpResponse {
    statusCode;
    body;
    constructor(statusCode, body) {
        this.statusCode = statusCode;
        this.body = body;
    }
}
exports.HttpResponse = HttpResponse;
