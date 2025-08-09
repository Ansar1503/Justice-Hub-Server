import { IController } from "../../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";
import { IFetchReviewsUseCase } from "@src/application/usecases/Client/IFetchReviewsUseCase";

export class FetchReviewsController implements IController {
  constructor(
    private fetchReviews: IFetchReviewsUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}

  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    try {
      const lawyer_id =
        httpRequest.params &&
        typeof httpRequest.params === "object" &&
        "id" in httpRequest.params
          ? (httpRequest.params as { id: string }).id
          : undefined;

      const cursor =
        httpRequest.query &&
        typeof httpRequest.query === "object" &&
        "cursor" in httpRequest.query
          ? (httpRequest.query as { cursor: string }).cursor
          : undefined;

      if (!lawyer_id || !cursor) {
        const err = this.httpErrors.error_400();
        return new HttpResponse(err.statusCode, err.body);
      }

      const result = await this.fetchReviews.execute({
        lawyer_id,
        page: Number(cursor),
      });

      const success = this.httpSuccess.success_200(result);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
