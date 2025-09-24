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
    let userId = "";
    if (
      httpRequest.user &&
      typeof httpRequest.user === "object" &&
      "id" in httpRequest.user
    ) {
      userId = String(httpRequest.user.id);
    }
    const parsed = BookAppointmentsByWalletZodSchema.safeParse(
      httpRequest.body
    );
    if (!userId) {
      return this._errors.error_400("no userId found");
    }
    if (!parsed.success) {
      const er = parsed.error.errors[0];
      console.log("errors", parsed.error.errors);
      return this._errors.error_400(er.message);
    }
    try {
      const result = await this._bookAppointmentUsecase.execute({
        ...parsed.data,
        caseId: parsed.data.caseTypeId,
        client_id: userId,
      });
      return this._success.success_200(result);
    } catch (error) {
      if (error instanceof Error) {
        return this._errors.error_400(error.message);
      }
      return this._errors.error_500();
    }
  }
}
