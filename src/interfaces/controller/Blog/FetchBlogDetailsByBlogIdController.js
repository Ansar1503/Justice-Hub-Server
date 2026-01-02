"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBlogDetailsByBlogIdController = void 0;
class FetchBlogDetailsByBlogIdController {
    _fetchBlogDetailsByBlogId;
    _errors;
    _success;
    constructor(_fetchBlogDetailsByBlogId, _errors, _success) {
        this._fetchBlogDetailsByBlogId = _fetchBlogDetailsByBlogId;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let blogId = "";
        if (httpRequest.params &&
            typeof httpRequest.params === "object" &&
            "id" in httpRequest.params) {
            blogId = String(httpRequest.params.id);
        }
        if (!blogId)
            return this._errors.error_400("blog id not found");
        try {
            const result = await this._fetchBlogDetailsByBlogId.execute(blogId);
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
exports.FetchBlogDetailsByBlogIdController = FetchBlogDetailsByBlogIdController;
