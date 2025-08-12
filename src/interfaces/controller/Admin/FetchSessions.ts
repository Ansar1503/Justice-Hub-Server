import { IFetchSessionUseCase } from "@src/application/usecases/Admin/IFetchSessionUseCase";
import { IController } from "../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { zodSessionQuerySchema } from "@interfaces/middelwares/validator/zod/zod.validate";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";

export class FetchSessions implements IController {
  constructor(
    private fetchSessionUseCase: IFetchSessionUseCase,
    private httpSuccess: IHttpSuccess = new HttpSuccess(),
    private httpErrors: IHttpErrors = new HttpErrors()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const parsedData = zodSessionQuerySchema.safeParse(httpRequest.query);
    if (!parsedData.success) {
      console.log("parsed Error :", parsedData.error);
      const err = parsedData.error.errors[0];
      return this.httpErrors.error_400(err.message);
    }
    try {
      if (!parsedData.data) {
        return this.httpErrors.error_400("Invalid Credentials");
      }
      const result = await this.fetchSessionUseCase.execute(parsedData.data);
      // console.log("result", result);
      const success = this.httpSuccess.success_200(result);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      // console.log("error:", error);
      if (error instanceof Error) {
        return this.httpErrors.error_400(error.message);
      }
      return this.httpErrors.error_500();
    }
  }
}
