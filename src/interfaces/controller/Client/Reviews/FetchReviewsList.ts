import { IController } from "@interfaces/controller/Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchReviewsQueryValidation } from "@interfaces/middelwares/validator/zod/FetchReviewsQueryValidataion";
import { IFetchReviewUseCase } from "@src/application/usecases/Review/IFetchReviewUseCase";

export class FetchReviewsList implements IController {
    constructor(
        private _fetchReviews: IFetchReviewUseCase,
        private _httpErrors: IHttpErrors = new HttpErrors(),
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let user_id: string = "";
        let role: "admin" | "client" | "lawyer" | "" = "";
        if (
            httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user &&
            "role" in httpRequest.user
        ) {
            user_id = String(httpRequest.user.id);
            role = httpRequest.user.role as "admin" | "client" | "lawyer";
        }
        if (!httpRequest.query) return this._httpErrors.error_400("Invalid query");
        const parsed = FetchReviewsQueryValidation.safeParse(httpRequest.query);
        if (!parsed.success) {
            const err = parsed.error.errors[0];
            return this._httpErrors.error_400(err.message);
        }
        if (!user_id || !role) {
            return this._httpErrors.error_400("Invalid user");
        }
        try {
            const payload = { ...parsed.data, user_id, role };
            const result = await this._fetchReviews.execute(payload);
            return this._httpSuccess.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500("Internal server error");
        }
    }
}
