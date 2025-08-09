import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";
import { IController } from "../../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { ICancelAppointmentUseCase } from "@src/application/usecases/Client/ICancelAppointmentUseCase";

export class CancelAppointmentController implements IController {
  constructor(
    private cancelAppointment: ICancelAppointmentUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const req = httpRequest as Record<string, any>;
    const client_id = req.user?.id;
    if (!client_id) {
      return new HttpResponse(400, { message: "Client Id not found" });
    }
    const { id, status } = req.body;
    if (!id || !status) {
      return new HttpResponse(400, { message: "Credentials not found" });
    }
    try {
      const result = await this.cancelAppointment.execute({
        id,
        status,
      });
      const success = this.httpSuccess.success_200(result);
      return new HttpResponse(success.statusCode, success.body);
    } catch (error: any) {
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
