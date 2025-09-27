import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IDeleteReviewUseCase } from "@src/application/usecases/Client/IDeleteReviewUseCase";
import { IController } from "../../Interface/IController";

export class DeleteReviewController implements IController {
    constructor(
        private deleteReview: IDeleteReviewUseCase,
        private httpErrors: IHttpErrors = new HttpErrors(),
        private httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}

    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        try {
            const reviewId =
                httpRequest.params && typeof httpRequest.params === "object" && "id" in httpRequest.params
                    ? (httpRequest.params as { id: string }).id
                    : undefined;

            if (!reviewId) {
                const error = this.httpErrors.error_400();
                return new HttpResponse(error.statusCode, error.body);
            }

            const result = await this.deleteReview.execute({
                review_id: reviewId,
            });

            const success = this.httpSuccess.success_200(result);
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            const err = this.httpErrors.error_500();
            return new HttpResponse(err.statusCode, err.body);
        }
    }
}
