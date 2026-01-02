"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleBlogStatusController = void 0;
class ToggleBlogStatusController {
    _toggleBlogStatus;
    _errors;
    _success;
    constructor(_toggleBlogStatus, _errors, _success) {
        this._toggleBlogStatus = _toggleBlogStatus;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let id = "";
        let toggle;
        if (httpRequest.params &&
            typeof httpRequest.params === "object" &&
            "id" in httpRequest.params) {
            id = String(httpRequest.params.id);
        }
        if (!id)
            return this._errors.error_400("blog id not found");
        try {
            const result = await this._toggleBlogStatus.execute(id);
            return this._success.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.ToggleBlogStatusController = ToggleBlogStatusController;
