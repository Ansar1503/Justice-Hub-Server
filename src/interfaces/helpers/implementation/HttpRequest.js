"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequest = void 0;
class HttpRequest {
    header;
    body;
    query;
    params;
    cookies;
    user;
    file;
    files;
    headers;
    constructor(init) {
        Object.assign(this, init);
    }
}
exports.HttpRequest = HttpRequest;
