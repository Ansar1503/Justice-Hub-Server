"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartCallController = void 0;
class StartCallController {
    _startCall;
    _errors;
    _success;
    constructor(_startCall, _errors, _success) {
        this._startCall = _startCall;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        const { sessionId, roomId } = httpRequest.body;
        if (!sessionId || !roomId)
            return this._errors.error_400("Invalid Credentials");
        const { id: userId } = httpRequest.user;
        try {
            await this._startCall.execute({ sessionId, roomId, userId });
            return this._success.success_200({
                success: true,
                message: "Call Started Successfully",
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500("Something went wrong");
        }
    }
}
exports.StartCallController = StartCallController;
