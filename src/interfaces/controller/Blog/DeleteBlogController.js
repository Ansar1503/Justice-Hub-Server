"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBlogController = void 0;
class DeleteBlogController {
    _deleteBlog;
    _errors;
    _success;
    constructor(_deleteBlog, _errors, _success) {
        this._deleteBlog = _deleteBlog;
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
            const result = await this._deleteBlog.execute(blogId);
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
exports.DeleteBlogController = DeleteBlogController;
