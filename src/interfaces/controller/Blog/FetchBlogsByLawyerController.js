"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBlogsByLawyerController = void 0;
const FetchBlogsByLawyer_1 = require("@interfaces/middelwares/validator/zod/Blog/FetchBlogsByLawyer");
class FetchBlogsByLawyerController {
    _FetchBlogsByLawyer;
    _errors;
    _success;
    constructor(_FetchBlogsByLawyer, _errors, _success) {
        this._FetchBlogsByLawyer = _FetchBlogsByLawyer;
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
        if (!userId)
            return this._errors.error_400("user  id not found");
        const parsed = FetchBlogsByLawyer_1.FetchBlogsByLawyerQueryZodSchema.safeParse(httpRequest.query);
        if (!parsed.success) {
            const err = parsed.error.errors[0];
            return this._errors.error_400(err.message);
        }
        try {
            const result = await this._FetchBlogsByLawyer.execute({
                ...parsed.data,
                lawyerId: userId,
            });
            return this._success.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_500(error.message);
            }
            return this._errors.error_500("Unknown error occurred");
        }
    }
}
exports.FetchBlogsByLawyerController = FetchBlogsByLawyerController;
