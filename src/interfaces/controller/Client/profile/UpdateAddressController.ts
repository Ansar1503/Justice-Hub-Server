import { IController } from "../../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IUpdateAddressUseCase } from "@src/application/usecases/Client/IUpdateAddressUseCase";

export class UpdateAddressController implements IController {
  constructor(
    private updateAddress: IUpdateAddressUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const req = httpRequest as Record<string, any>;
    const user_id = req.user?.id;
    const { state, city, locality, pincode } = req.body;
    if (!state && !city && !locality && !pincode) {
      const err = this.httpErrors.error_400();
      return new HttpResponse(err.statusCode, {
        message: "Invalid Credentials",
      });
    }
    try {
      await this.updateAddress.execute({
        user_id,
        city,
        locality,
        pincode,
        state,
      });
      const success = this.httpSuccess.success_200();
      return new HttpResponse(success.statusCode, success.body);
    } catch (error: any) {
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
