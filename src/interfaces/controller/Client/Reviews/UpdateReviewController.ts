import { IController } from "../../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IUpdateReviewUseCase } from "@src/application/usecases/Client/IUpdateReviewUseCase";
import { UpdateReviewInputDto } from "@src/application/dtos/client/UpdateReviewDto";

export class UpdateReviewsController implements IController {
  constructor(
    private updateReview: IUpdateReviewUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    try {
      const reviewId =
        httpRequest.params &&
        typeof httpRequest.params === "object" &&
        "id" in httpRequest.params
          ? (httpRequest.params as { id: string }).id
          : undefined;

      const body: any =
        httpRequest.body && typeof httpRequest.body === "object"
          ? httpRequest.body
          : undefined;

      if (!reviewId) {
        const error = this.httpErrors.error_400();
        return new HttpResponse(error.statusCode, error.body);
      }

      if (
        !body ||
        !body.session_id ||
        !body.heading ||
        !body.review ||
        typeof body.rating !== "number" ||
        !body.client_id ||
        !body.lawyer_id
      ) {
        const error = this.httpErrors.error_400();
        return new HttpResponse(error.statusCode, error.body);
      }

      const updates: UpdateReviewInputDto["updates"] = {
        session_id: body.session_id,
        heading: body.heading,
        review: body.review,
        rating: body.rating,
        client_id: body.client_id,
        lawyer_id: body.lawyer_id,
      };

      const result = await this.updateReview.execute({
        review_id: reviewId,
        updates,
      });

      const success = this.httpSuccess.success_200(result);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
