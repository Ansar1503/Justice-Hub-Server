"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBlogController = void 0;
const BlogValidation_1 = require("@interfaces/middelwares/validator/zod/Blog/BlogValidation");
class CreateBlogController {
    _CreateBlogUsecase;
    _errors;
    _success;
    constructor(_CreateBlogUsecase, _errors, _success) {
        this._CreateBlogUsecase = _CreateBlogUsecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userId = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        const parsed = await BlogValidation_1.CreateBlogSchema.safeParse(httpRequest.body);
        if (!userId) {
            return this._errors.error_400("user Id not found");
        }
        if (!parsed.success) {
            const err = parsed.error.errors[0];
            return this._errors.error_400(err.message);
        }
        try {
            const result = await this._CreateBlogUsecase.execute({
                ...parsed.data,
                lawyerId: userId,
            });
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
exports.CreateBlogController = CreateBlogController;
