"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBlogsByClientController = void 0;
const BlogValidation_1 = require("@interfaces/middelwares/validator/zod/Blog/BlogValidation");
class FetchBlogsByClientController {
    _fetchBlogsByClient;
    _errors;
    _success;
    constructor(_fetchBlogsByClient, _errors, _success) {
        this._fetchBlogsByClient = _fetchBlogsByClient;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        const parsed = await BlogValidation_1.FetchBlogsByClientSchema.safeParse(httpRequest.query);
        if (!parsed.success) {
            const error = parsed.error.errors[0];
            return this._errors.error_400(error.message);
        }
        try {
            const response = await this._fetchBlogsByClient.execute(parsed.data);
            return this._success.success_200(response);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.FetchBlogsByClientController = FetchBlogsByClientController;
