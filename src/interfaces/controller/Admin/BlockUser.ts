import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IController } from "../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IBlockUserUseCase } from "@src/application/usecases/Admin/IBlockUserUseCase";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";

export class BlockUser implements IController {
  constructor(
    private BlockUserUseCase: IBlockUserUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const { user_id } = httpRequest.body as Record<string, string>;
    if (!user_id) {
      const error = this.httpErrors.error_400();
      return new HttpResponse(error.statusCode, "user Id not found");
    }
    try {
      const result = await this.BlockUserUseCase.execute(user_id);
      const body = {
        success: true,
        message: `user ${result?.status ? "blocked" : "unblocked"}`,
        data: result,
      };
      const success = this.httpSuccess.success_200(body);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error: any) {
      return new HttpResponse(
        error?.statusCode || 500,
        error?.message || "Internal Server Error"
      );
    }
  }
}
