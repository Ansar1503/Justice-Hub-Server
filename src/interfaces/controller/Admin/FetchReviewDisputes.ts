import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { IFetchReviewDisputesUseCase } from "@src/application/usecases/Admin/IFetchReviewDisputesUseCase";
import { zodReviewDisputesQuerySchema } from "@interfaces/middelwares/validator/zod/zod.validate";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";

export class FetchReviewDisputes implements IController {
  constructor(
    private FetchReviewDisputesUseCase: IFetchReviewDisputesUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const parsedData = zodReviewDisputesQuerySchema.safeParse(
      httpRequest.query
    );
    if (!parsedData.success) {
      console.log("parsed Error :", parsedData.error);
      const err = this.httpErrors.error_400();
      return new HttpResponse(err.statusCode, {
        message: "Invalid Credentials",
      });
    }
    try {
      const result = await this.FetchReviewDisputesUseCase.execute(
        parsedData.data
      );
      const success = this.httpSuccess.success_200(result);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
