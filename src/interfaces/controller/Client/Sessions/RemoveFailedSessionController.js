"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveFailedSessionController = void 0;
const HttpResponse_1 = require("@interfaces/helpers/implementation/HttpResponse");
class RemoveFailedSessionController {
    _getSessionMetadata;
    constructor(_getSessionMetadata) {
        this._getSessionMetadata = _getSessionMetadata;
    }
    async handle(httpRequest) {
        const session_id = httpRequest.params?.id;
        if (!session_id) {
            return new HttpResponse_1.HttpResponse(400, {
                success: false,
                message: "Session ID not found",
            });
        }
        try {
            const response = await this._getSessionMetadata.execute(session_id);
            return new HttpResponse_1.HttpResponse(200, {
                success: true,
                message: "Success",
                data: response,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return new HttpResponse_1.HttpResponse(400, error.message);
            }
            return new HttpResponse_1.HttpResponse(500, "something went wrong");
        }
    }
}
exports.RemoveFailedSessionController = RemoveFailedSessionController;
