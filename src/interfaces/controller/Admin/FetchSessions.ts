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
      // console.log("parsed Error :", parsedData.error);
      parsedData.error.errors.forEach((err) => {
        return new HttpResponse(Number(err.code), err.message);
      });
    }
    try {
      if (!parsedData.data) {
        return this.httpErrors.error_400("Invalid Credentials");
      }
      const result = await this.fetchSessionUseCase.execute(parsedData.data);
      console.log("result", result);
      const success = this.httpSuccess.success_200(result);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      console.log("error:", error);
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
