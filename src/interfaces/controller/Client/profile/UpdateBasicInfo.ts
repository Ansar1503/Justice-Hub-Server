import { IController } from "../../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IUpdateClientDataUseCase } from "@src/application/usecases/Client/IUpdateClientDataUseCase";

export class UpdateBasicInfoController implements IController {
  constructor(
    private udpateClientData: IUpdateClientDataUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const { name, mobile, dob, gender } = httpRequest.body as Record<
      string,
      any
    >;
    if (!name || !mobile) {
      const err = this.httpErrors.error_400();
      return new HttpResponse(err.statusCode, err.body);
    }
    const profile_image = (httpRequest as Record<string, any>)?.file?.path;
    const user_id = (httpRequest as Record<string, any>)?.user?.id;
    try {
      const updateData = await this.udpateClientData.execute({
        profile_image,
        user_id,
        name,
        mobile,
        dob,
        gender,
      });
      if (!updateData) {
        const err = this.httpErrors.error_500();
        return new HttpResponse(err.statusCode, err.body);
      }
      const success = this.httpSuccess.success_200(updateData);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
