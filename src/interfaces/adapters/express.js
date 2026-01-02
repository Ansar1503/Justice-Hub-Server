"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAdapter = expressAdapter;
const HttpRequest_1 = require("@interfaces/helpers/implementation/HttpRequest");
async function expressAdapter(request, apiRoute) {
    const httpRequest = new HttpRequest_1.HttpRequest({
        header: request.header,
        body: request.body,
        params: request.params,
        query: request.query,
        user: request.user,
        cookies: request.cookies,
        file: request.file,
        files: request.files,
        headers: request.headers,
    });
    const response = await apiRoute.handle(httpRequest);
    return response;
}
