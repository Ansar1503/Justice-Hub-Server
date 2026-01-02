"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogController = void 0;
const BlogValidation_1 = require("@interfaces/middelwares/validator/zod/Blog/BlogValidation");
class UpdateBlogController {
    _updateBlog;
    _errors;
    _success;
    constructor(_updateBlog, _errors, _success) {
        this._updateBlog = _updateBlog;
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
            const parsed = await BlogValidation_1.CreateBlogSchema.safeParse(httpRequest.body);
            if (!parsed.success) {
                const err = parsed.error.errors[0];
                return this._errors.error_400(err.message);
            }
            const success = await this._updateBlog.execute({
                ...parsed.data,
                blogId,
            });
            return this._success.success_200(success);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.UpdateBlogController = UpdateBlogController;
