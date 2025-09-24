import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IController } from "../Interface/IController";
import { BookAppointmentsByWalletZodSchema } from "@interfaces/middelwares/validator/zod/Appointments/BookAppointmentByWalletSchema";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IBookAppointmentsByWalletUsecase } from "@src/application/usecases/Appointments/IBookAppointmentsByWalletUsecase";

export class BookAppointmentByWalletController implements IController {
  constructor(
    private _bookAppointmentUsecase: IBookAppointmentsByWalletUsecase,
    private _errors: IHttpErrors,
    private _success: IHttpSuccess
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const parsed = BookAppointmentsByWalletZodSchema.safeParse(
      httpRequest.body
    );
    if (!parsed.success) {
      const er = parsed.error.errors[0];
      return this._errors.error_400(er.message);
    }
    try {
      const result = await this._bookAppointmentUsecase.execute(parsed.data);
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
