"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeOrDislikeBlogController = void 0;
class LikeOrDislikeBlogController {
    _likeOrDislike;
    _errors;
    _success;
    constructor(_likeOrDislike, _errors, _success) {
        this._likeOrDislike = _likeOrDislike;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let blogId = "";
        let userId = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        if (httpRequest.params &&
            typeof httpRequest.params === "object" &&
            "id" in httpRequest.params) {
            blogId = String(httpRequest.params.id);
        }
        if (!userId)
            return this._errors.error_400("user id not found");
        if (!blogId)
            return this._errors.error_400("blog id not found");
        try {
            const result = await this._likeOrDislike.execute({ blogId, userId });
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
exports.LikeOrDislikeBlogController = LikeOrDislikeBlogController;
